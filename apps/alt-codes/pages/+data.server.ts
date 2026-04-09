import type { PageContextServer } from 'vike/types';
import type { CharacterEntry } from '../src/unicode-data';

export type Data = {
  characters: CharacterEntry[];
};

export async function data(pageContext: PageContextServer): Promise<Data> {
  return { characters: pageContext.globalContext.unicodeData.characters };
}
