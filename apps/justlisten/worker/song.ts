/**
 * Song detail loading, shared by the SSR data hook for /song/@provider/@id.
 *
 * Fetches the source track, then resolves the other providers concurrently via
 * matching.ts (ISRC first, then normalized `artist title` search). Per-provider
 * resolution is cached in KV inside `resolveTrackOnProvider`
 * (`match:<isrc-or-normkey>:<provider>`, 30 days); the assembled detail is
 * Cache-API cached 24h. Provider failures degrade to `kind: 'search'` links —
 * a failed lookup never fails the page. Links are always one per provider, in
 * `PROVIDER_IDS` order.
 */
import { cacheJson } from './cache';
import { exactTrackLink, searchTrackLink } from './providers/links';
import { resolveTrackOnProvider, seedSourceMatch } from './providers/matching';
import { getProvider, isProviderId } from './providers/index';
import type { Env, ResolvedMatch, SongDetail, Track } from './types';
import { PROVIDER_IDS } from './types';

const SONG_CACHE_TTL_SECONDS = 24 * 60 * 60;

/** Thrown inside the cache producer so a 404 is never cached for 24h. */
class TrackNotFoundError extends Error {}

/** Raised for an unusable `:provider` route param. */
export class UnknownProviderError extends Error {
  constructor(provider: string) {
    super(`Unknown provider: ${provider}`);
    this.name = 'UnknownProviderError';
  }
}

/**
 * One provider link per entry in `PROVIDER_IDS`: an exact link for the source
 * provider (pure, no subrequest), concurrent cached resolution for the rest,
 * degrading any failure to a search link.
 */
async function resolveDetail(env: Env, track: Track): Promise<SongDetail> {
  const [results] = await Promise.all([
    Promise.all(
      PROVIDER_IDS.map(async (target): Promise<ResolvedMatch> => {
        if (target === track.provider) {
          return { link: exactTrackLink(target, track.id) };
        }
        try {
          // Uses the KV match cache (30-day TTL) internally; contract says it
          // never throws, but degrade defensively anyway.
          return await resolveTrackOnProvider(env, track, target);
        } catch (err) {
          console.error(`Resolve failed for ${target}:`, err);
          return { link: searchTrackLink(target, track) };
        }
      })
    ),
    // Record this provider's own id for the recording, so a later view sourced
    // from a different catalog gets an exact link here instead of a search
    // box — including for platforms we hold no credentials for. Runs only on a
    // Cache-API miss (see the 24h `cacheJson` around this), so it cannot churn
    // KV's ~1k writes/day.
    seedSourceMatch(env, track),
  ]);

  // Fill gaps from whichever catalog matched: a track scraped off Spotify's
  // embed page has no artwork and no ISRC, but the iTunes or Deezer record we
  // just matched against does.
  const matches = results
    .map((result) => result.matched)
    .filter((match): match is Track => Boolean(match));

  return {
    track: {
      ...track,
      artworkUrl:
        track.artworkUrl ?? matches.find((m) => m.artworkUrl)?.artworkUrl,
      isrc: track.isrc ?? matches.find((m) => m.isrc)?.isrc,
      album: track.album ?? matches.find((m) => m.album)?.album,
    },
    links: results.map((result) => result.link),
  };
}

/**
 * Resolve a song and its cross-provider links.
 *
 * Returns null when the provider has no such track — the caller renders a 404
 * rather than an error, and the miss is not cached.
 *
 * @throws UnknownProviderError when `providerParam` names no known provider.
 */
export async function loadSongDetail(
  env: Env,
  providerParam: string,
  id: string
): Promise<SongDetail | null> {
  if (!isProviderId(providerParam)) {
    throw new UnknownProviderError(providerParam);
  }
  const provider = getProvider(providerParam);
  if (!provider) {
    throw new UnknownProviderError(providerParam);
  }

  try {
    return await cacheJson<SongDetail>(
      `song:${provider.id}:${id}`,
      SONG_CACHE_TTL_SECONDS,
      async () => {
        const track = await provider.getTrack(env, id);
        if (!track) {
          throw new TrackNotFoundError();
        }
        return resolveDetail(env, track);
      }
    );
  } catch (err) {
    if (err instanceof TrackNotFoundError) return null;
    throw err;
  }
}
