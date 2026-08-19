/**
 * Shared domain types + provider interface — the contract from SPEC.md.
 * All worker and (via import) frontend code must conform to these types.
 */

// Imported explicitly (rather than relying on ambient globals) so this file
// also typechecks inside the SPA project, which uses DOM libs instead of the
// workers-types ambient environment.
import type { Fetcher, KVNamespace } from '@cloudflare/workers-types';

export type ProviderId = 'spotify' | 'apple' | 'youtube';

export interface ProviderLink {
  provider: ProviderId;
  /** exact = resolved item; search = query deep-link */
  kind: 'exact' | 'search';
  url: string;
}

export interface Track {
  /** provider that sourced this metadata */
  provider: ProviderId;
  /** provider-native id */
  id: string;
  title: string;
  artist: string;
  album?: string;
  /** ISO date or year */
  releaseDate?: string;
  artworkUrl?: string;
  durationMs?: number;
  isrc?: string;
}

/** Autocomplete rows. */
export interface SearchResult extends Track {}

export interface SongDetail {
  track: Track;
  /** one per provider, always all 3 present */
  links: ProviderLink[];
}

export interface Playlist {
  /** random url-safe id (crypto) */
  id: string;
  title: string;
  sourceProvider: ProviderId;
  sourceUrl: string;
  /** ISO */
  createdAt: string;
  tracks: PlaylistTrack[];
}

export interface PlaylistTrack {
  track: Track;
  links: ProviderLink[];
}

export interface PlaylistOpenLinks {
  provider: ProviderId;
  kind: 'exact' | 'search';
  url: string;
  /** e.g. "Open on Spotify", "Find on YouTube Music" */
  label: string;
}

export interface Env {
  ASSETS: Fetcher;
  CACHE: KVNamespace;
  PLAYLISTS: KVNamespace;
  SPOTIFY_CLIENT_ID?: string;
  SPOTIFY_CLIENT_SECRET?: string;
  YOUTUBE_API_KEY?: string;
}

export interface MusicProvider {
  id: ProviderId;
  available(env: Env): boolean;
  search(env: Env, q: string, limit: number): Promise<SearchResult[]>;
  getTrack(env: Env, id: string): Promise<Track | null>;
  /** Resolve this provider's link for a track sourced elsewhere. */
  resolve(env: Env, track: Track): Promise<ProviderLink>;
  /** Parse a playlist URL owned by this provider; null if not theirs. */
  parsePlaylistUrl(url: string): { playlistId: string } | null;
  getPlaylist(
    env: Env,
    playlistId: string
  ): Promise<{ title: string; tracks: Track[] } | null>;
}
