import {
  useState,
  useMemo,
  useRef,
  useEffect,
  type RefObject,
} from 'react';
import { useData } from 'vike-react/useData';
import { useVirtualizer } from '@tanstack/react-virtual';
import { CATEGORIES, toSymbolSlug, type CharacterEntry } from '../src/unicode-data';
import type { Data } from './+data.server';
import { withBase } from '../src/utils';
import '../src/style.css';

function matchesSearch(c: CharacterEntry, q: string): boolean {
  return (
    c.char === q ||
    c.hex.toLowerCase().includes(q) ||
    c.decimal.toString().includes(q) ||
    c.name.toLowerCase().includes(q) ||
    c.aliases.some((a) => a.toLowerCase().includes(q)) ||
    (c.altCode !== null && c.altCode.toString().includes(q))
  );
}

// ── Constants ─────────────────────────────────────────────────────────────
const CARD_SLOT = 110; // card min-width (100px) + gap (5px) + a little breathing room
const ROW_HEIGHT = 90; // fixed card height + gap — must match CSS

// ── Virtual grid ──────────────────────────────────────────────────────────

interface GridProps {
  characters: CharacterEntry[];
}

function useColumnCount(containerRef: RefObject<HTMLDivElement | null>): number {
  const [columns, setColumns] = useState(8);
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      const width = entry.contentRect.width;
      setColumns(Math.max(1, Math.floor(width / CARD_SLOT)));
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [containerRef]);
  return columns;
}

function VirtualGrid({ characters }: GridProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const columns = useColumnCount(containerRef);
  const rowCount = Math.ceil(characters.length / columns);

  const rowVirtualizer = useVirtualizer({
    count: rowCount,
    getScrollElement: () => containerRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: 4,
  });

  return (
    <div
      ref={containerRef}
      className="virtual-scroll"
    >
      <div style={{ height: `${rowVirtualizer.getTotalSize()}px`, position: 'relative' }}>
        {rowVirtualizer.getVirtualItems().map((vRow) => {
          const start = vRow.index * columns;
          const row = characters.slice(start, start + columns);
          return (
            <div
              key={vRow.key}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: `${vRow.size}px`,
                transform: `translateY(${vRow.start}px)`,
                display: 'grid',
                gridTemplateColumns: `repeat(${columns}, 1fr)`,
                gap: '5px',
              }}
            >
              {row.map((c) => (
                <CharCard
                  key={`${c.categoryId}-${c.codePoint}`}
                  entry={c}
                />
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Card ──────────────────────────────────────────────────────────────────

function CharCard({ entry: c }: { entry: CharacterEntry }) {
  const tooltip = [
    c.name,
    ...c.aliases,
    c.hex,
    `decimal ${c.decimal}`,
    c.altCode !== null ? `Alt+${c.altCode}` : null,
    'click for details',
  ]
    .filter(Boolean)
    .join(' · ');

  return (
    <a
      className="char-card"
      href={withBase(`/symbol/${toSymbolSlug(c)}`)}
      title={tooltip}
    >
      <span className="char-glyph">{c.char}</span>
      <span className="char-hex">{c.hex}</span>
      {c.name && <span className="char-name">{c.name}</span>}
      {c.altCode !== null && <span className="char-alt">Alt+{c.altCode}</span>}
    </a>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────

export default function Page() {
  const { characters } = useData<Data>();

  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  // Deduplicate for "All" view — keep first occurrence (alt-codes first)
  const deduped = useMemo<CharacterEntry[]>(() => {
    const seen = new Set<number>();
    return characters.filter((c) => {
      if (seen.has(c.codePoint)) return false;
      seen.add(c.codePoint);
      return true;
    });
  }, [characters]);

  const q = search.trim().toLowerCase();

  const filtered = useMemo<CharacterEntry[]>(() => {
    const base = activeCategory === null
      ? deduped
      : characters.filter((c) => c.categoryId === activeCategory);
    if (!q) return base;
    return base.filter((c) => matchesSearch(c, q));
  }, [activeCategory, q, characters, deduped]);

  // Per-category match counts when a search is active (one pass over all characters).
  // Used to show badges on pills and a helpful message when the current category is empty.
  const categoryMatchCounts = useMemo<Map<string, number>>(() => {
    if (!q) return new Map();
    const counts = new Map<string, number>();
    for (const c of characters) {
      if (matchesSearch(c, q)) {
        counts.set(c.categoryId, (counts.get(c.categoryId) ?? 0) + 1);
      }
    }
    return counts;
  }, [q, characters]);

  // Total deduplicated matches across all categories (for the "All" pill badge and empty-state hint).
  const totalSearchMatches = useMemo<number>(() => {
    if (!q) return 0;
    return deduped.filter((c) => matchesSearch(c, q)).length;
  }, [q, deduped]);

  // Categories sorted by match count (descending) when a search is active.
  const sortedCategories = useMemo(() => {
    if (!q) return CATEGORIES;
    return [...CATEGORIES].sort(
      (a, b) =>
        (categoryMatchCounts.get(b.id) ?? 0) - (categoryMatchCounts.get(a.id) ?? 0),
    );
  }, [q, categoryMatchCounts]);

  return (
    <div className="app-root">

      {/* ── Header ─────────────────────────────── */}
      <header className="app-header">
        <div className="header-inner">
          <div className="header-brand">
            <div className="brand-title">Glyph Index</div>
            <div className="brand-sub">Unicode &amp; Alt Code Reference</div>
          </div>
          <div className="header-search">
            <input
              type="search"
              className="search-input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, alias, character, U+code, alt number…"
            />
          </div>
          <div className="header-count">
            {filtered.length.toLocaleString()} glyphs
          </div>
        </div>
      </header>

      {/* ── Category pills ─────────────────────── */}
      <div className="category-bar">
        <div className="category-inner no-scrollbar">
          <button
            className={`cat-pill${activeCategory === null ? ' cat-pill--active' : ''}`}
            onClick={() => setActiveCategory(null)}
          >
            All
            {q && totalSearchMatches > 0 && (
              <span className="cat-pill-count">{totalSearchMatches}</span>
            )}
          </button>
          {sortedCategories.map((cat) => {
            const count = q ? (categoryMatchCounts.get(cat.id) ?? 0) : null;
            const isEmpty = count !== null && count === 0;
            return (
              <button
                key={cat.id}
                className={[
                  'cat-pill',
                  activeCategory === cat.id ? 'cat-pill--active' : '',
                  isEmpty ? 'cat-pill--no-results' : '',
                ].filter(Boolean).join(' ')}
                onClick={() => { setActiveCategory(cat.id); }}
              >
                {cat.name}
                {count !== null && count > 0 && (
                  <span className="cat-pill-count">{count}</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Virtualized grid ───────────────────── */}
      <main className="app-main">
        {filtered.length === 0 ? (
          <div className="empty-state">
            {activeCategory !== null && q ? (
              <>
                <p className="empty-title">
                  No matches in{' '}
                  <strong>{CATEGORIES.find((c) => c.id === activeCategory)?.name}</strong>
                </p>
                {totalSearchMatches > 0 ? (
                  <p className="empty-hint">
                    {totalSearchMatches.toLocaleString()} result
                    {totalSearchMatches !== 1 ? 's' : ''} in other categories
                    <button
                      className="empty-show-all"
                      onClick={() => setActiveCategory(null)}
                    >
                      Show all
                    </button>
                  </p>
                ) : (
                  <p className="empty-hint">No results anywhere for this search.</p>
                )}
              </>
            ) : (
              <p className="empty-title">No characters found</p>
            )}
          </div>
        ) : (
          <VirtualGrid
            key={activeCategory ?? '__all__'}
            characters={filtered}
          />
        )}
      </main>

    </div>
  );
}
