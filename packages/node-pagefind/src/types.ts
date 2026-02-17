export interface PagefindClientOptions {
  /** Path to a locally built site directory containing pagefind/ */
  localPath?: string;
  /** Base URL of a remote site to query */
  baseUrl?: string;
  /** Custom cache directory for downloaded pagefind.js — bypasses version-based caching */
  cachePath?: string;
  /** Log fetch events and cache details to stderr */
  verbose?: boolean;
  /** Skip all caching — always fetch from remote */
  skipCache?: boolean;
}

export interface PagefindSearchOptions {
  /** Language code for the search index */
  language?: string;
  /** Whether to include excerpts in results */
  excerpt?: boolean;
  /** Maximum number of results to return */
  limit?: number;
  /** Pagefind filter object */
  filters?: Record<string, string | string[]>;
}

export interface PagefindResultData {
  url: string;
  excerpt: string;
  meta: Record<string, string>;
  content: string;
  word_count: number;
  filters: Record<string, string[]>;
  sub_results: Array<{
    title: string;
    url: string;
    excerpt: string;
  }>;
}

export interface PagefindResult {
  id: string;
  score: number;
  data: () => Promise<PagefindResultData>;
}

export interface PagefindSearchResponse {
  results: PagefindResult[];
  unfilteredResultCount: number;
  filters: Record<string, Record<string, number>>;
  totalFilters: Record<string, Record<string, number>>;
  timings: {
    preload: number;
    search: number;
    total: number;
  };
}

export type PagefindFilterMap = Record<string, Record<string, number>>;

export interface PagefindModule {
  options: (opts: { basePath: string; baseUrl: string }) => void;
  init: (language?: string) => Promise<void>;
  search: (
    query: string,
    options?: { filters?: Record<string, string | string[]> }
  ) => Promise<PagefindSearchResponse>;
  filters: () => Promise<PagefindFilterMap>;
}
