import { useState, useRef, useCallback } from 'react';

interface JsonInputProps {
  onJsonParsed: (data: unknown, rawJson: string) => void;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getSummary(data: unknown, rawJson: string): string {
  const size = formatBytes(new TextEncoder().encode(rawJson).length);
  if (Array.isArray(data)) {
    return `Array · ${data.length} items · ${size}`;
  }
  if (data !== null && typeof data === 'object') {
    return `Object · ${Object.keys(data).length} keys · ${size}`;
  }
  return `${typeof data} · ${size}`;
}

export function JsonInput({ onJsonParsed }: JsonInputProps) {
  const [rawText, setRawText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [collapsed, setCollapsed] = useState(false);
  const [summary, setSummary] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const parseAndSubmit = useCallback(
    (text: string) => {
      try {
        const parsed = JSON.parse(text);
        setError(null);
        setSummary(getSummary(parsed, text));
        setCollapsed(true);
        onJsonParsed(parsed, text);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Invalid JSON');
      }
    },
    [onJsonParsed]
  );

  const handleSubmit = () => {
    if (!rawText.trim()) return;
    parseAndSubmit(rawText);
  };

  const handleFileRead = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      setRawText(text);
      parseAndSubmit(text);
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileRead(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  if (collapsed) {
    return (
      <div className="bg-white rounded-2xl px-5 py-3 border border-gray-200 mb-6 flex items-center justify-between animate-fade-in">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-700">{summary}</span>
        </div>
        <button
          onClick={() => setCollapsed(false)}
          className="text-sm text-blue-500 hover:text-blue-600 font-medium transition-colors"
        >
          Edit
        </button>
      </div>
    );
  }

  return (
    <div className="mb-6 animate-fade-in">
      <div
        className={`bg-white rounded-3xl p-6 border ${isDragging ? 'border-blue-500 bg-blue-50/30' : 'border-gray-100'} transition-all duration-200`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <textarea
          className="w-full h-48 px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all duration-200 text-gray-900 placeholder-gray-400 font-mono text-sm"
          placeholder='Paste JSON here or drag and drop a .json file...'
          value={rawText}
          onChange={(e) => {
            setRawText(e.target.value);
            setError(null);
          }}
        />
        {error && (
          <p className="mt-2 text-sm text-red-500">{error}</p>
        )}
        <div className="mt-4 flex items-center gap-3">
          <button
            onClick={handleSubmit}
            className="bg-black text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-800 transition-all duration-200 active:scale-95 shadow-sm"
          >
            Load JSON
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="bg-white border border-gray-200 text-gray-700 px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 active:scale-95 shadow-sm"
          >
            Upload File
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,application/json"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileRead(file);
            }}
          />
        </div>
      </div>
    </div>
  );
}
