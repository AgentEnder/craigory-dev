/**
 * Two-tier caching helpers.
 *
 * - Cache API (`caches.default`): free/unlimited (per-PoP) — used for
 *   high-volume, short-TTL responses (autocomplete, full song detail).
 * - KV (`env.CACHE`): long-lived per-song/per-provider resolution data only.
 *   KV free tier allows ~1k writes/day, so high-churn data must NOT go here.
 */

import { scopedKey } from './kv-scope';
import type { Env } from './types';

/**
 * Synthetic origin for Cache API keys. Cache API entries are keyed by
 * Request; we use `https://cache.justlisten.internal/<encoded key>` so cache
 * entries can never collide with real routes or assets.
 */
const CACHE_KEY_ORIGIN = 'https://cache.justlisten.internal/';

function cacheKeyRequest(key: string): Request {
  return new Request(CACHE_KEY_ORIGIN + encodeURIComponent(key));
}

/**
 * Cache-API-backed JSON memoizer. Returns the cached value for `key` when
 * present; otherwise runs `producer`, stores its JSON result with the given
 * TTL, and returns it. Errors thrown by `producer` propagate and nothing is
 * cached.
 */
export async function cacheJson<T>(
  key: string,
  ttlSeconds: number,
  producer: () => Promise<T>
): Promise<T> {
  const request = cacheKeyRequest(key);
  const hit = await caches.default.match(request);
  if (hit) {
    return (await hit.json()) as T;
  }
  const value = await producer();
  await caches.default.put(
    request,
    new Response(JSON.stringify(value), {
      headers: {
        'content-type': 'application/json',
        'cache-control': `public, max-age=${ttlSeconds}`,
      },
    })
  );
  return value;
}

/** Read a cached Response from the Cache API for the given key URL. */
export async function cacheGet(keyUrl: string): Promise<Response | null> {
  return (await caches.default.match(new Request(keyUrl))) ?? null;
}

/** Store a Response in the Cache API with the given TTL (seconds). */
export async function cachePut(
  keyUrl: string,
  response: Response,
  ttlSeconds: number
): Promise<void> {
  const headers = new Headers(response.headers);
  headers.set('cache-control', `public, max-age=${ttlSeconds}`);
  await caches.default.put(
    new Request(keyUrl),
    new Response(response.body, { status: response.status, headers })
  );
}

/** Read a JSON value from the long-lived KV cache. */
export async function kvGetJson<T>(env: Env, key: string): Promise<T | null> {
  return env.CACHE.get<T>(scopedKey(env, key), 'json');
}

/** Write a JSON value to the long-lived KV cache with a TTL (seconds). */
export async function kvPutJson(
  env: Env,
  key: string,
  value: unknown,
  expirationTtlSeconds: number
): Promise<void> {
  await env.CACHE.put(scopedKey(env, key), JSON.stringify(value), {
    expirationTtl: expirationTtlSeconds,
  });
}

/**
 * Build the KV key for a cross-provider match:
 * `match:<isrc-or-normkey>:<provider>` (TTL 30 days).
 */
export function matchCacheKey(isrcOrNormKey: string, provider: string): string {
  return `match:${isrcOrNormKey}:${provider}`;
}

/** 30 days, the TTL for `match:*` entries. */
export const MATCH_CACHE_TTL_SECONDS = 30 * 24 * 60 * 60;
