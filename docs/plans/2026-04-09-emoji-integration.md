# Emoji Integration Design

**Date:** 2026-04-09  
**Status:** Approved

## Overview

Integrate emoji data from `unicode-emoji-json` into the alt-codes app. Emojis become first-class characters in the main grid, and emoji groups become categories alongside existing Unicode categories (arrows, math, symbols, etc.).

## Data Model Changes

Extend `CharacterEntry` to support multi-codepoint sequences and emoji metadata:

```typescript
interface CharacterEntry {
  // existing (unchanged)
  char: string;
  hex: string;           // first codepoint hex — used in URL slug
  decimal: number;       // first codepoint decimal
  categoryId: string;
  altCode: number | null;
  name: string;
  aliases: string[];

  // changed: was codePoint: number
  codePoints: number[];  // single-element for regular chars, multi for emoji sequences

  // new (null for non-emojis)
  emoji: {
    group: string;           // "Smileys & Emotion"
    subgroup: string;        // "face-smiling"
    emojiVersion: string;    // "1.0"
    unicodeVersion: string;  // "6.1"
    skinToneSlots: number;   // 0 = none, 1 = single, 2 = dual
  } | null;
}
```

`UnicodeData` lookup map changes from `byCodePoint: Map<number, CharacterEntry>` to `byCodePoints: Map<string, CharacterEntry>` keyed by joined hex string (e.g. `"1f468-200d-1f4bb"`).

## Data Loading Pipeline

`unicode-loader.server.ts` gains a new `buildEmojiCharacters()` function:

- Iterates `data-ordered-emoji.json` from `unicode-emoji-json`
- Parses each emoji char → `codePoints[]` via `[...char].map(c => c.codePointAt(0)!)`
- Detects `skinToneSlots` by splitting sequence on ZWJ (U+200D) and counting segments containing a skin tone modifier (U+1F3FB–U+1F3FF)
- Maps group string → slugified categoryId (e.g. `"Smileys & Emotion"` → `"smileys-emotion"`)
- Sets `altCode: null`, `aliases: []`

## Emoji Categories

9 new categories appended to `CATEGORIES` in `unicode-data.ts`:

| Group | Category ID |
|---|---|
| Smileys & Emotion | `smileys-emotion` |
| People & Body | `people-body` |
| Animals & Nature | `animals-nature` |
| Food & Drink | `food-drink` |
| Travel & Places | `travel-places` |
| Activities | `activities` |
| Objects | `objects` |
| Symbols | `symbols-emoji` |
| Flags | `flags` |

Note: `symbols-emoji` avoids collision with the existing `symbols` category.

## URL & Routing

`toSymbolSlug()` joins all codepoints with `-` for the hex prefix:

```
👍  →  /symbol/1f44d-thumbs-up
👨‍💻  →  /symbol/1f468-200d-1f4bb-man-technologist
🇺🇸  →  /symbol/1f1fa-1f1f8-flag-united-states
```

`parseSymbolSlug()` splits the slug on `-`, reading hex segments until it hits a non-hex token (the name part begins).

Lookup uses `byCodePoints` map keyed by the joined hex prefix from the slug.

Total prerendered pages: ~3,800 (~2,000 existing + ~1,800 emoji).

## Detail Page — Skin Tone Selectors

Skin tone modifiers: U+1F3FB (🏻) through U+1F3FF (🏿).

**Single slot** (`skinToneSlots === 1`): one row of 6 swatches (5 tones + yellow default). Selecting a tone replaces or inserts the modifier in the codepoint sequence.

**Dual slot** (`skinToneSlots === 2`): two labeled rows (e.g. "Person 1" / "Person 2"), each independently selectable. Sequence is rebuilt by splitting on ZWJ, inserting/replacing modifier in each segment, re-joining with ZWJ.

The picker is client-side only — updates the displayed glyph and copy button. No new pages or URL changes.

## Grid Cards

For emoji entries:
- Hide "Alt" badge (not applicable)
- Cards otherwise identical: glyph, hex of first codepoint, name

**Dual presentation (added 2026-07-28).** The 371 code points in
`emoji-variation-sequences.txt` have both a text-style (U+FE0E) and an emoji-style
(U+FE0F) standardized sequence, and render as visibly different characters — ♥ vs ♥️.
A bare code point is *unqualified*, so which one you get is decided by platform font
fallback; the same card rendered differently per OS. Those cards now show both glyphs
side by side, explicitly qualified, via `src/CharGlyph.tsx`.

The predicate (`presentationBase` in `src/unicode-data.ts`) accepts both forms the two
loader paths produce for the same character — the bare `[0x2665]` from `makeEntry()`'s
block ranges and the fully-qualified `[0x2665, 0xFE0F]` from `buildEmojiCharacters()`.
It rejects longer sequences, which matters because digits are variation bases: a
first-code-point-only check would wrongly split the keycap `1️⃣`.

Card geometry is unchanged — the two glyphs sit on one line at 24px, so the
virtualizers' fixed 85px card height and `ROW_HEIGHT` estimates still hold.

## Non-Goals

- Skin tone variants as separate pages (handled via detail page selector only)
- Emoji search by keyword beyond name/group (future work)
- Animated emoji support
