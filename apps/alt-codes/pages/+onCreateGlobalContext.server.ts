import type { GlobalContext } from 'vike/types';
import { loadUnicodeData } from './unicode-loader.server';

export function onCreateGlobalContext(globalContext: GlobalContext): void {
  globalContext.unicodeData = loadUnicodeData();
}
