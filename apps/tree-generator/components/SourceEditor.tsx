import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from 'react';
import { TextArea, cx } from '@new-personal-monorepo/small-app-design-system';
import {
  blockRange,
  gapFromY,
  moveBlock,
  nearestIndent,
  planDrop,
  toLines,
} from '../src/reorder';

interface SourceEditorProps {
  value: string;
  onChange: (next: string) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  onPaste: (e: React.ClipboardEvent<HTMLTextAreaElement>) => void;
  placeholder: string;
  /** Soft-wrap long lines instead of scrolling them sideways. */
  wrap: boolean;
  describedBy?: string;
}

/**
 * Padding that reserves the gutter. Applied to the field and its mirror alike,
 * and the gutter is sized to match it.
 */
const GUTTER_PADDING = 'pl-9';
const GUTTER_WIDTH = 'w-9';

/** The laid-out box of one source line, in the field's own coordinates. */
interface Row {
  top: number;
  height: number;
}

interface Metrics {
  rows: Row[];
  /** Distance from the field's left edge to column zero. */
  origin: number;
  /** Width of one monospace column. */
  column: number;
}

const NO_METRICS: Metrics = { rows: [], origin: 0, column: 8 };

interface Drag {
  /** Line the grip belongs to. */
  from: number;
  /** Span being carried, so it can be shown lifted. */
  start: number;
  end: number;
  /** Gap it would land in, and the indent it would land at. */
  gap: number;
  indent: number;
}

/**
 * The source field, plus a gutter of drag grips for reordering subtrees.
 *
 * The grips live beside the text rather than on it, and that is the whole
 * design: no handler sits on the text surface, so Enter, Tab, Shift+Tab,
 * click-drag selection, double and triple click, and paste keep behaving
 * natively rather than being carefully re-implemented.
 *
 * The grips do claim the leftmost strip of the field's padding, the way an
 * editor's line-number gutter does -- a press there grabs the line instead of
 * putting the caret at its start. The strip is kept narrower than the padding
 * so the columns nearest the text still belong to the textarea.
 *
 * Line geometry comes from a hidden mirror -- a div with the same font, width,
 * padding and wrapping rules, one child per line. A textarea exposes no boxes
 * for its lines, so measuring a stand-in is the only way to know where a line
 * sits once soft wrapping has had its say.
 */
export function SourceEditor({
  value,
  onChange,
  onKeyDown,
  onPaste,
  placeholder,
  wrap,
  describedBy,
}: SourceEditorProps) {
  const mirrorRef = useRef<HTMLDivElement>(null);
  const probeRef = useRef<HTMLSpanElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);

  const [metrics, setMetrics] = useState<Metrics>(NO_METRICS);
  const [scroll, setScroll] = useState({ top: 0, left: 0 });
  const [drag, setDrag] = useState<Drag | null>(null);
  /** Where the pointer went down, and the indent it went down on. */
  const grabRef = useRef<{ x: number; indent: number } | null>(null);

  const lines = value.split('\n');
  const { rows, origin, column } = metrics;

  const measure = useCallback(() => {
    const mirror = mirrorRef.current;
    const probe = probeRef.current;
    if (!mirror || !probe) return;

    // Rects rather than offsetTop/offsetLeft: those are measured from the
    // offsetParent's padding edge, so the field's 1px border would shift every
    // grip up and left by one pixel.
    const base = mirror.getBoundingClientRect();
    const children = Array.from(mirror.children) as HTMLElement[];

    setMetrics({
      rows: children.map((child) => {
        const box = child.getBoundingClientRect();
        return { top: box.top - base.top, height: box.height };
      }),
      origin: children.length
        ? children[0].getBoundingClientRect().left - base.left
        : 0,
      // Ten characters, so a sub-pixel advance width averages out.
      column: probe.getBoundingClientRect().width / 10 || NO_METRICS.column,
    });
  }, []);

  // Layout effect, not effect: the grips are positioned from these numbers, so
  // measuring after paint would leave them a frame behind every keystroke.
  useLayoutEffect(measure, [measure, value, wrap]);

  // The pane is resizable and wrapping follows its width, so every line below
  // the first re-wrap moves. Nothing else would tell us.
  useEffect(() => {
    const frame = frameRef.current;
    if (!frame || typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(measure);
    observer.observe(frame);
    return () => observer.disconnect();
  }, [measure]);

  // A drag is a modal gesture, so Escape has to abandon it without editing.
  useEffect(() => {
    if (!drag) return;
    const cancel = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setDrag(null);
    };
    window.addEventListener('keydown', cancel);
    return () => window.removeEventListener('keydown', cancel);
  }, [drag]);

  /** Top of the gap before `gap`; past the last line, the end of the text. */
  const gapY = (gap: number) => {
    if (gap < rows.length) return rows[gap].top;
    const last = rows[rows.length - 1];
    return last ? last.top + last.height : 0;
  };

  const handleGripDown = (index: number) => (e: ReactPointerEvent) => {
    if (e.button !== 0) return;
    // Keeps focus and the caret where the user left them: reordering is not a
    // reason to lose the selection they were part way through making.
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);

    const sourceLines = toLines(value);
    const { start, end } = blockRange(sourceLines, index);
    grabRef.current = { x: e.clientX, indent: sourceLines[index].indent };

    // Seeded where the block already is, at the indent it already has, so a
    // press that never travels is not an edit. Deriving the indent from the
    // pointer instead would read the grip's own position in the gutter as a
    // demand to outdent to the left margin.
    setDrag({
      from: index,
      start,
      end,
      gap: start,
      indent: grabRef.current.indent,
    });
  };

  const handleGripMove = (index: number) => (e: ReactPointerEvent) => {
    const frame = frameRef.current;
    const grab = grabRef.current;
    if (!drag || !frame || !grab) return;
    const box = frame.getBoundingClientRect();

    const gap = gapFromY(rows, e.clientY - box.top + scroll.top);
    const plan = planDrop(toLines(value), index, gap);
    // Depth follows how far the pointer has travelled sideways, not where it
    // sits: the grip lives in the gutter, so its absolute position is nowhere
    // near the column the line starts at.
    const columns = grab.indent + Math.round((e.clientX - grab.x) / column);

    setDrag({
      from: index,
      start: plan.start,
      end: plan.end,
      gap,
      indent: nearestIndent(plan.options, columns),
    });
  };

  const releaseGrip = (e: ReactPointerEvent) => {
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  };

  const handleGripUp = (e: ReactPointerEvent) => {
    releaseGrip(e);
    if (!drag) return;
    const moved = moveBlock(value, drag.from, drag.gap, drag.indent);
    setDrag(null);
    // null means the block landed where it started. Not an edit, and pushing it
    // through state would put an identical entry on the undo stack.
    if (moved !== null) onChange(moved);
  };

  // pointercancel means the gesture never happened -- the browser took the
  // pointer, the device went away, a touch was cancelled. Rewriting the
  // document off the back of that would reorder a tree the user never dropped.
  const handleGripCancel = (e: ReactPointerEvent) => {
    releaseGrip(e);
    setDrag(null);
  };

  // Shared by the field and its mirror. Any difference between the two here
  // shows up as grips drifting out of line with the text.
  const boxShape = cx(
    // break-words is not decoration: the UA stylesheet gives a textarea
    // `word-wrap: break-word` and a plain div `normal`, so one long unbreakable
    // token -- a deep path, a URL -- wraps in the field and not in the mirror.
    // Every row below it would then be measured a line too high.
    'px-4 py-4 text-sm font-mono leading-6 break-words',
    GUTTER_PADDING,
    wrap ? 'whitespace-pre-wrap' : 'whitespace-pre',
    // On both, or a vertical scrollbar narrows only the real field and wraps
    // it a column earlier than the mirror predicted.
    '[scrollbar-gutter:stable]'
  );

  // min-h: stacked on a phone the card's height is content-driven, and every
  // child of the frame is absolutely positioned, so flex-1 on its own would
  // resolve to no height at all.
  return (
    <div
      ref={frameRef}
      className="group relative flex-1 min-h-[18rem] md:min-h-0"
    >
      <TextArea
        mono
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        onPaste={onPaste}
        onScroll={(e) =>
          setScroll({
            top: e.currentTarget.scrollTop,
            left: e.currentTarget.scrollLeft,
          })
        }
        placeholder={placeholder}
        spellCheck={false}
        // The CSS above is what actually does this, and it is what the mirror
        // matches. The attribute is here so the DOM says the same thing.
        wrap={wrap ? 'soft' : 'off'}
        className={cx(
          'absolute inset-0 h-full overflow-auto',
          boxShape,
          // border-gray-300 over the shared field's gray-200: a 1px hairline
          // lands on a single device pixel at fractional DPR, where the
          // lighter grey all but disappears against the white card.
          'border-gray-300'
        )}
        aria-label="Tree source"
        aria-describedby={describedBy}
      />

      <div
        ref={mirrorRef}
        aria-hidden
        className={cx(
          'absolute inset-0 invisible pointer-events-none overflow-hidden',
          'border border-transparent',
          boxShape
        )}
      >
        {lines.map((line, i) => (
          // A non-breaking space gives an empty line a box to be measured; an
          // empty div would collapse to no height at all.
          <div key={i}>{line === '' ? ' ' : line}</div>
        ))}
      </div>

      <span
        ref={probeRef}
        aria-hidden
        className="absolute invisible pointer-events-none text-sm font-mono whitespace-pre"
      >
        0000000000
      </span>

      {drag && rows[drag.start] && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-2xl">
          {/* The subtree being carried, shown lifted so it is obvious that a
              directory brings its children along. */}
          <div
            className="absolute inset-x-0 bg-blue-500/10"
            style={{
              top: rows[drag.start].top - scroll.top,
              height: gapY(drag.end) - rows[drag.start].top,
            }}
          />
          {/* Where it lands, drawn at the indent it will land at, so the
              pointer's horizontal position reads as a depth choice. */}
          <div
            className="absolute right-4 h-0.5 bg-blue-500 rounded-full"
            style={{
              top: gapY(drag.gap) - scroll.top - 1,
              left: origin + drag.indent * column - scroll.left,
            }}
          />
        </div>
      )}

      <div
        className={cx(
          'absolute left-0 top-0 bottom-0 overflow-hidden pointer-events-none',
          GUTTER_WIDTH
        )}
      >
        {rows.map((row, i) =>
          !lines[i] || lines[i].trim() === '' ? null : (
            <button
              key={i}
              type="button"
              // Out of the tab order on purpose. Every move this offers is
              // already on the keyboard -- Alt+Arrow reorders, Tab and
              // Shift+Tab reparent -- so a stop per line would bury those
              // bindings behind a hundred tab presses.
              tabIndex={-1}
              aria-hidden
              title="Drag to move this item and everything nested under it"
              onPointerDown={handleGripDown(i)}
              onPointerMove={handleGripMove(i)}
              onPointerUp={handleGripUp}
              onPointerCancel={handleGripCancel}
              className={cx(
                // left-0 w-5, not the full w-9 gutter: the outer 20px is the
                // grip, and the 16px next to the text stays live padding for
                // click-to-place-caret and drag-select from line start.
                'absolute left-0 h-6 w-5 flex items-center justify-center',
                // touch-none, or the browser claims the gesture as a page
                // scroll and the grip never sees a move.
                'pointer-events-auto touch-none transition-opacity',
                'focus:outline-none',
                drag
                  ? drag.from === i
                    ? 'opacity-100 text-blue-500 cursor-grabbing'
                    : 'opacity-0'
                  : 'opacity-0 group-hover:opacity-100 text-gray-300 hover:text-gray-600 cursor-grab'
              )}
              style={{ top: row.top - scroll.top }}
            >
              <GripIcon />
            </button>
          )
        )}
      </div>
    </div>
  );
}

function GripIcon() {
  return (
    <svg
      width="10"
      height="14"
      viewBox="0 0 10 14"
      aria-hidden
      focusable="false"
    >
      {[3, 7, 11].map((y) =>
        [3, 7].map((x) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r="1.1" fill="currentColor" />
        ))
      )}
    </svg>
  );
}
