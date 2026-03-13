import { useState, useCallback } from 'react';
import '../../src/style.css';
import { AppHeader } from '../../components/AppHeader';
import { JsonInput } from '../../components/JsonInput';
import { TabBar, type Tab } from '../../components/TabBar';
import { JsonOutput } from '../../components/JsonOutput';

export default function Page() {
  const [jsonData, setJsonData] = useState<unknown>(null);
  const [rawJson, setRawJson] = useState('');
  const [activeTab, setActiveTab] = useState<Tab>('jq');
  const [output, setOutput] = useState<unknown>(null);

  const handleJsonParsed = useCallback((data: unknown, raw: string) => {
    setJsonData(data);
    setRawJson(raw);
    setOutput(data);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <AppHeader />
        <JsonInput onJsonParsed={handleJsonParsed} />
        {jsonData !== null && (
          <>
            <div className="bg-white rounded-3xl p-6 border border-gray-100 mb-6 animate-fade-in">
              <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
              <div className="min-h-[200px]">
                <p className="text-gray-400 text-sm">
                  {activeTab} editor coming next
                </p>
              </div>
            </div>
            <JsonOutput data={output} />
          </>
        )}
      </div>
    </div>
  );
}
