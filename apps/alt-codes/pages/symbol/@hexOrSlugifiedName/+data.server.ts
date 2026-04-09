import type { PageContextServer } from 'vike/types';
import type { CharacterEntry, EncodingInfo } from '../../../src/unicode-data';
import { parseSymbolSlug } from '../../../src/unicode-data';
import { getEncodingInfo } from '../../unicode-loader.server';

export type SymbolData = {
  entry: CharacterEntry;
  encoding: EncodingInfo;
  blockNeighbors: CharacterEntry[];   // same category, near this codePoint
  relatedByName: CharacterEntry[];    // other entries sharing a word in name
};

export async function data(pageContext: PageContextServer): Promise<SymbolData> {
  const codePoint = parseSymbolSlug(pageContext.routeParams.hexOrSlugifiedName);
  const hexStr = codePoint.toString(16).toUpperCase().padStart(4, '0');
  const { byCodePoint, characters } = pageContext.globalContext.unicodeData;

  const entry = byCodePoint.get(codePoint);
  if (!entry) throw new Error(`No entry for U+${hexStr}`);

  const encoding = getEncodingInfo(codePoint);

  // Block neighbors: up to 6 chars before and after in same category
  const catChars = pageContext.globalContext.unicodeData.byCategory.get(entry.categoryId) ?? [];
  const idx = catChars.findIndex(c => c.codePoint === codePoint);
  const start = Math.max(0, idx - 6);
  const end = Math.min(catChars.length, idx + 7);
  const blockNeighbors = catChars.slice(start, end).filter(c => c.codePoint !== codePoint);

  // Related by name: find entries sharing a meaningful word (>=4 chars) in the name
  const words = entry.name.split(/\s+/).filter(w => w.length >= 4);
  const relatedByName: CharacterEntry[] = [];
  if (words.length > 0) {
    const seen = new Set<number>([codePoint]);
    for (const c of characters) {
      if (seen.has(c.codePoint)) continue;
      if (words.some(w => c.name.includes(w))) {
        seen.add(c.codePoint);
        relatedByName.push(c);
        if (relatedByName.length >= 12) break;
      }
    }
  }

  return { entry, encoding, blockNeighbors, relatedByName };
}
