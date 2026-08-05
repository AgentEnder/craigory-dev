import { useCallback, useEffect, useState } from 'react';

interface TreeOutputProps {
  tree: string;
}

export function TreeOutput({ tree }: TreeOutputProps) {
  const [copied, setCopied] = useState(false);

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
      <div className="flex items-center justify-between mb-4">
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
      <pre className="flex-1 min-h-[12rem] text-sm font-mono text-gray-900 bg-gray-50 rounded-2xl p-4 overflow-auto whitespace-pre">
        {tree}
      </pre>
    </>
  );
}
