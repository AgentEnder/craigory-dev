/**
 * Deezer provider — public JSON API, no auth required.
 *
 * Deezer earns its place as the lead search catalog for three reasons:
 * - keyless, so it works in every deploy (like iTunes, unlike Spotify);
 * - it indexes independent/distributor releases that Apple and MusicBrainz
 *   miss entirely (the covers-and-small-labels long tail);
 * - every `/search` row carries an `isrc` inline, which feeds the ISRC-first
 *   path in matching.ts. iTunes search results carry no ISRC, so before
 *   Deezer that path was mostly unreachable from a search-sourced track.
 *
 * Rate limit is ~50 requests per 5 seconds per IP and Workers share egress
 * IPs per PoP, so every route that touches Deezer must go through the
 * existing Cache API / KV memoization rather than calling it per keystroke.
 */

import type {
  Env,
  MusicProvider,
  ResolvedMatch,
  SearchResult,
  Track,
} from '../types';
import { exactTrackLink, searchTrackLink } from './links';
import { pickBestMatch } from './matching';

const API_BASE = 'https://api.deezer.com';
/** Playlist import cap, per SPEC. */
const MAX_PLAYLIST_TRACKS = 100;

interface DeezerArtist {
  name?: string;
}

interface DeezerAlbum {
  title?: string;
  cover_medium?: string;
  cover_big?: string;
  cover?: string;
  release_date?: string;
}

interface DeezerTrack {
  id?: number | string;
  readable?: boolean;
  title?: string;
  title_short?: string;
  isrc?: string;
  /** Seconds, not milliseconds. */
  duration?: number;
  release_date?: string;
  artist?: DeezerArtist;
  album?: DeezerAlbum;
}

/**
 * Deezer signals failure with a 200 + `{ error: { type, message } }` body
 * rather than an HTTP status, so every response must be inspected.
 */
interface DeezerError {
  error?: { type?: string; message?: string; code?: number };
}

function isUsableTrack(t: DeezerTrack): boolean {
  return (
    t.id !== undefined &&
    String(t.id).length > 0 &&
    typeof t.title === 'string' &&
    t.title.length > 0
  );
}

/** Prefer the 250px cover; fall back through the other sizes Deezer offers. */
function coverUrl(album: DeezerAlbum | undefined): string | undefined {
  const url = album?.cover_medium ?? album?.cover_big ?? album?.cover;
  // `cover` (unsized) points at an api.deezer.com redirect endpoint rather
  // than the CDN — usable, but only as a last resort.
  return url && url.length > 0 ? url : undefined;
}

export function mapDeezerTrack(t: DeezerTrack): Track {
  const track: Track = {
    provider: 'deezer',
    id: String(t.id ?? ''),
    title: t.title ?? '',
    artist: t.artist?.name ?? '',
  };
  if (t.album?.title) track.album = t.album.title;
  // `/search` rows omit release_date; `/track/:id` and playlist rows carry it.
  const released = t.release_date ?? t.album?.release_date;
  if (released) track.releaseDate = released.slice(0, 10);
  const artwork = coverUrl(t.album);
  if (artwork) track.artworkUrl = artwork;
  if (typeof t.duration === 'number' && t.duration > 0) {
    track.durationMs = t.duration * 1000; // Deezer reports whole seconds.
  }
  if (typeof t.isrc === 'string' && t.isrc.length > 0) {
    track.isrc = t.isrc.toUpperCase();
  }
  return track;
}

async function deezerGet<T>(pathAndQuery: string): Promise<T> {
  const res = await fetch(`${API_BASE}${pathAndQuery}`, {
    headers: { Accept: 'application/json' },
  });
  if (!res.ok) {
    throw new Error(`Deezer API error ${res.status} for ${pathAndQuery}`);
  }
  const data = (await res.json()) as T & DeezerError;
  if (data?.error) {
    throw new Error(
      `Deezer API error ${data.error.type ?? 'unknown'}: ${
        data.error.message ?? ''
      }`
    );
  }
  return data;
}

/**
 * Look a recording up by ISRC. Deezer's `/track/isrc:<code>` does NOT 404 on
 * an unknown code — it can return an unrelated track whose stored ISRC is
 * literally the string you asked for (placeholder codes exist in the
 * catalog), so the response's own `isrc` is verified before it is trusted.
 */
export async function deezerTrackByIsrc(isrc: string): Promise<Track | null> {
  const code = isrc.trim().toUpperCase();
  if (!/^[A-Z]{2}[A-Z0-9]{3}\d{7}$/.test(code)) return null;
  try {
    const t = await deezerGet<DeezerTrack>(
      `/track/isrc:${encodeURIComponent(code)}`
    );
    if (!isUsableTrack(t)) return null;
    if ((t.isrc ?? '').toUpperCase() !== code) return null;
    if (t.readable === false) return null;
    return mapDeezerTrack(t);
  } catch {
    return null;
  }
}

export const deezerProvider: MusicProvider = {
  id: 'deezer',

  // Keyless: the public API needs no credentials, so Deezer is always up.
  available(_env: Env): boolean {
    return true;
  },

  async search(_env: Env, q: string, limit: number): Promise<SearchResult[]> {
    const data = await deezerGet<{ data?: DeezerTrack[] }>(
      `/search?limit=${limit}&q=${encodeURIComponent(q)}`
    );
    return (data.data ?? []).filter(isUsableTrack).map(mapDeezerTrack);
  },

  async getTrack(_env: Env, id: string): Promise<Track | null> {
    try {
      const t = await deezerGet<DeezerTrack>(
        `/track/${encodeURIComponent(id)}`
      );
      return isUsableTrack(t) ? mapDeezerTrack(t) : null;
    } catch {
      return null;
    }
  },

  async resolve(env: Env, track: Track): Promise<ResolvedMatch> {
    if (track.provider === 'deezer') {
      return { link: exactTrackLink('deezer', track.id) };
    }
    const fallback = { link: searchTrackLink('deezer', track) };
    try {
      // ISRC first — an exact identity match beats any fuzzy scoring.
      if (track.isrc) {
        const byIsrc = await deezerTrackByIsrc(track.isrc);
        if (byIsrc) {
          return { link: exactTrackLink('deezer', byIsrc.id), matched: byIsrc };
        }
      }
      const q = `${track.artist} ${track.title}`.trim();
      if (!q) return fallback;
      const candidates = await this.search(env, q, 5);
      const best = pickBestMatch(track, candidates);
      if (best) return { link: exactTrackLink('deezer', best.id), matched: best };
    } catch {
      // Degrade to a search link — never throw from resolve.
    }
    return fallback;
  },

  parsePlaylistUrl(url: string): { playlistId: string } | null {
    let u: URL;
    try {
      u = new URL(url.trim());
    } catch {
      return null;
    }
    const host = u.hostname.replace(/^www\./, '');
    if (host !== 'deezer.com' && host !== 'deezer.page.link') return null;
    const segments = u.pathname.split('/').filter(Boolean);
    let i = 0;
    // Locale prefix, e.g. /us/playlist/123 or /fr/album/456.
    if (segments[i] && /^[a-z]{2}$/.test(segments[i]!)) i++;
    const kind = segments[i];
    const id = segments[i + 1];
    if ((kind === 'playlist' || kind === 'album') && id && /^\d+$/.test(id)) {
      return { playlistId: `${kind}:${id}` };
    }
    return null;
  },

  async getPlaylist(
    _env: Env,
    playlistId: string
  ): Promise<{ title: string; tracks: Track[] } | null> {
    const sep = playlistId.indexOf(':');
    const kind = sep === -1 ? 'playlist' : playlistId.slice(0, sep);
    const id = sep === -1 ? playlistId : playlistId.slice(sep + 1);
    const resource = kind === 'album' ? 'album' : 'playlist';
    try {
      const meta = await deezerGet<{
        title?: string;
        cover_medium?: string;
        cover_big?: string;
        tracks?: { data?: DeezerTrack[] };
      }>(`/${resource}/${encodeURIComponent(id)}`);
      const title =
        meta.title ?? (resource === 'album' ? 'Deezer album' : 'Deezer playlist');

      // The container response embeds the first page; page the rest via the
      // dedicated tracks endpoint until the cap.
      const tracks: Track[] = (meta.tracks?.data ?? [])
        .filter(isUsableTrack)
        .map(mapDeezerTrack)
        .slice(0, MAX_PLAYLIST_TRACKS);

      let index = tracks.length;
      while (tracks.length < MAX_PLAYLIST_TRACKS) {
        const page = await deezerGet<{ data?: DeezerTrack[]; next?: string }>(
          `/${resource}/${encodeURIComponent(id)}/tracks?index=${index}&limit=50`
        );
        const rows = (page.data ?? []).filter(isUsableTrack);
        if (rows.length === 0) break;
        for (const row of rows) {
          // Album track rows carry no `album` object of their own, so they
          // inherit the container's title and cover.
          if (resource === 'album' && !row.album) {
            row.album = {
              title: meta.title ?? '',
              cover_medium: meta.cover_medium ?? '',
              cover_big: meta.cover_big ?? '',
            };
          }
          tracks.push(mapDeezerTrack(row));
          if (tracks.length >= MAX_PLAYLIST_TRACKS) break;
        }
        index += rows.length;
        if (!page.next) break;
      }
      return { title, tracks };
    } catch {
      return null;
    }
  },
};
