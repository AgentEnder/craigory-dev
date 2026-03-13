import { useState } from 'react';
import '../../src/style.css';
import { AppHeader } from '../../components/AppHeader';
import { JsonInput } from '../../components/JsonInput';

export default function Page() {
  const [jsonData, setJsonData] = useState<unknown>(null);
  const [rawJson, setRawJson] = useState('');

  const handleJsonParsed = (data: unknown, raw: string) => {
    setJsonData(data);
    setRawJson(raw);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <AppHeader />
        <JsonInput onJsonParsed={handleJsonParsed} />
        {jsonData !== null && (
          <div className="text-gray-500 text-center text-sm">
            JSON loaded — workspace coming next
          </div>
        )}
      </div>
    </div>
  );
}
