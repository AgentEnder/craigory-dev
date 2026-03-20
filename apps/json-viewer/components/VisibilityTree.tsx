import { useState, useMemo } from 'react';
import { getCollectionTraits } from '../src/collection-traits';
import { PATH_SEP } from '../src/visibility-filter';

interface VisibilityTreeProps {
  data: unknown;
  hiddenPaths: Set<string>;
  onTogglePath: (path: string) => void;
}

function TypeBadge({ value }: { value: unknown }) {
  if (value === null) return <span className="text-xs text-orange-500 font-mono">null</span>;
  if (Array.isArray(value)) return <span className="text-xs text-blue-500 font-mono">[]</span>;
  if (typeof value === 'object') return <span className="text-xs text-purple-500 font-mono">{'{}'}</span>;
  // No badge for primitives — the inline value preview is sufficient
  return null;
}

function TreeNode({
  keyName,
  value,
  path,
  hiddenPaths,
  onTogglePath,
}: {
  keyName: string;
  value: unknown;
  path: string;
  hiddenPaths: Set<string>;
  onTogglePath: (path: string) => void;
}) {
  const isExpandable = value !== null && typeof value === 'object';
  const isHidden = hiddenPaths.has(path);

  const entries = useMemo(() => {
    if (!isExpandable) return [];
    return Array.isArray(value)
      ? (value as unknown[]).map((v, i) => ({ key: String(i), value: v }))
      : Object.entries(value as Record<string, unknown>).map(([k, v]) => ({ key: k, value: v }));
  }, [value, isExpandable]);

  const traits = useMemo(() => getCollectionTraits(value), [value]);

  const [expanded, setExpanded] = useState(entries.length <= traits.collapseThreshold);
  const [visibleCount, setVisibleCount] = useState(traits.chunkSize);

  const visibleEntries = entries.slice(0, visibleCount);
  const remaining = entries.length - visibleCount;

  return (
    <div>
      <div className="flex items-center gap-1.5 py-0.5 group">
        {isExpandable ? (
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-4 h-4 flex items-center justify-center text-gray-400 hover:text-gray-600 text-xs"
          >
            {expanded ? '▼' : '▶'}
          </button>
        ) : (
          <span className="w-4" />
        )}
        <button
          onClick={() => onTogglePath(path)}
          className={`w-5 h-5 flex items-center justify-center rounded transition-colors ${
            isHidden
              ? 'text-gray-300 hover:text-gray-500'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          title={isHidden ? 'Show property' : 'Hide property'}
        >
          {isHidden ? (
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
            </svg>
          ) : (
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          )}
        </button>
        <TypeBadge value={value} />
        <span className={`text-sm font-mono ${isHidden ? 'text-gray-300 line-through' : 'text-gray-700'}`}>
          {keyName}
          {isExpandable && <span className="text-gray-400 ml-1">({entries.length})</span>}
        </span>
        {!isExpandable && !isHidden && (
          <span
            className={`text-xs truncate max-w-[200px] ${
              typeof value === 'string'
                ? 'text-green-600'
                : typeof value === 'number'
                  ? 'text-blue-600'
                  : value === null || typeof value === 'boolean'
                    ? 'text-orange-500'
                    : 'text-gray-400'
            }`}
          >
            {JSON.stringify(value)}
          </span>
        )}
      </div>
      {isExpandable && expanded && (
        <div className="ml-5 border-l border-gray-200 pl-1">
          {visibleEntries.map((entry) => (
            <TreeNode
              key={entry.key}
              keyName={entry.key}
              value={entry.value}
              path={path ? `${path}${PATH_SEP}${entry.key}` : entry.key}
              hiddenPaths={hiddenPaths}
              onTogglePath={onTogglePath}
            />
          ))}
          {remaining > 0 && (
            <button
              onClick={() => setVisibleCount((c) => c + traits.chunkSize)}
              className="text-xs text-blue-500 hover:text-blue-700 py-1 cursor-pointer"
            >
              Show {Math.min(remaining, traits.chunkSize)} more ({remaining} remaining)
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export function VisibilityTree({ data, hiddenPaths, onTogglePath }: VisibilityTreeProps) {
  if (data === null || typeof data !== 'object') {
    return <p className="text-gray-400 text-sm">No object or array to display</p>;
  }

  const entries = Array.isArray(data)
    ? (data as unknown[]).map((v, i) => ({ key: String(i), value: v }))
    : Object.entries(data as Record<string, unknown>).map(([k, v]) => ({ key: k, value: v }));

  return (
    <div className="font-mono text-sm overflow-auto max-h-[400px]">
      {entries.map((entry) => (
        <TreeNode
          key={entry.key}
          keyName={entry.key}
          value={entry.value}
          path={entry.key}
          hiddenPaths={hiddenPaths}
          onTogglePath={onTogglePath}
        />
      ))}
    </div>
  );
}
