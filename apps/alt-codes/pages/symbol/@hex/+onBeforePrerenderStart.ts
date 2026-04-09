// apps/alt-codes/pages/symbol/@hex/+onBeforePrerenderStart.ts
import type { OnBeforePrerenderStartSync } from 'vike/types';
import { loadUnicodeData } from '../../unicode-loader.server';

export const onBeforePrerenderStart: OnBeforePrerenderStartSync = (): ReturnType<OnBeforePrerenderStartSync> => {
  const { characters } = loadUnicodeData();
  const seen = new Set<number>();
  const urls: string[] = [];
  for (const entry of characters) {
    if (!seen.has(entry.codePoint)) {
      seen.add(entry.codePoint);
      const hexStr = entry.codePoint.toString(16).toUpperCase().padStart(4, '0');
      urls.push(`/symbol/${hexStr}`);
    }
  }
  return urls;
};
