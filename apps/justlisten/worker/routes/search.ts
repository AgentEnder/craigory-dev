/**
 * GET /api/search?q=<text>&limit=8 → SearchResult[]
 *
 * Uses ONE metadata provider for autocomplete (Spotify if configured, else
 * iTunes) — never fans out to all providers per keystroke (cost/quota).
 * Cached with the Cache API (free/unlimited; never KV), TTL 3600s, keyed on
 * the normalized query + limit. 400 on empty/too-short q.
 */

import { Hono } from 'hono';
import type { Env, SearchResult } from '../types';
import { cacheJson } from '../cache';
import { getProvider } from '../providers/index';

const SEARCH_CACHE_TTL_SECONDS = 3600;
const DEFAULT_LIMIT = 8;
const MIN_QUERY_LENGTH = 2;

export const searchRoutes = new Hono<{ Bindings: Env }>();

searchRoutes.get('/', async (c) => {
  // Normalize: trim, collapse whitespace, lowercase — also the cache key, so
  // trivially-different keystroke queries share one upstream request.
  const q = (c.req.query('q') ?? '').trim().replace(/\s+/g, ' ').toLowerCase();
  if (!q) {
    return c.json({ error: 'Missing required query parameter: q' }, 400);
  }
  if (q.length < MIN_QUERY_LENGTH) {
    return c.json(
      { error: `Query must be at least ${MIN_QUERY_LENGTH} characters` },
      400
    );
  }

  const rawLimit = Number.parseInt(c.req.query('limit') ?? '', 10);
  const limit = Number.isNaN(rawLimit)
    ? DEFAULT_LIMIT
    : Math.min(10, Math.max(1, rawLimit));

  // ONE provider only: Spotify when credentials are configured, else iTunes
  // (which needs no credentials and is always available).
  const spotify = getProvider('spotify');
  const apple = getProvider('apple');
  const provider = spotify?.available(c.env) ? spotify : apple;
  if (!provider || !provider.available(c.env)) {
    return c.json({ error: 'No search provider is available' }, 503);
  }

  try {
    const results = await cacheJson<SearchResult[]>(
      `search:${limit}:${q}`,
      SEARCH_CACHE_TTL_SECONDS,
      () => provider.search(c.env, q, limit)
    );
    return c.json(results);
  } catch (err) {
    console.error('Search failed:', err);
    return c.json({ error: 'Search is temporarily unavailable' }, 502);
  }
});
