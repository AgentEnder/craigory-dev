import { useData } from 'vike-react/useData';
import { useRef, useEffect, useState, type RefObject } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import type { CategoryData } from './+data.server';
import type { CharacterEntry } from '../../../src/unicode-data';
import { toSymbolSlug, codePointsKey } from '../../../src/unicode-data';
import { withBase } from '../../../src/utils';
import { SearchInput } from '../../../src/SearchInput';
import '../../../src/style.css';

const CARD_SLOT = 110;
const ROW_HEIGHT = 90;

function useColumnCount(containerRef: RefObject<HTMLDivElement | null>): number {
  const [columns, setColumns] = useState(8);
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      setColumns(Math.max(1, Math.floor(entry.contentRect.width / CARD_SLOT)));
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [containerRef]);
  return columns;
}

function CategoryGrid({ characters }: { characters: CharacterEntry[] }) {
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
    <div ref={containerRef} className="virtual-scroll">
      <div style={{ height: `${rowVirtualizer.getTotalSize()}px`, position: 'relative' }}>
        {rowVirtualizer.getVirtualItems().map((vRow) => {
          const start = vRow.index * columns;
          const row = characters.slice(start, start + columns);
          return (
            <div
              key={vRow.key}
              style={{
                position: 'absolute', top: 0, left: 0, right: 0,
                height: `${vRow.size}px`,
                transform: `translateY(${vRow.start}px)`,
                display: 'grid',
                gridTemplateColumns: `repeat(${columns}, 1fr)`,
                gap: '5px',
              }}
            >
              {row.map((c) => (
                  <a
                    key={codePointsKey(c.codePoints)}
                    href={withBase(`/symbol/${toSymbolSlug(c)}`)}
                    className="char-card"
                    title={[c.name, ...c.aliases, c.hex, 'click for details'].filter(Boolean).join(' · ')}
                  >
                    <span className="char-glyph">{c.char}</span>
                    <span className="char-hex">{c.hex}</span>
                    {c.name && <span className="char-name">{c.name}</span>}
                    {c.altCode !== null && <span className="char-alt">Alt+{c.altCode}</span>}
                  </a>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function Page() {
  const { categoryName, characters } = useData<CategoryData>();

  return (
    <div className="app-root">
      <header className="app-header">
        <div className="header-inner">
          <a href={withBase('/')} className="header-brand" style={{ textDecoration: 'none' }}>
            <div className="brand-title">Glyph Index</div>
            <div className="brand-sub">Unicode &amp; Alt Code Reference</div>
          </a>
          <div className="header-search">
            <SearchInput />
          </div>
          <div className="header-count">
            {characters.length.toLocaleString()} glyphs
          </div>
        </div>
      </header>

      <div className="category-bar">
        <div className="category-inner no-scrollbar" style={{ padding: '4px 0', flexDirection: 'column', gap: '4px' }}>
          <nav className="symbol-breadcrumb" aria-label="Breadcrumb">
            <a href={withBase('/')} className="breadcrumb-link">All Glyphs</a>
            <span className="breadcrumb-sep" aria-hidden="true">›</span>
            <span className="breadcrumb-current">{categoryName}</span>
          </nav>
          <h1 style={{ margin: 0, fontSize: '14px', fontFamily: 'var(--font-mono)', color: 'var(--color-text)', fontWeight: 700 }}>
            {categoryName}
          </h1>
        </div>
      </div>

      <main className="app-main">
        <CategoryGrid characters={characters} />
      </main>
    </div>
  );
}
