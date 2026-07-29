import { describe, it, expect } from 'vitest';
import {
  CP437_SPECIAL,
  VS_TEXT,
  VS_EMOJI,
  presentationBase,
  textPresentation,
  emojiPresentation,
  defaultPresentation,
} from './unicode-data';

describe('presentationBase', () => {
  it('accepts the bare form the block ranges produce', () => {
    expect(presentationBase([0x2665])).toBe(0x2665);
  });

  it('accepts the fully-qualified form emoji-test.txt produces', () => {
    // The same character arrives via two loader paths; both cards must show both variants.
    expect(presentationBase([0x2665, VS_EMOJI])).toBe(0x2665);
  });

  it('leaves an already text-qualified sequence alone', () => {
    expect(presentationBase([0x2665, VS_TEXT])).toBeNull();
  });

  it('rejects code points with no standardized variation sequence', () => {
    expect(presentationBase([0x2593])).toBeNull(); // ▓ DARK SHADE
    expect(presentationBase([0x1f600])).toBeNull(); // 😀 emoji-default, no text form
  });

  it('does not split a keycap sequence whose base happens to be a variation base', () => {
    // Digit ONE *is* in emoji-variation-sequences.txt, so a first-code-point-only check
    // would wrongly render 1️⃣ as two loose digits.
    expect(presentationBase([0x31, VS_EMOJI, 0x20e3])).toBeNull();
  });

  it('rejects ZWJ sequences', () => {
    expect(presentationBase([0x1f468, 0x200d, 0x1f4bb])).toBeNull(); // 👨‍💻
  });

  it('rejects emoji components, whose two presentations are the same glyph', () => {
    // #, * and 0-9 carry variation sequences only because they compose into keycaps.
    // No font ships a standalone emoji-style digit, so showing both would be noise.
    for (const cp of [0x23, 0x2a, ...Array.from({ length: 10 }, (_, i) => 0x30 + i)]) {
      expect(presentationBase([cp])).toBeNull();
    }
  });

  it('keeps characters that do have two distinct designs', () => {
    expect(presentationBase([0x2708])).toBe(0x2708); // ✈ airplane, text-default
    expect(presentationBase([0x231a])).toBe(0x231a); // ⌚ watch, emoji-default
  });
});

describe('presentation variants', () => {
  it('appends the matching selector', () => {
    expect([...textPresentation(0x2665)].map((c) => c.codePointAt(0))).toEqual([0x2665, VS_TEXT]);
    expect([...emojiPresentation(0x2665)].map((c) => c.codePointAt(0))).toEqual([0x2665, VS_EMOJI]);
  });
});

describe('defaultPresentation', () => {
  it('reports which side the unqualified form already renders as', () => {
    // Text-default: ♥ ☁ ✈ draw as monochrome text glyphs with no selector.
    expect(defaultPresentation(0x2665)).toBe('text');
    expect(defaultPresentation(0x2601)).toBe('text');
    expect(defaultPresentation(0x2708)).toBe('text');
    // Emoji-default: ⌚ 🕔 👍 draw as color emoji with no selector.
    expect(defaultPresentation(0x231a)).toBe('emoji');
    expect(defaultPresentation(0x1f554)).toBe('emoji');
    expect(defaultPresentation(0x1f44d)).toBe('emoji');
  });
});

describe('the alt-codes table', () => {
  it('shows both presentations for exactly the ten CP437 characters that have them', () => {
    const dual = CP437_SPECIAL.filter(([, cp]) => presentationBase([cp]) !== null).map(
      ([altCode]) => altCode,
    );
    // ☺ ♥ ♦ ♣ ♠ ♂ ♀ ↕ ‼ ↔ — per emoji-variation-sequences.txt.
    expect(dual).toEqual([1, 3, 4, 5, 6, 11, 12, 18, 19, 29]);
  });
});
