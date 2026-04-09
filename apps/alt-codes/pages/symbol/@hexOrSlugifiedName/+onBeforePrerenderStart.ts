import type { OnBeforePrerenderStartSync } from 'vike/types';
import { loadUnicodeData } from '../../unicode-loader.server';
import { toSymbolSlug } from '../../../src/unicode-data';

export const onBeforePrerenderStart: OnBeforePrerenderStartSync = (): ReturnType<OnBeforePrerenderStartSync> => {
  const { characters } = loadUnicodeData();
  const seen = new Set<number>();
  const urls: string[] = [];
  for (const entry of characters) {
    if (!seen.has(entry.codePoint)) {
      seen.add(entry.codePoint);
      urls.push(`/symbol/${toSymbolSlug(entry)}`);
    }
  }
  return urls;
};
