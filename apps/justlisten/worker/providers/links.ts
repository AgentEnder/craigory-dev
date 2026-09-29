/**
 * Deep-link / search-link builders — pure functions, unit-tested in
 * worker/__tests__ (no network).
 */

import type {
  PlaylistOpenLinks,
  ProviderId,
  ProviderLink,
  Track,
} from '../types';
import { PROVIDER_IDS } from '../types';

const enc = encodeURIComponent;

// ---------------------------------------------------------------------------
// Composite provider ids.
//
// Four of the seven providers name a track with an opaque single token, which
// drops into `/song/:provider/:id` unchanged. The other three name it with a
// *tuple*:
//
//   last.fm   artist + title          (its URLs are built from names, not ids)
//   bandcamp  host + track slug       (every artist has their own subdomain)
//   pandora   artist/album/track slugs
//
// `/song/@provider/@id` matches one path segment, so those tuples are packed
// into a single segment with a separator that cannot occur inside an encoded
// part. `~` and `:` are both left alone by `encodeURIComponent`, so each part
// is encoded and then has the separator escaped explicitly — otherwise an
// artist named "A:B" would silently re-split into the wrong fields.
//
// These live here, beside the URL builders that consume them, rather than in
// the provider modules: the provider modules import `links.ts`, so putting
// them there would make the dependency circular.
// ---------------------------------------------------------------------------

function encodeIdPart(part: string, separator: string): string {
  // Percent-escape written out rather than taken from `enc(separator)`:
  // `encodeURIComponent` leaves `~` alone (it is an unreserved character), so
  // encoding the separator with itself is a no-op and an artist literally
  // named "~" would re-split the id in the wrong place.
  const escaped = `%${separator.charCodeAt(0).toString(16).toUpperCase().padStart(2, '0')}`;
  return enc(part).split(separator).join(escaped);
}

function decodeIdPart(part: string): string {
  try {
    return decodeURIComponent(part);
  } catch {
    // A hand-typed id can carry a stray `%`; the raw text is the best guess.
    return part;
  }
}

/** Last.fm track id: `<artist>~<title>`, each URL-encoded. */
export function lastfmTrackId(artist: string, title: string): string {
  return `${encodeIdPart(artist, '~')}~${encodeIdPart(title, '~')}`;
}

/** Inverse of {@link lastfmTrackId}; null when the id has no `~`. */
export function parseLastfmTrackId(
  id: string
): { artist: string; title: string } | null {
  const sep = id.indexOf('~');
  if (sep <= 0 || sep === id.length - 1) return null;
  const artist = decodeIdPart(id.slice(0, sep));
  const title = decodeIdPart(id.slice(sep + 1));
  return artist && title ? { artist, title } : null;
}

/**
 * Bandcamp track id: `<host>:<slug>`.
 *
 * The host is carried rather than assumed, because a Bandcamp page lives on
 * `<artist>.bandcamp.com` *or* on the artist's own domain (Bandcamp serves
 * custom domains for paying artists), and only the host distinguishes them.
 */
export function bandcampTrackId(host: string, slug: string): string {
  return `${encodeIdPart(host, ':')}:${encodeIdPart(slug, ':')}`;
}

/** Inverse of {@link bandcampTrackId} (also used for album ids). */
export function parseBandcampTrackId(
  id: string
): { host: string; slug: string } | null {
  const sep = id.indexOf(':');
  if (sep <= 0 || sep === id.length - 1) return null;
  const host = decodeIdPart(id.slice(0, sep));
  const slug = decodeIdPart(id.slice(sep + 1));
  // Guard the host: it is interpolated into a URL, so a decoded `/` or `@`
  // would point the "exact" link at another origin entirely.
  if (!/^[a-z0-9.-]+$/i.test(host) || !slug) return null;
  return { host, slug };
}

/** Pandora track id: the `/artist/…` path slugs joined with `:`. */
export function pandoraTrackId(segments: readonly string[]): string {
  return segments.map((part) => encodeIdPart(part, ':')).join(':');
}

/** Inverse of {@link pandoraTrackId}; null unless it holds 3 slugs. */
export function parsePandoraTrackId(id: string): string[] | null {
  const parts = id.split(':').map(decodeIdPart);
  return parts.length === 3 && parts.every(Boolean) ? parts : null;
}

/** Human-readable provider name for labels/badges. */
export function providerDisplayName(provider: ProviderId): string {
  switch (provider) {
    case 'spotify':
      return 'Spotify';
    case 'apple':
      return 'Apple Music';
    case 'youtube':
      return 'YouTube Music';
    case 'deezer':
      return 'Deezer';
    case 'bandcamp':
      return 'Bandcamp';
    case 'lastfm':
      return 'Last.fm';
    case 'pandora':
      return 'Pandora';
  }
}

/** Exact track URL on a provider from its native id. */
export function exactTrackLink(provider: ProviderId, id: string): ProviderLink {
  switch (provider) {
    case 'spotify':
      return { provider, kind: 'exact', url: `https://open.spotify.com/track/${id}` };
    case 'apple':
      return { provider, kind: 'exact', url: `https://music.apple.com/us/song/${id}` };
    case 'youtube':
      return { provider, kind: 'exact', url: `https://music.youtube.com/watch?v=${id}` };
    case 'deezer':
      return { provider, kind: 'exact', url: `https://www.deezer.com/track/${id}` };
    case 'bandcamp': {
      const parsed = parseBandcampTrackId(id);
      // An unparseable id would otherwise build an "exact" link to a host of
      // the caller's choosing; a Bandcamp search is the honest degradation.
      if (!parsed) {
        return { provider, kind: 'search', url: searchUrl(provider, id) };
      }
      return {
        provider,
        kind: 'exact',
        url: `https://${parsed.host}/track/${parsed.slug}`,
      };
    }
    case 'lastfm': {
      const parsed = parseLastfmTrackId(id);
      if (!parsed) {
        return { provider, kind: 'search', url: searchUrl(provider, id) };
      }
      // `/music/<artist>/_/<track>`: the `_` slot is where an album would go,
      // and Last.fm reads names, not ids — `+` for spaces, as its own links do.
      return {
        provider,
        kind: 'exact',
        url: `https://www.last.fm/music/${lastfmPathSegment(
          parsed.artist
        )}/_/${lastfmPathSegment(parsed.title)}`,
      };
    }
    case 'pandora': {
      const parts = parsePandoraTrackId(id);
      if (!parts) {
        return { provider, kind: 'search', url: searchUrl(provider, id) };
      }
      return {
        provider,
        kind: 'exact',
        url: `https://www.pandora.com/artist/${parts.map(enc).join('/')}`,
      };
    }
  }
}

/** Last.fm writes spaces as `+` inside its `/music/…` path segments. */
function lastfmPathSegment(text: string): string {
  return enc(text).replace(/%20/g, '+');
}

/** Search deep-link URL on a provider for an arbitrary query string. */
export function searchUrl(provider: ProviderId, query: string): string {
  switch (provider) {
    case 'spotify':
      return `https://open.spotify.com/search/${enc(query)}`;
    case 'apple':
      return `https://music.apple.com/us/search?term=${enc(query)}`;
    case 'youtube':
      return `https://music.youtube.com/search?q=${enc(query)}`;
    case 'deezer':
      return `https://www.deezer.com/search/${enc(query)}`;
    case 'bandcamp':
      // No `item_type` filter: the same builder serves track links and
      // playlist-title links, and a track filter would hide every album.
      return `https://bandcamp.com/search?q=${enc(query)}`;
    case 'lastfm':
      return `https://www.last.fm/search?q=${enc(query)}`;
    case 'pandora':
      return `https://www.pandora.com/search/${enc(query)}/all`;
  }
}

/**
 * Search deep-link for a track on a provider, e.g.
 * https://music.youtube.com/search?q=…, https://open.spotify.com/search/….
 */
export function searchTrackLink(
  provider: ProviderId,
  track: Pick<Track, 'title' | 'artist'>
): ProviderLink {
  const query = `${track.title} ${track.artist}`.trim();
  return { provider, kind: 'search', url: searchUrl(provider, query) };
}

/** Search deep-link for a playlist title on a provider. */
export function searchPlaylistLink(
  provider: ProviderId,
  title: string
): ProviderLink {
  return { provider, kind: 'search', url: searchUrl(provider, title.trim()) };
}

/**
 * Exact playlist URL on the source provider.
 *
 * `playlistId` is the id produced by that provider's `parsePlaylistUrl`:
 * - spotify: `playlist:<id>` or `album:<id>` (bare ids treated as playlists)
 * - apple:   `<storefront>/<pl.…>` (bare `pl.…` ids default to `us`)
 * - youtube: the raw `list` id
 * - deezer:  `playlist:<id>` or `album:<id>` (bare ids treated as playlists)
 */
export function exactPlaylistLink(
  provider: ProviderId,
  playlistId: string
): ProviderLink {
  switch (provider) {
    case 'spotify': {
      const sep = playlistId.indexOf(':');
      const kind = sep === -1 ? 'playlist' : playlistId.slice(0, sep);
      const id = sep === -1 ? playlistId : playlistId.slice(sep + 1);
      const path = kind === 'album' ? 'album' : 'playlist';
      return { provider, kind: 'exact', url: `https://open.spotify.com/${path}/${id}` };
    }
    case 'apple': {
      const sep = playlistId.indexOf('/');
      const storefront = sep === -1 ? 'us' : playlistId.slice(0, sep);
      const id = sep === -1 ? playlistId : playlistId.slice(sep + 1);
      return {
        provider,
        kind: 'exact',
        url: `https://music.apple.com/${storefront}/playlist/${id}`,
      };
    }
    case 'youtube':
      return {
        provider,
        kind: 'exact',
        url: `https://music.youtube.com/playlist?list=${playlistId}`,
      };
    case 'deezer': {
      const sep = playlistId.indexOf(':');
      const kind = sep === -1 ? 'playlist' : playlistId.slice(0, sep);
      const id = sep === -1 ? playlistId : playlistId.slice(sep + 1);
      const path = kind === 'album' ? 'album' : 'playlist';
      return { provider, kind: 'exact', url: `https://www.deezer.com/${path}/${id}` };
    }
    case 'bandcamp': {
      const parsed = parseBandcampTrackId(playlistId);
      if (!parsed) {
        return { provider, kind: 'search', url: searchUrl(provider, playlistId) };
      }
      return {
        provider,
        kind: 'exact',
        url: `https://${parsed.host}/album/${parsed.slug}`,
      };
    }
    // Last.fm and Pandora never reach here: their `parsePlaylistUrl` always
    // returns null (neither publishes a fetchable collection), so no import
    // can ever carry them as its source provider. Kept total — and honest —
    // rather than throwing from a pure link builder.
    case 'lastfm':
    case 'pandora':
      return { provider, kind: 'search', url: searchUrl(provider, playlistId) };
  }
}

/**
 * Open-links for an imported playlist (`PlaylistOpenLinks` per SPEC): the
 * exact source-platform URL plus title search links on the other platforms.
 */
export function playlistOpenLinks(
  sourceProvider: ProviderId,
  sourceUrl: string,
  title: string
): PlaylistOpenLinks[] {
  return PROVIDER_IDS.map((provider) =>
    provider === sourceProvider
      ? {
          provider,
          kind: 'exact' as const,
          url: sourceUrl,
          label: `Open on ${providerDisplayName(provider)}`,
        }
      : {
          ...searchPlaylistLink(provider, title),
          label: `Find on ${providerDisplayName(provider)}`,
        }
  );
}

/** A Deezer resource the widget player can embed. */
export interface DeezerEmbed {
  type: 'track' | 'album' | 'playlist';
  id: string;
}

const DEEZER_EMBEDDABLE = ['track', 'album', 'playlist'] as const;

/**
 * Pull the widget-embeddable resource out of a Deezer URL.
 *
 * Deezer is the only one of the four with a player that embeds without an
 * account or an API key, so an exact match there is what lets a page actually
 * play the song rather than just link out to it.
 *
 * Tolerates the optional locale segment Deezer puts on shared links
 * (`/us/track/123`), and returns null for anything else — an artist page, a
 * search URL, or another provider's link.
 */
export function deezerEmbedFromUrl(url: string): DeezerEmbed | null {
  let parsed: URL;
  try {
    parsed = new URL(url.trim());
  } catch {
    return null;
  }
  if (parsed.hostname.replace(/^www\./, '') !== 'deezer.com') return null;

  const segments = parsed.pathname.split('/').filter(Boolean);
  let i = 0;
  if (segments[i] && /^[a-z]{2}$/.test(segments[i]!)) i++;
  const type = segments[i];
  const id = segments[i + 1];
  if (!type || !id || !/^\d+$/.test(id)) return null;
  if (!DEEZER_EMBEDDABLE.includes(type as DeezerEmbed['type'])) return null;
  return { type: type as DeezerEmbed['type'], id };
}

/**
 * The embeddable Deezer resource among a set of provider links, if any.
 * Only an `exact` match qualifies — a search link is a query, not a resource.
 */
export function deezerEmbedFromLinks(
  links: readonly ProviderLink[]
): DeezerEmbed | null {
  const link = links.find(
    (candidate) => candidate.provider === 'deezer' && candidate.kind === 'exact'
  );
  return link ? deezerEmbedFromUrl(link.url) : null;
}
