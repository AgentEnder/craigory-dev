import { useEffect, useId, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ErrorPill,
  TextInput,
  cx,
} from '@new-personal-monorepo/small-app-design-system';
import type { SearchResult } from '../../worker/types';
import { searchTracks } from '../api';
import { Artwork } from './Artwork';

type Status = 'idle' | 'loading' | 'ready' | 'error';

export interface SearchBoxProps {
  autoFocus?: boolean;
  className?: string;
}

/**
 * Debounced (250ms) autocomplete search. Stale requests are canceled with an
 * AbortController; selecting a row navigates to `/song/:provider/:id`.
 * Keyboard: ↑/↓ move, Enter selects, Esc closes (then clears).
 */
export function SearchBox({ autoFocus = false, className }: SearchBoxProps) {
  const navigate = useNavigate();
  const listboxId = useId();
  const rootRef = useRef<HTMLDivElement>(null);

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  // Debounced fetch; cleanup cancels both the timer and any in-flight request,
  // so stale responses can never land.
  useEffect(() => {
    const q = query.trim();
    // Mirror the server's MIN_QUERY_LENGTH (2): a shorter query would get a
    // 400 back, flashing an error pill on the first keystroke.
    if (q.length < 2) {
      setResults([]);
      setStatus('idle');
      setOpen(false);
      setActiveIndex(-1);
      return;
    }
    setStatus('loading');
    setOpen(true);
    const controller = new AbortController();
    const timer = window.setTimeout(() => {
      searchTracks(q, 8, { signal: controller.signal })
        .then((rows) => {
          setResults(rows);
          setStatus('ready');
          setActiveIndex(rows.length > 0 ? 0 : -1);
        })
        .catch((err: unknown) => {
          if (controller.signal.aborted) return;
          setError(err instanceof Error ? err.message : 'Search failed');
          setStatus('error');
          setResults([]);
          setActiveIndex(-1);
        });
    }, 250);
    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  // Click / tap outside closes the dropdown.
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent | TouchEvent) => {
      const root = rootRef.current;
      if (root && event.target instanceof Node && !root.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('touchstart', onPointerDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('touchstart', onPointerDown);
    };
  }, [open]);

  const select = (row: SearchResult) => {
    setOpen(false);
    navigate(`/song/${row.provider}/${encodeURIComponent(row.id)}`);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      if (open) setOpen(false);
      else if (query) setQuery('');
      return;
    }
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      if (!open) {
        if (status !== 'idle') setOpen(true);
        return;
      }
      if (results.length === 0) return;
      const delta = event.key === 'ArrowDown' ? 1 : -1;
      setActiveIndex((i) => (i + delta + results.length) % results.length);
      return;
    }
    if (event.key === 'Enter') {
      if (open && activeIndex >= 0 && activeIndex < results.length) {
        event.preventDefault();
        select(results[activeIndex]);
      }
    }
  };

  // While a refinement is in flight, keep showing the previous results rather
  // than flashing a "Searching…" panel between keystrokes.
  const showList = results.length > 0 && status !== 'error';

  return (
    <div ref={rootRef} className={cx('relative', className)}>
      <TextInput
        type="text"
        enterKeyHint="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        onKeyDown={onKeyDown}
        onFocus={() => {
          if (status !== 'idle') setOpen(true);
        }}
        placeholder="Search for a song, e.g. “Bohemian Rhapsody”…"
        role="combobox"
        aria-expanded={open}
        aria-controls={listboxId}
        aria-activedescendant={
          open && activeIndex >= 0
            ? `${listboxId}-option-${activeIndex}`
            : undefined
        }
        aria-autocomplete="list"
        aria-label="Search for a song"
        autoComplete="off"
        spellCheck={false}
        autoFocus={autoFocus}
        className="pr-12"
      />
      {status === 'loading' && (
        <div
          aria-hidden="true"
          className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 animate-spin rounded-full border-2 border-gray-200 border-t-blue-500"
        />
      )}

      {open && (
        <div className="absolute left-0 right-0 top-full z-20 mt-2 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl animate-fade-in">
          {showList ? (
            <ul
              role="listbox"
              id={listboxId}
              aria-label="Song suggestions"
              className="max-h-96 overflow-y-auto py-1"
            >
              {results.map((row, index) => {
                const year = row.releaseDate?.slice(0, 4);
                const active = index === activeIndex;
                return (
                  <li
                    key={`${row.provider}:${row.id}`}
                    id={`${listboxId}-option-${index}`}
                    role="option"
                    aria-selected={active}
                    className={cx(
                      'flex cursor-pointer items-center gap-3 px-3 py-2.5 transition-colors',
                      active && 'bg-blue-50'
                    )}
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => select(row)}
                    onMouseEnter={() => setActiveIndex(index)}
                  >
                    <Artwork
                      url={row.artworkUrl}
                      className="h-10 w-10 shrink-0"
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium text-gray-900">
                        {row.title}
                      </span>
                      <span className="block truncate text-xs text-gray-500">
                        {row.artist}
                        {row.album ? ` · ${row.album}` : ''}
                        {year ? ` · ${year}` : ''}
                      </span>
                    </span>
                  </li>
                );
              })}
            </ul>
          ) : status === 'error' ? (
            <div className="p-3">
              <ErrorPill>{error}</ErrorPill>
            </div>
          ) : status === 'loading' ? (
            <p className="px-4 py-3 text-sm text-gray-400">Searching…</p>
          ) : (
            <p className="px-4 py-3 text-sm text-gray-500">
              No matches for “{query.trim()}”. Try a different title or artist.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
