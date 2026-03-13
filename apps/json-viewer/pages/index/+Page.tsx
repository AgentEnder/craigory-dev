import { useState, useCallback } from 'react';
import '../../src/style.css';
import { AppHeader } from '../../components/AppHeader';
import { JsonInput } from '../../components/JsonInput';
import { TabBar, type Tab } from '../../components/TabBar';
import { JsonOutput } from '../../components/JsonOutput';
import { VisibilityTree } from '../../components/VisibilityTree';
import { applyVisibilityFilter } from '../../src/visibility-filter';

export default function Page() {
  const [jsonData, setJsonData] = useState<unknown>(null);
  const [rawJson, setRawJson] = useState('');
  const [activeTab, setActiveTab] = useState<Tab>('jq');
  const [output, setOutput] = useState<unknown>(null);
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
      if (tab === 'visibility' && jsonData !== null) {
        setOutput(applyVisibilityFilter(jsonData, hiddenPaths));
      } else if (jsonData !== null) {
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
                {activeTab === 'visibility' ? (
                  <VisibilityTree
                    data={jsonData}
                    hiddenPaths={hiddenPaths}
                    onTogglePath={handleTogglePath}
                  />
                ) : (
                  <p className="text-gray-400 text-sm">
                    {activeTab} editor coming next
                  </p>
                )}
              </div>
            </div>
            <JsonOutput data={output} />
          </>
        )}
      </div>
    </div>
  );
}
