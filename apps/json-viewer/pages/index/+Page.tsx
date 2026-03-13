import { useState, useCallback } from 'react';
import '../../src/style.css';
import { AppHeader } from '../../components/AppHeader';
import { JsonInput } from '../../components/JsonInput';
import { TabBar, type Tab } from '../../components/TabBar';
import { JsonOutput } from '../../components/JsonOutput';
import { VisibilityTree } from '../../components/VisibilityTree';
import { JqEditor } from '../../components/JqEditor';
import { TypeScriptEditor } from '../../components/TypeScriptEditor';
import { applyVisibilityFilter } from '../../src/visibility-filter';

export default function Page() {
  const [jsonData, setJsonData] = useState<unknown>(null);
  const [, setRawJson] = useState('');
  const [activeTab, setActiveTab] = useState<Tab>('jq');
  const [output, setOutput] = useState<unknown>(null);
  const [error, setError] = useState<string | null>(null);
  const [hiddenPaths, setHiddenPaths] = useState<Set<string>>(new Set());

  const handleJsonParsed = useCallback((data: unknown, raw: string) => {
    setJsonData(data);
    setRawJson(raw);
    setOutput(data);
  }, []);

  const handleTogglePath = useCallback(
    (path: string) => {
      setHiddenPaths((prev) => {
        const next = new Set(prev);
        if (next.has(path)) {
          next.delete(path);
        } else {
          next.add(path);
        }
        if (activeTab === 'visibility' && jsonData !== null) {
          setOutput(applyVisibilityFilter(jsonData, next));
        }
        return next;
      });
    },
    [activeTab, jsonData]
  );

  const handleTabChange = useCallback(
    (tab: Tab) => {
      setActiveTab(tab);
      setError(null);
      if (tab === 'visibility' && jsonData !== null) {
        setOutput(applyVisibilityFilter(jsonData, hiddenPaths));
      } else if (tab !== 'jq' && jsonData !== null) {
        setOutput(jsonData);
      }
    },
    [jsonData, hiddenPaths]
  );

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <AppHeader />
        <JsonInput onJsonParsed={handleJsonParsed} />
        {jsonData !== null && (
          <>
            <div className="bg-white rounded-3xl p-6 border border-gray-100 mb-6 animate-fade-in">
              <TabBar activeTab={activeTab} onTabChange={handleTabChange} />
              <div className="min-h-[200px]">
                {activeTab === 'jq' ? (
                  <JqEditor
                    jsonData={jsonData}
                    onResult={setOutput}
                    onError={setError}
                  />
                ) : activeTab === 'typescript' ? (
                  <TypeScriptEditor
                    jsonData={jsonData}
                    onResult={setOutput}
                    onError={setError}
                  />
                ) : activeTab === 'visibility' ? (
                  <VisibilityTree
                    data={jsonData}
                    hiddenPaths={hiddenPaths}
                    onTogglePath={handleTogglePath}
                  />
                ) : null}
              </div>
            </div>
            {error && (
              <div className="mb-6 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 animate-fade-in">
                {error}
              </div>
            )}
            <JsonOutput data={output} />
          </>
        )}
      </div>
    </div>
  );
}
