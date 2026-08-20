/**
 * Spotify provider — Web API with client-credentials auth.
 * OPTIONAL: without SPOTIFY_CLIENT_ID/SPOTIFY_CLIENT_SECRET this provider is
 * unavailable; search falls back to iTunes and Spotify links degrade to
 * search deep-links.
 */

import { scopedKey } from '../kv-scope';
import { fetchPublicPage } from './scrape/fetch-page';
import { parseSpotifyEmbed } from './scrape/spotify-embed';
import type {
  Env,
  MusicProvider,
  ResolvedMatch,
  SearchResult,
  Track,
} from '../types';
import { exactTrackLink, searchTrackLink } from './links';
import { normalizeArtist, normalizeTitle, pickBestMatch } from './matching';

const ACCOUNTS_TOKEN_URL = 'https://accounts.spotify.com/api/token';
const API_BASE = 'https://api.spotify.com/v1';
/** KV key for the cached client-credentials token. */
const TOKEN_KV_KEY = 'spotify:token';
/** Playlist import cap, per SPEC. */
const MAX_PLAYLIST_TRACKS = 100;

interface SpotifyImage {
  url: string;
  width?: number | null;
  height?: number | null;
}

interface SpotifyArtist {
  name?: string;
}

interface SpotifyAlbum {
  name?: string;
  release_date?: string;
  images?: SpotifyImage[];
}

interface SpotifyTrackObj {
  id?: string | null;
  name?: string;
  duration_ms?: number;
  is_local?: boolean;
  artists?: SpotifyArtist[];
  album?: SpotifyAlbum;
  external_ids?: { isrc?: string };
}

function artworkFrom(images: SpotifyImage[] | undefined): string | undefined {
  if (!images || images.length === 0) return undefined;
  // Prefer a mid-size image; Spotify sorts largest-first.
  const mid = images.find((i) => (i.width ?? 0) > 0 && (i.width ?? 0) <= 300);
  return (mid ?? images[images.length - 1] ?? images[0])?.url;
}

function mapTrack(t: SpotifyTrackObj, albumContext?: SpotifyAlbum): Track {
  const album = t.album ?? albumContext;
  const track: Track = {
    provider: 'spotify',
    id: t.id ?? '',
    title: t.name ?? '',
    artist: (t.artists ?? [])
      .map((a) => a.name)
      .filter(Boolean)
      .join(', '),
  };
  if (album?.name) track.album = album.name;
  if (album?.release_date) track.releaseDate = album.release_date;
  const artwork = artworkFrom(album?.images);
  if (artwork) track.artworkUrl = artwork;
  if (typeof t.duration_ms === 'number') track.durationMs = t.duration_ms;
  const isrc = t.external_ids?.isrc;
  if (isrc) track.isrc = isrc.toUpperCase();
  return track;
}

/**
 * Get a client-credentials token, cached in KV `CACHE` with an
 * `expirationTtl` of `expires_in - 60` seconds.
 */
async function getToken(env: Env): Promise<string> {
  const cached = await env.CACHE.get(scopedKey(env, TOKEN_KV_KEY));
  if (cached) return cached;

  const res = await fetch(ACCOUNTS_TOKEN_URL, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${btoa(
        `${env.SPOTIFY_CLIENT_ID}:${env.SPOTIFY_CLIENT_SECRET}`
      )}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });
  if (!res.ok) {
    throw new Error(`Spotify token request failed (${res.status})`);
  }
  const data = (await res.json()) as {
    access_token?: string;
    expires_in?: number;
  };
  if (!data.access_token) {
    throw new Error('Spotify token response missing access_token');
  }
  // KV minimum expirationTtl is 60s.
  const ttl = Math.max(60, (data.expires_in ?? 3600) - 60);
  await env.CACHE.put(scopedKey(env, TOKEN_KV_KEY), data.access_token, {
    expirationTtl: ttl,
  });
  return data.access_token;
}

async function apiGet<T>(env: Env, pathAndQuery: string): Promise<T> {
  let token = await getToken(env);
  let res = await fetch(`${API_BASE}${pathAndQuery}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (res.status === 401) {
    // Token expired/revoked early — refresh once and retry.
    await env.CACHE.delete(scopedKey(env, TOKEN_KV_KEY));
    token = await getToken(env);
    res = await fetch(`${API_BASE}${pathAndQuery}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }
  if (!res.ok) {
    throw new Error(`Spotify API error ${res.status} for ${pathAndQuery}`);
  }
  return (await res.json()) as T;
}

async function searchTracks(env: Env, q: string, limit: number): Promise<Track[]> {
  const data = await apiGet<{ tracks?: { items?: SpotifyTrackObj[] } }>(
    env,
    `/search?type=track&limit=${limit}&q=${encodeURIComponent(q)}`
  );
  return (data.tracks?.items ?? [])
    .filter((t) => t && t.id && !t.is_local)
    .map((t) => mapTrack(t));
}

async function getPlaylistTracks(
  env: Env,
  id: string
): Promise<{ title: string; tracks: Track[] }> {
  const meta = await apiGet<{ name?: string }>(
    env,
    `/playlists/${id}?fields=name`
  );
  const tracks: Track[] = [];
  const fields =
    'items(track(id,name,duration_ms,is_local,external_ids,artists(name),album(name,release_date,images))),next';
  let path: string | null =
    `/playlists/${id}/tracks?limit=100&fields=${encodeURIComponent(fields)}`;
  while (path && tracks.length < MAX_PLAYLIST_TRACKS) {
    const page: {
      items?: { track?: SpotifyTrackObj | null }[];
      next?: string | null;
    } = await apiGet(env, path);
    for (const item of page.items ?? []) {
      const t = item?.track;
      if (!t || !t.id || t.is_local) continue; // skip local/unavailable rows
      tracks.push(mapTrack(t));
      if (tracks.length >= MAX_PLAYLIST_TRACKS) break;
    }
    path = page.next ? page.next.replace(API_BASE, '') : null;
  }
  return { title: meta.name ?? 'Spotify playlist', tracks };
}

async function getAlbumTracks(
  env: Env,
  id: string
): Promise<{ title: string; tracks: Track[] }> {
  const album = await apiGet<{
    name?: string;
    release_date?: string;
    images?: SpotifyImage[];
    tracks?: { items?: SpotifyTrackObj[]; next?: string | null };
  }>(env, `/albums/${id}`);
  const albumContext: SpotifyAlbum = {
    name: album.name,
    release_date: album.release_date,
    images: album.images,
  };
  const tracks: Track[] = [];
  const collect = (items: SpotifyTrackObj[] | undefined): void => {
    for (const t of items ?? []) {
      if (!t || !t.id) continue;
      if (tracks.length >= MAX_PLAYLIST_TRACKS) return;
      tracks.push(mapTrack(t, albumContext));
    }
  };
  collect(album.tracks?.items);
  let next = album.tracks?.next ?? null;
  while (next && tracks.length < MAX_PLAYLIST_TRACKS) {
    const page: { items?: SpotifyTrackObj[]; next?: string | null } =
      await apiGet(env, next.replace(API_BASE, ''));
    collect(page.items);
    next = page.next ?? null;
  }
  return { title: album.name ?? 'Spotify album', tracks };
}

export const spotifyProvider: MusicProvider = {
  id: 'spotify',

  available(env: Env): boolean {
    return Boolean(env.SPOTIFY_CLIENT_ID && env.SPOTIFY_CLIENT_SECRET);
  },

  async search(env: Env, q: string, limit: number): Promise<SearchResult[]> {
    if (!this.available(env)) return [];
    return searchTracks(env, q, limit);
  },

  async getTrack(env: Env, id: string): Promise<Track | null> {
    if (!this.available(env)) return null;
    try {
      const t = await apiGet<SpotifyTrackObj>(env, `/tracks/${id}`);
      if (!t?.id) return null;
      return mapTrack(t); // ISRC captured from external_ids in mapTrack.
    } catch {
      return null;
    }
  },

  async resolve(env: Env, track: Track): Promise<ResolvedMatch> {
    if (track.provider === 'spotify') {
      return { link: exactTrackLink('spotify', track.id) };
    }
    const fallback = { link: searchTrackLink('spotify', track) };
    if (!this.available(env)) return fallback; // kind: 'search' deep link
    try {
      // ISRC search first: q=isrc:CODE.
      if (track.isrc) {
        const byIsrc = await searchTracks(env, `isrc:${track.isrc}`, 1);
        const hit = byIsrc[0];
        if (hit) return { link: exactTrackLink('spotify', hit.id), matched: hit };
      }
      // Normalized `title artist` search fallback.
      const q = `${normalizeTitle(track.title)} ${normalizeArtist(track.artist)}`.trim();
      if (q) {
        const candidates = await searchTracks(env, q, 5);
        const best = pickBestMatch(track, candidates);
        if (best) return { link: exactTrackLink('spotify', best.id), matched: best };
      }
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
    if (u.hostname !== 'open.spotify.com') return null;
    const segments = u.pathname.split('/').filter(Boolean);
    let i = 0;
    if (segments[i]?.startsWith('intl-')) i++; // locale prefix, e.g. /intl-de/
    if (segments[i] === 'embed') i++;
    const kind = segments[i];
    const id = segments[i + 1];
    if (
      (kind === 'playlist' || kind === 'album') &&
      id !== undefined &&
      /^[A-Za-z0-9]+$/.test(id)
    ) {
      return { playlistId: `${kind}:${id}` };
    }
    return null;
  },

  parseTrackUrl(url: string): { trackId: string } | null {
    let u: URL;
    try {
      u = new URL(url.trim());
    } catch {
      return null;
    }
    if (u.hostname !== 'open.spotify.com') return null;
    const segments = u.pathname.split('/').filter(Boolean);
    let i = 0;
    if (segments[i]?.startsWith('intl-')) i++; // locale prefix, e.g. /intl-de/
    if (segments[i] === 'embed') i++;
    const id = segments[i + 1];
    if (segments[i] !== 'track' || id === undefined) return null;
    return /^[A-Za-z0-9]+$/.test(id) ? { trackId: id } : null;
  },

  /**
   * API first when credentials exist — it is the only source of ISRC, which is
   * what makes cross-provider matching exact. The embed page is the fallback,
   * and the reason playlist import works with no credentials at all.
   */
  async getPlaylist(
    env: Env,
    playlistId: string
  ): Promise<{ title: string; tracks: Track[] } | null> {
    const sep = playlistId.indexOf(':');
    const kind = sep === -1 ? 'playlist' : playlistId.slice(0, sep);
    const id = sep === -1 ? playlistId : playlistId.slice(sep + 1);

    if (this.available(env)) {
      try {
        const viaApi =
          kind === 'album'
            ? await getAlbumTracks(env, id)
            : await getPlaylistTracks(env, id);
        if (viaApi) return viaApi;
      } catch {
        // Fall through to the embed page rather than failing the import.
      }
    }

    const html = await fetchPublicPage(
      `https://open.spotify.com/embed/${kind === 'album' ? 'album' : 'playlist'}/${encodeURIComponent(id)}`
    );
    return html ? parseSpotifyEmbed(html) : null;
  },
};
