import { useCallback, useEffect, useState } from 'react';
import { cx } from '@new-personal-monorepo/small-app-design-system';

interface TreeOutputProps {
  tree: string;
  /**
   * Shown, muted, while there is nothing to render -- the counterpart to the
   * source field's placeholder, so an empty pane still says what it is for.
   */
  placeholder?: string;
}

export function TreeOutput({ tree, placeholder }: TreeOutputProps) {
  const [copied, setCopied] = useState(false);
  const showingPlaceholder = !tree && !!placeholder;

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(tree);
    setCopied(true);
  }, [tree]);

  return (
    <>
      {/* h-9 is the Copy button's own height, pinned here so the source pane's
          header can match it and the two titles sit on the same line. */}
      <div className="flex items-center justify-between h-9 mb-4">
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
        className={cx(
          'flex-1 min-h-[12rem] text-sm font-mono bg-gray-50 rounded-2xl p-4 overflow-auto whitespace-pre',
          // select-none so a stray drag cannot lift the sample out as if it
          // were real output -- Copy is disabled for the same reason.
          showingPlaceholder
            ? 'text-gray-400 select-none'
            : 'text-gray-900'
        )}
      >
        {tree || placeholder}
      </pre>
    </>
  );
}
