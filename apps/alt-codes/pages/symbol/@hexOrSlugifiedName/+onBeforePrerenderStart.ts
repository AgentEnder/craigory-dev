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
