import type { PageContextServer } from 'vike/types';
import { categoryName } from '../../../src/unicode-data';

export type VersionSummary = {
  version: string;
  total: number;
  categories: { id: string; name: string; count: number }[];
};

export type VersionsIndexData = {
  versions: VersionSummary[];
  latest: string;
};

export async function data(pageContext: PageContextServer): Promise<VersionsIndexData> {
  const { byVersion, versions } = pageContext.globalContext.unicodeData;
  const summaries = versions.map<VersionSummary>((version) => {
    const entries = byVersion.get(version) ?? [];
    const counts = new Map<string, number>();
    for (const e of entries) counts.set(e.categoryId, (counts.get(e.categoryId) ?? 0) + 1);
    const categories = [...counts.entries()]
      .map(([id, count]) => ({ id, name: categoryName(id), count }))
      .sort((a, b) => b.count - a.count);
    return { version, total: entries.length, categories };
  });
  return { versions: summaries, latest: versions[0] };
}
