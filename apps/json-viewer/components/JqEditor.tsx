import { useState, useCallback, useEffect } from 'react';
import { useJsonViewerStore } from '../src/store';
import type { JqApi } from '../src/jq-loader';

export function JqEditor() {
  const jsonData = useJsonViewerStore((s) => s.jsonData);
  const expression = useJsonViewerStore((s) => s.jqExpression);
  const setJqExpression = useJsonViewerStore((s) => s.setJqExpression);
  const setOutput = useJsonViewerStore((s) => s.setOutput);
  const setError = useJsonViewerStore((s) => s.setError);
  const clearError = useJsonViewerStore((s) => s.clearError);

  const [jqApi, setJqApi] = useState<JqApi | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadJq() {
      try {
        // Via ../src/jq-loader, never `import('jq-web')` directly — see the
        // comment there for why awaiting jq-web's namespace throws.
        const { jq } = await import('../src/jq-loader');
        const api = await jq;

        if (typeof api?.json !== 'function') {
          throw new Error(
            `jq module resolved without a json() function (got ${typeof api}).`
          );
        }

        if (!cancelled) {
          setJqApi(api);
          setLoading(false);
        }
      } catch (e) {
        if (!cancelled) {
          setError(
            'jq',
            `Failed to load jq engine: ${
              e instanceof Error ? e.message : String(e)
            }`
          );
          setLoading(false);
        }
      }
    }

    loadJq();
    return () => {
      cancelled = true;
    };
  }, [setError]);

  const runQuery = useCallback(
    (expr: string) => {
      if (!jqApi || !expr.trim()) return;
      try {
        const result = jqApi.json(jsonData, expr);
        setOutput(result);
        clearError('jq');
      } catch (e) {
        setError('jq', e instanceof Error ? e.message : 'jq error');
      }
    },
    [jqApi, jsonData, setOutput, setError, clearError]
  );

  // Debounce expression/data changes; re-run when jq engine becomes available.
  useEffect(() => {
    if (!jqApi) return;
    const t = setTimeout(() => runQuery(expression), 300);
    return () => clearTimeout(t);
  }, [jqApi, jsonData, expression, runQuery]);

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
        onChange={(e) => setJqExpression(e.target.value)}
        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 font-mono text-sm"
        placeholder="e.g. .users[] | .name"
        spellCheck={false}
      />
    </div>
  );
}
