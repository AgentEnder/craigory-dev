/**
 * Apple Music provider — iTunes Search API (no auth required).
 * Always available; the app works with zero secrets thanks to this provider.
 *
 * Playlist import scrapes the public music.apple.com playlist page's embedded
 * serialized JSON (no MusicKit token). That markup is not a stable API, so
 * parsing is defensive: any failure returns null and the route layer 422s
 * per SPEC.
 */

import type { Env, MusicProvider, ProviderLink, ResolvedMatch, SearchResult, Track } from '../types';
import { exactTrackLink, searchTrackLink } from './links';
import { pickBestMatch } from './matching';

const ITUNES_BASE = 'https://itunes.apple.com';
/** Playlist import cap, per SPEC. */
const MAX_PLAYLIST_TRACKS = 100;

interface ITunesResult {
  wrapperType?: string;
  kind?: string;
  trackId?: number;
  trackName?: string;
  artistName?: string;
  collectionName?: string;
  releaseDate?: string;
  artworkUrl100?: string;
  artworkUrl60?: string;
  trackTimeMillis?: number;
  trackViewUrl?: string;
}

function isSong(r: ITunesResult): boolean {
  return (
    (r.wrapperType === 'track' || r.kind === 'song') &&
    typeof r.trackId === 'number'
  );
}

function upscaleArtwork(url: string | undefined): string | undefined {
  // iTunes serves any size by rewriting the dimension segment.
  return url?.replace(/\/(\d+)x\1([a-z]*)\.(jpg|png)$/i, '/300x300$2.$3');
}

function mapResult(r: ITunesResult): Track {
  const track: Track = {
    provider: 'apple',
    id: String(r.trackId ?? ''),
    title: r.trackName ?? '',
    artist: r.artistName ?? '',
  };
  if (r.collectionName) track.album = r.collectionName;
  if (r.releaseDate) track.releaseDate = r.releaseDate.slice(0, 10);
  const artwork = upscaleArtwork(r.artworkUrl100 ?? r.artworkUrl60);
  if (artwork) track.artworkUrl = artwork;
  if (typeof r.trackTimeMillis === 'number') track.durationMs = r.trackTimeMillis;
  return track;
}

async function itunes(pathAndQuery: string): Promise<ITunesResult[]> {
  const res = await fetch(`${ITUNES_BASE}${pathAndQuery}`, {
    headers: { Accept: 'application/json' },
  });
  if (!res.ok) {
    throw new Error(`iTunes API error ${res.status} for ${pathAndQuery}`);
  }
  const data = (await res.json()) as { results?: ITunesResult[] };
  return (data.results ?? []).filter(isSong);
}

/** Prefer the API's trackViewUrl as the exact link when present. */
function exactLinkFor(r: ITunesResult): ProviderLink {
  if (r.trackViewUrl) {
    return { provider: 'apple', kind: 'exact', url: r.trackViewUrl };
  }
  return exactTrackLink('apple', String(r.trackId));
}

// ---------------------------------------------------------------------------
// Playlist page scraping helpers (defensive; every step may return null).
// ---------------------------------------------------------------------------

function deepWalk(
  node: unknown,
  visit: (obj: Record<string, unknown>) => void,
  depth = 0
): void {
  if (depth > 30 || node === null || typeof node !== 'object') return;
  if (Array.isArray(node)) {
    for (const item of node) deepWalk(item, visit, depth + 1);
    return;
  }
  const obj = node as Record<string, unknown>;
  visit(obj);
  for (const value of Object.values(obj)) deepWalk(value, visit, depth + 1);
}

function str(v: unknown): string | undefined {
  return typeof v === 'string' && v.length > 0 ? v : undefined;
}

interface ScrapedAttributes {
  name?: unknown;
  artistName?: unknown;
  albumName?: unknown;
  releaseDate?: unknown;
  durationInMillis?: unknown;
  isrc?: unknown;
  curatorName?: unknown;
  artwork?: unknown;
  playParams?: unknown;
}

function trackFromAttributes(
  attrs: ScrapedAttributes,
  outerId: unknown
): Track | null {
  const title = str(attrs.name);
  const artist = str(attrs.artistName);
  if (!title || !artist) return null;
  const playParams = attrs.playParams as Record<string, unknown> | undefined;
  const id =
    str(outerId) ??
    (playParams && typeof playParams === 'object'
      ? str(playParams['id'])
      : undefined);
  const track: Track = {
    provider: 'apple',
    id: id ?? '',
    title,
    artist,
  };
  const album = str(attrs.albumName);
  if (album) track.album = album;
  const release = str(attrs.releaseDate);
  if (release) track.releaseDate = release.slice(0, 10);
  if (typeof attrs.durationInMillis === 'number') {
    track.durationMs = attrs.durationInMillis;
  }
  const isrc = str(attrs.isrc);
  if (isrc) track.isrc = isrc.toUpperCase();
  const artwork = attrs.artwork as Record<string, unknown> | undefined;
  const artworkTemplate =
    artwork && typeof artwork === 'object' ? str(artwork['url']) : undefined;
  if (artworkTemplate) {
    track.artworkUrl = artworkTemplate
      .replace('{w}', '300')
      .replace('{h}', '300')
      .replace('{c}', '')
      .replace('{f}', 'jpg');
  }
  return track;
}

/**
 * Parse the `<script id="serialized-server-data" type="application/json">`
 * blob embedded in public playlist pages: deep-walk for song objects
 * (identified by `attributes` carrying both `name` and `artistName`).
 */
function parseServerData(
  html: string
): { title: string | null; tracks: Track[] } | null {
  const m = html.match(
    /<script[^>]*id="serialized-server-data"[^>]*>([\s\S]*?)<\/script>/i
  );
  if (!m || m[1] === undefined) return null;
  let data: unknown;
  try {
    data = JSON.parse(m[1]);
  } catch {
    return null;
  }

  const tracks: Track[] = [];
  const seen = new Set<string>();
  let title: string | null = null;

  const addTrack = (t: Track | null): void => {
    if (!t || tracks.length >= MAX_PLAYLIST_TRACKS) return;
    const key = t.id || `${t.artist}~${t.title}`;
    if (seen.has(key)) return;
    seen.add(key);
    tracks.push(t);
  };

  deepWalk(data, (obj) => {
    const attrs = obj['attributes'];
    if (attrs && typeof attrs === 'object' && !Array.isArray(attrs)) {
      const a = attrs as ScrapedAttributes;
      if (str(a.name) && str(a.artistName) && !str(a.curatorName)) {
        addTrack(trackFromAttributes(a, obj['id']));
      }
      // The playlist's own attributes carry curatorName + name.
      if (!title && str(a.name) && str(a.curatorName)) {
        title = str(a.name) ?? null;
      }
    }
    // Some page variants inline song fields without an attributes wrapper.
    if (
      str(obj['artistName']) &&
      str(obj['name']) &&
      ('durationInMillis' in obj || 'playParams' in obj || 'isrc' in obj)
    ) {
      addTrack(trackFromAttributes(obj as ScrapedAttributes, obj['id']));
    }
  });

  return tracks.length > 0 ? { title, tracks } : null;
}

/**
 * Fallback: the schema.org `MusicPlaylist` JSON-LD block. Carries names/urls
 * only (often no artist) — still enough for the search-link degrade path.
 */
function parseJsonLd(
  html: string
): { title: string | null; tracks: Track[] } | null {
  const re = /<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi;
  for (const m of html.matchAll(re)) {
    let data: unknown;
    try {
      data = JSON.parse(m[1] ?? '');
    } catch {
      continue;
    }
    const nodes = Array.isArray(data) ? data : [data];
    for (const node of nodes) {
      if (!node || typeof node !== 'object') continue;
      const obj = node as Record<string, unknown>;
      if (obj['@type'] !== 'MusicPlaylist') continue;
      const title = str(obj['name']) ?? null;
      const rawTracks = Array.isArray(obj['track']) ? obj['track'] : [];
      const tracks: Track[] = [];
      for (const raw of rawTracks) {
        if (tracks.length >= MAX_PLAYLIST_TRACKS) break;
        if (!raw || typeof raw !== 'object') continue;
        const r = raw as Record<string, unknown>;
        const name = str(r['name']);
        if (!name) continue;
        const byArtist = r['byArtist'] as Record<string, unknown> | undefined;
        const artist =
          byArtist && typeof byArtist === 'object'
            ? (str(byArtist['name']) ?? '')
            : '';
        // JSON-LD urls look like …/album/slug/<albumId>?i=<trackId>.
        const url = str(r['url']);
        const idMatch = url?.match(/[?&]i=(\d+)/);
        tracks.push({
          provider: 'apple',
          id: idMatch?.[1] ?? '',
          title: name,
          artist,
        });
      }
      if (tracks.length > 0) return { title, tracks };
    }
  }
  return null;
}

export const appleProvider: MusicProvider = {
  id: 'apple',

  available(_env: Env): boolean {
    return true;
  },

  async search(_env: Env, q: string, limit: number): Promise<SearchResult[]> {
    const results = await itunes(
      `/search?media=music&entity=song&country=US&limit=${limit}&term=${encodeURIComponent(q)}`
    );
    return results.map(mapResult);
  },

  async getTrack(_env: Env, id: string): Promise<Track | null> {
    try {
      const results = await itunes(
        `/lookup?id=${encodeURIComponent(id)}&entity=song`
      );
      const hit = results[0];
      return hit ? mapResult(hit) : null;
    } catch {
      return null;
    }
  },

  async resolve(_env: Env, track: Track): Promise<ResolvedMatch> {
    if (track.provider === 'apple') {
      // Scraped tracks (JSON-LD fallback) may lack an id — an "exact" link
      // built from an empty id would 404, so degrade to a search link.
      return {
        link: track.id
          ? exactTrackLink('apple', track.id)
          : searchTrackLink('apple', track),
      };
    }
    const fallback = { link: searchTrackLink('apple', track) };
    try {
      // ISRC lookup first — iTunes supports lookup?isrc=.
      if (track.isrc) {
        const byIsrc = await itunes(
          `/lookup?isrc=${encodeURIComponent(track.isrc)}&entity=song`
        );
        if (byIsrc.length > 0) {
          // ISRC is authoritative; scoring only disambiguates multi-hits.
          const best =
            pickBestMatch(track, byIsrc.map(mapResult), 0) ?? undefined;
          const raw = best
            ? byIsrc.find((r) => String(r.trackId) === best.id)
            : byIsrc[0];
          if (raw) return { link: exactLinkFor(raw), matched: mapResult(raw) };
        }
      }
      // Search term fallback.
      const term = `${track.artist} ${track.title}`.trim();
      if (term) {
        const results = await itunes(
          `/search?media=music&entity=song&country=US&limit=5&term=${encodeURIComponent(term)}`
        );
        const best = pickBestMatch(track, results.map(mapResult));
        if (best) {
          const raw = results.find((r) => String(r.trackId) === best.id);
          if (raw) return { link: exactLinkFor(raw), matched: mapResult(raw) };
          return { link: exactTrackLink('apple', best.id), matched: best };
        }
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
    if (u.hostname !== 'music.apple.com' && u.hostname !== 'itunes.apple.com') {
      return null;
    }
    const segments = u.pathname.split('/').filter(Boolean);
    const idx = segments.indexOf('playlist');
    if (idx === -1) return null;
    const storefrontRaw = idx > 0 ? segments[0] : undefined;
    const storefront =
      storefrontRaw !== undefined && /^[a-z]{2,3}$/i.test(storefrontRaw)
        ? storefrontRaw.toLowerCase()
        : 'us';
    const id = segments
      .slice(idx + 1)
      .find((s) => /^pl\.[A-Za-z0-9._-]+$/.test(s));
    if (!id) return null;
    return { playlistId: `${storefront}/${id}` };
  },

  /**
   * Two shapes, because Apple has two ways of pointing at one song: a
   * `/song/<slug>/<id>` page, and an album page whose `?i=` names the track —
   * which is what "Share → Copy Link" produces from a song row. Both yield a
   * catalog id, which `getTrack` looks up through the keyless iTunes API, so
   * no storefront is needed here.
   */
  parseTrackUrl(url: string): { trackId: string } | null {
    let u: URL;
    try {
      u = new URL(url.trim());
    } catch {
      return null;
    }
    if (u.hostname !== 'music.apple.com' && u.hostname !== 'itunes.apple.com') {
      return null;
    }
    const i = u.searchParams.get('i');
    if (i && /^\d+$/.test(i)) return { trackId: i };
    const segments = u.pathname.split('/').filter(Boolean);
    const idx = segments.indexOf('song');
    if (idx === -1) return null;
    const id = segments.slice(idx + 1).find((s) => /^\d+$/.test(s));
    return id ? { trackId: id } : null;
  },

  async getPlaylist(
    _env: Env,
    playlistId: string
  ): Promise<{ title: string; tracks: Track[] } | null> {
    const sep = playlistId.indexOf('/');
    const storefront = sep === -1 ? 'us' : playlistId.slice(0, sep);
    const id = sep === -1 ? playlistId : playlistId.slice(sep + 1);
    try {
      const res = await fetch(
        `https://music.apple.com/${storefront}/playlist/${id}`,
        {
          headers: {
            Accept: 'text/html',
            'User-Agent':
              'Mozilla/5.0 (compatible; JustListen/1.0; +https://craigory.dev)',
          },
        }
      );
      if (!res.ok) return null;
      const html = await res.text();
      const parsed = parseServerData(html) ?? parseJsonLd(html);
      if (!parsed) return null;
      const title =
        parsed.title ??
        parseJsonLd(html)?.title ??
        'Apple Music playlist';
      return { title, tracks: parsed.tracks };
    } catch {
      // Not robustly parseable → null; the route layer 422s per SPEC.
      return null;
    }
  },
};
