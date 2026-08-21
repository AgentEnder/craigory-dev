/**
 * GET /api/search?q=<text>&limit=8      → SearchResult[]        (autocomplete)
 * GET /api/search/all?q=<text>&limit=25 → AggregatedSearch      (search page)
 *
 * Autocomplete uses ONE metadata provider — never fans out per keystroke
 * (cost/quota). The full search page is user-initiated rather than
 * per-keystroke, so it may fan out across every searchable catalog and merge
 * the results. Neither path ever touches the YouTube Data API, whose
 * `search.list` costs 100 of a 10,000-unit daily quota.
 *
 * Both are cached with the Cache API (free/unlimited; never KV), keyed on the
 * normalized query + limit.
 */

import { Hono } from 'hono';
import type { AggregatedSearch, Env, SearchResult } from '../types';
import { cacheJson } from '../cache';
import { searchCatalogs } from '../providers/index';
import { mergeCatalogResults, type CatalogResults } from '../providers/aggregate';
import { seedAggregateMatches } from '../providers/matching';

const SEARCH_CACHE_TTL_SECONDS = 3600;
/**
 * The aggregate costs one upstream request per catalog, so it is cached
 * longer than autocomplete — it also shields Deezer's ~50-request/5s per-IP
 * limit, which Workers hit from shared per-PoP egress addresses.
 */
const AGGREGATE_CACHE_TTL_SECONDS = 6 * 60 * 60;
const DEFAULT_LIMIT = 8;
const DEFAULT_AGGREGATE_LIMIT = 25;
const MIN_QUERY_LENGTH = 2;

export const searchRoutes = new Hono<{ Bindings: Env }>();

/**
 * Normalize a raw `q`: trim, collapse whitespace, lowercase. Also the cache
 * key, so trivially-different keystroke queries share one upstream request.
 */
function normalizeQuery(raw: string | undefined): string {
  return (raw ?? '').trim().replace(/\s+/g, ' ').toLowerCase();
}

function parseLimit(raw: string | undefined, fallback: number, max: number) {
  const parsed = Number.parseInt(raw ?? '', 10);
  return Number.isNaN(parsed) ? fallback : Math.min(max, Math.max(1, parsed));
}

/** Shared 400s for both endpoints; null when the query is acceptable. */
function queryError(q: string): string | null {
  if (!q) return 'Missing required query parameter: q';
  if (q.length < MIN_QUERY_LENGTH) {
    return `Query must be at least ${MIN_QUERY_LENGTH} characters`;
  }
  return null;
}

searchRoutes.get('/all', async (c) => {
  const q = normalizeQuery(c.req.query('q'));
  const error = queryError(q);
  if (error) return c.json({ error }, 400);

  const limit = parseLimit(c.req.query('limit'), DEFAULT_AGGREGATE_LIMIT, 50);
  // Over-fetch per catalog so the merge has duplicates to collapse and still
  // fills `limit` rows afterwards.
  const perCatalog = Math.min(25, limit);

  try {
    const aggregate = await cacheJson<AggregatedSearch>(
      `search-all:${limit}:${q}`,
      AGGREGATE_CACHE_TTL_SECONDS,
      async () => {
        // Concurrent: one catalog erroring or being unconfigured must not
        // deny the user the others' results.
        const settled = await Promise.all(
          searchCatalogs.map(async (provider) => {
            if (!provider.available(c.env)) {
              return {
                status: {
                  provider: provider.id,
                  available: false,
                  ok: false,
                  count: 0,
                },
                results: [] as SearchResult[],
              };
            }
            try {
              const results = await provider.search(c.env, q, perCatalog);
              return {
                status: {
                  provider: provider.id,
                  available: true,
                  ok: true,
                  count: results.length,
                },
                results,
              };
            } catch (err) {
              console.error(`Search failed for ${provider.id}:`, err);
              return {
                status: {
                  provider: provider.id,
                  available: true,
                  ok: false,
                  count: 0,
                },
                results: [] as SearchResult[],
              };
            }
          })
        );

        const catalogResults: CatalogResults[] = settled.map((s) => ({
          provider: s.status.provider,
          results: s.results,
        }));
        const results = mergeCatalogResults(catalogResults, limit);

        // The merge just established which catalogs carry each recording, and
        // under which native id — the exact mapping the match cache holds, for
        // free. Keep it, so a later song page can offer a direct link to a
        // platform this deployment holds no credentials for.
        //
        // Inside the cache producer on purpose: this runs once per distinct
        // query per 6h, not per search. Writes are net-new only, so a warm
        // catalog costs nothing. Autocomplete is deliberately excluded — it
        // queries one catalog, so it learns no cross-provider mapping, and it
        // fires far more often.
        await seedAggregateMatches(c.env, results);

        return {
          query: q,
          results,
          catalogs: settled.map((s) => s.status),
        };
      }
    );
    return c.json(aggregate);
  } catch (err) {
    console.error('Aggregate search failed:', err);
    return c.json({ error: 'Search is temporarily unavailable' }, 502);
  }
});

searchRoutes.get('/', async (c) => {
  const q = normalizeQuery(c.req.query('q'));
  const error = queryError(q);
  if (error) return c.json({ error }, 400);

  const limit = parseLimit(c.req.query('limit'), DEFAULT_LIMIT, 10);

  // ONE catalog only, in `SEARCH_CATALOG_IDS` preference order: Deezer leads
  // because it is keyless (so autocomplete works in a zero-secret deploy),
  // indexes the independent long tail the other catalogs miss, and returns an
  // ISRC on every row — which the song page then resolves from exactly.
  const provider = searchCatalogs.find((p) => p.available(c.env));
  if (!provider) {
    return c.json({ error: 'No search provider is available' }, 503);
  }

  try {
    const results = await cacheJson<SearchResult[]>(
      `search:${provider.id}:${limit}:${q}`,
      SEARCH_CACHE_TTL_SECONDS,
      () => provider.search(c.env, q, limit)
    );
    return c.json(results);
  } catch (err) {
    console.error('Search failed:', err);
    return c.json({ error: 'Search is temporarily unavailable' }, 502);
  }
});
