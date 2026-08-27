/**
 * Shared domain types + provider interface — the contract from SPEC.md.
 * All worker and (via import) frontend code must conform to these types.
 */

// Imported explicitly (rather than relying on ambient globals) so this file
// also typechecks inside the SPA project, which uses DOM libs instead of the
// workers-types ambient environment.
import type { KVNamespace } from '@cloudflare/workers-types';

export type ProviderId = 'spotify' | 'apple' | 'youtube' | 'deezer';

/**
 * Every provider id, in canonical display order — the single source of truth
 * for iteration and validation. Lives here (rather than in the provider
 * registry) so the SPA can import it without pulling in provider
 * implementations and their Worker-only dependencies.
 */
export const PROVIDER_IDS: readonly ProviderId[] = [
  'spotify',
  'apple',
  'youtube',
  'deezer',
];

/**
 * Catalogs queried by search. YouTube is deliberately absent: its Data API
 * `search.list` costs 100 of a 10,000-unit daily quota, so it can never back
 * a search box (see providers/youtube.ts). Deezer leads because it needs no
 * credentials, indexes independent releases the other catalogs miss, and
 * returns an ISRC on every row — which feeds the ISRC-first match path.
 */
export const SEARCH_CATALOG_IDS: readonly ProviderId[] = [
  'deezer',
  'spotify',
  'apple',
];

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
  /** one per provider in `PROVIDER_IDS`, always all of them present */
  links: ProviderLink[];
}

/**
 * One recording on the full search page, merged across every catalog that
 * returned it. Because the catalogs are deduped by ISRC (falling back to a
 * normalized artist/title key), `sources` reports genuine cross-platform
 * availability without spending a single `resolve()` subrequest.
 */
export interface AggregatedSearchResult {
  /** The richest record among the merged rows; drives artwork/title/album. */
  track: SearchResult;
  /** Every catalog that returned this recording, with its native id. */
  sources: { provider: ProviderId; id: string }[];
}

/** Per-catalog outcome, so the UI can say *why* a platform is missing. */
export interface SearchCatalogStatus {
  provider: ProviderId;
  /** False when the catalog needs credentials that are not configured. */
  available: boolean;
  /** False when the catalog was queried but errored (rate limit, outage). */
  ok: boolean;
  /** Rows this catalog contributed before merging. */
  count: number;
}

/** GET /api/search/all response. */
export interface AggregatedSearch {
  query: string;
  results: AggregatedSearchResult[];
  catalogs: SearchCatalogStatus[];
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
  /**
   * True once this row has had a live cross-provider lookup. Absent rows carry
   * locally-built search links and are what the client asks the resolve
   * endpoint to finish — without the flag, a track that genuinely exists
   * nowhere else would be retried on every single page view.
   */
  resolved?: boolean;
}

/**
 * What `POST /api/playlists` made of a pasted link.
 *
 * The box takes one text field and people paste whatever they copied, which is
 * as often one song as a collection — a `youtube.com/watch?v=…` link is what a
 * desktop browser gives you. So the endpoint answers *what the link was* and
 * the client routes on it, rather than assuming every URL is a playlist.
 *
 * `song` costs no subrequests: the URL is parsed, not fetched, and
 * `/song/:provider/:id` does its own lookup (and its own 404).
 */
export type PastedLinkResult =
  | { kind: 'playlist'; id: string }
  | { kind: 'song'; provider: ProviderId; id: string };

export interface PlaylistOpenLinks {
  provider: ProviderId;
  kind: 'exact' | 'search';
  url: string;
  /** e.g. "Open on Spotify", "Find on YouTube Music" */
  label: string;
}

export interface Env {
  CACHE: KVNamespace;
  PLAYLISTS: KVNamespace;
  SPOTIFY_CLIENT_ID?: string;
  SPOTIFY_CLIENT_SECRET?: string;
  YOUTUBE_API_KEY?: string;
  /**
   * Namespaces every KV key this Worker touches (see `kv-scope.ts`). Set only
   * on preview versions, which share production's KV bindings; unset in
   * production, so production keys keep their bare names.
   */
  KV_PREFIX?: string;
}

/** A resolved cross-provider link, plus the matched track when exact. */
export interface ResolvedMatch {
  link: ProviderLink;
  matched?: Track;
}

export interface MusicProvider {
  id: ProviderId;
  available(env: Env): boolean;
  search(env: Env, q: string, limit: number): Promise<SearchResult[]>;
  getTrack(env: Env, id: string): Promise<Track | null>;
  /**
   * Resolve this provider's link for a track sourced elsewhere.
   *
   * Returns the matched track alongside the link when the match was exact:
   * the lookup has already paid for that metadata, and the importer uses it to
   * fill in artwork and ISRC the source catalog did not carry.
   */
  resolve(env: Env, track: Track): Promise<ResolvedMatch>;
  /** Parse a playlist URL owned by this provider; null if not theirs. */
  parsePlaylistUrl(url: string): { playlistId: string } | null;
  /**
   * Parse a single-track URL owned by this provider; null if not theirs.
   *
   * The peer of `parsePlaylistUrl`, and the reason a pasted song link is no
   * longer answered with "unsupported playlist link": a YouTube video URL is
   * what you get sharing from a desktop browser, and it names one recording,
   * not a collection. Callers try `parsePlaylistUrl` first, so a watch URL
   * carrying `list=` still imports the playlist.
   *
   * Pure parsing, no network: the id feeds `/song/:provider/:id`, whose own
   * lookup decides whether the track actually exists.
   */
  parseTrackUrl(url: string): { trackId: string } | null;
  getPlaylist(
    env: Env,
    playlistId: string
  ): Promise<{ title: string; tracks: Track[] } | null>;
}
