import { useState } from 'react';

interface JsonOutputProps {
  data: unknown;
}

function JsonNode({ keyName, value, isLast }: { keyName?: string; value: unknown; isLast: boolean }) {
  const [collapsed, setCollapsed] = useState(false);
  const isObject = value !== null && typeof value === 'object' && !Array.isArray(value);
  const isArray = Array.isArray(value);
  const isExpandable = isObject || isArray;

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

  const entries = isArray
    ? (value as unknown[]).map((v, i) => ({ key: String(i), value: v }))
    : Object.entries(value as Record<string, unknown>).map(([k, v]) => ({ key: k, value: v }));

  const openBracket = isArray ? '[' : '{';
  const closeBracket = isArray ? ']' : '}';

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
            <span className="text-gray-400 mx-1">
              {entries.length} {isArray ? 'items' : 'keys'}
            </span>
            <span className="text-gray-600">{closeBracket}{comma}</span>
          </>
        )}
      </span>
      {!collapsed && (
        <>
          <div className="ml-5 border-l border-gray-200 pl-3">
            {entries.map((entry, i) => (
              <JsonNode
                key={entry.key}
                keyName={isArray ? undefined : entry.key}
                value={entry.value}
                isLast={i === entries.length - 1}
              />
            ))}
          </div>
          <div>
            <span className="text-gray-400 w-4 inline-block" />
            <span className="text-gray-600">{closeBracket}{comma}</span>
          </div>
        </>
      )}
    </div>
  );
}

function renderPrimitive(value: unknown) {
  if (value === null) return <span className="text-orange-600">null</span>;
  if (typeof value === 'boolean') return <span className="text-orange-600">{String(value)}</span>;
  if (typeof value === 'number') return <span className="text-blue-600">{String(value)}</span>;
  if (typeof value === 'string') return <span className="text-green-700">"{value}"</span>;
  return <span className="text-gray-500">{String(value)}</span>;
}

export function JsonOutput({ data }: JsonOutputProps) {
  return (
    <div className="bg-white rounded-3xl p-6 border border-gray-100 animate-fade-in">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-medium text-gray-500">Output</h2>
      </div>
      <div className="font-mono text-sm overflow-auto max-h-[500px]">
        <JsonNode value={data} isLast={true} />
      </div>
    </div>
  );
}
