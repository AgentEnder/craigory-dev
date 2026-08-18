import { describe, expect, it } from 'vitest';

import {
  GOOGLE_FONT_LEGACY_UA,
  fontFamiliesForCodePoint,
  googleFontCssUrl,
  parseGoogleFontCss,
  scriptForCodePoint,
} from './font-source';

describe('scriptForCodePoint', () => {
  it.each([
    ['A', 0x0041, 'Latin'],
    ['é', 0x00e9, 'Latin'],
    ['中', 0x4e2d, 'Han'],
    ['ا', 0x0627, 'Arabic'],
    ['😀', 0x1f600, 'Common'],
    ['→', 0x2192, 'Common'],
    ['か', 0x304b, 'Hiragana'],
    ['한', 0xd55c, 'Hangul'],
    ['Ω', 0x03a9, 'Greek'],
    ['д', 0x0434, 'Cyrillic'],
  ])('resolves %s (U+%s) to %s', (_char, cp, script) => {
    expect(scriptForCodePoint(cp)).toBe(script);
  });

  it('reports Unknown for unassigned code points', () => {
    // U+0870 was unassigned before Unicode 14 but is Arabic now; U+2FE0 is a genuine hole
    // in the CJK radicals block that no script claims.
    expect(scriptForCodePoint(0x2fe0)).toBe('Unknown');
  });

  it('reports Unknown above the last assigned range rather than throwing', () => {
    expect(scriptForCodePoint(0x10ffff)).toBe('Unknown');
  });

  it('places combining marks in Inherited, not the base script', () => {
    expect(scriptForCodePoint(0x0301)).toBe('Inherited'); // COMBINING ACUTE ACCENT
  });
});

describe('fontFamiliesForCodePoint', () => {
  it('offers Noto Sans first for Latin', () => {
    expect(fontFamiliesForCodePoint(0x0041)[0]).toBe('Noto Sans');
  });

  it('offers the CJK families for Han, widest coverage first', () => {
    expect(fontFamiliesForCodePoint(0x4e2d)).toEqual([
      'Noto Sans SC',
      'Noto Sans TC',
      'Noto Sans JP',
      'Noto Sans KR',
    ]);
  });

  it('maps a script to its Noto family by naming convention', () => {
    // Nothing hand-written covers Cherokee; the convention has to carry it.
    expect(fontFamiliesForCodePoint(0x13a0)).toContain('Noto Sans Cherokee');
  });

  it('converts underscored script names to spaced family names', () => {
    // U+1400 CANADIAN SYLLABICS — Script=Canadian_Aboriginal.
    expect(fontFamiliesForCodePoint(0x1400)).toContain('Noto Sans Canadian Aboriginal');
  });

  it('offers the symbol families for Common, which is where this app lives', () => {
    // U+2192 RIGHTWARDS ARROW and U+2554 BOX DRAWINGS DOUBLE DOWN AND RIGHT are both
    // Script=Common but sit in different Noto symbol fonts, so the list must span them.
    const families = fontFamiliesForCodePoint(0x2192);
    expect(families).toContain('Noto Sans Symbols');
    expect(families).toContain('Noto Sans Symbols 2');
    expect(fontFamiliesForCodePoint(0x2554)).toEqual(families);
  });

  it('gives Inherited the same candidates as Common', () => {
    expect(fontFamiliesForCodePoint(0x0301)).toEqual(fontFamiliesForCodePoint(0x0020));
  });

  it('returns no candidates for an unknown script, which is the no-coverage signal', () => {
    expect(fontFamiliesForCodePoint(0x2fe0)).toEqual([]);
  });
});

describe('googleFontCssUrl', () => {
  it('percent-encodes the family and the subset text', () => {
    const url = googleFontCssUrl('Noto Sans SC', '中');
    expect(url).toBe(
      'https://fonts.googleapis.com/css2?family=Noto+Sans+SC&text=%E4%B8%AD',
    );
  });

  it('encodes astral characters as full UTF-8, not surrogate halves', () => {
    expect(googleFontCssUrl('Noto Sans', '😀')).toContain('text=%F0%9F%98%80');
  });
});

describe('parseGoogleFontCss', () => {
  const woffCss = `@font-face {
  font-family: 'Noto Sans SC';
  font-style: normal;
  font-weight: 400;
  src: url(https://fonts.gstatic.com/l/font?kit=abc&skey=def&v=v40) format('woff');
}`;

  it('extracts the first woff url', () => {
    expect(parseGoogleFontCss(woffCss)).toBe(
      'https://fonts.gstatic.com/l/font?kit=abc&skey=def&v=v40',
    );
  });

  it('rejects woff2, which Satori cannot parse', () => {
    expect(parseGoogleFontCss(woffCss.replace("'woff'", "'woff2'"))).toBeNull();
  });

  it('rejects the HTML error page Google serves for an unknown family', () => {
    expect(parseGoogleFontCss('<!DOCTYPE html><html lang=en><head>')).toBeNull();
  });

  it('accepts truetype, which some families still serve to the legacy UA', () => {
    const ttf = woffCss.replace("format('woff')", "format('truetype')");
    expect(parseGoogleFontCss(ttf)).toBe(
      'https://fonts.gstatic.com/l/font?kit=abc&skey=def&v=v40',
    );
  });
});

describe('GOOGLE_FONT_LEGACY_UA', () => {
  it('is a pre-woff2 user agent, which is what makes Google serve woff', () => {
    // Google decides the format from the UA. Anything modern gets woff2, which Satori's
    // opentype fork cannot parse — so this string is load-bearing, not cosmetic.
    expect(GOOGLE_FONT_LEGACY_UA).toContain('AppleWebKit/534.30');
  });
});
