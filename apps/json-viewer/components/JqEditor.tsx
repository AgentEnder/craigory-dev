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

        // jq-web's final module.exports is a Promise<{ json, raw }>.
        // Vite's CJS→ESM interop may expose it in several ways:
        //  - mod.default is the Promise (standard CJS interop)
        //  - mod itself resolves to { json, raw } (if Vite auto-resolves thenable exports)
        //  - mod.default.default in rare double-wrap cases
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let resolved: JqApi | null = null;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        function hasJsonFn(v: any): v is JqApi {
          return v && typeof v.json === 'function';
        }

        // Check if already resolved (Vite may auto-await thenables)
        if (hasJsonFn(mod)) {
          resolved = mod;
        } else if (hasJsonFn(mod.default)) {
          resolved = mod.default;
        } else {
          // Await the thenable/Promise — don't swallow errors here,
          // as rejection typically means the WASM failed to load
          const target = mod.default ?? mod;
          if (typeof target === 'function') {
            const instance = await target();
            resolved = hasJsonFn(instance) ? instance : null;
          } else if (target && typeof target.then === 'function') {
            const awaited = await target;
            resolved = hasJsonFn(awaited) ? awaited : null;
          }
        }

        if (!resolved) {
          throw new Error(
            'Could not resolve jq API from module. ' +
              `Got keys: [${Object.keys(mod).join(', ')}], ` +
              `default type: ${typeof mod.default}`
          );
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
