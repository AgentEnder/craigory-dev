import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import styles from './spotlight-search.module.scss';
import { SpotlightContext, useSpotlight } from './spotlight-context';

/**
 * Spotlight-style site search over the Pagefind index built by
 * `tools/build-search-index.ts`.
 *
 * The index does not exist until after `vike build`, so `pagefind.js` is loaded
 * from a runtime URL rather than imported — there is nothing for the bundler to
 * resolve at build time, and in `vike dev` there is nothing to load at all. That
 * is a supported state, not an error: the dialog says search is unavailable.
 */

// ---------------------------------------------------------------- pagefind

interface PagefindAnchor {
  id?: string;
}

interface PagefindSubResult {
  title: string;
  url: string;
  excerpt: string;
  anchor?: PagefindAnchor;
}

interface PagefindDocument {
  url: string;
  excerpt: string;
  meta?: Record<string, string>;
  sub_results?: PagefindSubResult[];
}

interface PagefindSearchResult {
  id: string;
  score: number;
  data: () => Promise<PagefindDocument>;
}

interface PagefindApi {
  search: (query: string) => Promise<{ results: PagefindSearchResult[] }>;
  options: (options: Record<string, unknown>) => Promise<void>;
}

const BASE_URL = import.meta.env.BASE_URL || '/';

let pagefindPromise: Promise<PagefindApi> | null = null;

function loadPagefind(): Promise<PagefindApi> {
  if (!pagefindPromise) {
    pagefindPromise = (async () => {
      const root = BASE_URL.replace(/\/$/, '');
      // @vite-ignore: this file is emitted by the search-index step after the
      // bundle is written, so Vite must not try to resolve it.
      const api: PagefindApi = await import(
        /* @vite-ignore */ `${root}/pagefind/pagefind.js`
      );
      // Result URLs are stored site-root-relative. Under a PR preview the site
      // is served from /pr/<n>/, so links need that prefix put back on.
      await api.options({ baseUrl: BASE_URL });
      return api;
    })();
  }
  return pagefindPromise;
}

// ---------------------------------------------------------------- results

const KIND_ORDER = [
  'Blog',
  'Presentations',
  'Projects',
  'Tools',
  'Pages',
] as const;
type Kind = (typeof KIND_ORDER)[number];

/**
 * Results are classified by URL rather than a Pagefind filter so that crawled
 * pages and the synthetic presentation records are grouped by the same rule.
 */
function kindOf(url: string): Kind {
  const path = url.startsWith(BASE_URL) ? url.slice(BASE_URL.length - 1) : url;
  if (path.startsWith('/blog')) return 'Blog';
  if (path.startsWith('/presentations')) return 'Presentations';
  if (path.startsWith('/projects')) return 'Projects';
  if (path.startsWith('/tools')) return 'Tools';
  return 'Pages';
}

interface Entry {
  key: string;
  kind: Kind;
  title: string;
  url: string;
  excerpt: string;
  /** Sub-results are headings within a page — indented, and never grouped alone. */
  isSub: boolean;
}

const MAX_PAGES = 12;
const MAX_SUB_RESULTS = 2;

function toEntries(document_: PagefindDocument): Entry[] {
  const title = document_.meta?.title?.trim() || document_.url;
  const kind = kindOf(document_.url);
  const entries: Entry[] = [
    {
      key: document_.url,
      kind,
      title,
      url: document_.url,
      excerpt: document_.excerpt,
      isSub: false,
    },
  ];

  for (const sub of (document_.sub_results ?? []).slice(0, MAX_SUB_RESULTS)) {
    // Pagefind emits a sub-result for the page's own top heading; it duplicates
    // the parent row rather than adding a destination.
    if (!sub.anchor?.id || sub.url === document_.url) continue;
    entries.push({
      key: sub.url,
      kind,
      title: sub.title,
      url: sub.url,
      excerpt: sub.excerpt,
      isSub: true,
    });
  }

  return entries;
}

export function SpotlightProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLElement | null>(null);

  const open = useCallback(() => {
    triggerRef.current = document.activeElement as HTMLElement;
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    triggerRef.current?.focus();
    triggerRef.current = null;
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        // Toggling rather than always-opening keeps cmd+k symmetric with how
        // every other spotlight behaves.
        if (isOpen) close();
        else open();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isOpen, open, close]);

  useEffect(() => {
    if (!isOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [isOpen]);

  const value = useMemo(() => ({ open }), [open]);

  return (
    <SpotlightContext.Provider value={value}>
      {children}
      {isOpen && <SpotlightDialog onClose={close} />}
    </SpotlightContext.Provider>
  );
}

// ---------------------------------------------------------------- trigger

export function SpotlightTrigger({ className }: { className?: string }) {
  const { open } = useSpotlight();
  const [shortcut, setShortcut] = useState<string | null>(null);

  // Resolved after mount: the server has no idea which platform will render
  // this, and guessing would cause a hydration mismatch.
  useEffect(() => {
    setShortcut(/mac|iphone|ipad/i.test(navigator.userAgent) ? '⌘K' : 'Ctrl K');
  }, []);

  return (
    <button
      type="button"
      className={[styles.trigger, className].filter(Boolean).join(' ')}
      onClick={open}
      aria-label="Search the site"
    >
      <SearchIcon />
      <span className={styles.triggerLabel}>Search</span>
      {shortcut && <kbd className={styles.triggerHint}>{shortcut}</kbd>}
    </button>
  );
}

// ---------------------------------------------------------------- dialog

type Status = 'idle' | 'searching' | 'ready' | 'unavailable';

function SpotlightDialog({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState('');
  const [entries, setEntries] = useState<Entry[]>([]);
  const [status, setStatus] = useState<Status>('idle');
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      setEntries([]);
      setStatus('idle');
      return;
    }

    setStatus('searching');
    let cancelled = false;
    const timer = setTimeout(async () => {
      try {
        const pagefind = await loadPagefind();
        const { results } = await pagefind.search(trimmed);
        const documents = await Promise.all(
          results.slice(0, MAX_PAGES).map((result) => result.data())
        );
        if (cancelled) return;
        setEntries(documents.flatMap(toEntries));
        setSelected(0);
        setStatus('ready');
      } catch {
        if (cancelled) return;
        // Almost always "there is no index yet" — i.e. running `vike dev`.
        setStatus('unavailable');
      }
    }, 150);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [query]);

  const groups = useMemo(() => {
    const byKind = new Map<Kind, Entry[]>();
    for (const entry of entries) {
      const bucket = byKind.get(entry.kind);
      if (bucket) bucket.push(entry);
      else byKind.set(entry.kind, [entry]);
    }
    // KIND_ORDER drives the order, so groups appear in a fixed sequence rather
    // than whichever kind Pagefind happened to rank first.
    return KIND_ORDER.flatMap((kind) => {
      const kindEntries = byKind.get(kind);
      return kindEntries ? [{ kind, entries: kindEntries }] : [];
    });
  }, [entries]);

  // Selection walks the list as displayed, which is grouped — not the order
  // Pagefind returned.
  const ordered = useMemo(
    () => groups.flatMap((group) => group.entries),
    [groups]
  );

  const go = useCallback((entry: Entry | undefined) => {
    if (entry) window.location.href = entry.url;
  }, []);

  // Escape is handled on the document rather than via React's onKeyDown.
  // WebKit consumes Escape inside a focused text field before it bubbles (the
  // native "clear the field" behaviour), so a handler on the panel never fired
  // and the dialog stayed open.
  useEffect(() => {
    const onEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      event.preventDefault();
      onClose();
    };
    document.addEventListener('keydown', onEscape);
    return () => document.removeEventListener('keydown', onEscape);
  }, [onClose]);

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setSelected((i) => (ordered.length ? (i + 1) % ordered.length : 0));
      return;
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      setSelected((i) =>
        ordered.length ? (i - 1 + ordered.length) % ordered.length : 0
      );
      return;
    }
    if (event.key === 'Enter') {
      event.preventDefault();
      go(ordered[selected]);
    }
  };

  useEffect(() => {
    listRef.current
      ?.querySelector('[aria-selected="true"]')
      ?.scrollIntoView({ block: 'nearest' });
  }, [selected]);

  let index = -1;

  return (
    <div
      className={styles.overlay}
      onClick={onClose}
      role="presentation"
      data-pagefind-ignore
    >
      <div
        className={styles.panel}
        role="dialog"
        aria-modal="true"
        aria-label="Search the site"
        onClick={(event) => event.stopPropagation()}
        onKeyDown={onKeyDown}
      >
        <div className={styles.inputRow}>
          <SearchIcon />
          <input
            ref={inputRef}
            className={styles.input}
            // Not type="search": its native Escape-clears-the-field behaviour
            // competes with Escape closing the dialog.
            type="text"
            value={query}
            placeholder="Search posts, talks, and projects…"
            aria-label="Search query"
            onChange={(event) => setQuery(event.target.value)}
          />
          <button
            type="button"
            className={styles.close}
            onClick={onClose}
            aria-label="Close search"
          >
            Esc
          </button>
        </div>

        <div className={styles.results} ref={listRef} role="listbox">
          {status === 'unavailable' && (
            <p className={styles.message}>
              Search is unavailable — the index is generated at build time. Run{' '}
              <code>nx build craigory-dev</code> and use the built site.
            </p>
          )}
          {status === 'ready' && !ordered.length && (
            <p className={styles.message}>No matches for “{query.trim()}”.</p>
          )}
          {status === 'idle' && (
            <p className={styles.message}>
              Search across blog posts, talk slides, and projects.
            </p>
          )}

          {groups.map((group) => (
            <section key={group.kind} className={styles.group}>
              <h2 className={styles.groupHeading}>{group.kind}</h2>
              {group.entries.map((entry) => {
                index += 1;
                const position = index;
                return (
                  <a
                    key={entry.key}
                    href={entry.url}
                    role="option"
                    aria-selected={position === selected}
                    className={[
                      styles.result,
                      entry.isSub ? styles.subResult : '',
                      position === selected ? styles.selected : '',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    onMouseEnter={() => setSelected(position)}
                    onClick={(event) => {
                      event.preventDefault();
                      go(entry);
                    }}
                  >
                    <span className={styles.resultTitle}>{entry.title}</span>
                    {/* Pagefind returns excerpts with <mark> around the hits. */}
                    <span
                      className={styles.resultExcerpt}
                      dangerouslySetInnerHTML={{ __html: entry.excerpt }}
                    />
                  </a>
                );
              })}
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}

function SearchIcon() {
  return (
    <svg
      className={styles.icon}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" />
      <line x1="16.5" y1="16.5" x2="21" y2="21" />
    </svg>
  );
}
