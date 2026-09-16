/**
 * Bandcamp provider — keyless, and the only catalog here that indexes the
 * self-released long tail.
 *
 * Bandcamp is not licensed-catalog music: artists upload it themselves, so a
 * great deal of what it carries exists on none of the other six platforms, and
 * a great deal of what the other six carry exists on none of Bandcamp. That
 * asymmetry is the reason to include it — and the reason its match threshold
 * is raised (see `BANDCAMP_MATCH_THRESHOLD`).
 *
 * Two endpoints, neither with a published contract:
 * - `bandcamp.com/api/bcsearch_public_api/1/autocomplete_elastic` backs the
 *   site's own search box. JSON in, JSON out, no credentials.
 * - public album/track pages carry a `data-tralbum` blob (see
 *   `scrape/bandcamp-tralbum.ts`).
 *
 * Both are read-only and unauthenticated, and every failure here degrades to a
 * search link rather than throwing — the same contract the Spotify embed and
 * YouTube page tiers already work under.
 */

import type {
  Env,
  MusicProvider,
  ResolvedMatch,
  SearchResult,
  Track,
} from '../types';
import {
  bandcampTrackId,
  exactTrackLink,
  parseBandcampTrackId,
  searchTrackLink,
} from './links';
import { pickBestMatch } from './matching';
import { fetchPublicPage } from './scrape/fetch-page';
import {
  parseBandcampAlbum,
  parseBandcampTrack,
} from './scrape/bandcamp-tralbum';

const SEARCH_ENDPOINT =
  'https://bandcamp.com/api/bcsearch_public_api/1/autocomplete_elastic';

/** Playlist import cap, per SPEC. */
const MAX_PLAYLIST_TRACKS = 100;

/**
 * Bandcamp accepts a weaker match than the licensed catalogs do.
 *
 * `pickBestMatch`'s default 0.6 is tuned for catalogs that carry the same
 * recording under near-identical metadata. Bandcamp mostly does not carry the
 * mainstream recording at all — what it carries is a cover, a bedroom remix or
 * an unrelated song of the same name, uploaded under whatever artist string the
 * uploader chose. At 0.6 those clear the bar and the row gets a confident link
 * to the wrong song, which is strictly worse than the search link it replaces.
 * A wrong "exact" link is the one failure mode this app cannot degrade out of,
 * so Bandcamp has to be more certain than its peers before claiming one.
 */
export const BANDCAMP_MATCH_THRESHOLD = 0.8;

/** `type: 't'` selects tracks; the endpoint also returns artists and albums. */
interface BcSearchRow {
  type?: unknown;
  name?: unknown;
  band_name?: unknown;
  album_name?: unknown;
  img?: unknown;
  item_url_path?: unknown;
  url?: unknown;
}

function str(value: unknown): string | undefined {
  return typeof value === 'string' && value.length > 0 ? value : undefined;
}

/** `{ host, slug }` from any Bandcamp `/track/<slug>` URL, or null. */
function trackUrlParts(raw: string): { host: string; slug: string } | null {
  let url: URL;
  try {
    url = new URL(raw.trim());
  } catch {
    return null;
  }
  const match = /^\/track\/([^/]+)\/?$/.exec(url.pathname);
  return match?.[1] ? { host: url.hostname, slug: match[1] } : null;
}

/**
 * Map one `autocomplete_elastic` row, or undefined when it is not a usable
 * track. Rows carry no duration and no ISRC, so a Bandcamp row merges with the
 * other catalogs on normalized artist/title alone.
 */
function mapSearchRow(row: BcSearchRow): SearchResult | undefined {
  if (row.type !== 't') return undefined;
  const title = str(row.name);
  const artist = str(row.band_name);
  const href = str(row.item_url_path) ?? str(row.url);
  if (!title || !artist || !href) return undefined;
  const parts = trackUrlParts(href);
  if (!parts) return undefined;

  const track: SearchResult = {
    provider: 'bandcamp',
    id: bandcampTrackId(parts.host, parts.slug),
    title,
    artist,
  };
  const album = str(row.album_name);
  if (album) track.album = album;
  // `img` is a URL on most rows but a bare numeric art id on some; a raw id
  // would render as a broken <img src="123">.
  const artwork = str(row.img);
  if (artwork?.startsWith('http')) track.artworkUrl = artwork;
  return track;
}

/** The public track page for an id, fetched as a browser would see it. */
async function fetchTrackPage(
  id: string
): Promise<{ html: string; host: string } | null> {
  const parsed = parseBandcampTrackId(id);
  if (!parsed) return null;
  const html = await fetchPublicPage(
    `https://${parsed.host}/track/${encodeURIComponent(parsed.slug)}`
  );
  return html ? { html, host: parsed.host } : null;
}

export const bandcampProvider: MusicProvider = {
  id: 'bandcamp',

  // Keyless: neither the search endpoint nor the public pages authenticate.
  available(_env: Env): boolean {
    return true;
  },

  async search(_env: Env, q: string, limit: number): Promise<SearchResult[]> {
    const res = await fetch(SEARCH_ENDPOINT, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        accept: 'application/json',
      },
      body: JSON.stringify({
        search_text: q,
        search_filter: 't',
        full_page: false,
        fan_id: null,
      }),
    });
    if (!res.ok) {
      throw new Error(`Bandcamp search error ${res.status}`);
    }
    const data = (await res.json()) as { auto?: { results?: BcSearchRow[] } };
    const rows = Array.isArray(data.auto?.results) ? data.auto.results : [];
    return rows
      .map(mapSearchRow)
      .filter((track): track is SearchResult => Boolean(track))
      .slice(0, limit);
  },

  async getTrack(_env: Env, id: string): Promise<Track | null> {
    const page = await fetchTrackPage(id);
    return page ? parseBandcampTrack(page.html, page.host) : null;
  },

  async resolve(env: Env, track: Track): Promise<ResolvedMatch> {
    if (track.provider === 'bandcamp') {
      return { link: exactTrackLink('bandcamp', track.id) };
    }
    const fallback = { link: searchTrackLink('bandcamp', track) };
    // No ISRC path: Bandcamp neither stores nor exposes ISRCs — most of what
    // it hosts was never registered with one.
    const q = `${track.artist} ${track.title}`.trim();
    if (!q) return fallback;
    try {
      const candidates = await this.search(env, q, 5);
      const best = pickBestMatch(track, candidates, BANDCAMP_MATCH_THRESHOLD);
      if (best) {
        return { link: exactTrackLink('bandcamp', best.id), matched: best };
      }
    } catch {
      // Degrade to a search link — never throw from resolve.
    }
    return fallback;
  },

  /**
   * Bandcamp albums. There are no user playlists to import: a Bandcamp
   * "collection" is a fan's purchase history, not a track list, and it is not
   * a track sequence anyone would want imported as one.
   */
  parsePlaylistUrl(url: string): { playlistId: string } | null {
    let parsed: URL;
    try {
      parsed = new URL(url.trim());
    } catch {
      return null;
    }
    const match = /^\/album\/([^/]+)\/?$/.exec(parsed.pathname);
    return match?.[1]
      ? { playlistId: bandcampTrackId(parsed.hostname, match[1]) }
      : null;
  },

  /**
   * Any `…/track/<slug>` URL.
   *
   * Deliberately not restricted to `*.bandcamp.com`: Bandcamp serves paying
   * artists on their own domains, where the page — and the `data-tralbum` blob
   * this reads — is byte-for-byte the same. The cost of being permissive is
   * bounded: a `/track/…` URL on some unrelated host parses, then fails to
   * produce a tralbum blob, and the song page 404s. Playlist parsing runs
   * first, and the other providers' parsers are host-locked, so a permissive
   * matcher here cannot steal a link that belongs to one of them.
   */
  parseTrackUrl(url: string): { trackId: string } | null {
    const parts = trackUrlParts(url);
    return parts ? { trackId: bandcampTrackId(parts.host, parts.slug) } : null;
  },

  async getPlaylist(
    _env: Env,
    playlistId: string
  ): Promise<{ title: string; tracks: Track[] } | null> {
    const parsed = parseBandcampTrackId(playlistId);
    if (!parsed) return null;
    const html = await fetchPublicPage(
      `https://${parsed.host}/album/${encodeURIComponent(parsed.slug)}`
    );
    if (!html) return null;
    return parseBandcampAlbum(html, parsed.host, MAX_PLAYLIST_TRACKS);
  },
};
