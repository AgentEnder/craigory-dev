export {
  createPagefindClient,
  inspectCache,
  PagefindClient,
  printCacheInspection,
} from './pagefind.js';
export type { CacheInspection } from './pagefind.js';
export type {
  PagefindClientOptions,
  PagefindFilterMap,
  PagefindModule,
  PagefindResult,
  PagefindResultData,
  PagefindSearchOptions,
  PagefindSearchResponse,
} from './types.js';
export { pagefindCLI as cli };

import pagefindCLI from './cli.js';
export const sdk = pagefindCLI.sdk();
