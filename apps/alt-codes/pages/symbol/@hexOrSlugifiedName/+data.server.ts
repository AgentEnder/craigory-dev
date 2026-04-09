import type { PageContextServer } from 'vike/types';
import type { CharacterEntry, EncodingInfo } from '../../../src/unicode-data';
import { parseSymbolSlug, codePointsKey, CATEGORIES } from '../../../src/unicode-data';
import { getEncodingInfo } from '../../unicode-loader.server';

export type SymbolData = {
  entry: CharacterEntry;
  categoryName: string;
  encoding: EncodingInfo;
  blockNeighbors: CharacterEntry[];
  relatedByName: CharacterEntry[];
};

// Words too common in Unicode names to be useful signals
const STOP_WORDS = new Set([
  'BLACK', 'WHITE', 'WITH', 'SIGN', 'SYMBOL', 'LETTER', 'DIGIT',
  'SMALL', 'CAPITAL', 'LATIN', 'COMBINING', 'MODIFIER', 'ABOVE', 'BELOW',
  'LEFT', 'RIGHT', 'UPPER', 'LOWER', 'AND', 'FOR', 'THE', 'MARK', 'LINE',
  'DOUBLE', 'HEAVY', 'LIGHT', 'MEDIUM', 'WIDE', 'NARROW', 'REVERSE',
  'DOTTED', 'DASHED', 'SOLID', 'OPEN',
]);

function nameKeywords(name: string): string[] {
  return name
    .split(/\s+/)
    .map(w => w.toUpperCase())
    .filter(w => w.length >= 3 && !STOP_WORDS.has(w));
}

function relatedScore(candidate: CharacterEntry, keywords: string[], firstCodePoint: number): number {
  const nameUpper = candidate.name.toUpperCase();
  const matches = keywords.filter(kw => nameUpper.includes(kw)).length;
  if (matches === 0) return 0;
  const cpDist = Math.abs(candidate.codePoints[0] - firstCodePoint);
  return matches * 100 + Math.max(0, 50 - Math.floor(cpDist / 20));
}

export async function data(pageContext: PageContextServer): Promise<SymbolData> {
  const codePoints = parseSymbolSlug(pageContext.routeParams.hexOrSlugifiedName);
  const key = codePointsKey(codePoints);
  const { byCodePoints, byCategory, characters } = pageContext.globalContext.unicodeData;

  const entry = byCodePoints.get(key);
  if (!entry) throw new Error(`No entry for key: ${key}`);

  const categoryName = CATEGORIES.find(c => c.id === entry.categoryId)?.name ?? entry.categoryId;
  const encoding = getEncodingInfo(entry.codePoints);

  // Block neighbors: up to 8 chars before and after in same category
  const catChars = byCategory.get(entry.categoryId) ?? [];
  const idx = catChars.findIndex(c => codePointsKey(c.codePoints) === key);
  const start = Math.max(0, idx - 8);
  const end = Math.min(catChars.length, idx + 9);
  const blockNeighbors = catChars.slice(start, end).filter(c => codePointsKey(c.codePoints) !== key);

  // Related by name: scored by meaningful word overlap + code-point proximity
  const keywords = nameKeywords(entry.name);
  const relatedByName: CharacterEntry[] = [];
  if (keywords.length > 0) {
    const seen = new Set<string>([key]);
    const scored: Array<{ entry: CharacterEntry; score: number }> = [];
    for (const c of characters) {
      const cKey = codePointsKey(c.codePoints);
      if (seen.has(cKey) || !c.name) continue;
      const score = relatedScore(c, keywords, codePoints[0]);
      if (score > 0) {
        seen.add(cKey);
        scored.push({ entry: c, score });
      }
    }
    scored.sort((a, b) => b.score - a.score);
    relatedByName.push(...scored.slice(0, 16).map(s => s.entry));
  }

  return { entry, categoryName, encoding, blockNeighbors, relatedByName };
}
