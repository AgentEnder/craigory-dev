/**
 * MusicBrainz client — the keyless cross-platform id oracle.
 *
 * ## The problem it solves
 *
 * In a zero-credential deployment, five of the seven providers can never
 * produce an exact link. Spotify, YouTube and Last.fm all return a search link
 * the moment `available(env)` is false; Pandora has no API to call at all; and
 * Bandcamp's raised threshold means it rarely claims a mainstream recording.
 * That leaves Apple and Deezer — and on a page reached from a Deezer search,
 * Deezer's link costs no network at all, so the page can look like it found
 * exactly one real link.
 *
 * MusicBrainz is the only way out of that without asking anyone for an API key.
 * It is keyless, documented, and stable (not a scrape), and a recording's
 * URL relationships are precisely the mapping the other six providers are being
 * asked to guess at.
 *
 * ## Why it can be trusted where a search cannot
 *
 * Lookups are by **ISRC**, so identity is asserted by the recording code rather
 * than inferred from a title and a duration. There is no scoring step and no
 * threshold, because there is nothing to disambiguate: the ISRC either names
 * this recording or it does not. That is also why this only runs for tracks
 * that carry an ISRC — every Deezer row does, which is the common case here,
 * and `reccobeats` backfills ISRCs onto Spotify-sourced tracks that lack one.
 *
 * ## Coverage
 *
 * The relationships are editor-contributed, so coverage is uneven — good on
 * well-known releases, thin on the long tail, and better for free streaming
 * (YouTube) than for subscription services. It supplements resolution rather
 * than replacing it: `song.ts` calls this only for providers that already came
 * back with a search link, and keeps whatever the providers themselves found.
 *
 * ## Rate limit
 *
 * MusicBrainz allows roughly **one request per second per IP** and requires a
 * descriptive User-Agent identifying the application and a contact — an
 * anonymous or browser-spoofing client is liable to be blocked outright, which
 * is the opposite of the accommodation `scrape/fetch-page.ts` makes for pages
 * that want to look like a browser. Volume here is naturally tiny: one request
 * per recording per 30 days, behind both the KV cache below and the song page's
 * own 24h memo.
 *
 * ## Unverified from the build machine
 *
 * As with ReccoBeats, the network policy where this was written blocks
 * `musicbrainz.org`, so no call below has been run against the live service.
 * Unlike ReccoBeats this is a long-stable documented API rather than a guess,
 * but the same defensive posture applies: every field optional, every failure
 * returning an empty result, and the mapping itself covered by fixture tests.
 */
import { kvGetJson, kvPutJson } from '../cache';
import type { Env, ProviderLink } from '../types';
import { linksFromIsrcLookup } from './parse';

const API_BASE = 'https://musicbrainz.org/ws/2';

/**
 * MusicBrainz asks every client to identify itself and provide a contact, and
 * enforces it — this is not the browser-impersonating UA the page scrapers use,
 * and must not be replaced with one.
 */
const USER_AGENT =
  'JustListen/1.0 ( https://github.com/AgentEnder/craigory-dev )';

/** Bounded so a slow oracle cannot hold up a song page. */
const REQUEST_TIMEOUT_MS = 4000;

/** A recording's URL relationships do not change often. */
const MB_TTL_SECONDS = 30 * 24 * 60 * 60;

/**
 * Misses are cached for a week rather than a month: an unlinked recording is
 * exactly the kind of gap an editor fills, so re-asking sooner is worthwhile.
 */
const MB_MISS_TTL_SECONDS = 7 * 24 * 60 * 60;

/** Cached as an array so an empty result is a hit, not a miss. */
type CachedLinks = { links: ProviderLink[] };

function isrcKey(isrc: string): string {
  return `mb:isrc:${isrc.toUpperCase()}`;
}

/**
 * Exact provider links MusicBrainz knows for an ISRC, or an empty array.
 *
 * Never throws: a MusicBrainz outage, a rate limit, or an unparseable response
 * all mean "no extra links", and the caller keeps whatever resolution found.
 */
export async function musicbrainzLinksForIsrc(
  env: Env,
  isrc: string
): Promise<ProviderLink[]> {
  const code = isrc.trim().toUpperCase();
  if (!/^[A-Z]{2}[A-Z0-9]{3}\d{7}$/.test(code)) return [];

  const key = isrcKey(code);
  try {
    const cached = await kvGetJson<CachedLinks>(env, key);
    // An empty array is a real answer — "MusicBrainz has nothing for this" —
    // and must not be retried until the miss TTL expires.
    if (cached && Array.isArray(cached.links)) return cached.links;
  } catch {
    // Cache outage — ask upstream.
  }

  let links: ProviderLink[];
  try {
    // `inc=url-rels` is what carries the streaming relationships; without it
    // the response is just recording titles and buys nothing.
    const res = await fetch(
      `${API_BASE}/isrc/${encodeURIComponent(code)}?inc=url-rels&fmt=json`,
      {
        headers: { Accept: 'application/json', 'User-Agent': USER_AGENT },
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      }
    );
    if (res.status === 404) {
      // MusicBrainz does not know this ISRC. Durable enough to cache.
      await writeLinks(env, key, [], MB_MISS_TTL_SECONDS);
      return [];
    }
    if (!res.ok) {
      // 503 is how MusicBrainz reports rate limiting. Transient, so nothing is
      // cached — caching it would suppress the oracle for a month over a
      // momentary burst.
      console.error(`MusicBrainz ${res.status} for ISRC ${code}`);
      return [];
    }
    links = linksFromIsrcLookup(await res.json());
  } catch (err) {
    console.error(`MusicBrainz lookup failed for ISRC ${code}:`, err);
    return [];
  }

  await writeLinks(
    env,
    key,
    links,
    links.length > 0 ? MB_TTL_SECONDS : MB_MISS_TTL_SECONDS
  );
  return links;
}

async function writeLinks(
  env: Env,
  key: string,
  links: ProviderLink[],
  ttl: number
): Promise<void> {
  try {
    await kvPutJson(env, key, { links }, ttl);
  } catch {
    // Best-effort: a failed write costs a future cache hit, nothing more.
  }
}
