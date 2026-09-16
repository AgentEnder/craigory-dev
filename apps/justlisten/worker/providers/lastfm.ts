/**
 * Last.fm provider — the documented `ws.audioscrobbler.com/2.0/` API.
 *
 * Last.fm is not a streaming service, and that is exactly what it is good for
 * here: it is the scrobble ledger the other platforms report *into*, so it
 * knows about a recording whether or not any given catalog licenses it, and its
 * track page is where a listener goes for tags, similar tracks and play counts.
 * JustListen's job is pointing at the place you actually listen, and for a lot
 * of people that place is "wherever Last.fm says this is".
 *
 * Identity here is a *name pair*, not an id: Last.fm URLs are
 * `/music/<artist>/_/<track>` and its API is queried the same way, so this
 * provider's `Track.id` is the packed `<artist>~<title>` pair built by
 * `lastfmTrackId`.
 *
 * Every endpoint needs an API key — there is no keyless tier the way Deezer,
 * iTunes and Bandcamp have one — so with `LASTFM_API_KEY` unset this provider
 * reports unavailable and degrades to search links, exactly as Spotify and
 * YouTube do.
 */

import type {
  Env,
  MusicProvider,
  ResolvedMatch,
  SearchResult,
  Track,
} from '../types';
import {
  exactTrackLink,
  lastfmTrackId,
  parseLastfmTrackId,
  searchTrackLink,
} from './links';
import { normalizeArtist, normalizeTitle, pickBestMatch } from './matching';

const API_BASE = 'https://ws.audioscrobbler.com/2.0/';

/**
 * Last.fm serves this star graphic for every track with no cover of its own —
 * as a real URL, not as an empty field — so it has to be filtered by hash or
 * every unloved track arrives carrying "artwork" that is the same grey star.
 */
const PLACEHOLDER_ART = '2a96cdd8b46e442fc41c2b86b821562f';

interface LastfmImage {
  '#text'?: unknown;
  size?: unknown;
}

interface LastfmTrack {
  name?: unknown;
  artist?: unknown;
  url?: unknown;
  duration?: unknown;
  image?: unknown;
  album?: { title?: unknown; image?: unknown } | null;
}

function str(value: unknown): string | undefined {
  return typeof value === 'string' && value.length > 0 ? value : undefined;
}

/**
 * The artist name, which arrives as a bare string from `track.search` and as
 * `{ name }` from `track.getInfo`.
 */
function artistName(value: unknown): string | undefined {
  if (typeof value === 'string') return str(value);
  return str((value as { name?: unknown })?.name);
}

/**
 * Largest non-placeholder image. Last.fm's `image` array runs small → large,
 * so the last usable entry is the biggest.
 */
function imageUrl(value: unknown): string | undefined {
  if (!Array.isArray(value)) return undefined;
  let best: string | undefined;
  for (const entry of value as LastfmImage[]) {
    const url = str(entry['#text']);
    if (url && !url.includes(PLACEHOLDER_ART)) best = url;
  }
  return best;
}

/**
 * Last.fm's `duration` is milliseconds as a string on `track.getInfo`, and is
 * routinely `"0"` or absent — it is crowd-supplied, not measured — so only a
 * positive value is trusted. A zero would otherwise read as a real 0ms
 * duration and block every duration-guarded merge in `aggregate.ts`.
 */
function durationMs(value: unknown): number | undefined {
  const ms = typeof value === 'string' ? Number.parseInt(value, 10) : value;
  return typeof ms === 'number' && Number.isFinite(ms) && ms > 0
    ? ms
    : undefined;
}

function mapTrack(row: LastfmTrack): Track | undefined {
  const title = str(row.name);
  const artist = artistName(row.artist);
  if (!title || !artist) return undefined;

  const track: Track = {
    provider: 'lastfm',
    id: lastfmTrackId(artist, title),
    title,
    artist,
  };
  const album = str(row.album?.title);
  if (album) track.album = album;
  const artwork = imageUrl(row.album?.image) ?? imageUrl(row.image);
  if (artwork) track.artworkUrl = artwork;
  const ms = durationMs(row.duration);
  if (ms) track.durationMs = ms;
  return track;
}

async function lastfmGet<T>(
  env: Env,
  params: Record<string, string>
): Promise<T> {
  const query = new URLSearchParams({
    ...params,
    api_key: env.LASTFM_API_KEY ?? '',
    format: 'json',
  });
  const res = await fetch(`${API_BASE}?${query.toString()}`, {
    headers: { Accept: 'application/json' },
  });
  if (!res.ok) {
    throw new Error(`Last.fm API error ${res.status} for ${params['method']}`);
  }
  const data = (await res.json()) as T & { error?: number; message?: string };
  // Last.fm reports some failures as a 200 carrying `{ error, message }`.
  if (typeof data?.error === 'number') {
    throw new Error(`Last.fm API error ${data.error}: ${data.message ?? ''}`);
  }
  return data;
}

/** Last.fm returns a lone result as an object rather than a one-item array. */
function asArray<T>(value: unknown): T[] {
  if (Array.isArray(value)) return value as T[];
  return value && typeof value === 'object' ? [value as T] : [];
}

export const lastfmProvider: MusicProvider = {
  id: 'lastfm',

  available(env: Env): boolean {
    return Boolean(env.LASTFM_API_KEY);
  },

  async search(env: Env, q: string, limit: number): Promise<SearchResult[]> {
    const data = await lastfmGet<{
      results?: { trackmatches?: { track?: unknown } };
    }>(env, { method: 'track.search', track: q, limit: String(limit) });
    return asArray<LastfmTrack>(data.results?.trackmatches?.track)
      .map(mapTrack)
      .filter((track): track is SearchResult => Boolean(track))
      .slice(0, limit);
  },

  async getTrack(env: Env, id: string): Promise<Track | null> {
    if (!this.available(env)) return null;
    const parsed = parseLastfmTrackId(id);
    if (!parsed) return null;
    try {
      const data = await lastfmGet<{ track?: LastfmTrack }>(env, {
        method: 'track.getInfo',
        artist: parsed.artist,
        track: parsed.title,
        // Let Last.fm fix a misspelling or an alias into its canonical names,
        // which is also what makes the resulting `/music/…` URL resolve.
        autocorrect: '1',
      });
      return data.track ? (mapTrack(data.track) ?? null) : null;
    } catch {
      return null;
    }
  },

  /**
   * `track.getInfo` first, then `track.search`.
   *
   * The lookup is the cheaper and stricter of the two — Last.fm's identity
   * *is* artist + title, so asking for the exact pair (with `autocorrect`
   * handling aliases) either finds the recording or does not. Search is the
   * fallback for the cases where the source catalog's artist string differs
   * enough that the direct lookup misses, and it is scored like any other
   * catalog's rather than trusted by position.
   */
  async resolve(env: Env, track: Track): Promise<ResolvedMatch> {
    if (track.provider === 'lastfm') {
      return { link: exactTrackLink('lastfm', track.id) };
    }
    const fallback = { link: searchTrackLink('lastfm', track) };
    if (!this.available(env)) return fallback;
    if (!track.title || !track.artist) return fallback;

    try {
      const data = await lastfmGet<{ track?: LastfmTrack }>(env, {
        method: 'track.getInfo',
        artist: track.artist,
        track: track.title,
        autocorrect: '1',
      });
      const found = data.track ? mapTrack(data.track) : undefined;
      // Autocorrect can walk a long way from what was asked for, so the answer
      // is checked rather than accepted: an artist correction that changes who
      // the artist *is* would mean linking to someone else's song.
      if (
        found &&
        normalizeTitle(found.title) === normalizeTitle(track.title) &&
        normalizeArtist(found.artist) === normalizeArtist(track.artist)
      ) {
        return { link: exactTrackLink('lastfm', found.id), matched: found };
      }

      const candidates = await this.search(
        env,
        `${track.artist} ${track.title}`.trim(),
        5
      );
      const best = pickBestMatch(track, candidates);
      if (best) {
        return { link: exactTrackLink('lastfm', best.id), matched: best };
      }
    } catch {
      // Degrade to a search link — never throw from resolve.
    }
    return fallback;
  },

  /**
   * Last.fm has no importable collections. Its playlist API was retired years
   * ago, and what remains — a user's loved tracks, their scrobble history, a
   * tag's top tracks — is a personal feed behind an authenticated session
   * rather than a shareable track list.
   */
  parsePlaylistUrl(_url: string): { playlistId: string } | null {
    return null;
  },

  /** `last.fm/music/<artist>/_/<track>`, with or without a locale prefix. */
  parseTrackUrl(url: string): { trackId: string } | null {
    let parsed: URL;
    try {
      parsed = new URL(url.trim());
    } catch {
      return null;
    }
    if (parsed.hostname.replace(/^www\./, '') !== 'last.fm') return null;

    const segments = parsed.pathname.split('/').filter(Boolean);
    let i = 0;
    // Locale prefix on shared links, e.g. /ja/music/Queen/_/Bohemian+Rhapsody.
    if (segments[i] && /^[a-z]{2}$/.test(segments[i]!)) i++;
    // `_` is the album slot; anything else is an album page, not a track.
    if (segments[i] !== 'music' || segments[i + 2] !== '_') return null;

    const artist = decodePathSegment(segments[i + 1]);
    const title = decodePathSegment(segments[i + 3]);
    if (!artist || !title) return null;
    return { trackId: lastfmTrackId(artist, title) };
  },

  async getPlaylist(): Promise<{ title: string; tracks: Track[] } | null> {
    return null;
  },
};

/** Last.fm path segments are URL-encoded with `+` for spaces. */
function decodePathSegment(segment: string | undefined): string | undefined {
  if (!segment) return undefined;
  try {
    return decodeURIComponent(segment.replace(/\+/g, ' ')) || undefined;
  } catch {
    return segment.replace(/\+/g, ' ') || undefined;
  }
}
