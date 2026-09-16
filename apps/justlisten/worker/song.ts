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
 *
 * ReccoBeats then enriches the result (see `reccobeats/index.ts`): an ISRC for
 * tracks that arrived without one, audio features, and recommendations. It is
 * not a provider — there is nowhere on ReccoBeats to listen — so it sits
 * outside the registry and every part of it is optional. All of it rides the
 * same 24h memo.
 */
import { cacheJson } from './cache';
import { exactTrackLink, searchTrackLink } from './providers/links';
import { resolveTrackOnProvider, seedSourceMatch } from './providers/matching';
import { getProvider, isProviderId } from './providers/index';
import { spotifyProvider } from './providers/spotify';
import {
  reccoBundleForSpotifyId,
  reccoRecommendations,
} from './reccobeats/index';
import type { Env, ProviderLink, ResolvedMatch, SongDetail, Track } from './types';
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
 * The Spotify track id for a recording, from its own id when it is a Spotify
 * track and otherwise from the exact Spotify link resolution just found.
 *
 * This is what makes ReccoBeats reachable for a Deezer- or Bandcamp-sourced
 * song: ReccoBeats is keyed on Spotify ids, and by this point the page has
 * already paid for a Spotify resolution. A search link yields nothing — it is
 * a query, not a track — which is the correct outcome, since there is no
 * recording for ReccoBeats to look up.
 */
function spotifyIdFor(
  track: Track,
  links: readonly ProviderLink[]
): string | undefined {
  if (track.provider === 'spotify') return track.id || undefined;
  const link = links.find(
    (candidate) => candidate.provider === 'spotify' && candidate.kind === 'exact'
  );
  return link ? (spotifyProvider.parseTrackUrl(link.url)?.trackId ?? undefined) : undefined;
}

/**
 * One provider link per entry in `PROVIDER_IDS`: an exact link for the source
 * provider (pure, no subrequest), concurrent cached resolution for the rest,
 * degrading any failure to a search link. Then ReccoBeats enrichment, which
 * never fails the page.
 */
async function resolveDetail(env: Env, sourceTrack: Track): Promise<SongDetail> {
  // ReccoBeats knows a track's ISRC given its Spotify id, and the keyless
  // Spotify path (the embed scrape) produces tracks carrying no ISRC at all —
  // which is why those fall back to fuzzy matching on every other platform.
  // Asking *before* resolution is the whole point: an ISRC in hand here turns
  // the six lookups below into exact identity matches instead of guesses.
  //
  // Only a Spotify-sourced track can be enriched this early, because only it
  // already has a Spotify id. Everything else has to wait for resolution to
  // produce one (see `spotifyIdFor`), by which point it is too late to help
  // this page's own matching — though it still lands in the 30-day KV entry
  // and helps the next render of the same recording.
  const sourceSpotifyId =
    sourceTrack.provider === 'spotify' ? sourceTrack.id || undefined : undefined;
  let bundle = sourceSpotifyId
    ? await reccoBundleForSpotifyId(env, sourceSpotifyId)
    : null;
  const track: Track =
    bundle?.isrc && !sourceTrack.isrc
      ? { ...sourceTrack, isrc: bundle.isrc }
      : sourceTrack;

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

  const links = results.map((result) => result.link);

  // Second chance at ReccoBeats for everything that was not Spotify-sourced:
  // resolution has just produced a Spotify id for it. A KV hit makes the
  // Spotify-sourced case above free rather than a repeat request.
  const spotifyId = spotifyIdFor(track, links);
  // `spotifyId !== sourceSpotifyId` matters on the failure path: when
  // ReccoBeats is unreachable the call above returns null, and without this
  // guard a Spotify-sourced track would ask the same dead endpoint for the
  // same id a second time on every render.
  if (!bundle && spotifyId && spotifyId !== sourceSpotifyId) {
    bundle = await reccoBundleForSpotifyId(env, spotifyId);
  }
  // Recommendations are the one call that is not cached in KV — they are a
  // model's answer rather than a fact, and they ride this page's own 24h memo.
  const similar = bundle
    ? await reccoRecommendations(bundle.id, spotifyId)
    : [];

  return {
    track: {
      ...track,
      artworkUrl:
        track.artworkUrl ?? matches.find((m) => m.artworkUrl)?.artworkUrl,
      isrc: track.isrc ?? bundle?.isrc ?? matches.find((m) => m.isrc)?.isrc,
      album: track.album ?? matches.find((m) => m.album)?.album,
    },
    links,
    // Omitted rather than sent empty: absent means "nothing to show", and the
    // page keys its sections off presence.
    ...(bundle?.features ? { audioFeatures: bundle.features } : {}),
    ...(similar.length > 0 ? { similar } : {}),
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
