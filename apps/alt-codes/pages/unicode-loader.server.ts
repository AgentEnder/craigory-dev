import unicodeNames from '@unicode/unicode-17.0.0/Names/index.js';
import controlAliases from '@unicode/unicode-17.0.0/Names/Control/index.js';
import correctionAliases from '@unicode/unicode-17.0.0/Names/Correction/index.js';
import abbreviationAliases from '@unicode/unicode-17.0.0/Names/Abbreviation/index.js';
import alternateAliases from '@unicode/unicode-17.0.0/Names/Alternate/index.js';

import { CP437_SPECIAL, type CharacterEntry, type UnicodeData } from '../src/unicode-data';

// CP437 bidirectional maps
const altToUnicode = new Map<number, number>();
for (const [altCode, cp] of CP437_SPECIAL) altToUnicode.set(altCode, cp);
for (let i = 32; i <= 126; i++) altToUnicode.set(i, i);
const unicodeToAlt = new Map<number, number>();
for (const [altCode, cp] of altToUnicode.entries()) unicodeToAlt.set(cp, altCode);

function getAliases(cp: number): string[] {
  const out: string[] = [];
  const ctrl = controlAliases[cp];
  if (ctrl) out.push(...ctrl);
  const corr = correctionAliases[cp];
  if (corr) out.push(...corr);
  const abbr = abbreviationAliases[cp];
  if (abbr) out.push(...abbr);
  const alt = alternateAliases[cp];
  if (alt) out.push(...alt);
  return out;
}

function makeEntry(codePoint: number, categoryId: string): CharacterEntry {
  return {
    codePoint,
    char: String.fromCodePoint(codePoint),
    hex: `U+${codePoint.toString(16).toUpperCase().padStart(4, '0')}`,
    decimal: codePoint,
    categoryId,
    altCode: unicodeToAlt.get(codePoint) ?? null,
    name: unicodeNames.get(codePoint) ?? '',
    aliases: getAliases(codePoint),
  };
}

function rangeEntries(start: number, end: number, categoryId: string): CharacterEntry[] {
  const out: CharacterEntry[] = [];
  for (let cp = start; cp <= end; cp++) out.push(makeEntry(cp, categoryId));
  return out;
}

export function loadUnicodeData(): UnicodeData {
  const altCodeEntries: CharacterEntry[] = [];
  for (let altCode = 1; altCode <= 254; altCode++) {
    const cp = altToUnicode.get(altCode);
    if (cp !== undefined) altCodeEntries.push(makeEntry(cp, 'alt-codes'));
  }

  const characters: CharacterEntry[] = [
    ...altCodeEntries,
    ...rangeEntries(0x0021, 0x007e, 'ascii'),
    ...rangeEntries(0x00a0, 0x00ff, 'latin-ext'),
    ...rangeEntries(0x20a0, 0x20cf, 'currency'),
    ...rangeEntries(0x2100, 0x214f, 'letterlike'),
    ...rangeEntries(0x2150, 0x218f, 'number-forms'),
    ...rangeEntries(0x2190, 0x21ff, 'arrows'),
    ...rangeEntries(0x2200, 0x22ff, 'math'),
    ...rangeEntries(0x2300, 0x23ff, 'technical'),
    ...rangeEntries(0x2500, 0x257f, 'box'),
    ...rangeEntries(0x2580, 0x259f, 'blocks'),
    ...rangeEntries(0x25a0, 0x25ff, 'geometric'),
    ...rangeEntries(0x2600, 0x26ff, 'symbols'),
    ...rangeEntries(0x2700, 0x27bf, 'dingbats'),
  ];

  const byCodePoint = new Map<number, CharacterEntry>();
  const byCategory = new Map<string, CharacterEntry[]>();

  for (const entry of characters) {
    if (!byCodePoint.has(entry.codePoint)) byCodePoint.set(entry.codePoint, entry);
    const cat = byCategory.get(entry.categoryId) ?? [];
    cat.push(entry);
    byCategory.set(entry.categoryId, cat);
  }

  return { characters, byCodePoint, byCategory };
}
