/**
 * Shared domain types + provider interface — the contract from SPEC.md.
 * All worker and (via import) frontend code must conform to these types.
 */

// Imported explicitly (rather than relying on ambient globals) so this file
// also typechecks inside the SPA project, which uses DOM libs instead of the
// workers-types ambient environment.
import type { KVNamespace } from '@cloudflare/workers-types';

export type ProviderId =
  | 'spotify'
  | 'apple'
  | 'youtube'
  | 'deezer'
  | 'bandcamp'
  | 'lastfm'
  | 'pandora';

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
  'bandcamp',
  'lastfm',
  'pandora',
];

/**
 * Catalogs queried by search.
 *
 * Deezer leads because it needs no credentials, indexes independent releases
 * the other catalogs miss, and returns an ISRC on every row — which feeds the
 * ISRC-first match path.
 *
 * Two are deliberately absent:
 * - **YouTube**, whose Data API `search.list` costs 100 of a 10,000-unit daily
 *   quota, so it can never back a search box (see providers/youtube.ts).
 * - **Pandora**, which publishes no search API at all. It can only ever be
 *   reached by a pasted link or by the match cache a paste leaves behind
 *   (see providers/pandora.ts).
 *
 * Bandcamp is here for the opposite reason to Deezer's: it carries the
 * self-released long tail none of the licensed catalogs index, and it is
 * keyless. Last.fm is last because it is the only keyed entry and its rows
 * carry the least metadata — no ISRC, no duration, no album — so it
 * contributes availability rather than a description.
 */
export const SEARCH_CATALOG_IDS: readonly ProviderId[] = [
  'deezer',
  'spotify',
  'apple',
  'bandcamp',
  'lastfm',
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

/**
 * Measured characteristics of a recording, from ReccoBeats.
 *
 * Spotify's field names and scales — ReccoBeats mirrors them deliberately,
 * because Spotify deprecated its own `/v1/audio-features` in November 2024 and
 * shipped no replacement. The values are ReccoBeats' estimates rather than
 * Spotify's original numbers, and `time_signature` has no equivalent here
 * because ReccoBeats does not return one.
 *
 * Every field is optional: this is the one upstream in the app whose response
 * shape could not be verified against a live call (see `reccobeats/parse.ts`),
 * so a field that does not arrive, or arrives outside its documented range, is
 * dropped rather than rendered.
 */
export interface AudioFeatures {
  /** Beats per minute. */
  tempo?: number;
  /** Pitch class, 0 = C through 11 = B. Absent when no key was detected. */
  key?: number;
  /** 1 = major, 0 = minor. */
  mode?: number;
  /** Full-scale dB, negative. */
  loudness?: number;
  /** The rest are 0–1. */
  acousticness?: number;
  danceability?: number;
  energy?: number;
  instrumentalness?: number;
  liveness?: number;
  speechiness?: number;
  valence?: number;
}

export interface SongDetail {
  track: Track;
  /** one per provider in `PROVIDER_IDS`, always all of them present */
  links: ProviderLink[];
  /**
   * Audio features, when ReccoBeats knows this recording. Absent for a track
   * with no exact Spotify match (ReccoBeats is keyed on Spotify ids), one it
   * has never analyzed, or when it could not be reached — all three are the
   * same thing to the page, which simply omits the section.
   */
  audioFeatures?: AudioFeatures;
  /**
   * "More like this", as Spotify-provider tracks.
   *
   * Filed under `spotify` because a recommendation's only durable id is its
   * Spotify track id, and `/song/spotify/:id` already resolves one of those
   * across every platform — so each row links back into this app rather than
   * costing a cross-provider resolution of its own. Empty when there are none.
   */
  similar?: Track[];
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
   * Last.fm needs a key for every call — it publishes no keyless endpoint the
   * way Deezer, iTunes and Bandcamp do — so without this Last.fm degrades to
   * search links like Spotify and YouTube do.
   */
  LASTFM_API_KEY?: string;
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
