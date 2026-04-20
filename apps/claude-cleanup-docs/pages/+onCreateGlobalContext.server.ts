import type { GlobalContext } from 'vike/types';

import { listPageIndex, type DocIndexEntry } from '../src/docs.server';

export function onCreateGlobalContext(globalContext: GlobalContext): void {
  globalContext.docsNav = listPageIndex();
}

declare global {
  namespace Vike {
    interface GlobalContext {
      docsNav: DocIndexEntry[];
    }
  }
}
