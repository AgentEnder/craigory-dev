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
  }
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
