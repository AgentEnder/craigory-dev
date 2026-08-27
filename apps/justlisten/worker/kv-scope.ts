/**
 * KV key namespacing for non-production Worker versions.
 *
 * Preview versions (`wrangler versions upload`) bind the *same* CACHE and
 * PLAYLISTS namespaces as production — separate namespaces would mean
 * provisioning and wiring a pair per environment. Instead the deploy target
 * injects `KV_PREFIX` (e.g. `pr-42`) as a version var, and every key this
 * Worker touches is prefixed with it.
 *
 * Reads are scoped as well as writes, so a preview sees only its own data:
 * it starts with a cold cache and an empty playlist store rather than
 * borrowing production's. Both key families already carry an `expirationTtl`
 * (7 days for playlists, 30 for matches), so a merged or abandoned PR's keys
 * evict themselves — there is nothing to clean up.
 *
 * Production sets no var, so `KV_PREFIX` is undefined and keys are unchanged.
 * That keeps existing production keys readable rather than orphaning them
 * behind a new prefix.
 */

import type { Env } from './types';

/** Prefix `key` with this deployment's KV scope, if it has one. */
export function scopedKey(env: Env, key: string): string {
  return env.KV_PREFIX ? `${env.KV_PREFIX}:${key}` : key;
}
