import type { PageContextServer } from 'vike/types';
import type { GridEntry } from '../src/unicode-data';
import { HERO_CATEGORIES, toGridEntry } from '../src/unicode-data';

export type Data = {
  characters: GridEntry[];
};

export async function data(pageContext: PageContextServer): Promise<Data> {
  const characters = pageContext.globalContext.unicodeData.characters
    .filter(c => HERO_CATEGORIES.has(c.categoryId))
    .map(toGridEntry);
  return { characters };
}
