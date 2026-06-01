import type { OnBeforePrerenderStartSync } from 'vike/types';
import { loadUnicodeData } from '../../../../unicode-loader.server';

export const onBeforePrerenderStart: OnBeforePrerenderStartSync = (): ReturnType<OnBeforePrerenderStartSync> => {
  const { byVersion } = loadUnicodeData();
  const urls: string[] = [];
  for (const [version, entries] of byVersion) {
    const categories = new Set(entries.map((e) => e.categoryId));
    for (const categoryId of categories) urls.push(`/unicode/versions/${version}/${categoryId}`);
  }
  return urls;
};
