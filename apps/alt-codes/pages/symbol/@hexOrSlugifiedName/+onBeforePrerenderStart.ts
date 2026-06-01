import type { OnBeforePrerenderStartSync } from 'vike/types';
import { loadUnicodeData } from '../../unicode-loader.server';
import { toSymbolSlug, codePointsKey } from '../../../src/unicode-data';

export const onBeforePrerenderStart: OnBeforePrerenderStartSync = (): ReturnType<OnBeforePrerenderStartSync> => {
  const { characters } = loadUnicodeData();
  const seen = new Set<string>();
  const urls: string[] = [];
  for (const entry of characters) {
    // The CJK & Scripts bucket (12k+ glyphs) is rendered client-side via /glyph
    // instead — see pages/glyph. Prerendering it would balloon the static build.
    if (entry.categoryId === 'cjk-scripts') continue;
    const key = codePointsKey(entry.codePoints);
    if (!seen.has(key)) {
      seen.add(key);
      urls.push(`/symbol/${toSymbolSlug(entry)}`);
    }
  }
  return urls;
};
