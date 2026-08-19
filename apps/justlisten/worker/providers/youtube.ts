/**
 * YouTube / YouTube Music provider — YouTube Data API v3.
 * OPTIONAL: without YOUTUBE_API_KEY, links degrade to
 * https://music.youtube.com/search?q=…. Playlist import still works without
 * one by reading the public playlist page — see scrape/youtube-initial-data.ts.
 * The Data API is used only for detail-page resolution and playlist import —
 * `search.list` (100 quota units) is called ONLY inside `resolve`; the
 * `search()` interface method intentionally returns nothing so this provider
 * can never serve autocomplete.
 */

import { fetchPublicPage } from './scrape/fetch-page';
import { parseYouTubeInitialData } from './scrape/youtube-initial-data';
import type {
  Env,
  MusicProvider,
  ProviderLink,
  SearchResult,
  Track,
} from '../types';
import { exactTrackLink, searchTrackLink } from './links';
import { pickBestMatch } from './matching';

const API_BASE = 'https://www.googleapis.com/youtube/v3';
/** Playlist import cap, per SPEC. */
const MAX_PLAYLIST_TRACKS = 100;

interface YtThumbnails {
  medium?: { url?: string };
  high?: { url?: string };
  default?: { url?: string };
}

interface YtVideoItem {
  id?: string;
  snippet?: {
    title?: string;
    channelTitle?: string;
    publishedAt?: string;
    thumbnails?: YtThumbnails;
  };
  contentDetails?: { duration?: string };
}

interface YtSearchItem {
  id?: { videoId?: string };
}

interface YtPlaylistItem {
  snippet?: {
    title?: string;
    videoOwnerChannelTitle?: string;
    publishedAt?: string;
    thumbnails?: YtThumbnails;
  };
  contentDetails?: { videoId?: string };
}

/** Parse an ISO-8601 duration (PT#H#M#S) into milliseconds. */
export function parseIsoDuration(iso: string): number | undefined {
  const m = iso.match(/^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+(?:\.\d+)?)S)?$/);
  if (!m) return undefined;
  const hours = Number(m[1] ?? 0);
  const minutes = Number(m[2] ?? 0);
  const seconds = Number(m[3] ?? 0);
  return Math.round((hours * 3600 + minutes * 60 + seconds) * 1000);
}

/** Strip the auto-generated " - Topic" suffix from channel names. */
export function cleanChannelTitle(name: string): string {
  return name.replace(/\s*-\s*Topic\s*$/i, '').trim();
}

function thumbnailUrl(t: YtThumbnails | undefined): string | undefined {
  return t?.medium?.url ?? t?.high?.url ?? t?.default?.url;
}

function mapVideo(item: YtVideoItem): Track {
  const track: Track = {
    provider: 'youtube',
    id: item.id ?? '',
    title: item.snippet?.title ?? '',
    artist: cleanChannelTitle(item.snippet?.channelTitle ?? ''),
  };
  const published = item.snippet?.publishedAt;
  if (published) track.releaseDate = published.slice(0, 10);
  const artwork = thumbnailUrl(item.snippet?.thumbnails);
  if (artwork) track.artworkUrl = artwork;
  const duration = item.contentDetails?.duration;
  if (duration) {
    const ms = parseIsoDuration(duration);
    if (ms !== undefined) track.durationMs = ms;
  }
  return track;
}

async function apiGet<T>(
  env: Env,
  resource: string,
  params: Record<string, string>
): Promise<T> {
  const sp = new URLSearchParams({ ...params, key: env.YOUTUBE_API_KEY ?? '' });
  const res = await fetch(`${API_BASE}/${resource}?${sp.toString()}`);
  if (!res.ok) {
    throw new Error(`YouTube API error ${res.status} for ${resource}`);
  }
  return (await res.json()) as T;
}

export const youtubeProvider: MusicProvider = {
  id: 'youtube',

  available(env: Env): boolean {
    return Boolean(env.YOUTUBE_API_KEY);
  },

  // Cost guardrail: YouTube search costs 100 quota units and must never be
  // used for autocomplete — this provider does not serve search results.
  async search(_env: Env, _q: string, _limit: number): Promise<SearchResult[]> {
    return [];
  },

  async getTrack(env: Env, id: string): Promise<Track | null> {
    if (!this.available(env)) return null;
    try {
      const data = await apiGet<{ items?: YtVideoItem[] }>(env, 'videos', {
        part: 'snippet,contentDetails',
        id,
      });
      const item = data.items?.[0];
      return item?.id ? mapVideo(item) : null;
    } catch {
      return null;
    }
  },

  async resolve(env: Env, track: Track): Promise<ProviderLink> {
    if (track.provider === 'youtube') {
      return exactTrackLink('youtube', track.id); // music.youtube.com/watch?v=…
    }
    const fallback = searchTrackLink('youtube', track);
    if (!this.available(env)) return fallback;
    try {
      const q = `${track.artist} ${track.title}`.trim();
      if (!q) return fallback;
      // search.list — allowed here (resolve path), never for autocomplete.
      const found = await apiGet<{ items?: YtSearchItem[] }>(env, 'search', {
        part: 'snippet',
        type: 'video',
        videoCategoryId: '10', // Music
        maxResults: '5',
        q,
      });
      const ids = (found.items ?? [])
        .map((i) => i.id?.videoId)
        .filter((v): v is string => Boolean(v));
      if (ids.length === 0) return fallback;
      // Fetch durations so scoring can apply the ±5s bonus.
      const details = await apiGet<{ items?: YtVideoItem[] }>(env, 'videos', {
        part: 'snippet,contentDetails',
        id: ids.join(','),
      });
      const candidates = (details.items ?? [])
        .filter((i) => i.id)
        .map(mapVideo);
      const best = pickBestMatch(track, candidates);
      if (best) return exactTrackLink('youtube', best.id);
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
    const host = u.hostname.replace(/^(www|m)\./, '');
    if (host !== 'youtube.com' && host !== 'music.youtube.com') return null;
    const list = u.searchParams.get('list');
    if (!list || !/^[A-Za-z0-9_-]+$/.test(list)) return null;
    if (u.pathname === '/playlist' || u.pathname === '/watch') {
      return { playlistId: list };
    }
    return null;
  },

  /**
   * API first when a key exists — it carries per-track artwork the public page
   * does not. The scrape is the fallback, and matters more than Spotify's:
   * `playlistItems.list` costs 50 quota units per call against a 10,000/day
   * budget, and the public page costs none.
   */
  async getPlaylist(
    env: Env,
    playlistId: string
  ): Promise<{ title: string; tracks: Track[] } | null> {
    const viaApi = this.available(env)
      ? await fetchViaApi(env, playlistId)
      : null;
    if (viaApi) return viaApi;

    const html = await fetchPublicPage(
      `https://www.youtube.com/playlist?list=${encodeURIComponent(playlistId)}`
    );
    return html ? parseYouTubeInitialData(html) : null;
  },
};

/** The Data API playlist path, split out so the provider reads as a fallback chain. */
async function fetchViaApi(
  env: Env,
  playlistId: string
): Promise<{ title: string; tracks: Track[] } | null> {
  try {
    const meta = await apiGet<{ items?: { snippet?: { title?: string } }[] }>(
      env,
      'playlists',
      { part: 'snippet', id: playlistId, maxResults: '1' }
    );
    const playlist = meta.items?.[0];
    if (!playlist) return null;
    const title = playlist.snippet?.title ?? 'YouTube playlist';

    const tracks: Track[] = [];
    let pageToken: string | undefined;
    while (tracks.length < MAX_PLAYLIST_TRACKS) {
      const params: Record<string, string> = {
        part: 'snippet,contentDetails',
        playlistId,
        maxResults: '50',
      };
      if (pageToken) params['pageToken'] = pageToken;
      const page = await apiGet<{
        items?: YtPlaylistItem[];
        nextPageToken?: string;
      }>(env, 'playlistItems', params);
      for (const item of page.items ?? []) {
        const videoId = item.contentDetails?.videoId;
        const videoTitle = item.snippet?.title ?? '';
        // Skip unplayable rows.
        if (
          !videoId ||
          videoTitle === 'Private video' ||
          videoTitle === 'Deleted video'
        ) {
          continue;
        }
        const track: Track = {
          provider: 'youtube',
          id: videoId,
          title: videoTitle,
          artist: cleanChannelTitle(item.snippet?.videoOwnerChannelTitle ?? ''),
        };
        const artwork = thumbnailUrl(item.snippet?.thumbnails);
        if (artwork) track.artworkUrl = artwork;
        tracks.push(track);
        if (tracks.length >= MAX_PLAYLIST_TRACKS) break;
      }
      if (!page.nextPageToken || tracks.length >= MAX_PLAYLIST_TRACKS) break;
      pageToken = page.nextPageToken;
    }
    return { title, tracks };
  } catch {
    return null;
  }
}
