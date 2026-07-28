import { describe, it, expect } from 'vitest';
import {
  CP437_SPECIAL,
  VS_TEXT,
  VS_EMOJI,
  presentationBase,
  textPresentation,
  emojiPresentation,
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
});

describe('presentation variants', () => {
  it('appends the matching selector', () => {
    expect([...textPresentation(0x2665)].map((c) => c.codePointAt(0))).toEqual([0x2665, VS_TEXT]);
    expect([...emojiPresentation(0x2665)].map((c) => c.codePointAt(0))).toEqual([0x2665, VS_EMOJI]);
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
