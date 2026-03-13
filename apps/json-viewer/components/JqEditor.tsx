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
        // jq-web's module.exports is a Promise<{ json, raw }>.
        // With Vite pre-bundling (esbuild CJS→ESM), mod.default is the Promise.
        const mod = await import('jq-web');
        const target = mod.default ?? mod;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const resolved: any =
          target && typeof target.then === 'function'
            ? await target
            : target;

        if (!resolved || typeof resolved.json !== 'function') {
          throw new Error(
            'Could not resolve jq API from module. ' +
              `default type: ${typeof mod.default}, ` +
              `resolved type: ${typeof resolved}`
          );
        }

        if (!cancelled) {
          setJqApi(resolved as JqApi);
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
