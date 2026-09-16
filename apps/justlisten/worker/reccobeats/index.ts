/**
 * ReccoBeats client — audio features, ISRC backfill, and recommendations.
 *
 * ReccoBeats is not a place to listen, which is why it is not a `MusicProvider`
 * and has no entry in `PROVIDER_IDS`: it has no player and no human-facing
 * track page, so a "Listen on ReccoBeats" button would go nowhere and a column
 * in the CSV export would always be empty. It is a metadata source that sits
 * *beside* the provider registry and enriches what the registry produces.
 *
 * It earns its place by supplying two things none of the seven providers do:
 *
 * - **Audio features.** Tempo, key, energy, danceability and the rest, on
 *   Spotify's own scales. Spotify deprecated its `/v1/audio-features` endpoint
 *   in November 2024 with no replacement, and ReccoBeats exists largely to fill
 *   that hole. The numbers are ReccoBeats' estimates, not Spotify's originals.
 * - **An ISRC for a Spotify track id.** This is the quieter win. The keyless
 *   Spotify path (the embed scrape) produces tracks with no ISRC at all, which
 *   SPEC.md already names as the reason those fall back to fuzzy title/artist/
 *   duration matching everywhere. One lookup turns them back into exact
 *   ISRC matches on Apple and Deezer.
 *
 * ## Lookup key: it is always a Spotify id
 *
 * ReccoBeats is keyed on a Spotify track id (or its own UUID). That sounds like
 * it limits this to Spotify-sourced tracks, but it does not: the song page has
 * *already* resolved a Spotify link for every track it renders, so a Deezer- or
 * Bandcamp-sourced recording reaches ReccoBeats through the Spotify id sitting
 * in its own resolved links. A track with no exact Spotify match gets no
 * features, which is the honest outcome — there is nothing to look up.
 *
 * ## No credentials, but a rate limit
 *
 * The API is free and unauthenticated. It is also rate-limited, with limits
 * ReccoBeats does not publish, answering 429 with a `Retry-After`. That header
 * is deliberately *not* honoured: a Worker cannot sit and wait inside a user's
 * request, and a song page that hangs to be polite about somebody else's quota
 * is a worse page. A 429 degrades to "no features" for this render.
 *
 * ## Unverified against the live API
 *
 * The network policy on the machine this was written on blocks
 * `api.reccobeats.com` outright (403 at the egress proxy), so no call below has
 * been executed against the real service — the paths and parameters come from
 * ReccoBeats' published docs and other public consumers. Every function here
 * returns null rather than throwing, and every caller treats null as "no
 * enrichment", so if a path is wrong the song page renders exactly as it did
 * before any of this existed. See `parse.ts` for how the response shape is
 * handled under the same uncertainty.
 */
import { kvGetJson, kvPutJson } from '../cache';
import type { AudioFeatures, Env, Track } from '../types';
import {
  parseFirstAudioFeatures,
  parseFirstReccoTrack,
  parseRecommendations,
} from './parse';

const API_BASE = 'https://api.reccobeats.com/v1';

/** Per-request ceiling. The features call is the slow one; keep it bounded. */
const REQUEST_TIMEOUT_MS = 4000;

/**
 * Audio features and ISRCs are immutable facts about a recording, so they get
 * the same 30-day TTL as the match cache rather than the song page's 24h memo.
 */
const RECCO_TTL_SECONDS = 30 * 24 * 60 * 60;

/**
 * A "ReccoBeats does not have this recording" answer is cached too, or a track
 * it has never heard of costs a request on every cold render forever. Shorter
 * than a hit, because its catalog grows and today's miss is next month's hit.
 */
const RECCO_MISS_TTL_SECONDS = 7 * 24 * 60 * 60;

/** How many "more like this" rows the song page asks for. */
export const RECOMMENDATION_COUNT = 6;

/** What one Spotify id resolves to, as cached. */
interface ReccoBundle {
  /** ReccoBeats UUID. */
  id: string;
  isrc?: string;
  features?: AudioFeatures;
}

/** The cache entry, which records a miss as well as a hit. */
type CachedBundle = { found: false } | ({ found: true } & ReccoBundle);

function bundleKey(spotifyId: string): string {
  return `recco:${spotifyId}`;
}

/**
 * Outcome of one request, distinguishing the two failures that must be cached
 * differently: ReccoBeats genuinely not knowing a track (durable — cache it)
 * from the service being unreachable or rate-limiting us (transient — cache
 * nothing, or a five-minute rate limit would suppress features for a week).
 */
type Fetched<T> =
  | { status: 'ok'; value: T }
  | { status: 'missing' }
  | { status: 'unavailable' };

async function reccoGet<T>(path: string): Promise<Fetched<T>> {
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
    if (res.status === 404) return { status: 'missing' };
    if (!res.ok) {
      // Includes 429. Transient by assumption: retrying is the caller's
      // problem on some future render, not this request's.
      console.error(`ReccoBeats ${res.status} for ${path}`);
      return { status: 'unavailable' };
    }
    return { status: 'ok', value: (await res.json()) as T };
  } catch (err) {
    // Timeout, DNS, TLS, malformed JSON — all the same to the caller.
    console.error(`ReccoBeats request failed for ${path}:`, err);
    return { status: 'unavailable' };
  }
}

/**
 * The ReccoBeats record for a Spotify track id: its UUID, its ISRC, and its
 * audio features, cached together under one key.
 *
 * One entry rather than three because all of it is immutable and all of it is
 * wanted at once — and because the same recording is reachable from seven
 * different `/song/:provider/:id` URLs, each with its own 24h Cache-API memo.
 * Keying on the Spotify id collapses those seven into one KV entry, so the
 * second platform's page costs a KV read instead of two more HTTP calls.
 *
 * Never throws. Returns null when ReccoBeats does not have the track, or when
 * it could not be reached.
 */
export async function reccoBundleForSpotifyId(
  env: Env,
  spotifyId: string
): Promise<ReccoBundle | null> {
  const key = bundleKey(spotifyId);
  try {
    const cached = await kvGetJson<CachedBundle>(env, key);
    if (cached) return cached.found ? cached : null;
  } catch {
    // Cache outage — fall through and ask upstream.
  }

  // `GET /v1/track?ids=<spotify id>`: ReccoBeats accepts Spotify ids here and
  // answers with its own row, including the UUID the other endpoints need.
  const lookup = await reccoGet<unknown>(
    `/track?ids=${encodeURIComponent(spotifyId)}`
  );
  if (lookup.status === 'unavailable') return null;

  const track =
    lookup.status === 'ok' ? parseFirstReccoTrack(lookup.value) : null;
  if (!track) {
    await writeBundle(env, key, { found: false }, RECCO_MISS_TTL_SECONDS);
    return null;
  }

  const bundle: ReccoBundle = { id: track.id };
  if (track.isrc) bundle.isrc = track.isrc;

  const features = await reccoGet<unknown>(
    `/track/${encodeURIComponent(track.id)}/audio-features`
  );
  if (features.status === 'ok') {
    const parsed = parseFirstAudioFeatures(features.value);
    if (parsed) bundle.features = parsed;
  } else if (features.status === 'unavailable') {
    // The id and ISRC are still good and worth keeping; only the features are
    // missing, and a shorter TTL lets a later render try for them again.
    await writeBundle(
      env,
      key,
      { found: true, ...bundle },
      RECCO_MISS_TTL_SECONDS
    );
    return bundle;
  }

  await writeBundle(env, key, { found: true, ...bundle }, RECCO_TTL_SECONDS);
  return bundle;
}

async function writeBundle(
  env: Env,
  key: string,
  value: CachedBundle,
  ttl: number
): Promise<void> {
  try {
    await kvPutJson(env, key, value, ttl);
  } catch {
    // Best-effort: a failed write costs a future cache hit, nothing more.
  }
}

/**
 * "More like this" for a ReccoBeats track id.
 *
 * Not KV-cached: unlike features and ISRCs these are a *model's* answer rather
 * than a fact about the recording, so they are allowed to move, and they ride
 * the song page's own 24-hour Cache-API memo instead. That also keeps the
 * recommendation call off KV's ~1k-writes/day budget, which the match cache
 * has a much stronger claim on.
 *
 * Rows come back as Spotify-provider tracks pointing at this app's own
 * `/song/spotify/:id`, so a list of six costs one request rather than six
 * resolutions — see `parseRecommendation`.
 */
export async function reccoRecommendations(
  reccoTrackId: string,
  seedSpotifyId: string | undefined,
  limit: number = RECOMMENDATION_COUNT
): Promise<Track[]> {
  // `GET /v1/track/recommendation?seeds=<uuid>&size=<n>`. Over-ask by one so
  // dropping the seed from its own recommendations cannot leave a short list.
  const res = await reccoGet<unknown>(
    `/track/recommendation?seeds=${encodeURIComponent(
      reccoTrackId
    )}&size=${limit + 1}`
  );
  if (res.status !== 'ok') return [];
  return parseRecommendations(res.value, seedSpotifyId, limit);
}
