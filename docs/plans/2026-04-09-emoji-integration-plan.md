# Emoji Integration Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Integrate ~1,800 emoji from `unicode-emoji-json` as first-class characters in the alt-codes app, with emoji groups as categories and skin tone selectors on detail pages.

**Architecture:** Extend `CharacterEntry` to support multi-codepoint sequences (`codePoints: number[]` replaces `codePoint: number`). Emoji data loaded alongside Unicode data in `unicode-loader.server.ts`. URL slugs use `_` as codepoint separator and `-` before the name (e.g. `1f468_200d_1f4bb-man-technologist`) — this avoids ambiguity with 4-char hex words like "face" in emoji names. Single-codepoint slugs are unchanged (e.g. `2190-leftwards-arrow`).

**Tech Stack:** Vike (SSR/prerender), React 19, TypeScript, `unicode-emoji-json` npm package, TailwindCSS v4

**Working directory for all commands:** `~/repos/worktrees/craigory-dev/emoji-integration`

---

### Task 1: Install unicode-emoji-json

**Files:**
- Modify: `apps/alt-codes/package.json` (via pnpm)

**Step 1: Add the package**

```bash
cd apps/alt-codes && pnpm add unicode-emoji-json
```

**Step 2: Verify data shape**

```bash
node -e "
const d = require('./node_modules/unicode-emoji-json/data-by-emoji.json');
const entries = Object.entries(d);
console.log('First entry:', entries[0]);
console.log('Total:', entries.length);
"
```

Expected: An entry like `['😀', { name: 'grinning face', slug: 'grinning_face', group: 'Smileys & Emotion', emoji_version: '1.0', unicode_version: '6.1', skin_tone_support: false }]` and Total ~1800.

Also check ordered list:
```bash
node -e "
const d = require('./node_modules/unicode-emoji-json/data-ordered-emoji.json');
console.log('First 3:', d.slice(0, 3));
console.log('Total:', d.length);
"
```

**Step 3: Commit**

```bash
git add apps/alt-codes/package.json pnpm-lock.yaml
git commit -m "chore(alt-codes): add unicode-emoji-json dependency"
```

---

### Task 2: Update CharacterEntry type, slug functions, and UnicodeData

**Files:**
- Modify: `apps/alt-codes/src/unicode-data.ts`

This is the core data model change. All other tasks flow from this.

**Step 1: Replace `CharacterEntry` and related types**

In `apps/alt-codes/src/unicode-data.ts`, replace lines 1–28 (the `CharacterEntry` interface and slug functions) with:

```typescript
export interface EmojiMeta {
  group: string;           // "Smileys & Emotion"
  subgroup: string;        // "face-smiling"
  emojiVersion: string;    // "1.0"
  unicodeVersion: string;  // "6.1"
  skinToneSlots: number;   // 0 = none, 1 = single, 2 = dual
}

export interface CharacterEntry {
  codePoints: number[];       // [0x2190] for regular chars; multi for emoji sequences
  char: string;
  hex: string;                // "U+XXXX" — first codepoint, used for card display and slug prefix
  decimal: number;            // first codepoint decimal
  categoryId: string;
  altCode: number | null;
  name: string;
  aliases: string[];
  emoji: EmojiMeta | null;    // null for non-emoji
}

/** Returns the map key for a codepoints array.
 *  e.g. [0x1F468, 0x200D, 0x1F4BB] → "1f468_200d_1f4bb" */
export function codePointsKey(codePoints: number[]): string {
  return codePoints.map(cp => cp.toString(16).toLowerCase()).join('_');
}

/** Produces a URL-safe slug.
 *  Single codepoint:  "2190-leftwards-arrow"
 *  Multi codepoint:   "1f468_200d_1f4bb-man-technologist"
 *  Codepoints joined with _ to avoid ambiguity with 4-char hex name words (e.g. "face"). */
export function toSymbolSlug(entry: CharacterEntry): string {
  const hexPrefix = codePointsKey(entry.codePoints);
  if (!entry.name) return hexPrefix;
  const slug = entry.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  return `${hexPrefix}-${slug}`;
}

/** Extracts codepoints from a slug.
 *  "2190-leftwards-arrow"              → [0x2190]
 *  "1f468_200d_1f4bb-man-technologist" → [0x1F468, 0x200D, 0x1F4BB]
 *  Strategy: take everything before the first "-", split on "_". */
export function parseSymbolSlug(param: string): number[] {
  const hexPrefix = param.split('-')[0];
  return hexPrefix.split('_').map(h => parseInt(h, 16));
}
```

**Step 2: Update `UnicodeData` interface**

Change line `byCodePoint: Map<number, CharacterEntry>;` to:

```typescript
  byCodePoints: Map<string, CharacterEntry>;
```

**Step 3: Add emoji categories to `CATEGORIES`**

After `{ id: 'dingbats', name: 'Dingbats' }`, add:

```typescript
  { id: 'smileys-emotion', name: 'Smileys & Emotion' },
  { id: 'people-body', name: 'People & Body' },
  { id: 'animals-nature', name: 'Animals & Nature' },
  { id: 'food-drink', name: 'Food & Drink' },
  { id: 'travel-places', name: 'Travel & Places' },
  { id: 'activities', name: 'Activities' },
  { id: 'objects', name: 'Objects' },
  { id: 'symbols-emoji', name: 'Symbols (Emoji)' },
  { id: 'flags', name: 'Flags' },
```

**Step 4: Build to check unicode-data.ts is clean**

```bash
pnpm nx build alt-codes 2>&1 | head -80
```

Expected: TypeScript errors in other files (they still use `codePoint`), but **no errors from `src/unicode-data.ts` itself**. If there are errors in that file, fix them before continuing.

**Step 5: Commit**

```bash
git add apps/alt-codes/src/unicode-data.ts
git commit -m "feat(alt-codes): extend CharacterEntry for multi-codepoint sequences and emoji metadata"
```

---

### Task 3: Update unicode-loader.server.ts — existing data + encoding

**Files:**
- Modify: `apps/alt-codes/pages/unicode-loader.server.ts`

**Step 1: Add import for codePointsKey**

At the top of the file, update the import from `../src/unicode-data`:

```typescript
import { CP437_SPECIAL, codePointsKey, type CharacterEntry, type UnicodeData } from '../src/unicode-data';
```

**Step 2: Update `makeEntry` to use `codePoints` array**

Replace the `makeEntry` function (currently lines 29–40):

```typescript
function makeEntry(codePoint: number, categoryId: string): CharacterEntry {
  return {
    codePoints: [codePoint],
    char: String.fromCodePoint(codePoint),
    hex: `U+${codePoint.toString(16).toUpperCase().padStart(4, '0')}`,
    decimal: codePoint,
    categoryId,
    altCode: unicodeToAlt.get(codePoint) ?? null,
    name: unicodeNames.get(codePoint) ?? '',
    aliases: getAliases(codePoint),
    emoji: null,
  };
}
```

**Step 3: Update `loadUnicodeData` Map building**

In `loadUnicodeData()`, replace the `byCodePoint` Map building section:

```typescript
  const byCodePoints = new Map<string, CharacterEntry>();
  const byCategory = new Map<string, CharacterEntry[]>();

  for (const entry of characters) {
    const key = codePointsKey(entry.codePoints);
    if (!byCodePoints.has(key)) byCodePoints.set(key, entry);
    const cat = byCategory.get(entry.categoryId) ?? [];
    cat.push(entry);
    byCategory.set(entry.categoryId, cat);
  }

  _cachedData = { characters, byCodePoints, byCategory };
  return _cachedData;
```

**Step 4: Update `getEncodingInfo` to handle sequences**

Replace the function signature and body:

```typescript
export function getEncodingInfo(codePoints: number[]): import('../src/unicode-data').EncodingInfo {
  const char = codePoints.map(cp => String.fromCodePoint(cp)).join('');

  // UTF-8 encoding of the full sequence
  const encoder = new TextEncoder();
  const bytes = Array.from(encoder.encode(char));
  const utf8Hex = bytes.map(b => b.toString(16).toUpperCase().padStart(2, '0')).join(' ');

  // HTML entity (single codepoint only)
  const htmlEntity = codePoints.length === 1 ? (HTML_ENTITIES[codePoints[0]] ?? null) : null;

  // HTML numeric: each codepoint as &#N; or &#xN;
  const htmlNumeric = codePoints
    .map(cp => cp <= 0xffff ? `&#${cp};` : `&#x${cp.toString(16).toUpperCase()};`)
    .join('');

  // CSS: backslash-hex per codepoint
  const cssValue = codePoints
    .map(cp => `\\${cp.toString(16).toUpperCase()}`)
    .join('');

  // JS escape per codepoint
  const jsEscape = codePoints
    .map(cp => cp <= 0xffff
      ? `\\u${cp.toString(16).toUpperCase().padStart(4, '0')}`
      : `\\u{${cp.toString(16).toUpperCase()}}`)
    .join('');

  return { utf8Bytes: bytes, utf8Hex, htmlEntity, htmlNumeric, cssValue, jsEscape };
}
```

**Step 5: Build check**

```bash
pnpm nx build alt-codes 2>&1 | head -80
```

Expected: No errors in `unicode-loader.server.ts`. Other files still have errors.

**Step 6: Commit**

```bash
git add apps/alt-codes/pages/unicode-loader.server.ts
git commit -m "feat(alt-codes): update loader for codePoints[] and sequence-aware encoding info"
```

---

### Task 4: Add buildEmojiCharacters() to unicode-loader.server.ts

**Files:**
- Modify: `apps/alt-codes/pages/unicode-loader.server.ts`

**Step 1: Add emoji data imports at the top of the file**

```typescript
import dataOrderedEmoji from 'unicode-emoji-json/data-ordered-emoji.json';
import dataByEmoji from 'unicode-emoji-json/data-by-emoji.json';
```

**Step 2: Add skin tone detection helpers after existing constants (after `unicodeToAlt`/`unicodeToAlt` block)**

```typescript
const SKIN_TONE_MODIFIERS = new Set([0x1F3FB, 0x1F3FC, 0x1F3FD, 0x1F3FE, 0x1F3FF]);
const ZWJ = 0x200D;

function isHumanFigure(cp: number): boolean {
  // Covers person, man, woman, child, adult, and common human figure emoji
  return (cp >= 0x1F466 && cp <= 0x1F9D1) || cp === 0x1F91D;
}

function splitOnZwj(codePoints: number[]): number[][] {
  const result: number[][] = [];
  let current: number[] = [];
  for (const cp of codePoints) {
    if (cp === ZWJ) { result.push(current); current = []; }
    else current.push(cp);
  }
  result.push(current);
  return result;
}

function detectSkinToneSlots(codePoints: number[], skinToneSupport: boolean): number {
  if (!skinToneSupport) return 0;
  // Two-person ZWJ sequence → dual skin tone (each person independently selectable)
  const components = splitOnZwj(codePoints);
  if (
    components.length === 2 &&
    components[0].length > 0 && isHumanFigure(components[0][0]) &&
    components[1].length > 0 && isHumanFigure(components[1][0])
  ) {
    return 2;
  }
  return 1;
}

const EMOJI_GROUP_TO_CATEGORY: Record<string, string> = {
  'Smileys & Emotion': 'smileys-emotion',
  'People & Body': 'people-body',
  'Animals & Nature': 'animals-nature',
  'Food & Drink': 'food-drink',
  'Travel & Places': 'travel-places',
  'Activities': 'activities',
  'Objects': 'objects',
  'Symbols': 'symbols-emoji',
  'Flags': 'flags',
};
```

**Step 3: Add type for the emoji JSON data**

```typescript
interface EmojiJsonEntry {
  name: string;
  slug: string;
  group: string;
  emoji_version: string;
  unicode_version: string;
  skin_tone_support: boolean;
}
```

**Step 4: Add `buildEmojiCharacters()` function**

```typescript
function buildEmojiCharacters(): CharacterEntry[] {
  const byEmoji = dataByEmoji as Record<string, EmojiJsonEntry>;
  const ordered = dataOrderedEmoji as string[];
  const entries: CharacterEntry[] = [];

  for (const emojiChar of ordered) {
    const meta = byEmoji[emojiChar];
    if (!meta) continue;

    const categoryId = EMOJI_GROUP_TO_CATEGORY[meta.group];
    if (!categoryId) continue;

    const codePoints = [...emojiChar].map(c => c.codePointAt(0)!);
    const firstCp = codePoints[0];

    entries.push({
      codePoints,
      char: emojiChar,
      hex: `U+${firstCp.toString(16).toUpperCase().padStart(4, '0')}`,
      decimal: firstCp,
      categoryId,
      altCode: null,
      name: meta.name.toUpperCase(),
      aliases: [],
      emoji: {
        group: meta.group,
        subgroup: meta.slug.replace(/_/g, '-'),
        emojiVersion: meta.emoji_version,
        unicodeVersion: meta.unicode_version,
        skinToneSlots: detectSkinToneSlots(codePoints, meta.skin_tone_support),
      },
    });
  }

  return entries;
}
```

**Step 5: Append emoji characters in `loadUnicodeData()`**

In the `characters` array definition, add `...buildEmojiCharacters()` as the last spread:

```typescript
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
    ...buildEmojiCharacters(),
  ];
```

**Step 6: Build check**

```bash
pnpm nx build alt-codes 2>&1 | head -80
```

Expected: `unicode-loader.server.ts` compiles cleanly. Remaining errors are in pages that still use old `entry.codePoint` API.

**Step 7: Commit**

```bash
git add apps/alt-codes/pages/unicode-loader.server.ts
git commit -m "feat(alt-codes): load emoji data with skin tone slot detection"
```

---

### Task 5: Update symbol/+data.server.ts

**Files:**
- Modify: `apps/alt-codes/pages/symbol/@hexOrSlugifiedName/+data.server.ts`

**Step 1: Update imports**

Add `codePointsKey` to the import from `../../../src/unicode-data`:

```typescript
import { parseSymbolSlug, codePointsKey, CATEGORIES } from '../../../src/unicode-data';
```

Also update the `getEncodingInfo` call site — it now takes `number[]` instead of `number`.

**Step 2: Update `relatedScore` to use `codePoints[0]`**

```typescript
function relatedScore(candidate: CharacterEntry, keywords: string[], firstCodePoint: number): number {
  const nameUpper = candidate.name.toUpperCase();
  const matches = keywords.filter(kw => nameUpper.includes(kw)).length;
  if (matches === 0) return 0;
  const cpDist = Math.abs(candidate.codePoints[0] - firstCodePoint);
  return matches * 100 + Math.max(0, 50 - Math.floor(cpDist / 20));
}
```

**Step 3: Rewrite the `data()` function body**

```typescript
export async function data(pageContext: PageContextServer): Promise<SymbolData> {
  const codePoints = parseSymbolSlug(pageContext.routeParams.hexOrSlugifiedName);
  const key = codePointsKey(codePoints);
  const { byCodePoints, byCategory, characters } = pageContext.globalContext.unicodeData;

  const entry = byCodePoints.get(key);
  if (!entry) throw new Error(`No entry for key: ${key}`);

  const categoryName = CATEGORIES.find(c => c.id === entry.categoryId)?.name ?? entry.categoryId;
  const encoding = getEncodingInfo(entry.codePoints);

  // Block neighbors: up to 8 chars before and after in same category
  const catChars = byCategory.get(entry.categoryId) ?? [];
  const entryKey = codePointsKey(entry.codePoints);
  const idx = catChars.findIndex(c => codePointsKey(c.codePoints) === entryKey);
  const start = Math.max(0, idx - 8);
  const end = Math.min(catChars.length, idx + 9);
  const blockNeighbors = catChars.slice(start, end).filter(c => codePointsKey(c.codePoints) !== entryKey);

  // Related by name
  const keywords = nameKeywords(entry.name);
  const relatedByName: CharacterEntry[] = [];
  if (keywords.length > 0) {
    const seen = new Set<string>([entryKey]);
    const scored: Array<{ entry: CharacterEntry; score: number }> = [];
    for (const c of characters) {
      const cKey = codePointsKey(c.codePoints);
      if (seen.has(cKey) || !c.name) continue;
      const score = relatedScore(c, keywords, codePoints[0]);
      if (score > 0) {
        seen.add(cKey);
        scored.push({ entry: c, score });
      }
    }
    scored.sort((a, b) => b.score - a.score);
    relatedByName.push(...scored.slice(0, 16).map(s => s.entry));
  }

  return { entry, categoryName, encoding, blockNeighbors, relatedByName };
}
```

**Step 4: Build check**

```bash
pnpm nx build alt-codes 2>&1 | head -80
```

Expected: This file now compiles cleanly.

**Step 5: Commit**

```bash
git add apps/alt-codes/pages/symbol/@hexOrSlugifiedName/+data.server.ts
git commit -m "feat(alt-codes): update symbol data fetcher for multi-codepoint lookup"
```

---

### Task 6: Update symbol/+onBeforePrerenderStart.ts

**Files:**
- Modify: `apps/alt-codes/pages/symbol/@hexOrSlugifiedName/+onBeforePrerenderStart.ts`

**Step 1: Replace file content**

```typescript
import type { OnBeforePrerenderStartSync } from 'vike/types';
import { loadUnicodeData } from '../../unicode-loader.server';
import { toSymbolSlug, codePointsKey } from '../../../src/unicode-data';

export const onBeforePrerenderStart: OnBeforePrerenderStartSync = (): ReturnType<OnBeforePrerenderStartSync> => {
  const { characters } = loadUnicodeData();
  const seen = new Set<string>();
  const urls: string[] = [];
  for (const entry of characters) {
    const key = codePointsKey(entry.codePoints);
    if (!seen.has(key)) {
      seen.add(key);
      urls.push(`/symbol/${toSymbolSlug(entry)}`);
    }
  }
  return urls;
};
```

**Step 2: Commit**

```bash
git add apps/alt-codes/pages/symbol/@hexOrSlugifiedName/+onBeforePrerenderStart.ts
git commit -m "fix(alt-codes): update symbol prerender start to use codePoints key"
```

---

### Task 7: Update home page +Page.tsx

**Files:**
- Modify: `apps/alt-codes/pages/+Page.tsx`

**Step 1: Add `codePointsKey` to import**

```typescript
import { CATEGORIES, toSymbolSlug, codePointsKey, type CharacterEntry } from '../src/unicode-data';
```

**Step 2: Update dedup logic**

In the `deduped` useMemo (currently uses `seen.has(c.codePoint)`):

```typescript
const deduped = useMemo<CharacterEntry[]>(() => {
  const seen = new Set<string>();
  return characters.filter((c) => {
    const key = codePointsKey(c.codePoints);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}, [characters]);
```

**Step 3: Update CharCard key in VirtualGrid**

```tsx
<CharCard
  key={`${c.categoryId}-${codePointsKey(c.codePoints)}`}
  entry={c}
/>
```

**Step 4: Build check**

```bash
pnpm nx build alt-codes 2>&1 | head -80
```

**Step 5: Commit**

```bash
git add apps/alt-codes/pages/+Page.tsx
git commit -m "fix(alt-codes): update home page dedup and card keys for codePoints[]"
```

---

### Task 8: Update category page +Page.tsx

**Files:**
- Modify: `apps/alt-codes/pages/category/@id/+Page.tsx`

**Step 1: Add `codePointsKey` to import**

```typescript
import { toSymbolSlug, codePointsKey } from '../../../src/unicode-data';
```

**Step 2: Update card key on line 60**

Change `key={c.codePoint}` to:

```tsx
key={codePointsKey(c.codePoints)}
```

**Step 3: Build check — expect zero errors now**

```bash
pnpm nx build alt-codes 2>&1 | tail -30
```

Expected: Build succeeds with zero TypeScript errors.

**Step 4: Commit**

```bash
git add apps/alt-codes/pages/category/@id/+Page.tsx
git commit -m "fix(alt-codes): update category page card key for codePoints[]"
```

---

### Task 9: Add skin tone selector and multi-codepoint encoding display to symbol/+Page.tsx

**Files:**
- Modify: `apps/alt-codes/pages/symbol/@hexOrSlugifiedName/+Page.tsx`
- Modify: `apps/alt-codes/src/style.css`

**Step 1: Add imports**

```typescript
import { toSymbolSlug, codePointsKey, type CharacterEntry } from '../../../src/unicode-data';
```

**Step 2: Update MiniCard keys**

Both `relatedByName` and `blockNeighbors` maps currently use `key={c.codePoint}`. Change both to:

```tsx
<MiniCard key={codePointsKey(c.codePoints)} entry={c} />
```

**Step 3: Update encoding display for multi-codepoint sequences**

In the `Page` component, derive display strings before the return:

```tsx
const unicodeDisplay = entry.codePoints
  .map(cp => `U+${cp.toString(16).toUpperCase().padStart(4, '0')}`)
  .join(' ');

const decimalDisplay = entry.codePoints.join(' ');
```

Replace the Unicode and Decimal enc-rows:

```tsx
<div className="enc-row">
  <span className="enc-label">Unicode</span>
  <code className="enc-value">{unicodeDisplay}</code>
  <CopyButton value={unicodeDisplay} label="Copy" />
</div>
<div className="enc-row">
  <span className="enc-label">Decimal</span>
  <code className="enc-value">{decimalDisplay}</code>
  <CopyButton value={decimalDisplay} label="Copy" />
</div>
```

**Step 4: Add skin tone state to Page component**

```tsx
export default function Page() {
  const { entry, categoryName, encoding, blockNeighbors, relatedByName } = useData<SymbolData>();
  const [displayChar, setDisplayChar] = useState(entry.char);

  // Reset variant when navigating to a new symbol
  useEffect(() => { setDisplayChar(entry.char); }, [entry.char]);
```

Replace `entry.char` in the hero glyph and copy button with `displayChar`:

```tsx
<div className="symbol-hero-glyph">{displayChar}</div>
// ...
<CopyButton value={displayChar} label={`Copy "${displayChar}"`} />
{entry.emoji !== null && entry.emoji.skinToneSlots > 0 && (
  <SkinTonePicker entry={entry} onVariantChange={setDisplayChar} />
)}
```

**Step 5: Add SkinTonePicker component**

Add before the `Page` component:

```tsx
const SKIN_TONES: Array<{ modifier: number | null; label: string; swatch: string }> = [
  { modifier: null,   label: 'Default',      swatch: '🟡' },
  { modifier: 0x1F3FB, label: 'Light',        swatch: '🏻' },
  { modifier: 0x1F3FC, label: 'Medium-Light', swatch: '🏼' },
  { modifier: 0x1F3FD, label: 'Medium',       swatch: '🏽' },
  { modifier: 0x1F3FE, label: 'Medium-Dark',  swatch: '🏾' },
  { modifier: 0x1F3FF, label: 'Dark',         swatch: '🏿' },
];

const SKIN_MODIFIER_SET = new Set([0x1F3FB, 0x1F3FC, 0x1F3FD, 0x1F3FE, 0x1F3FF]);
const ZWJ_CP = 0x200D;

function applyOneSkinTone(codePoints: number[], modifier: number | null): string {
  const stripped = codePoints.filter(cp => !SKIN_MODIFIER_SET.has(cp));
  if (modifier === null) return String.fromCodePoint(...stripped);
  return String.fromCodePoint(stripped[0], modifier, ...stripped.slice(1));
}

function applyDualSkinTone(
  codePoints: number[],
  modifier1: number | null,
  modifier2: number | null,
): string {
  const components: number[][] = [];
  let current: number[] = [];
  for (const cp of codePoints) {
    if (cp === ZWJ_CP) { components.push(current); current = []; }
    else current.push(cp);
  }
  components.push(current);

  const withTones = components.map((comp, i) => {
    const stripped = comp.filter(cp => !SKIN_MODIFIER_SET.has(cp));
    const mod = i === 0 ? modifier1 : modifier2;
    if (mod === null || stripped.length === 0) return stripped;
    return [stripped[0], mod, ...stripped.slice(1)];
  });

  return withTones
    .map(cps => String.fromCodePoint(...cps))
    .join(String.fromCodePoint(ZWJ_CP));
}

function SkinTonePicker({
  entry,
  onVariantChange,
}: {
  entry: CharacterEntry;
  onVariantChange: (char: string) => void;
}) {
  const slots = entry.emoji?.skinToneSlots ?? 0;
  const [tone1, setTone1] = useState<number | null>(null);
  const [tone2, setTone2] = useState<number | null>(null);

  if (slots === 0) return null;

  const handleTone1 = (mod: number | null) => {
    setTone1(mod);
    if (slots === 1) {
      onVariantChange(applyOneSkinTone(entry.codePoints, mod));
    } else {
      onVariantChange(applyDualSkinTone(entry.codePoints, mod, tone2));
    }
  };

  const handleTone2 = (mod: number | null) => {
    setTone2(mod);
    onVariantChange(applyDualSkinTone(entry.codePoints, tone1, mod));
  };

  return (
    <div className="skin-tone-picker">
      <div className="skin-tone-row">
        {slots === 2 && <span className="skin-tone-label">Person 1</span>}
        {SKIN_TONES.map(({ modifier, label, swatch }) => (
          <button
            key={label}
            className={`skin-tone-swatch${tone1 === modifier ? ' skin-tone-swatch--active' : ''}`}
            title={label}
            onClick={() => handleTone1(modifier)}
            aria-pressed={tone1 === modifier}
          >
            {swatch}
          </button>
        ))}
      </div>
      {slots === 2 && (
        <div className="skin-tone-row">
          <span className="skin-tone-label">Person 2</span>
          {SKIN_TONES.map(({ modifier, label, swatch }) => (
            <button
              key={label}
              className={`skin-tone-swatch${tone2 === modifier ? ' skin-tone-swatch--active' : ''}`}
              title={label}
              onClick={() => handleTone2(modifier)}
              aria-pressed={tone2 === modifier}
            >
              {swatch}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
```

**Step 6: Add skin tone CSS to style.css**

Read `apps/alt-codes/src/style.css` first to find a good insertion point, then append:

```css
/* ── Skin tone picker ──────────────────────────────────────── */
.skin-tone-picker {
  margin-top: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.skin-tone-row {
  display: flex;
  align-items: center;
  gap: 0.375rem;
}

.skin-tone-label {
  font-size: 0.75rem;
  color: var(--color-muted, #888);
  min-width: 4.5rem;
}

.skin-tone-swatch {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  border: 2px solid transparent;
  background: transparent;
  cursor: pointer;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: border-color 0.1s;
  padding: 0;
}

.skin-tone-swatch:hover {
  border-color: var(--color-accent, #7c6af7);
}

.skin-tone-swatch--active {
  border-color: var(--color-accent, #7c6af7);
}
```

**Step 7: Full build check**

```bash
pnpm nx build alt-codes 2>&1 | tail -30
```

Expected: Zero TypeScript errors. Build succeeds.

**Step 8: Commit**

```bash
git add apps/alt-codes/pages/symbol/@hexOrSlugifiedName/+Page.tsx apps/alt-codes/src/style.css
git commit -m "feat(alt-codes): skin tone picker and multi-codepoint encoding display"
```

---

### Task 10: Final verification

**Step 1: Full production build**

```bash
pnpm nx build alt-codes 2>&1 | tail -20
```

Expected: Build succeeds. Should report significantly more prerendered pages than before (~3,800 total vs ~2,000).

**Step 2: Verify emoji category pages generated**

```bash
ls ~/repos/worktrees/craigory-dev/emoji-integration/dist/apps/alt-codes/category/ | sort
```

Expected: Includes `smileys-emotion/`, `people-body/`, `animals-nature/`, `food-drink/`, `travel-places/`, `activities/`, `objects/`, `symbols-emoji/`, `flags/`.

**Step 3: Verify multi-codepoint emoji URL format**

```bash
ls ~/repos/worktrees/craigory-dev/emoji-integration/dist/apps/alt-codes/symbol/ | grep "_" | head -10
```

Expected: Directory names like `1f468_200d_1f4bb-man-technologist/`.

**Step 4: Verify single-codepoint URLs unchanged**

```bash
ls ~/repos/worktrees/craigory-dev/emoji-integration/dist/apps/alt-codes/symbol/ | grep "^2190" | head -3
```

Expected: `2190-leftwards-arrow/` — same format as before.

**Step 5: Lint**

```bash
pnpm nx lint alt-codes
```

Expected: Zero linting errors.

**Step 6: Commit any remaining cleanup**

```bash
git status
# If anything unstaged:
git add -A
git commit -m "chore(alt-codes): post-emoji-integration cleanup"
```
