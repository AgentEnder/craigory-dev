import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
} from 'react';
import { cx } from '@new-personal-monorepo/small-app-design-system';
import { measureTree } from '../src/render';

interface TreeOutputProps {
  tree: string;
  /**
   * Shown, muted, while there is nothing to render -- the counterpart to the
   * source field's placeholder, so an empty pane still says what it is for.
   */
  placeholder?: string;
  /** Wrap settings, mirrored here to draw the column the output wraps at. */
  wrap: boolean;
  width: number;
}

/**
 * Left padding on the <pre>, as a bare number of rem. The column guide is
 * positioned against the padding box, so it has to clear the same gutter the
 * first character sits behind.
 */
const PAD_REM = 1;

export function TreeOutput({
  tree,
  placeholder,
  wrap,
  width,
}: TreeOutputProps) {
  const [copied, setCopied] = useState(false);
  const showingPlaceholder = !tree && !!placeholder;
  const measurement = useMemo(() => measureTree(tree), [tree]);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(tree);
    setCopied(true);
  }, [tree]);

  // A hairline at the column the renderer wraps to, so the wrap width is
  // something you can see against the output rather than a number to imagine.
  //
  // `ch` is the monospace advance width, so the rule lands exactly on a column
  // boundary. `background-attachment: local` pins it to the content rather than
  // the viewport of the box, so it scrolls sideways with the text it measures
  // instead of sliding across it.
  const guide: CSSProperties | undefined = wrap
    ? ({
        '--guide-x': `calc(${PAD_REM}rem + ${width}ch)`,
        backgroundImage:
          'linear-gradient(to right, transparent var(--guide-x), rgb(15 23 42 / 0.12) var(--guide-x), rgb(15 23 42 / 0.12) calc(var(--guide-x) + 1px), transparent calc(var(--guide-x) + 1px))',
        backgroundAttachment: 'local',
      } as CSSProperties)
    : undefined;

  const overflow = wrap ? measurement.widest - width : 0;

  return (
    <>
      {/* h-9 is the Copy button's own height, pinned here so the source pane's
          header can match it and the two titles sit on the same line. */}
      <div className="flex items-center justify-between h-9 mb-4 gap-4">
        <h2 className="text-sm font-medium text-gray-700">Rendered tree</h2>
        <button
          onClick={handleCopy}
          disabled={!tree}
          className="bg-black text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-gray-800 transition-all duration-200 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      {/* Horizontal scroll rather than wrapping: with wrap off, or a width above
          the pane, reflowing here would misrepresent the output the user copies.
          flex-1 lets the block take up whatever height the paired input pane
          sets, so the two cards end level. */}
      <pre
        style={guide}
        className={cx(
          'flex-1 min-h-[12rem] text-sm font-mono bg-gray-50 rounded-2xl p-4 overflow-auto whitespace-pre',
          // select-none so a stray drag cannot lift the sample out as if it
          // were real output -- Copy is disabled for the same reason.
          showingPlaceholder ? 'text-gray-400 select-none' : 'text-gray-900'
        )}
      >
        {tree || placeholder}
      </pre>
      <div className="mt-3 h-4 flex items-center justify-between gap-4 text-xs text-gray-400">
        {showingPlaceholder ? (
          <span>Example output — start typing to replace it.</span>
        ) : (
          <span>
            {measurement.lines} {measurement.lines === 1 ? 'line' : 'lines'} ·
            widest {measurement.widest} cols
          </span>
        )}
        {overflow > 0 && (
          <span
            className="text-amber-600 shrink-0"
            title="An annotation always keeps a minimum amount of room, however deep its node sits, rather than being shredded into a few characters per line. Nesting past that point runs over the target instead."
          >
            {overflow} past the {width}-col target
          </span>
        )}
      </div>
    </>
  );
}
