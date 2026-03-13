import { useState, useCallback, useRef, useEffect } from 'react';

interface JqApi {
  json: (data: unknown, filter: string) => unknown;
}

interface JqEditorProps {
  jsonData: unknown;
  onResult: (result: unknown) => void;
  onError: (error: string | null) => void;
}

export function JqEditor({ jsonData, onResult, onError }: JqEditorProps) {
  const [expression, setExpression] = useState('.');
  const [jqApi, setJqApi] = useState<JqApi | null>(null);
  const [loading, setLoading] = useState(true);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined
  );

  useEffect(() => {
    let cancelled = false;

    async function loadJq() {
      try {
        const mod = await import('jq-web');

        // jq-web's CJS module.exports is reassigned twice:
        // first to a factory, then to a Promise of { json, raw }.
        // Vite's CJS→ESM interop can produce various shapes depending
        // on whether it auto-resolves the thenable. Search multiple
        // candidate locations for the `json` function.
        let resolved: JqApi | null = null;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const candidates: any[] = [
          mod.default,
          mod,
          mod.default?.default,
        ].filter(Boolean);

        for (const c of candidates) {
          if (typeof c.json === 'function') {
            resolved = c;
            break;
          }
          if (typeof c.then === 'function') {
            try {
              const awaited = await c;
              if (typeof awaited?.json === 'function') {
                resolved = awaited;
                break;
              }
            } catch {
              /* try next candidate */
            }
          }
          if (typeof c === 'function') {
            try {
              const instance = await c();
              if (typeof instance?.json === 'function') {
                resolved = instance;
                break;
              }
            } catch {
              /* try next candidate */
            }
          }
        }

        if (!resolved) {
          throw new Error('Unexpected jq-web module format');
        }

        if (!cancelled) {
          setJqApi(resolved);
          setLoading(false);
        }
      } catch (e) {
        if (!cancelled) {
          onError(
            `Failed to load jq engine: ${e instanceof Error ? e.message : String(e)}`
          );
          setLoading(false);
        }
      }
    }

    loadJq();
    return () => {
      cancelled = true;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const runQuery = useCallback(
    (expr: string) => {
      if (!jqApi || !expr.trim()) return;
      try {
        const result = jqApi.json(jsonData, expr);
        onResult(result);
        onError(null);
      } catch (e) {
        onError(e instanceof Error ? e.message : 'jq error');
      }
    },
    [jqApi, jsonData, onResult, onError]
  );

  useEffect(() => {
    if (jqApi) runQuery(expression);
  }, [jqApi, jsonData]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleChange = (value: string) => {
    setExpression(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => runQuery(value), 300);
  };

  if (loading) {
    return <p className="text-gray-400 text-sm">Loading jq engine...</p>;
  }

  return (
    <div>
      <label className="block text-xs font-medium text-gray-500 mb-1.5">
        jq expression
      </label>
      <input
        type="text"
        value={expression}
        onChange={(e) => handleChange(e.target.value)}
        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 font-mono text-sm"
        placeholder="e.g. .users[] | .name"
        spellCheck={false}
      />
    </div>
  );
}
