/**
 * The spike itself: five code points spanning Latin, accented Latin, CJK, Arabic and emoji,
 * each rendered end to end, plus the no-coverage case.
 *
 * These hit fonts.googleapis.com and the Twemoji CDN, because the thing under test IS the
 * network font supply. OPT-IN — run with `OG_SPIKE=1`, or `pnpm --filter alt-codes og:spike`
 * for the same cards as files you can look at.
 *
 * Deliberately not part of the PR gate. The gate runs on every push, and pointing it at two
 * third-party CDNs would make unrelated PRs fail when jsDelivr has a bad minute — and would
 * lean on Google continuing to sniff a 2011 Safari User-Agent. The offline suites in
 * font-source.spec.ts cover the code-point logic and the HTTP-status handling on every run.
 */

import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';

import { beforeAll, describe, expect, it } from 'vitest';

import {
  type GlyphCardInput,
  initResvg,
  initSatori,
  renderGlyphCard,
  twemojiFilename,
} from './render';

const live = process.env.OG_SPIKE === '1';

const CASES: Array<GlyphCardInput & { expected: 'font' | 'image' | 'none' }> = [
  {
    codePoints: [0x0041], char: 'A', name: 'LATIN CAPITAL LETTER A',
    hex: 'U+0041', altCode: 65, categoryName: 'ASCII Symbols', expected: 'font',
  },
  {
    codePoints: [0x00e9], char: 'é', name: 'LATIN SMALL LETTER E WITH ACUTE',
    hex: 'U+00E9', altCode: 130, categoryName: 'Latin Extended', expected: 'font',
  },
  {
    codePoints: [0x4e2d], char: '中', name: 'CJK UNIFIED IDEOGRAPH-4E2D',
    hex: 'U+4E2D', altCode: null, categoryName: 'CJK & Scripts', expected: 'font',
  },
  {
    codePoints: [0x0627], char: 'ا', name: 'ARABIC LETTER ALEF',
    hex: 'U+0627', altCode: null, categoryName: 'CJK & Scripts', expected: 'font',
  },
  {
    codePoints: [0x1f600], char: '😀', name: 'GRINNING FACE',
    hex: 'U+1F600', altCode: null, categoryName: 'Smileys & Emotion', expected: 'image',
  },
  {
    // Box Drawing is only in Noto Sans Mono — every other candidate 400s, and the upstream
    // Noto Sans Symbols 2 binary has 0/128 of the block. This case guards the last entry in
    // COMMON_FAMILIES: drop it and CP437 alt-176 to alt-223 all fall to the no-glyph card.
    codePoints: [0x2554], char: '╔', name: 'BOX DRAWINGS DOUBLE DOWN AND RIGHT',
    hex: 'U+2554', altCode: 201, categoryName: 'Box Drawing', expected: 'font',
  },
  {
    // Genuinely uncovered: a Unicode 16 addition no released Noto family carries yet, and no
    // Twemoji SVG. Script=Common, so it exercises the whole candidate walk before giving up —
    // which is the path that must end in an explicit no-glyph card rather than tofu.
    codePoints: [0x1cc00], char: '\u{1CC00}', name: 'OUTLINED LATIN CAPITAL LETTER A',
    hex: 'U+1CC00', altCode: null, categoryName: 'Misc Symbols', expected: 'none',
  },
];

describe.skipIf(!live)('renderGlyphCard', () => {
  beforeAll(async () => {
    // Node reads the wasm off disk; a Worker passes the module its bundler imported. Both
    // engines take both shapes, which is why render.ts has no platform branch in it.
    const require = createRequire(import.meta.url);
    await initSatori(readFileSync(require.resolve('satori/yoga.wasm')));
    await initResvg(readFileSync(require.resolve('@resvg/resvg-wasm/index_bg.wasm')));
  }, 60_000);

  it.each(CASES)(
    'renders $hex ($name) via $expected',
    async ({ expected, ...input }) => {
      const { png, asset } = await renderGlyphCard(input);

      expect(asset.kind).toBe(expected);
      // PNG magic number — proof of an actual raster, not an empty buffer.
      expect(Array.from(png.subarray(0, 4))).toEqual([0x89, 0x50, 0x4e, 0x47]);
      expect(png.byteLength).toBeGreaterThan(5_000);
    },
    120_000,
  );
});

describe('twemojiFilename', () => {
  it('drops the variation selector outside a ZWJ sequence', () => {
    expect(twemojiFilename([0x2764, 0xfe0f])).toBe('2764');
  });

  it('keeps every code point inside a ZWJ sequence', () => {
    expect(twemojiFilename([0x1f468, 0x200d, 0x1f4bb])).toBe('1f468-200d-1f4bb');
  });

  it('joins a flag pair with a hyphen', () => {
    expect(twemojiFilename([0x1f1fa, 0x1f1f8])).toBe('1f1fa-1f1f8');
  });
});
