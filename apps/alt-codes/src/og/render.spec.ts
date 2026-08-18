/**
 * The spike itself: five code points spanning Latin, accented Latin, CJK, Arabic and emoji,
 * each rendered end to end, plus the no-coverage case.
 *
 * These hit fonts.googleapis.com and the Twemoji CDN, because the thing under test IS the
 * network font supply. Set OG_SPIKE=0 to skip.
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

const live = process.env.OG_SPIKE !== '0';

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
    // U+2554 is covered by no Google Fonts Noto family and has no Twemoji SVG — measured, not
    // hypothetical. It is also CP437 alt-201, so the fallback is on a real page, not a corner.
    codePoints: [0x2554], char: '╔', name: 'BOX DRAWINGS DOUBLE DOWN AND RIGHT',
    hex: 'U+2554', altCode: 201, categoryName: 'Box Drawing', expected: 'none',
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
