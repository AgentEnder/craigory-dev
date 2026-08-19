/**
 * GET /api/song/:provider/:id → SongDetail
 *
 * Fetch source track, then resolve the other two providers concurrently via
 * matching.ts (ISRC first, then normalized `artist title` search). Per-provider
 * resolution is cached in KV inside `resolveTrackOnProvider`
 * (`match:<isrc-or-normkey>:<provider>`, 30 days); the full response is
 * Cache-API cached 24h. Provider failures degrade to `kind: 'search'` links —
 * never 500 the whole response. Links are always exactly 3, ordered
 * spotify, apple, youtube.
 */

import { Hono } from 'hono';
import type { Env, ProviderId, ProviderLink, SongDetail, Track } from '../types';
import { cacheJson } from '../cache';
import { getProvider, isProviderId } from '../providers/index';
import { resolveTrackOnProvider } from '../providers/matching';
import { exactTrackLink, searchTrackLink } from '../providers/links';

const SONG_CACHE_TTL_SECONDS = 24 * 60 * 60;

const PROVIDER_ORDER: ProviderId[] = ['spotify', 'apple', 'youtube'];

/** Thrown inside the cache producer so a 404 is never cached for 24h. */
class TrackNotFoundError extends Error {}

/**
 * Build the 3 provider links for a track: exact link for the source
 * provider (pure, no subrequest), concurrent cached resolution for the
 * other two, degrading any failure to a search link.
 */
async function buildTrackLinks(env: Env, track: Track): Promise<ProviderLink[]> {
  return Promise.all(
    PROVIDER_ORDER.map(async (target) => {
      if (target === track.provider) {
        return exactTrackLink(target, track.id);
      }
      try {
        // Uses the KV match cache (30-day TTL) internally; contract says it
        // never throws, but degrade defensively anyway.
        return await resolveTrackOnProvider(env, track, target);
      } catch (err) {
        console.error(`Resolve failed for ${target}:`, err);
        return searchTrackLink(target, track);
      }
    })
  );
}

export const songRoutes = new Hono<{ Bindings: Env }>();

songRoutes.get('/:provider/:id', async (c) => {
  const providerParam = c.req.param('provider');
  const id = c.req.param('id');
  if (!isProviderId(providerParam)) {
    return c.json({ error: `Unknown provider: ${providerParam}` }, 400);
  }
  const provider = getProvider(providerParam);
  if (!provider) {
    return c.json({ error: `Unknown provider: ${providerParam}` }, 400);
  }

  try {
    const detail = await cacheJson<SongDetail>(
      `song:${provider.id}:${id}`,
      SONG_CACHE_TTL_SECONDS,
      async () => {
        const track = await provider.getTrack(c.env, id);
        if (!track) {
          throw new TrackNotFoundError();
        }
        return { track, links: await buildTrackLinks(c.env, track) };
      }
    );
    return c.json(detail);
  } catch (err) {
    if (err instanceof TrackNotFoundError) {
      return c.json({ error: 'Track not found' }, 404);
    }
    console.error('Song lookup failed:', err);
    return c.json({ error: 'Failed to load track details' }, 502);
  }
});
