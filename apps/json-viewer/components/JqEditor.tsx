import { useState, useCallback, useRef, useEffect } from 'react';

interface JqEditorProps {
  jsonData: unknown;
  onResult: (result: unknown) => void;
  onError: (error: string | null) => void;
}

export function JqEditor({ jsonData, onResult, onError }: JqEditorProps) {
  const [expression, setExpression] = useState('.');
  const [jqModule, setJqModule] = useState<{ json: (data: unknown, filter: string) => unknown } | null>(null);
  const [loading, setLoading] = useState(true);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    import('jq-web').then((mod) => {
      const jq = mod.default || mod;
      // jq-web exports a promise that resolves to the jq instance
      if (typeof jq.then === 'function') {
        jq.then((resolved: typeof jq) => {
          setJqModule(resolved);
          setLoading(false);
        });
      } else {
        setJqModule(jq);
        setLoading(false);
      }
    }).catch(() => {
      onError('Failed to load jq-web WASM module');
      setLoading(false);
    });
  }, [onError]);

  const runQuery = useCallback(
    (expr: string) => {
      if (!jqModule || !expr.trim()) return;
      try {
        const result = jqModule.json(jsonData, expr);
        onResult(result);
        onError(null);
      } catch (e) {
        onError(e instanceof Error ? e.message : 'jq error');
      }
    },
    [jqModule, jsonData, onResult, onError]
  );

  useEffect(() => {
    if (jqModule) runQuery(expression);
  }, [jqModule, jsonData]); // eslint-disable-line react-hooks/exhaustive-deps

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
