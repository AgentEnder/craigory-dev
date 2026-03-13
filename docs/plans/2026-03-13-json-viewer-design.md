# JSON Viewer App — Design

## Overview

A client-side JSON viewer and transformer tool. Users paste or upload JSON, then explore and transform it using three modes: jq queries, TypeScript transforms with intellisense, and a visual property visibility filter.

## Stack

- Vike + React + Tailwind CSS + Vite (matching existing apps)
- Ace Editor + ace-linters (TypeScript intellisense via web workers)
- jq-web (WASM port of jq for client-side execution)
- TypeScript compiler (client-side transpilation for user transforms)

## User Flow

1. User lands on the page and sees a prominent JSON input area (textarea + file drop zone)
2. User pastes JSON or uploads a `.json` file; input validates and parses
3. Input area collapses to a summary bar (e.g., "Object · 15 keys · 2.3 KB") with an expand/re-edit button
4. Workspace appears with three tabs: **JQ | TypeScript | Visibility**
5. Output panel below always shows the result of the active tab's operation
6. By default (no transform applied), output shows the full pretty-printed JSON

## Data Flow

```
Raw JSON string
  → Parse to object (stored as source of truth)
  → Active tab applies its operation:
      - JQ: run jq expression against full object
      - TypeScript: execute user's transform function against full object
      - Visibility: apply property filter mask to full object
  → Output: formatted JSON with collapsible nodes
```

## Layout

Single-column stacked layout:

1. **Input area (top)** — Prominent on first load. Collapses to a compact summary bar after successful parse.
2. **Tabbed workspace (middle)** — Three tabs: JQ | TypeScript | Visibility. Active tab determines output.
3. **Output (bottom, always visible)** — Syntax-highlighted JSON with collapsible/expandable nodes.

## Page States

- **Empty state** — Input area expanded, workspace and output hidden
- **Loaded state** — Input collapsed to summary bar, workspace + output visible

## Components

### AppHeader

Centered title and subtitle, matching existing app conventions.

### JsonInput

- Textarea with placeholder text and drag-and-drop file upload zone
- Validates JSON on submit; shows parse errors inline
- After successful parse, collapses to a summary bar showing: type (Object/Array), key/element count, byte size
- Expand button to re-edit or replace the JSON

### TabBar

Three tabs: JQ | TypeScript | Visibility. Styled consistently with the site's button/card patterns.

### JqEditor

- Ace editor configured for jq syntax
- Runs jq-web (WASM) against the full source JSON
- Errors displayed inline
- Output updates on expression change (debounced)

### TypeScriptEditor

- Ace editor with ace-linters providing TypeScript intellisense
- User code receives a typed `data` parameter with ambient types auto-generated from the parsed JSON structure
- Code is transpiled client-side and evaluated; return value is serialized to JSON output
- Errors displayed inline

### VisibilityTree

- Recursive tree view reflecting the JSON structure
- Each node has an eye-icon toggle to show/hide that property in the output
- Objects and arrays also have expand/collapse chevrons for navigation
- Type icons per node: `{}` for objects, `[]` for arrays, `"a"` for strings, `1` for numbers, etc.
- Hidden paths stored as a `Set<string>` of dot-notation paths

### JsonOutput

- Syntax-highlighted JSON with collapsible/expandable nodes
- Always visible below the tabbed workspace
- Shows the result of whichever tab is active
- Supports expand all / collapse all controls

## TypeScript Ambient Type Generation

A utility generates `.d.ts` declarations from the parsed JSON and feeds them to ace-linters:

- Primitives: `string`, `number`, `boolean`, `null`
- Arrays: element type inferred as union of all elements
- Objects: inline types with each key typed
- Nested structures recurse

Example input:
```json
{"users": [{"name": "Jo", "age": 3}]}
```

Generated declaration:
```ts
declare const data: { users: Array<{ name: string; age: number }> };
```

## TypeScript Execution

- User code is transpiled client-side using the TypeScript compiler
- The `data` variable is injected into scope with the full parsed JSON
- The return value of the user's code is serialized as JSON to the output panel
- Runtime errors are caught and displayed inline in the editor

## jq Execution

- Uses jq-web (WASM port) for fully client-side execution
- The jq expression runs against the full source JSON
- No server dependency

## File Structure

```
apps/json-viewer/
├── components/
│   ├── AppHeader.tsx
│   ├── JsonInput.tsx
│   ├── TabBar.tsx
│   ├── JqEditor.tsx
│   ├── TypeScriptEditor.tsx
│   ├── VisibilityTree.tsx
│   └── JsonOutput.tsx
├── pages/
│   ├── +config.ts
│   ├── index/
│   │   ├── +Page.tsx
│   │   └── +Head.tsx
│   └── _error/
│       └── +Page.tsx
├── src/
│   ├── style.css
│   ├── type-generator.ts
│   └── vite-env.d.ts
├── index.html
├── package.json
├── project.json
├── project-metadata.json
├── tsconfig.json
└── vite.config.ts
```

## Styling

Follows the existing app design language:
- Background: `bg-slate-50`
- Cards: `bg-white rounded-3xl p-8 border border-gray-100`
- Buttons: `bg-black text-white rounded-xl` (primary), `bg-white border border-gray-200` (secondary)
- Focus: `focus:ring-2 focus:ring-blue-500`
- Font: Inter with `font-feature-settings`
- Transitions: `transition-all duration-200`, `active:scale-95`
- Wider container: `max-w-4xl` to accommodate editor panels

## project-metadata.json

```json
{
  "name": "JSON Viewer",
  "description": "A client-side JSON viewer and transformer. Explore JSON with collapsible trees, filter properties visually, and transform data using TypeScript or jq queries with full intellisense support.",
  "technologies": ["TypeScript", "HTML", "CSS"]
}
```
