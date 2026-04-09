# Alt Codes Detail Pages Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Migrate data loading to `+onCreateGlobalContext.server.ts` and add per-symbol (`/alt-codes/symbol/@hex`) and per-category (`/alt-codes/category/@id`) detail pages with rich information.

**Architecture:** All Unicode data is loaded once in `+onCreateGlobalContext.server.ts` and stored in Vike's `globalContext`; every page's `+data.server.ts` reads from `pageContext.globalContext.unicodeData` rather than re-importing the 30MB `@unicode` package. Symbol pages render encoding details (UTF-8 bytes, HTML entity, CSS value) plus block neighbors and name-similar characters. Category pages render a virtual grid of all characters in that category with links to symbol pages.

**Tech Stack:** Vike 0.4.239, vike-react 0.6.5, React 19, TanStack Virtual 3, TypeScript, Tailwind CSS v4, `@unicode/unicode-17.0.0`

---

## Task 1: Extend `src/unicode-data.ts` with shared types and GlobalContext augmentation

**Files:**
- Modify: `apps/alt-codes/src/unicode-data.ts`

No tests for types — just add the interfaces and the module augmentation so TypeScript is happy.

**Step 1: Add `UnicodeData` interface and `EncodingInfo` type after the existing exports**

Open `apps/alt-codes/src/unicode-data.ts` and append:

```typescript
export interface EncodingInfo {
  utf8Bytes: number[];        // e.g. [0xE2, 0x86, 0x90]
  utf8Hex: string;            // e.g. "E2 86 90"
  htmlEntity: string | null;  // e.g. "&larr;" or null
  htmlNumeric: string;        // e.g. "&#8592;" or "&#x2190;"
  cssValue: string;           // e.g. "\\2190"
  jsEscape: string;           // e.g. "\\u2190" or "\\u{10FFFF}"
}

export interface UnicodeData {
  characters: CharacterEntry[];
  byCodePoint: Map<number, CharacterEntry>;
  byCategory: Map<string, CharacterEntry[]>;
}
```

**Step 2: Add GlobalContext augmentation at the end of the file**

```typescript
declare module 'vike/types' {
  interface GlobalContext {
    unicodeData: UnicodeData;
  }
}
```

**Step 3: Verify TypeScript compiles**

```bash
cd apps/alt-codes && npx tsc --noEmit
```
Expected: No errors.

**Step 4: Commit**

```bash
git add apps/alt-codes/src/unicode-data.ts
git commit -m "feat(alt-codes): add UnicodeData interface and GlobalContext augmentation"
```

---

## Task 2: Create `pages/unicode-loader.server.ts` (cached singleton)

**Files:**
- Create: `apps/alt-codes/pages/unicode-loader.server.ts`

This file centralizes all the data-loading logic currently in `+data.server.ts`. It exports a single `loadUnicodeData()` function that builds the character list and lookup maps. Since Vike calls `onCreateGlobalContext` only once, no explicit caching is needed here — but the module is kept separate for clarity.

**Step 1: Create the file**

```typescript
// apps/alt-codes/pages/unicode-loader.server.ts
import unicodeNames from '@unicode/unicode-17.0.0/Names/index.js';
import controlAliases from '@unicode/unicode-17.0.0/Names/Control/index.js';
import correctionAliases from '@unicode/unicode-17.0.0/Names/Correction/index.js';
import abbreviationAliases from '@unicode/unicode-17.0.0/Names/Abbreviation/index.js';
import alternateAliases from '@unicode/unicode-17.0.0/Names/Alternate/index.js';

import { CATEGORIES, CP437_SPECIAL, type CharacterEntry, type UnicodeData } from '../src/unicode-data';

// CP437 bidirectional maps
const altToUnicode = new Map<number, number>();
for (const [altCode, cp] of CP437_SPECIAL) altToUnicode.set(altCode, cp);
for (let i = 32; i <= 126; i++) altToUnicode.set(i, i);
const unicodeToAlt = new Map<number, number>();
for (const [altCode, cp] of altToUnicode.entries()) unicodeToAlt.set(cp, altCode);

function getAliases(cp: number): string[] {
  const out: string[] = [];
  const ctrl = controlAliases[cp]; if (ctrl) out.push(...ctrl);
  const corr = correctionAliases[cp]; if (corr) out.push(...corr);
  const abbr = abbreviationAliases[cp]; if (abbr) out.push(...abbr);
  const alt = alternateAliases[cp]; if (alt) out.push(...alt);
  return out;
}

function makeEntry(codePoint: number, categoryId: string): CharacterEntry {
  return {
    codePoint,
    char: String.fromCodePoint(codePoint),
    hex: `U+${codePoint.toString(16).toUpperCase().padStart(4, '0')}`,
    decimal: codePoint,
    categoryId,
    altCode: unicodeToAlt.get(codePoint) ?? null,
    name: unicodeNames.get(codePoint) ?? '',
    aliases: getAliases(codePoint),
  };
}

function rangeEntries(start: number, end: number, categoryId: string): CharacterEntry[] {
  const out: CharacterEntry[] = [];
  for (let cp = start; cp <= end; cp++) out.push(makeEntry(cp, categoryId));
  return out;
}

export function loadUnicodeData(): UnicodeData {
  const altCodeEntries: CharacterEntry[] = [];
  for (let altCode = 1; altCode <= 254; altCode++) {
    const cp = altToUnicode.get(altCode);
    if (cp !== undefined) altCodeEntries.push(makeEntry(cp, 'alt-codes'));
  }

  const characters: CharacterEntry[] = [
    ...altCodeEntries,
    ...rangeEntries(0x0021, 0x007e, 'ascii'),
    ...rangeEntries(0x00a0, 0x00ff, 'latin-ext'),
    ...rangeEntries(0x20a0, 0x20cf, 'currency'),
    ...rangeEntries(0x2100, 0x214f, 'letterlike'),
    ...rangeEntries(0x2150, 0x218f, 'number-forms'),
    ...rangeEntries(0x2190, 0x21ff, 'arrows'),
    ...rangeEntries(0x2200, 0x22ff, 'math'),
    ...rangeEntries(0x2300, 0x23ff, 'technical'),
    ...rangeEntries(0x2500, 0x257f, 'box'),
    ...rangeEntries(0x2580, 0x259f, 'blocks'),
    ...rangeEntries(0x25a0, 0x25ff, 'geometric'),
    ...rangeEntries(0x2600, 0x26ff, 'symbols'),
    ...rangeEntries(0x2700, 0x27bf, 'dingbats'),
  ];

  const byCodePoint = new Map<number, CharacterEntry>();
  const byCategory = new Map<string, CharacterEntry[]>();

  for (const entry of characters) {
    if (!byCodePoint.has(entry.codePoint)) byCodePoint.set(entry.codePoint, entry);
    const cat = byCategory.get(entry.categoryId) ?? [];
    cat.push(entry);
    byCategory.set(entry.categoryId, cat);
  }

  return { characters, byCodePoint, byCategory };
}
```

**Step 2: Verify TypeScript compiles**

```bash
cd apps/alt-codes && npx tsc --noEmit
```
Expected: No errors.

**Step 3: Commit**

```bash
git add apps/alt-codes/pages/unicode-loader.server.ts
git commit -m "feat(alt-codes): extract unicode loading to server-only singleton module"
```

---

## Task 3: Create `pages/+onCreateGlobalContext.server.ts`

**Files:**
- Create: `apps/alt-codes/pages/+onCreateGlobalContext.server.ts`

**Step 1: Create the file**

```typescript
// apps/alt-codes/pages/+onCreateGlobalContext.server.ts
import type { GlobalContext } from 'vike/types';
import { loadUnicodeData } from './unicode-loader.server';

export function onCreateGlobalContext(globalContext: GlobalContext) {
  globalContext.unicodeData = loadUnicodeData();
}
```

**Step 2: Verify TypeScript compiles**

```bash
cd apps/alt-codes && npx tsc --noEmit
```
Expected: No errors.

**Step 3: Commit**

```bash
git add apps/alt-codes/pages/+onCreateGlobalContext.server.ts
git commit -m "feat(alt-codes): load unicode data once via onCreateGlobalContext"
```

---

## Task 4: Simplify `pages/+data.server.ts` to read from globalContext

**Files:**
- Modify: `apps/alt-codes/pages/+data.server.ts`

**Step 1: Replace the entire file content with:**

```typescript
// apps/alt-codes/pages/+data.server.ts
import type { PageContextServer } from 'vike/types';
import type { CharacterEntry } from '../src/unicode-data';

export type Data = {
  characters: CharacterEntry[];
};

export async function data(pageContext: PageContextServer): Promise<Data> {
  return { characters: pageContext.globalContext.unicodeData.characters };
}
```

**Step 2: Verify TypeScript compiles and the app still builds**

```bash
cd apps/alt-codes && npx tsc --noEmit
```
Expected: No errors.

**Step 3: Commit**

```bash
git add apps/alt-codes/pages/+data.server.ts
git commit -m "refactor(alt-codes): simplify index data hook to read from globalContext"
```

---

## Task 5: Add `getEncodingInfo` helper to `unicode-loader.server.ts`

**Files:**
- Modify: `apps/alt-codes/pages/unicode-loader.server.ts`

This function computes per-symbol encoding details used in the symbol detail page.

**Step 1: Add this helper and export it at the end of the file**

```typescript
// Named HTML entities (subset of commonly needed ones)
const HTML_ENTITIES: Record<number, string> = {
  0x00a0: '&nbsp;', 0x00a9: '&copy;', 0x00ae: '&reg;', 0x2122: '&trade;',
  0x2190: '&larr;', 0x2191: '&uarr;', 0x2192: '&rarr;', 0x2193: '&darr;',
  0x2194: '&harr;', 0x21d0: '&lArr;', 0x21d2: '&rArr;', 0x21d4: '&hArr;',
  0x2200: '&forall;', 0x2202: '&part;', 0x2203: '&exist;', 0x2205: '&empty;',
  0x2207: '&nabla;', 0x2208: '&isin;', 0x2209: '&notin;', 0x220b: '&ni;',
  0x220f: '&prod;', 0x2211: '&sum;', 0x2212: '&minus;', 0x2217: '&lowast;',
  0x221a: '&radic;', 0x221d: '&prop;', 0x221e: '&infin;', 0x2220: '&ang;',
  0x2227: '&and;', 0x2228: '&or;', 0x2229: '&cap;', 0x222a: '&cup;',
  0x222b: '&int;', 0x2234: '&there4;', 0x223c: '&sim;', 0x2245: '&cong;',
  0x2248: '&asymp;', 0x2260: '&ne;', 0x2261: '&equiv;', 0x2264: '&le;',
  0x2265: '&ge;', 0x2282: '&sub;', 0x2283: '&sup;', 0x2284: '&nsub;',
  0x2286: '&sube;', 0x2287: '&supe;', 0x2295: '&oplus;', 0x2297: '&otimes;',
  0x22a5: '&perp;', 0x22c5: '&sdot;', 0x2308: '&lceil;', 0x2309: '&rceil;',
  0x230a: '&lfloor;', 0x230b: '&rfloor;', 0x2329: '&lang;', 0x232a: '&rang;',
  0x25ca: '&loz;', 0x2660: '&spades;', 0x2663: '&clubs;', 0x2665: '&hearts;',
  0x2666: '&diams;',
};

export function getEncodingInfo(codePoint: number): import('../src/unicode-data').EncodingInfo {
  // UTF-8 encoding
  const encoder = new TextEncoder();
  const bytes = Array.from(encoder.encode(String.fromCodePoint(codePoint)));
  const utf8Hex = bytes.map(b => b.toString(16).toUpperCase().padStart(2, '0')).join(' ');

  // HTML entity
  const htmlEntity = HTML_ENTITIES[codePoint] ?? null;
  const htmlNumeric = codePoint <= 0xffff
    ? `&#${codePoint};`
    : `&#x${codePoint.toString(16).toUpperCase()};`;

  // CSS value (always hex, padded to at least 4 digits)
  const cssValue = `\\${codePoint.toString(16).toUpperCase()}`;

  // JS escape
  const jsEscape = codePoint <= 0xffff
    ? `\\u${codePoint.toString(16).toUpperCase().padStart(4, '0')}`
    : `\\u{${codePoint.toString(16).toUpperCase()}}`;

  return { utf8Bytes: bytes, utf8Hex, htmlEntity, htmlNumeric, cssValue, jsEscape };
}
```

**Step 2: Verify TypeScript compiles**

```bash
cd apps/alt-codes && npx tsc --noEmit
```
Expected: No errors.

**Step 3: Commit**

```bash
git add apps/alt-codes/pages/unicode-loader.server.ts
git commit -m "feat(alt-codes): add getEncodingInfo helper for symbol detail pages"
```

---

## Task 6: Create `pages/symbol/@hex/` routes

**Files:**
- Create: `apps/alt-codes/pages/symbol/@hex/+route.ts`
- Create: `apps/alt-codes/pages/symbol/@hex/+onBeforePrerenderStart.ts`
- Create: `apps/alt-codes/pages/symbol/@hex/+data.server.ts`
- Create: `apps/alt-codes/pages/symbol/@hex/+Head.tsx`
- Create: `apps/alt-codes/pages/symbol/@hex/+Page.tsx`

### Step 1: Create `+route.ts`

```typescript
// apps/alt-codes/pages/symbol/@hex/+route.ts
export const route = '/symbol/@hex';
```

### Step 2: Create `+onBeforePrerenderStart.ts`

This generates one URL per unique code point.

```typescript
// apps/alt-codes/pages/symbol/@hex/+onBeforePrerenderStart.ts
import type { OnBeforePrerenderStartSync } from 'vike/types';

export const onBeforePrerenderStart: OnBeforePrerenderStartSync = (globalContext): ReturnType<OnBeforePrerenderStartSync> => {
  const seen = new Set<number>();
  const urls: string[] = [];
  for (const entry of globalContext.unicodeData.characters) {
    if (!seen.has(entry.codePoint)) {
      seen.add(entry.codePoint);
      const hexStr = entry.codePoint.toString(16).toUpperCase().padStart(4, '0');
      urls.push(`/symbol/${hexStr}`);
    }
  }
  return urls;
};
```

### Step 3: Create `+data.server.ts`

```typescript
// apps/alt-codes/pages/symbol/@hex/+data.server.ts
import type { PageContextServer } from 'vike/types';
import type { CharacterEntry, EncodingInfo } from '../../../src/unicode-data';
import { getEncodingInfo } from '../../unicode-loader.server';

export type SymbolData = {
  entry: CharacterEntry;
  encoding: EncodingInfo;
  blockNeighbors: CharacterEntry[];   // same category, near this codePoint
  relatedByName: CharacterEntry[];    // other entries sharing a word in name
};

export async function data(pageContext: PageContextServer): Promise<SymbolData> {
  const hexStr = pageContext.routeParams.hex.toUpperCase().padStart(4, '0');
  const codePoint = parseInt(hexStr, 16);
  const { byCodePoint, characters } = pageContext.globalContext.unicodeData;

  const entry = byCodePoint.get(codePoint);
  if (!entry) throw new Error(`No entry for U+${hexStr}`);

  const encoding = getEncodingInfo(codePoint);

  // Block neighbors: up to 6 chars before and after in same category
  const catChars = pageContext.globalContext.unicodeData.byCategory.get(entry.categoryId) ?? [];
  const idx = catChars.findIndex(c => c.codePoint === codePoint);
  const start = Math.max(0, idx - 6);
  const end = Math.min(catChars.length, idx + 7);
  const blockNeighbors = catChars.slice(start, end).filter(c => c.codePoint !== codePoint);

  // Related by name: find entries sharing a meaningful word (≥4 chars) in the name
  const words = entry.name.split(/\s+/).filter(w => w.length >= 4);
  const relatedByName: CharacterEntry[] = [];
  if (words.length > 0) {
    const seen = new Set<number>([codePoint]);
    for (const c of characters) {
      if (seen.has(c.codePoint)) continue;
      if (words.some(w => c.name.includes(w))) {
        seen.add(c.codePoint);
        relatedByName.push(c);
        if (relatedByName.length >= 12) break;
      }
    }
  }

  return { entry, encoding, blockNeighbors, relatedByName };
}
```

### Step 4: Create `+Head.tsx`

```tsx
// apps/alt-codes/pages/symbol/@hex/+Head.tsx
import { useData } from 'vike-react/useData';
import type { SymbolData } from './+data.server';

export function Head() {
  const { entry } = useData<SymbolData>();
  const label = entry.name || entry.hex;
  return (
    <>
      <title>{entry.char} {label} — Glyph Index</title>
      <meta name="description" content={`Unicode ${entry.hex} — ${label}. UTF-8, HTML entity, alt code, and related characters.`} />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600&family=Space+Mono:ital,wght@0,400;0,700;1,400&display=swap"
        rel="stylesheet"
      />
    </>
  );
}
```

### Step 5: Create `+Page.tsx`

```tsx
// apps/alt-codes/pages/symbol/@hex/+Page.tsx
import { useData } from 'vike-react/useData';
import { useState } from 'react';
import type { SymbolData } from './+data.server';
import type { CharacterEntry } from '../../../src/unicode-data';
import '../../../src/style.css';

function CopyButton({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      className={`copy-btn${copied ? ' copy-btn--done' : ''}`}
      onClick={() => {
        void navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 1400);
      }}
    >
      {copied ? 'Copied!' : label}
    </button>
  );
}

function MiniCard({ entry }: { entry: CharacterEntry }) {
  return (
    <a href={`/symbol/${entry.codePoint.toString(16).toUpperCase().padStart(4, '0')}`}
       className="char-card"
       title={entry.name || entry.hex}
    >
      <span className="char-glyph">{entry.char}</span>
      <span className="char-hex">{entry.hex}</span>
      {entry.name && <span className="char-name">{entry.name}</span>}
    </a>
  );
}

export default function Page() {
  const { entry, encoding, blockNeighbors, relatedByName } = useData<SymbolData>();

  return (
    <div className="app-root symbol-page">
      <header className="app-header">
        <div className="header-inner">
          <a href="/" className="header-brand" style={{ textDecoration: 'none' }}>
            <div className="brand-title">Glyph Index</div>
            <div className="brand-sub">Unicode &amp; Alt Code Reference</div>
          </a>
        </div>
      </header>

      <main className="symbol-main">
        {/* Hero glyph */}
        <section className="symbol-hero">
          <div className="symbol-hero-glyph">{entry.char}</div>
          <div className="symbol-hero-info">
            <h1 className="symbol-name">{entry.name || entry.hex}</h1>
            {entry.aliases.length > 0 && (
              <div className="symbol-aliases">
                {entry.aliases.join(' · ')}
              </div>
            )}
            <CopyButton value={entry.char} label={`Copy "${entry.char}"`} />
          </div>
        </section>

        {/* Technical details table */}
        <section className="symbol-section">
          <h2 className="symbol-section-title">Encodings</h2>
          <table className="encoding-table">
            <tbody>
              <tr>
                <td className="enc-label">Unicode</td>
                <td className="enc-value"><code>{entry.hex}</code></td>
                <td><CopyButton value={entry.hex} label="Copy" /></td>
              </tr>
              <tr>
                <td className="enc-label">Decimal</td>
                <td className="enc-value"><code>{entry.decimal}</code></td>
                <td><CopyButton value={String(entry.decimal)} label="Copy" /></td>
              </tr>
              <tr>
                <td className="enc-label">UTF-8 bytes</td>
                <td className="enc-value"><code>{encoding.utf8Hex}</code></td>
                <td><CopyButton value={encoding.utf8Hex} label="Copy" /></td>
              </tr>
              {encoding.htmlEntity && (
                <tr>
                  <td className="enc-label">HTML entity</td>
                  <td className="enc-value"><code>{encoding.htmlEntity}</code></td>
                  <td><CopyButton value={encoding.htmlEntity} label="Copy" /></td>
                </tr>
              )}
              <tr>
                <td className="enc-label">HTML numeric</td>
                <td className="enc-value"><code>{encoding.htmlNumeric}</code></td>
                <td><CopyButton value={encoding.htmlNumeric} label="Copy" /></td>
              </tr>
              <tr>
                <td className="enc-label">CSS value</td>
                <td className="enc-value"><code>{encoding.cssValue}</code></td>
                <td><CopyButton value={encoding.cssValue} label="Copy" /></td>
              </tr>
              <tr>
                <td className="enc-label">JS escape</td>
                <td className="enc-value"><code>{encoding.jsEscape}</code></td>
                <td><CopyButton value={encoding.jsEscape} label="Copy" /></td>
              </tr>
              {entry.altCode !== null && (
                <tr>
                  <td className="enc-label">Alt code</td>
                  <td className="enc-value"><code>Alt+{entry.altCode}</code></td>
                  <td><CopyButton value={`Alt+${entry.altCode}`} label="Copy" /></td>
                </tr>
              )}
            </tbody>
          </table>
        </section>

        {/* Block neighbors */}
        {blockNeighbors.length > 0 && (
          <section className="symbol-section">
            <h2 className="symbol-section-title">
              Nearby in <a href={`/category/${entry.categoryId}`} className="section-link">{entry.categoryId}</a>
            </h2>
            <div className="mini-grid">
              {blockNeighbors.map((c) => <MiniCard key={c.codePoint} entry={c} />)}
            </div>
          </section>
        )}

        {/* Related by name */}
        {relatedByName.length > 0 && (
          <section className="symbol-section">
            <h2 className="symbol-section-title">Related characters</h2>
            <div className="mini-grid">
              {relatedByName.map((c) => <MiniCard key={c.codePoint} entry={c} />)}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
```

### Step 6: Verify TypeScript compiles

```bash
cd apps/alt-codes && npx tsc --noEmit
```
Expected: No errors.

### Step 7: Commit

```bash
git add apps/alt-codes/pages/symbol/
git commit -m "feat(alt-codes): add per-symbol detail pages at /symbol/@hex"
```

---

## Task 7: Create `pages/category/@id/` routes

**Files:**
- Create: `apps/alt-codes/pages/category/@id/+route.ts`
- Create: `apps/alt-codes/pages/category/@id/+onBeforePrerenderStart.ts`
- Create: `apps/alt-codes/pages/category/@id/+data.server.ts`
- Create: `apps/alt-codes/pages/category/@id/+Head.tsx`
- Create: `apps/alt-codes/pages/category/@id/+Page.tsx`

### Step 1: Create `+route.ts`

```typescript
// apps/alt-codes/pages/category/@id/+route.ts
export const route = '/category/@id';
```

### Step 2: Create `+onBeforePrerenderStart.ts`

```typescript
// apps/alt-codes/pages/category/@id/+onBeforePrerenderStart.ts
import type { OnBeforePrerenderStartSync } from 'vike/types';
import { CATEGORIES } from '../../../src/unicode-data';

export const onBeforePrerenderStart: OnBeforePrerenderStartSync = (): ReturnType<OnBeforePrerenderStartSync> => {
  return CATEGORIES.map((cat) => `/category/${cat.id}`);
};
```

### Step 3: Create `+data.server.ts`

```typescript
// apps/alt-codes/pages/category/@id/+data.server.ts
import type { PageContextServer } from 'vike/types';
import type { CharacterEntry } from '../../../src/unicode-data';
import { CATEGORIES } from '../../../src/unicode-data';

export type CategoryData = {
  categoryId: string;
  categoryName: string;
  characters: CharacterEntry[];
};

export async function data(pageContext: PageContextServer): Promise<CategoryData> {
  const categoryId = pageContext.routeParams.id;
  const category = CATEGORIES.find((c) => c.id === categoryId);
  if (!category) throw new Error(`Unknown category: ${categoryId}`);

  const characters = pageContext.globalContext.unicodeData.byCategory.get(categoryId) ?? [];

  return {
    categoryId,
    categoryName: category.name,
    characters,
  };
}
```

### Step 4: Create `+Head.tsx`

```tsx
// apps/alt-codes/pages/category/@id/+Head.tsx
import { useData } from 'vike-react/useData';
import type { CategoryData } from './+data.server';

export function Head() {
  const { categoryName, characters } = useData<CategoryData>();
  return (
    <>
      <title>{categoryName} — Glyph Index</title>
      <meta name="description" content={`Browse ${characters.length} Unicode characters in the ${categoryName} category.`} />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600&family=Space+Mono:ital,wght@0,400;0,700;1,400&display=swap"
        rel="stylesheet"
      />
    </>
  );
}
```

### Step 5: Create `+Page.tsx`

The category page reuses the `VirtualGrid` and `CharCard` components from the index page but navigates to symbol pages on click.

```tsx
// apps/alt-codes/pages/category/@id/+Page.tsx
import { useData } from 'vike-react/useData';
import { useRef, useEffect, useState, useCallback, type RefObject } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import type { CategoryData } from './+data.server';
import type { CharacterEntry } from '../../../src/unicode-data';
import '../../../src/style.css';

const CARD_SLOT = 110;
const ROW_HEIGHT = 90;

function useColumnCount(containerRef: RefObject<HTMLDivElement | null>): number {
  const [columns, setColumns] = useState(8);
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      setColumns(Math.max(1, Math.floor(entry.contentRect.width / CARD_SLOT)));
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [containerRef]);
  return columns;
}

function CategoryGrid({ characters }: { characters: CharacterEntry[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const columns = useColumnCount(containerRef);
  const rowCount = Math.ceil(characters.length / columns);

  const rowVirtualizer = useVirtualizer({
    count: rowCount,
    getScrollElement: () => containerRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: 4,
  });

  const handleClick = useCallback((c: CharacterEntry) => {
    const hexStr = c.codePoint.toString(16).toUpperCase().padStart(4, '0');
    window.location.href = `/symbol/${hexStr}`;
  }, []);

  return (
    <div ref={containerRef} className="virtual-scroll">
      <div style={{ height: `${rowVirtualizer.getTotalSize()}px`, position: 'relative' }}>
        {rowVirtualizer.getVirtualItems().map((vRow) => {
          const start = vRow.index * columns;
          const row = characters.slice(start, start + columns);
          return (
            <div
              key={vRow.key}
              style={{
                position: 'absolute', top: 0, left: 0, right: 0,
                height: `${vRow.size}px`,
                transform: `translateY(${vRow.start}px)`,
                display: 'grid',
                gridTemplateColumns: `repeat(${columns}, 1fr)`,
                gap: '5px',
              }}
            >
              {row.map((c) => (
                <button
                  key={c.codePoint}
                  className="char-card"
                  onClick={() => handleClick(c)}
                  title={[c.name, ...c.aliases, c.hex, 'click for details'].filter(Boolean).join(' · ')}
                >
                  <span className="char-glyph">{c.char}</span>
                  <span className="char-hex">{c.hex}</span>
                  {c.name && <span className="char-name">{c.name}</span>}
                  {c.altCode !== null && <span className="char-alt">Alt+{c.altCode}</span>}
                </button>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function Page() {
  const { categoryName, characters } = useData<CategoryData>();

  return (
    <div className="app-root">
      <header className="app-header">
        <div className="header-inner">
          <a href="/" className="header-brand" style={{ textDecoration: 'none' }}>
            <div className="brand-title">Glyph Index</div>
            <div className="brand-sub">Unicode &amp; Alt Code Reference</div>
          </a>
          <div className="header-count">
            {characters.length.toLocaleString()} glyphs
          </div>
        </div>
      </header>

      <div className="category-bar">
        <div className="category-inner no-scrollbar" style={{ padding: '4px 0' }}>
          <h1 style={{ margin: 0, fontSize: '14px', fontFamily: 'var(--font-mono)', color: 'var(--color-text)', fontWeight: 700 }}>
            {categoryName}
          </h1>
        </div>
      </div>

      <main className="app-main">
        <CategoryGrid characters={characters} />
      </main>
    </div>
  );
}
```

### Step 6: Verify TypeScript compiles

```bash
cd apps/alt-codes && npx tsc --noEmit
```
Expected: No errors.

### Step 7: Commit

```bash
git add apps/alt-codes/pages/category/
git commit -m "feat(alt-codes): add per-category pages at /category/@id"
```

---

## Task 8: Add CSS for symbol page and copy button

**Files:**
- Modify: `apps/alt-codes/src/style.css`

Append these rules to the end of `style.css`:

```css
/* ── Symbol detail page ───────────────────────── */

.symbol-page .app-main {
  overflow-y: auto;
}

.symbol-main {
  max-width: 860px;
  margin: 0 auto;
  padding: 32px 24px 64px;
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.symbol-hero {
  display: flex;
  align-items: center;
  gap: 32px;
}

.symbol-hero-glyph {
  font-family: var(--font-glyph);
  font-size: 96px;
  line-height: 1;
  color: #e8e2d4;
  flex-shrink: 0;
  user-select: none;
}

.symbol-hero-info {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.symbol-name {
  font-family: var(--font-display);
  font-size: 22px;
  font-weight: 600;
  color: var(--color-amber);
  margin: 0;
  line-height: 1.2;
}

.symbol-aliases {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--color-muted);
  line-height: 1.4;
}

.symbol-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.symbol-section-title {
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 700;
  color: var(--color-muted);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin: 0;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--color-border);
}

.section-link {
  color: var(--color-amber);
  text-decoration: none;
}

.section-link:hover {
  text-decoration: underline;
}

/* ── Encoding table ───────────────────────────── */

.encoding-table {
  border-collapse: collapse;
  width: 100%;
  font-family: var(--font-mono);
}

.encoding-table tr {
  border-bottom: 1px solid var(--color-border);
}

.enc-label {
  font-size: 11px;
  color: var(--color-muted);
  padding: 8px 16px 8px 0;
  white-space: nowrap;
  width: 120px;
}

.enc-value {
  padding: 8px 16px 8px 0;
  font-size: 13px;
  color: var(--color-text);
}

.enc-value code {
  font-family: var(--font-mono);
}

/* ── Copy button ──────────────────────────────── */

.copy-btn {
  background: transparent;
  border: 1px solid var(--color-border);
  color: var(--color-muted);
  font-family: var(--font-mono);
  font-size: 10px;
  padding: 3px 10px;
  border-radius: 3px;
  cursor: pointer;
  white-space: nowrap;
  transition: border-color 0.1s, color 0.1s, background 0.1s;
}

.copy-btn:hover {
  border-color: var(--color-amber);
  color: var(--color-amber);
}

.copy-btn--done {
  border-color: var(--color-amber);
  background: color-mix(in srgb, var(--color-amber) 12%, transparent);
  color: var(--color-amber);
}

/* ── Mini char grid (neighbors / related) ─────── */

.mini-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 5px;
}
```

**Step 2: Verify TypeScript compiles (CSS-only change, but check for regressions)**

```bash
cd apps/alt-codes && npx tsc --noEmit
```
Expected: No errors.

**Step 3: Commit**

```bash
git add apps/alt-codes/src/style.css
git commit -m "feat(alt-codes): add CSS for symbol detail page and copy button"
```

---

## Task 9: Wire up index page card clicks to navigate to symbol pages

**Files:**
- Modify: `apps/alt-codes/pages/+Page.tsx`

Currently cards call `onCopy`. We want clicking to navigate while still supporting copy on some interaction. The simplest design: clicking the card navigates to the symbol page; the copy-on-click behavior from before is removed from the index page (or kept as a secondary affordance — for now, navigate on click, since the symbol page has explicit copy buttons).

**Step 1: Update `CharCard` to render as an `<a>` tag**

Replace the `CharCard` function (lines 113–137 in current `+Page.tsx`):

```tsx
function CharCard({ entry: c }: { entry: CharacterEntry }) {
  const hexStr = c.codePoint.toString(16).toUpperCase().padStart(4, '0');
  const tooltip = [
    c.name,
    ...c.aliases,
    c.hex,
    `decimal ${c.decimal}`,
    c.altCode !== null ? `Alt+${c.altCode}` : null,
    'click for details',
  ]
    .filter(Boolean)
    .join(' · ');

  return (
    <a
      className="char-card"
      href={`/symbol/${hexStr}`}
      title={tooltip}
    >
      <span className="char-glyph">{c.char}</span>
      <span className="char-hex">{c.hex}</span>
      {c.name && <span className="char-name">{c.name}</span>}
      {c.altCode !== null && <span className="char-alt">Alt+{c.altCode}</span>}
    </a>
  );
}
```

**Step 2: Update `GridProps` and `VirtualGrid` to remove `copied`/`onCopy` props**

Remove the `copied` and `onCopy` props from the `GridProps` interface and `VirtualGrid` function. Remove the related state in `Page` (`copied`, `clearCopyRef`, `copiedEntry`, `handleCopy`). Remove the copy toast JSX at the bottom of `Page`.

Update `CharCard` call inside `VirtualGrid`:
```tsx
{row.map((c) => (
  <CharCard key={`${c.categoryId}-${c.codePoint}`} entry={c} />
))}
```

**Step 3: Verify TypeScript compiles**

```bash
cd apps/alt-codes && npx tsc --noEmit
```
Expected: No errors.

**Step 4: Commit**

```bash
git add apps/alt-codes/pages/+Page.tsx
git commit -m "feat(alt-codes): navigate to symbol detail page on card click"
```

---

## Task 10: Add `.char-card` anchor styles

**Files:**
- Modify: `apps/alt-codes/src/style.css`

The `.char-card` is now used as both `<button>` and `<a>`. Add display/text-decoration reset for the anchor variant.

**Step 1: Update the `.char-card` rule** — add `text-decoration: none; display: flex;` (already has display:flex via flex-direction:column, but `<a>` is inline by default):

Find the `.char-card` rule in `style.css` and add:
```css
.char-card {
  /* existing properties... */
  text-decoration: none; /* for <a> variant */
}
```

**Step 2: Commit**

```bash
git add apps/alt-codes/src/style.css
git commit -m "fix(alt-codes): ensure char-card anchor variant has no text-decoration"
```

---

## Final Verification

After all tasks are complete, do a full build to confirm prerendering works:

```bash
cd apps/alt-codes && npx vike build 2>&1 | tail -30
```

Expected: Build completes, prerendered pages include `/symbol/XXXX` for each character and `/category/<id>` for each category. No TypeScript errors.
