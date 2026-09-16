/**
 * Bandcamp track and album parsing from the public page's `data-tralbum` blob.
 *
 * Bandcamp publishes no track metadata API — the one it had (`bandcamp.com/api`)
 * was retired for general use and its successor is label-only. What every
 * public album and track page *does* carry is a `data-tralbum` attribute
 * holding the same JSON the page's own player is built from: title, artist,
 * release date and a `trackinfo` array with per-track titles and durations.
 * That is the whole of what JustListen needs, so this is the Bandcamp
 * equivalent of the Spotify embed and YouTube `ytInitialData` tiers, and it
 * carries the same caveats: undocumented page structure that will break when
 * the site changes, and every failure returning null so the caller degrades to
 * a search link rather than erroring.
 *
 * Unlike those two, this is not a *fallback* — Bandcamp has no credentialed
 * tier to fall back from. It is the only route in.
 *
 * Pure string/JSON work, unit-tested in worker/__tests__ (no network).
 */
import type { Track } from '../../types';
import { bandcampTrackId } from '../links';

/** A parsed album page: the collection title plus its tracks. */
export interface BandcampAlbum {
  title: string;
  tracks: Track[];
}

interface TralbumTrack {
  title?: unknown;
  /** Seconds, fractional — Bandcamp's player counts in floats. */
  duration?: unknown;
  /** Path-relative track URL, e.g. `/track/airbag`. */
  title_link?: unknown;
}

interface Tralbum {
  artist?: unknown;
  item_type?: unknown;
  url?: unknown;
  current?: { title?: unknown; release_date?: unknown } | null;
  trackinfo?: unknown;
}

function str(value: unknown): string | undefined {
  return typeof value === 'string' && value.length > 0 ? value : undefined;
}

/**
 * Decode the HTML entities an attribute value is escaped with. Only the five
 * that matter inside `"…"`-quoted attribute text — the blob is JSON, so
 * anything non-ASCII already arrives as a `\uXXXX` escape.
 */
function decodeEntities(text: string): string {
  return text
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');
}

/** The page's `data-tralbum` JSON, or null when absent/unparseable. */
function tralbum(html: string): Tralbum | null {
  const match = /\sdata-tralbum="([^"]*)"/.exec(html);
  if (!match?.[1]) return null;
  try {
    const parsed: unknown = JSON.parse(decodeEntities(match[1]));
    return parsed && typeof parsed === 'object' ? (parsed as Tralbum) : null;
  } catch {
    return null;
  }
}

/**
 * The page's cover art.
 *
 * Read from `og:image` rather than rebuilt from the blob's `art_id`, because
 * the id-to-URL mapping (zero-padding, the `_N` size suffix, which `fN.bcbits`
 * shard) is undocumented and has changed, while the meta tag is what Bandcamp
 * itself hands every link preview.
 */
function ogImage(html: string): string | undefined {
  const match =
    /<meta[^>]+property="og:image"[^>]+content="([^"]+)"/i.exec(html) ??
    /<meta[^>]+content="([^"]+)"[^>]+property="og:image"/i.exec(html);
  return match?.[1] ? decodeEntities(match[1]) : undefined;
}

/** `"16 Jun 1997 00:00:00 GMT"` → `"1997-06-16"`; undefined if unparseable. */
function releaseDate(value: unknown): string | undefined {
  const raw = str(value);
  if (!raw) return undefined;
  const parsed = new Date(raw);
  return Number.isNaN(parsed.getTime())
    ? undefined
    : parsed.toISOString().slice(0, 10);
}

function durationMs(value: unknown): number | undefined {
  // Seconds as a float. Zero means "unknown", which Bandcamp uses for tracks
  // whose audio is not streamable (name-your-price albums, pre-orders).
  return typeof value === 'number' && value > 0
    ? Math.round(value * 1000)
    : undefined;
}

/** The `<slug>` of a `/track/<slug>` path, ignoring any query or fragment. */
function slugFromTitleLink(value: unknown): string | undefined {
  const link = str(value);
  const match = link ? /\/track\/([^/?#]+)/.exec(link) : null;
  return match?.[1];
}

/** The host a blob's own `url` field points at, so ids carry a real origin. */
function hostFromTralbum(blob: Tralbum, fallbackHost: string): string {
  const url = str(blob.url);
  if (!url) return fallbackHost;
  try {
    return new URL(url).hostname;
  } catch {
    return fallbackHost;
  }
}

/**
 * The single track a `…/track/<slug>` page describes.
 *
 * `host` is the page's own hostname, needed because a Bandcamp id is
 * `<host>:<slug>` — an artist's pages can live on `<artist>.bandcamp.com` or
 * on a custom domain, and only the host tells them apart.
 */
export function parseBandcampTrack(html: string, host: string): Track | null {
  const blob = tralbum(html);
  if (!blob || blob.item_type !== 'track') return null;

  const title = str(blob.current?.title);
  const artist = str(blob.artist);
  if (!title || !artist) return null;

  const rows = Array.isArray(blob.trackinfo)
    ? (blob.trackinfo as TralbumTrack[])
    : [];
  const pageHost = hostFromTralbum(blob, host);
  const slug =
    slugFromTitleLink(rows[0]?.title_link) ?? slugFromTitleLink(blob.url);
  if (!slug) return null;

  const track: Track = {
    provider: 'bandcamp',
    id: bandcampTrackId(pageHost, slug),
    title,
    artist,
  };
  const released = releaseDate(blob.current?.release_date);
  if (released) track.releaseDate = released;
  const artwork = ogImage(html);
  if (artwork) track.artworkUrl = artwork;
  const ms = durationMs(rows[0]?.duration);
  if (ms) track.durationMs = ms;
  return track;
}

/**
 * Every track on a `…/album/<slug>` page.
 *
 * Bandcamp has albums, not playlists — there is no user-curated collection to
 * import — so this is what a pasted Bandcamp collection link resolves to. The
 * album title becomes each row's `album`, and the cover is shared: Bandcamp
 * serves per-track art only for tracks that override it, which `og:image` on
 * the album page does not expose.
 */
export function parseBandcampAlbum(
  html: string,
  host: string,
  max: number
): BandcampAlbum | null {
  const blob = tralbum(html);
  if (!blob || blob.item_type !== 'album') return null;

  const title = str(blob.current?.title);
  const artist = str(blob.artist);
  if (!title || !artist) return null;

  const rows = Array.isArray(blob.trackinfo)
    ? (blob.trackinfo as TralbumTrack[])
    : [];
  const pageHost = hostFromTralbum(blob, host);
  const artwork = ogImage(html);
  const released = releaseDate(blob.current?.release_date);

  const tracks: Track[] = [];
  for (const row of rows) {
    if (tracks.length >= max) break;
    const rowTitle = str(row.title);
    const slug = slugFromTitleLink(row.title_link);
    // A row with no slug is a track with no page of its own (an unreleased
    // pre-order row); an "exact" link could not be built for it anyway.
    if (!rowTitle || !slug) continue;
    const track: Track = {
      provider: 'bandcamp',
      id: bandcampTrackId(pageHost, slug),
      title: rowTitle,
      artist,
      album: title,
    };
    if (released) track.releaseDate = released;
    if (artwork) track.artworkUrl = artwork;
    const ms = durationMs(row.duration);
    if (ms) track.durationMs = ms;
    tracks.push(track);
  }

  return tracks.length > 0 ? { title, tracks } : null;
}
