import { useState, useMemo, useCallback, type ReactNode } from 'react';
import { getCollectionTraits } from '../src/collection-traits';

interface JsonOutputProps {
  data: unknown;
}

function JsonNode({
  keyName,
  value,
  isLast,
}: {
  keyName?: string;
  value: unknown;
  isLast: boolean;
}) {
  const isObject =
    value !== null && typeof value === 'object' && !Array.isArray(value);
  const isArray = Array.isArray(value);
  const isExpandable = isObject || isArray;

  const entries = useMemo(() => {
    if (!isExpandable) return [];
    return isArray
      ? (value as unknown[]).map((v, i) => ({ key: String(i), value: v }))
      : Object.entries(value as Record<string, unknown>).map(([k, v]) => ({
          key: k,
          value: v,
        }));
  }, [value, isExpandable, isArray]);

  const traits = useMemo(() => getCollectionTraits(value), [value]);

  const [collapsed, setCollapsed] = useState(
    entries.length > traits.collapseThreshold
  );
  const [visibleCount, setVisibleCount] = useState(traits.chunkSize);

  const comma = isLast ? '' : ',';

  if (!isExpandable) {
    const rendered = renderPrimitive(value);
    return (
      <div className="leading-6">
        {keyName !== undefined && (
          <span className="text-purple-700">"{keyName}"</span>
        )}
        {keyName !== undefined && <span className="text-gray-600">: </span>}
        {rendered}
        <span className="text-gray-600">{comma}</span>
      </div>
    );
  }

  const openBracket = isArray ? '[' : '{';
  const closeBracket = isArray ? ']' : '}';
  const visibleEntries = entries.slice(0, visibleCount);
  const remaining = entries.length - visibleCount;

  return (
    <div>
      <span
        className="cursor-pointer select-none inline-flex items-center"
        onClick={() => setCollapsed(!collapsed)}
      >
        <span className="text-gray-400 w-4 inline-block text-xs">
          {collapsed ? '▶' : '▼'}
        </span>
        {keyName !== undefined && (
          <span className="text-purple-700">"{keyName}"</span>
        )}
        {keyName !== undefined && <span className="text-gray-600">: </span>}
        <span className="text-gray-600">{openBracket}</span>
        {collapsed && (
          <>
            <span className="mx-1">
              <CollapsedPreview entries={entries} isArray={isArray} />
            </span>
            <span className="text-gray-600">
              {closeBracket}
              {comma}
            </span>
          </>
        )}
      </span>
      {!collapsed && (
        <>
          <div className="ml-5 border-l border-gray-200 pl-3">
            {visibleEntries.map((entry, i) => (
              <JsonNode
                key={entry.key}
                keyName={isArray ? undefined : entry.key}
                value={entry.value}
                isLast={remaining <= 0 && i === visibleEntries.length - 1}
              />
            ))}
            {remaining > 0 && (
              <button
                onClick={() => setVisibleCount((c) => c + traits.chunkSize)}
                className="text-xs text-blue-500 hover:text-blue-700 py-1 cursor-pointer"
              >
                Show {Math.min(remaining, traits.chunkSize)} more ({remaining}{' '}
                remaining)
              </button>
            )}
          </div>
          <div>
            <span className="text-gray-400 w-4 inline-block" />
            <span className="text-gray-600">
              {closeBracket}
              {comma}
            </span>
          </div>
        </>
      )}
    </div>
  );
}

function inlinePreview(value: unknown): [string, ReactNode] {
  if (value === null)
    return ['null', <span className="text-orange-600">null</span>];
  if (typeof value === 'boolean') {
    const s = String(value);
    return [s, <span className="text-orange-600">{s}</span>];
  }
  if (typeof value === 'number') {
    const s = String(value);
    return [s, <span className="text-blue-600">{s}</span>];
  }
  if (typeof value === 'string') {
    const maxLen = 20;
    const display =
      value.length > maxLen
        ? `"${value.slice(0, maxLen)}…"`
        : `"${value}"`;
    return [display, <span className="text-green-700">{display}</span>];
  }
  if (Array.isArray(value))
    return ['[…]', <span className="text-gray-400">[…]</span>];
  if (typeof value === 'object')
    return ['{…}', <span className="text-gray-400">{'{…}'}</span>];
  const s = String(value);
  return [s, <span className="text-gray-500">{s}</span>];
}

function CollapsedPreview({
  entries,
  isArray,
  maxChars = 50,
}: {
  entries: { key: string; value: unknown }[];
  isArray: boolean;
  maxChars?: number;
}) {
  const items: ReactNode[] = [];
  let charCount = 0;
  let allFit = true;

  for (let i = 0; i < entries.length; i++) {
    const { key, value } = entries[i];
    const [valStr, valNode] = inlinePreview(value);

    const itemStr = isArray ? valStr : `${key}: ${valStr}`;
    const separatorLen = i > 0 ? 2 : 0;

    if (charCount + separatorLen + itemStr.length > maxChars && items.length > 0) {
      allFit = false;
      break;
    }

    if (i > 0) {
      items.push(
        <span key={`sep-${i}`} className="text-gray-600">
          ,{' '}
        </span>
      );
      charCount += 2;
    }

    items.push(
      isArray ? (
        <span key={i}>{valNode}</span>
      ) : (
        <span key={i}>
          <span className="text-purple-700">{key}</span>
          <span className="text-gray-600">: </span>
          {valNode}
        </span>
      )
    );
    charCount += itemStr.length;
  }

  if (!allFit) {
    items.push(
      <span key="sep-ellipsis" className="text-gray-600">
        ,{' '}
      </span>
    );
    items.push(
      <span key="ellipsis" className="text-gray-400">
        …
      </span>
    );
  }

  return <>{items}</>;
}

function renderPrimitive(value: unknown) {
  if (value === null) return <span className="text-orange-600">null</span>;
  if (typeof value === 'boolean')
    return <span className="text-orange-600">{String(value)}</span>;
  if (typeof value === 'number')
    return <span className="text-blue-600">{String(value)}</span>;
  if (typeof value === 'string')
    return <span className="text-green-700">"{value}"</span>;
  return <span className="text-gray-500">{String(value)}</span>;
}

function ActionButton({ onClick, children }: { onClick: () => void; children: ReactNode }) {
  return (
    <button
      onClick={onClick}
      className="text-xs text-gray-400 hover:text-gray-600 transition-colors cursor-pointer flex items-center gap-1"
    >
      {children}
    </button>
  );
}

export function JsonOutput({ data }: JsonOutputProps) {
  const [copied, setCopied] = useState(false);

  const handleDownload = useCallback(() => {
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'output.json';
    a.click();
    URL.revokeObjectURL(url);
  }, [data]);

  const handleCopy = useCallback(() => {
    const json = JSON.stringify(data, null, 2);
    navigator.clipboard.writeText(json).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }, [data]);

  return (
    <div className="bg-white rounded-3xl p-6 border border-gray-100 animate-fade-in">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-medium text-gray-500">Output</h2>
        {data !== null && (
          <div className="flex items-center gap-3">
            <ActionButton onClick={handleCopy}>
              {copied ? (
                <>
                  <svg className="w-3.5 h-3.5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-green-500">Copied</span>
                </>
              ) : (
                <>
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copy
                </>
              )}
            </ActionButton>
            <ActionButton onClick={handleDownload}>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V3" />
              </svg>
              Download
            </ActionButton>
          </div>
        )}
      </div>
      <div className="font-mono text-sm overflow-auto max-h-[500px]">
        <JsonNode value={data} isLast={true} />
      </div>
    </div>
  );
}
