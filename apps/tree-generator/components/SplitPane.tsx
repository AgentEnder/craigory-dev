import { useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { cx } from '@new-personal-monorepo/small-app-design-system';
import {
  DEFAULT_FRACTION,
  GUTTER_PX,
  MAX_FRACTION,
  MIN_FRACTION,
  fractionForKey,
  fractionFromPointer,
  toPercent,
} from '../src/split';

interface SplitPaneProps {
  /** Share of the row given to `start`. Owned by the caller so it can persist. */
  fraction: number;
  onFractionChange: (next: number) => void;
  start: ReactNode;
  end: ReactNode;
  /** Describes what the divider resizes, e.g. "source and rendered tree". */
  label: string;
  className?: string;
}

/**
 * Two panes with a divider the user can drag, keyboard, or double-click to
 * recentre.
 *
 * Below `md` the divider disappears and the panes stack: there is no width to
 * trade on a phone, and a 4px drag target on a touch screen would be a trap
 * rather than a control.
 */
export function SplitPane({
  fraction,
  onFractionChange,
  start,
  end,
  label,
  className,
}: SplitPaneProps) {
  const rowRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // Left button only; a right-click here should open the context menu.
    if (e.button !== 0) return;
    // Capture so the drag survives the pointer outrunning the divider, which it
    // always does -- without this the first fast flick drops the gesture onto
    // whichever pane the cursor landed in.
    e.currentTarget.setPointerCapture(e.pointerId);
    setDragging(true);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const row = rowRef.current;
    if (!dragging || !row) return;
    onFractionChange(
      fractionFromPointer(e.clientX, row.getBoundingClientRect(), GUTTER_PX)
    );
  };

  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging) return;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    setDragging(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const next = fractionForKey(e.key, fraction);
    // null means the key is not ours -- Tab has to keep moving focus on.
    if (next === null) return;
    e.preventDefault();
    onFractionChange(next);
  };

  return (
    <div
      ref={rowRef}
      // Read only by the `md:` track template below, so the stacked layout on
      // small screens is not overridden by an inline grid-template-columns.
      style={
        {
          '--split-start': `${fraction}fr`,
          '--split-end': `${1 - fraction}fr`,
        } as CSSProperties
      }
      className={cx(
        'grid gap-6 md:gap-2',
        'md:[grid-template-columns:minmax(0,var(--split-start))_auto_minmax(0,var(--split-end))]',
        // The cursor has to persist across the whole row: mid-drag the pointer
        // is nowhere near the divider it is still controlling.
        dragging && 'cursor-col-resize select-none',
        className
      )}
    >
      {start}
      <div
        role="separator"
        aria-orientation="vertical"
        aria-label={`Resize ${label}`}
        aria-valuenow={toPercent(fraction)}
        aria-valuemin={toPercent(MIN_FRACTION)}
        aria-valuemax={toPercent(MAX_FRACTION)}
        tabIndex={0}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onDoubleClick={() => onFractionChange(DEFAULT_FRACTION)}
        onKeyDown={handleKeyDown}
        // touch-none: without it the browser claims the gesture as a page
        // scroll and the divider never sees a move event.
        className="group hidden md:flex items-center justify-center w-4 cursor-col-resize touch-none focus:outline-none"
      >
        <div
          className={cx(
            'w-1 h-16 rounded-full transition-colors duration-150',
            dragging
              ? 'bg-blue-500'
              : 'bg-gray-200 group-hover:bg-gray-400 group-focus-visible:bg-blue-500'
          )}
        />
      </div>
      {end}
    </div>
  );
}
