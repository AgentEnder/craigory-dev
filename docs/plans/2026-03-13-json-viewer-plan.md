# JSON Viewer Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a client-side JSON viewer/transformer app following the existing Vike + React + Tailwind pattern.

**Architecture:** Single-column stacked layout with collapsible JSON input, tabbed workspace (JQ | TypeScript | Visibility), and always-visible output. Each tab mode operates on the full source JSON and produces output independently.

**Tech Stack:** Vike, React 19, Tailwind CSS 4, Vite, Ace Editor (ace-code), ace-linters (TypeScript intellisense), jq-web (WASM jq), TypeScript compiler (client-side transpilation)

---

### Task 1: Scaffold the app with config files

Create the app skeleton with all configuration files matching the qr-generator pattern.

**Files:**
- Create: `apps/json-viewer/package.json`
- Create: `apps/json-viewer/vite.config.ts`
- Create: `apps/json-viewer/tsconfig.json`
- Create: `apps/json-viewer/project.json`
- Create: `apps/json-viewer/project-metadata.json`
- Create: `apps/json-viewer/index.html`
- Create: `apps/json-viewer/.gitignore`
- Create: `apps/json-viewer/src/vite-env.d.ts`
- Create: `apps/json-viewer/src/style.css`

**Step 1: Create package.json**

```json
{
  "name": "json-viewer",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vike dev",
    "build": "vike build",
    "preview": "vike preview",
    "typecheck": "tsc --noEmit"
  },
  "nx": {
    "targets": {
      "build": {
        "dependsOn": [
          "typecheck"
        ]
      }
    }
  },
  "devDependencies": {},
  "dependencies": {
    "@tailwindcss/vite": "^4.1.12",
    "@types/react": "^19.1.10",
    "@types/react-dom": "^19.1.7",
    "@vitejs/plugin-react": "^5.0.0",
    "autoprefixer": "^10.4.21",
    "postcss": "^8.5.6",
    "react": "^19.1.1",
    "react-dom": "^19.1.1",
    "tailwindcss": "^4.1.12",
    "vike": "0.4.239-commit-9dcde6d",
    "vike-react": "^0.6.5",
    "ace-code": "^1.43.6",
    "ace-linters": "^2.1.1",
    "jq-web": "^0.6.2",
    "typescript": "^5.9.2"
  }
}
```

**Step 2: Create vite.config.ts**

```ts
import { defineConfig } from 'vite';
import vike from 'vike/plugin';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss(), vike()],
  build: {},
  base: (process.env.PUBLIC_ENV__BASE_URL ?? '') + '/json-viewer/',
});
```

**Step 3: Create tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "useDefineForClassFields": true,
    "module": "ESNext",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "verbatimModuleSyntax": true,
    "moduleDetection": "force",
    "noEmit": true,
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "erasableSyntaxOnly": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedSideEffectImports": true
  },
  "include": ["src"]
}
```

**Step 4: Create project.json**

```json
{
  "name": "json-viewer"
}
```

**Step 5: Create project-metadata.json**

```json
{
  "name": "JSON Viewer",
  "description": "A client-side JSON viewer and transformer. Explore JSON with collapsible trees, filter properties visually, and transform data using TypeScript or jq queries with full intellisense support.",
  "technologies": ["TypeScript", "HTML", "CSS"]
}
```

**Step 6: Create index.html**

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>JSON Viewer</title>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>
```

**Step 7: Create .gitignore**

Copy exact contents from `apps/qr-generator/.gitignore`.

**Step 8: Create src/vite-env.d.ts**

```ts
/// <reference types="vite/client" />
```

**Step 9: Create src/style.css**

```css
@import 'tailwindcss' source('..');

@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.4s ease-out;
}

@layer utilities {
  .active\:scale-\[0\.98\]:active {
    transform: scale(0.98);
  }
}

@layer base {
  * {
    border-color: #e5e7eb;
  }

  body {
    font-feature-settings: 'cv01', 'cv02', 'cv03', 'cv04';
  }
}

@layer utilities {
  .focus\:ring-2:focus {
    --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0
      var(--tw-ring-offset-width) var(--tw-ring-offset-color);
    --tw-ring-shadow: var(--tw-ring-inset) 0 0 0
      calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);
    box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow),
      var(--tw-shadow, 0 0 #0000);
  }

  .focus\:ring-blue-500:focus {
    --tw-ring-opacity: 1;
    --tw-ring-color: rgb(59 130 246 / var(--tw-ring-opacity));
  }

  .focus\:border-transparent:focus {
    border-color: transparent;
  }
}
```

**Step 10: Install dependencies**

Run: `cd apps/json-viewer && pnpm install`

**Step 11: Commit**

```bash
git add apps/json-viewer/
git commit -m "feat(json-viewer): scaffold app with config files"
```

---

### Task 2: Vike pages and AppHeader

Create the routing skeleton and header component.

**Files:**
- Create: `apps/json-viewer/pages/+config.ts`
- Create: `apps/json-viewer/pages/index/+Page.tsx`
- Create: `apps/json-viewer/pages/index/+Head.tsx`
- Create: `apps/json-viewer/pages/_error/+Page.tsx`
- Create: `apps/json-viewer/components/AppHeader.tsx`

**Step 1: Create pages/+config.ts**

```ts
import vikeReact from 'vike-react/config';
import type { Config } from 'vike/types';

export default {
  extends: [vikeReact],
  prerender: true,
} satisfies Config;
```

**Step 2: Create components/AppHeader.tsx**

```tsx
export function AppHeader() {
  return (
    <div className="text-center mb-8">
      <h1 className="text-2xl font-semibold text-gray-900 mb-1">
        JSON Viewer
      </h1>
      <p className="text-gray-500 text-sm">
        Explore, filter, and transform JSON data
      </p>
    </div>
  );
}
```

**Step 3: Create pages/index/+Head.tsx**

```tsx
export function Head() {
  return (
    <>
      <title>JSON Viewer</title>
      <meta
        name="description"
        content="A client-side JSON viewer and transformer with jq queries, TypeScript transforms, and visual filtering."
      />
    </>
  );
}
```

**Step 4: Create pages/index/+Page.tsx (minimal shell)**

```tsx
import '../../src/style.css';
import { AppHeader } from '../../components/AppHeader';

export default function Page() {
  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <AppHeader />
        <p className="text-gray-500 text-center">Loading...</p>
      </div>
    </div>
  );
}
```

**Step 5: Create pages/_error/+Page.tsx**

```tsx
import { PageContext } from 'vike/types';

export function Page({ is404, abortReason, abortStatusCode }: PageContext) {
  if (is404) {
    return (
      <>
        <h1>404 Page Not Found</h1>
        <p>This page could not be found.</p>
      </>
    );
  } else {
    return (
      <>
        <h1>500 Internal Error</h1>
        <p>Something went wrong.</p>
        <p>{JSON.stringify(abortReason)}</p>
        <p>{abortStatusCode}</p>
      </>
    );
  }
}
```

**Step 6: Verify the app runs**

Run: `cd apps/json-viewer && pnpm dev`
Expected: App loads at `http://localhost:3000/json-viewer/` showing header and "Loading..." text.

**Step 7: Commit**

```bash
git add apps/json-viewer/pages/ apps/json-viewer/components/AppHeader.tsx
git commit -m "feat(json-viewer): add Vike pages and AppHeader"
```

---

### Task 3: JsonInput component

Build the JSON input component with paste textarea, file drag-and-drop, and collapsible summary bar.

**Files:**
- Create: `apps/json-viewer/components/JsonInput.tsx`
- Modify: `apps/json-viewer/pages/index/+Page.tsx`

**Step 1: Create components/JsonInput.tsx**

```tsx
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
```

**Step 2: Update pages/index/+Page.tsx to use JsonInput**

```tsx
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
```

**Step 3: Verify**

Run: `cd apps/json-viewer && pnpm dev`
Expected: Paste JSON → input collapses to summary bar. Drag-and-drop a file → same behavior. Invalid JSON → error message shown.

**Step 4: Commit**

```bash
git add apps/json-viewer/components/JsonInput.tsx apps/json-viewer/pages/index/+Page.tsx
git commit -m "feat(json-viewer): add JsonInput with paste, file upload, and collapse"
```

---

### Task 4: TabBar and JsonOutput components

Build the tab navigation and the collapsible JSON output tree.

**Files:**
- Create: `apps/json-viewer/components/TabBar.tsx`
- Create: `apps/json-viewer/components/JsonOutput.tsx`
- Modify: `apps/json-viewer/pages/index/+Page.tsx`

**Step 1: Create components/TabBar.tsx**

```tsx
type Tab = 'jq' | 'typescript' | 'visibility';

interface TabBarProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

const tabs: { id: Tab; label: string }[] = [
  { id: 'jq', label: 'JQ' },
  { id: 'typescript', label: 'TypeScript' },
  { id: 'visibility', label: 'Visibility' },
];

export type { Tab };

export function TabBar({ activeTab, onTabChange }: TabBarProps) {
  return (
    <div className="flex gap-1 bg-gray-100 p-1 rounded-xl mb-4">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
            activeTab === tab.id
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
```

**Step 2: Create components/JsonOutput.tsx**

This is a recursive collapsible JSON tree renderer.

```tsx
import { useState } from 'react';

interface JsonOutputProps {
  data: unknown;
}

function JsonNode({ keyName, value, isLast }: { keyName?: string; value: unknown; isLast: boolean }) {
  const [collapsed, setCollapsed] = useState(false);
  const isObject = value !== null && typeof value === 'object' && !Array.isArray(value);
  const isArray = Array.isArray(value);
  const isExpandable = isObject || isArray;

  const comma = isLast ? '' : ',';

  if (!isExpandable) {
    const rendered = renderPrimitive(value);
    return (
      <div className="leading-6">
        {keyName !== undefined && (
          <span className="text-purple-700">"{keyName}"</span>
        )}
        {keyName !== undefined && <span className="text-gray-600">: </span>}
        {rendered}
        <span className="text-gray-600">{comma}</span>
      </div>
    );
  }

  const entries = isArray
    ? (value as unknown[]).map((v, i) => ({ key: String(i), value: v }))
    : Object.entries(value as Record<string, unknown>).map(([k, v]) => ({ key: k, value: v }));

  const openBracket = isArray ? '[' : '{';
  const closeBracket = isArray ? ']' : '}';

  return (
    <div>
      <span
        className="cursor-pointer select-none inline-flex items-center"
        onClick={() => setCollapsed(!collapsed)}
      >
        <span className="text-gray-400 w-4 inline-block text-xs">
          {collapsed ? '▶' : '▼'}
        </span>
        {keyName !== undefined && (
          <span className="text-purple-700">"{keyName}"</span>
        )}
        {keyName !== undefined && <span className="text-gray-600">: </span>}
        <span className="text-gray-600">{openBracket}</span>
        {collapsed && (
          <>
            <span className="text-gray-400 mx-1">
              {entries.length} {isArray ? 'items' : 'keys'}
            </span>
            <span className="text-gray-600">{closeBracket}{comma}</span>
          </>
        )}
      </span>
      {!collapsed && (
        <>
          <div className="ml-5 border-l border-gray-200 pl-3">
            {entries.map((entry, i) => (
              <JsonNode
                key={entry.key}
                keyName={isArray ? undefined : entry.key}
                value={entry.value}
                isLast={i === entries.length - 1}
              />
            ))}
          </div>
          <div>
            <span className="text-gray-400 w-4 inline-block" />
            <span className="text-gray-600">{closeBracket}{comma}</span>
          </div>
        </>
      )}
    </div>
  );
}

function renderPrimitive(value: unknown) {
  if (value === null) return <span className="text-orange-600">null</span>;
  if (typeof value === 'boolean') return <span className="text-orange-600">{String(value)}</span>;
  if (typeof value === 'number') return <span className="text-blue-600">{String(value)}</span>;
  if (typeof value === 'string') return <span className="text-green-700">"{value}"</span>;
  return <span className="text-gray-500">{String(value)}</span>;
}

export function JsonOutput({ data }: JsonOutputProps) {
  return (
    <div className="bg-white rounded-3xl p-6 border border-gray-100 animate-fade-in">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-medium text-gray-500">Output</h2>
      </div>
      <div className="font-mono text-sm overflow-auto max-h-[500px]">
        <JsonNode value={data} isLast={true} />
      </div>
    </div>
  );
}
```

**Step 3: Update pages/index/+Page.tsx**

```tsx
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
```

**Step 4: Verify**

Run the dev server, paste JSON, confirm tabs render and output displays collapsible tree.

**Step 5: Commit**

```bash
git add apps/json-viewer/components/TabBar.tsx apps/json-viewer/components/JsonOutput.tsx apps/json-viewer/pages/index/+Page.tsx
git commit -m "feat(json-viewer): add TabBar and collapsible JsonOutput tree"
```

---

### Task 5: VisibilityTree component

Build the tree view with eye-icon toggles that filter the JSON output.

**Files:**
- Create: `apps/json-viewer/components/VisibilityTree.tsx`
- Modify: `apps/json-viewer/pages/index/+Page.tsx`

**Step 1: Create components/VisibilityTree.tsx**

```tsx
import { useState } from 'react';

interface VisibilityTreeProps {
  data: unknown;
  hiddenPaths: Set<string>;
  onTogglePath: (path: string) => void;
}

function TypeBadge({ value }: { value: unknown }) {
  if (value === null) return <span className="text-xs text-orange-500 font-mono">null</span>;
  if (Array.isArray(value)) return <span className="text-xs text-blue-500 font-mono">[]</span>;
  if (typeof value === 'object') return <span className="text-xs text-purple-500 font-mono">{'{}'}</span>;
  if (typeof value === 'string') return <span className="text-xs text-green-600 font-mono">"a"</span>;
  if (typeof value === 'number') return <span className="text-xs text-blue-600 font-mono">1</span>;
  if (typeof value === 'boolean') return <span className="text-xs text-orange-600 font-mono">tf</span>;
  return null;
}

function TreeNode({
  keyName,
  value,
  path,
  hiddenPaths,
  onTogglePath,
}: {
  keyName: string;
  value: unknown;
  path: string;
  hiddenPaths: Set<string>;
  onTogglePath: (path: string) => void;
}) {
  const [expanded, setExpanded] = useState(true);
  const isExpandable = value !== null && typeof value === 'object';
  const isHidden = hiddenPaths.has(path);

  const entries = isExpandable
    ? Array.isArray(value)
      ? (value as unknown[]).map((v, i) => ({ key: String(i), value: v }))
      : Object.entries(value as Record<string, unknown>).map(([k, v]) => ({ key: k, value: v }))
    : [];

  return (
    <div>
      <div className="flex items-center gap-1.5 py-0.5 group">
        {isExpandable ? (
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-4 h-4 flex items-center justify-center text-gray-400 hover:text-gray-600 text-xs"
          >
            {expanded ? '▼' : '▶'}
          </button>
        ) : (
          <span className="w-4" />
        )}
        <button
          onClick={() => onTogglePath(path)}
          className={`w-5 h-5 flex items-center justify-center rounded transition-colors ${
            isHidden
              ? 'text-gray-300 hover:text-gray-500'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          title={isHidden ? 'Show property' : 'Hide property'}
        >
          {isHidden ? (
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
            </svg>
          ) : (
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          )}
        </button>
        <TypeBadge value={value} />
        <span className={`text-sm font-mono ${isHidden ? 'text-gray-300 line-through' : 'text-gray-700'}`}>
          {keyName}
        </span>
        {!isExpandable && !isHidden && (
          <span className="text-xs text-gray-400 truncate max-w-[200px]">
            {JSON.stringify(value)}
          </span>
        )}
      </div>
      {isExpandable && expanded && (
        <div className="ml-5 border-l border-gray-200 pl-1">
          {entries.map((entry) => (
            <TreeNode
              key={entry.key}
              keyName={entry.key}
              value={entry.value}
              path={`${path}.${entry.key}`}
              hiddenPaths={hiddenPaths}
              onTogglePath={onTogglePath}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function VisibilityTree({ data, hiddenPaths, onTogglePath }: VisibilityTreeProps) {
  if (data === null || typeof data !== 'object') {
    return <p className="text-gray-400 text-sm">No object or array to display</p>;
  }

  const entries = Array.isArray(data)
    ? (data as unknown[]).map((v, i) => ({ key: String(i), value: v }))
    : Object.entries(data as Record<string, unknown>).map(([k, v]) => ({ key: k, value: v }));

  return (
    <div className="font-mono text-sm overflow-auto max-h-[400px]">
      {entries.map((entry) => (
        <TreeNode
          key={entry.key}
          keyName={entry.key}
          value={entry.value}
          path={entry.key}
          hiddenPaths={hiddenPaths}
          onTogglePath={onTogglePath}
        />
      ))}
    </div>
  );
}
```

**Step 2: Create src/visibility-filter.ts**

A utility to apply the visibility filter to the source data.

```ts
export function applyVisibilityFilter(data: unknown, hiddenPaths: Set<string>): unknown {
  if (hiddenPaths.size === 0) return data;
  return filterNode(data, '', hiddenPaths);
}

function filterNode(value: unknown, currentPath: string, hiddenPaths: Set<string>): unknown {
  if (value === null || typeof value !== 'object') return value;

  if (Array.isArray(value)) {
    return value
      .map((item, i) => {
        const path = currentPath ? `${currentPath}.${i}` : String(i);
        if (hiddenPaths.has(path)) return undefined;
        return filterNode(item, path, hiddenPaths);
      })
      .filter((v) => v !== undefined);
  }

  const result: Record<string, unknown> = {};
  for (const [key, val] of Object.entries(value as Record<string, unknown>)) {
    const path = currentPath ? `${currentPath}.${key}` : key;
    if (hiddenPaths.has(path)) continue;
    result[key] = filterNode(val, path, hiddenPaths);
  }
  return result;
}
```

**Step 3: Update pages/index/+Page.tsx to wire up VisibilityTree**

Integrate the visibility tab by adding `hiddenPaths` state, the `VisibilityTree` component in the visibility tab, and computing filtered output when the visibility tab is active.

Key state additions:
- `const [hiddenPaths, setHiddenPaths] = useState<Set<string>>(new Set());`
- Toggle function that adds/removes paths from the set
- When `activeTab === 'visibility'`, output = `applyVisibilityFilter(jsonData, hiddenPaths)`
- Other tabs still show their own output (full data for now)

**Step 4: Verify**

Paste JSON, switch to Visibility tab, toggle properties on/off, confirm output updates.

**Step 5: Commit**

```bash
git add apps/json-viewer/components/VisibilityTree.tsx apps/json-viewer/src/visibility-filter.ts apps/json-viewer/pages/index/+Page.tsx
git commit -m "feat(json-viewer): add VisibilityTree with filtering"
```

---

### Task 6: Type generator utility

Build the utility that generates TypeScript type declarations from parsed JSON.

**Files:**
- Create: `apps/json-viewer/src/type-generator.ts`

**Step 1: Create src/type-generator.ts**

```ts
export function generateTypeDeclaration(data: unknown): string {
  const typeStr = inferType(data, 0);
  return `declare const data: ${typeStr};\n`;
}

function inferType(value: unknown, depth: number): string {
  if (value === null) return 'null';
  if (typeof value === 'string') return 'string';
  if (typeof value === 'number') return 'number';
  if (typeof value === 'boolean') return 'boolean';

  if (Array.isArray(value)) {
    if (value.length === 0) return 'unknown[]';
    const elementTypes = value.map((v) => inferType(v, depth + 1));
    const unique = [...new Set(elementTypes)];
    const elementType = unique.length === 1 ? unique[0] : `(${unique.join(' | ')})`;
    return `Array<${elementType}>`;
  }

  if (typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>);
    if (entries.length === 0) return 'Record<string, unknown>';
    const indent = '  '.repeat(depth + 1);
    const closingIndent = '  '.repeat(depth);
    const props = entries
      .map(([key, val]) => {
        const safeKey = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key) ? key : `"${key}"`;
        return `${indent}${safeKey}: ${inferType(val, depth + 1)}`;
      })
      .join(';\n');
    return `{\n${props};\n${closingIndent}}`;
  }

  return 'unknown';
}
```

**Step 2: Commit**

```bash
git add apps/json-viewer/src/type-generator.ts
git commit -m "feat(json-viewer): add TypeScript type generator from JSON"
```

---

### Task 7: JQ editor tab

Integrate jq-web for client-side jq execution with an Ace editor.

**Files:**
- Create: `apps/json-viewer/components/JqEditor.tsx`
- Modify: `apps/json-viewer/pages/index/+Page.tsx`

**Step 1: Create components/JqEditor.tsx**

```tsx
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
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

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
  }, [jqModule, jsonData]);

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
```

Note: jq-web may need special Vite configuration for WASM loading. If it doesn't work out of the box, add `optimizeDeps: { exclude: ['jq-web'] }` to vite.config.ts and potentially configure the WASM file serving.

**Step 2: Wire into +Page.tsx**

When `activeTab === 'jq'`, render `<JqEditor>` and pass its result to the output.

**Step 3: Verify**

Paste JSON, switch to JQ tab, type `.` → see full JSON. Type `.keys[0]` or similar → see filtered output.

**Step 4: Commit**

```bash
git add apps/json-viewer/components/JqEditor.tsx apps/json-viewer/pages/index/+Page.tsx
git commit -m "feat(json-viewer): add jq editor with WASM execution"
```

---

### Task 8: TypeScript editor tab with Ace + ace-linters

Build the TypeScript editor with intellisense and client-side execution.

**Files:**
- Create: `apps/json-viewer/components/TypeScriptEditor.tsx`
- Modify: `apps/json-viewer/pages/index/+Page.tsx`

**Step 1: Create components/TypeScriptEditor.tsx**

```tsx
import { useEffect, useRef, useCallback, useState } from 'react';
import { generateTypeDeclaration } from '../src/type-generator';

interface TypeScriptEditorProps {
  jsonData: unknown;
  onResult: (result: unknown) => void;
  onError: (error: string | null) => void;
}

export function TypeScriptEditor({ jsonData, onResult, onError }: TypeScriptEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const aceEditorRef = useRef<unknown>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function initEditor() {
      // Dynamic imports to avoid SSR issues
      const ace = await import('ace-code');
      await import('ace-code/src/mode/typescript');
      await import('ace-code/src/theme/chrome');
      const { LanguageProvider } = await import('ace-linters/build/ace-linters');

      if (!mounted || !editorRef.current) return;

      const editor = ace.edit(editorRef.current, {
        mode: 'ace/mode/typescript',
        theme: 'ace/theme/chrome',
        fontSize: 13,
        showPrintMargin: false,
        tabSize: 2,
        useSoftTabs: true,
        wrap: true,
        minLines: 8,
        maxLines: 20,
      });

      editor.setValue('// Transform the data and return the result\nreturn data;\n', -1);

      // Set up ace-linters for TypeScript intellisense
      try {
        const worker = new Worker(
          new URL('ace-linters/build/service-manager.js', import.meta.url),
          { type: 'module' }
        );
        const languageProvider = LanguageProvider.create(worker);
        languageProvider.registerEditor(editor);
      } catch (e) {
        console.warn('ace-linters setup failed, continuing without intellisense:', e);
      }

      aceEditorRef.current = editor;
      setReady(true);
    }

    initEditor();

    return () => {
      mounted = false;
      if (aceEditorRef.current) {
        (aceEditorRef.current as { destroy: () => void }).destroy();
      }
    };
  }, []);

  const runTransform = useCallback(() => {
    if (!aceEditorRef.current) return;
    const code = (aceEditorRef.current as { getValue: () => string }).getValue();

    try {
      // Wrap user code in an async function that receives data
      const fn = new Function('data', code);
      const result = fn(jsonData);
      onResult(result);
      onError(null);
    } catch (e) {
      onError(e instanceof Error ? e.message : 'Execution error');
    }
  }, [jsonData, onResult, onError]);

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-xs font-medium text-gray-500">
          TypeScript transform
        </label>
        <button
          onClick={runTransform}
          className="bg-black text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-gray-800 transition-all duration-200 active:scale-95"
        >
          Run
        </button>
      </div>
      <div
        ref={editorRef}
        className="w-full border border-gray-200 rounded-xl overflow-hidden"
        style={{ minHeight: '200px' }}
      />
    </div>
  );
}
```

Note: The ace-linters worker URL may need adjustment depending on how Vite resolves the worker. If the `new URL(...)` pattern doesn't work, fall back to creating a small worker entry file in the project.

**Step 2: Wire into +Page.tsx**

When `activeTab === 'typescript'`, render `<TypeScriptEditor>`. Show a "Run" button to execute.

**Step 3: Verify**

Paste JSON, switch to TypeScript tab, type `return data.users` → click Run → see filtered output.

**Step 4: Commit**

```bash
git add apps/json-viewer/components/TypeScriptEditor.tsx apps/json-viewer/pages/index/+Page.tsx
git commit -m "feat(json-viewer): add TypeScript editor with Ace and ace-linters"
```

---

### Task 9: Wire everything together in +Page.tsx

Connect all tabs to produce output, handle errors, and manage state transitions cleanly.

**Files:**
- Modify: `apps/json-viewer/pages/index/+Page.tsx`

**Step 1: Final +Page.tsx implementation**

The page manages:
- `jsonData` / `rawJson` — source data
- `activeTab` — which tab is selected
- `output` — computed result for the output panel
- `error` — error message from transforms
- `hiddenPaths` — visibility filter state
- When switching tabs, recompute output for the new tab's current state

Key behaviors:
- JQ tab: output updates on expression change (debounced)
- TypeScript tab: output updates on "Run" click
- Visibility tab: output updates on toggle
- Default output (no transform): full pretty-printed JSON
- Error messages display between tabs and output

**Step 2: Verify end-to-end**

1. Paste JSON → input collapses, output shows full JSON
2. JQ tab → type expression → output updates
3. TypeScript tab → write transform → Run → output updates
4. Visibility tab → toggle properties → output filters
5. Switch between tabs → output reflects active tab
6. Edit input → all states reset

**Step 3: Commit**

```bash
git add apps/json-viewer/pages/index/+Page.tsx
git commit -m "feat(json-viewer): wire all tabs and output together"
```

---

### Task 10: Polish and verify

Final pass for styling consistency, edge cases, and build verification.

**Step 1: Handle edge cases**

- Empty JSON input (just `""`, `0`, `null`, `true`) — should work
- Very large JSON — output has `max-h` with scroll
- Invalid jq expressions — error displayed, output preserved
- TypeScript runtime errors — error displayed
- File upload of non-JSON — error message

**Step 2: Run typecheck**

Run: `cd apps/json-viewer && pnpm typecheck`
Expected: No errors.

**Step 3: Run build**

Run: `cd apps/json-viewer && pnpm build`
Expected: Successful build in `dist/`.

**Step 4: Final commit**

```bash
git add -A apps/json-viewer/
git commit -m "feat(json-viewer): polish and verify build"
```
