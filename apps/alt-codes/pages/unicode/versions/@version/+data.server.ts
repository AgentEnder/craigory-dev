import type { PageContextServer } from 'vike/types';
import { categoryName } from '../../../../src/unicode-data';

export type VersionData = {
  version: string;
  total: number;
  categories: { id: string; name: string; count: number }[];
};

export async function data(pageContext: PageContextServer): Promise<VersionData> {
  const version = pageContext.routeParams.version;
  const entries = pageContext.globalContext.unicodeData.byVersion.get(version);
  if (!entries) throw new Error(`Unknown Unicode version: ${version}`);

  const counts = new Map<string, number>();
  for (const e of entries) counts.set(e.categoryId, (counts.get(e.categoryId) ?? 0) + 1);
  const categories = [...counts.entries()]
    .map(([id, count]) => ({ id, name: categoryName(id), count }))
    .sort((a, b) => b.count - a.count);

  return { version, total: entries.length, categories };
}
