import { useRef, useEffect, useState, type RefObject } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { toSymbolSlug, codePointsKey, type GridEntry } from './unicode-data';
import { withBase } from './utils';

const CARD_SLOT = 110; // card min-width (100px) + gap — keep in sync with the other grids
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

/** Virtualized grid of glyph cards — only visible rows hit the DOM, so even the
 *  11k+ Seal characters added in Unicode 18.0 render without exploding the tree.
 *  `hrefFor` overrides each card's link target (defaults to the prerendered
 *  /symbol page); the CJK leaf passes a builder pointing at the client-only /glyph viewer. */
export function SymbolGrid({
  characters,
  hrefFor = (c) => withBase(`/symbol/${toSymbolSlug(c)}`),
}: {
  characters: GridEntry[];
  hrefFor?: (entry: GridEntry) => string;
}) {
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
                  href={hrefFor(c)}
                  className="char-card"
                  title={[c.name, ...c.aliases, c.hex, 'click for details'].filter(Boolean).join(' · ')}
                >
                  <span className="char-glyph">{c.char}</span>
                  <span className="char-hex">{c.hex}</span>
                  {c.name && <span className="char-name">{c.name}</span>}
                </a>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
