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
  ResolvedMatch,
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

/**
 * Map a `youtube.com/oembed` document onto a `Track`. Null without a title,
 * the one field nothing downstream can work without.
 *
 * Split from the fetch so it stays pure and unit-testable, exactly like
 * `mapVideo` is for the API shape. `author_name` is the channel, which is what
 * both the API and the playlist scrape already record as a video's artist, so
 * a track sourced here resolves identically to one sourced there.
 */
export function parseYouTubeOEmbed(id: string, body: unknown): Track | null {
  if (!body || typeof body !== 'object') return null;
  const doc = body as {
    title?: unknown;
    author_name?: unknown;
    thumbnail_url?: unknown;
  };
  const title = typeof doc.title === 'string' ? doc.title : '';
  if (!title) return null;

  const track: Track = {
    provider: 'youtube',
    id,
    title,
    artist:
      typeof doc.author_name === 'string'
        ? cleanChannelTitle(doc.author_name)
        : '',
  };
  if (typeof doc.thumbnail_url === 'string' && doc.thumbnail_url) {
    track.artworkUrl = doc.thumbnail_url;
  }
  return track;
}

/**
 * One video, keylessly.
 *
 * `youtube.com/oembed` is public, unauthenticated, and costs nothing against
 * the Data API's 10,000-unit daily quota. A far better keyless path than
 * scraping the watch page: no HTML, no `ytInitialPlayerResponse` blob to keep
 * chasing when YouTube renames it (see scrape/youtube-initial-data.ts for that
 * treadmill), and a private, deleted or embed-blocked video answers non-200
 * rather than rendering a page that parses to nothing.
 *
 * What it gives up versus `videos.list` is duration, which costs only the
 * +0.1 duration bonus in `scoreMatch` — title and artist carry the other 100%
 * of the score, so matches stay good.
 *
 * Shape verified against the live endpoint 2026-08-20.
 */
async function fetchOEmbed(id: string): Promise<Track | null> {
  const params = new URLSearchParams({
    url: `https://www.youtube.com/watch?v=${id}`,
    format: 'json',
  });
  try {
    const res = await fetch(`https://www.youtube.com/oembed?${params}`);
    if (!res.ok) return null;
    return parseYouTubeOEmbed(id, await res.json());
  } catch {
    return null;
  }
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

  /**
   * API first when a key exists — `videos.list` costs 1 unit and carries the
   * duration oEmbed omits — then oEmbed, which costs nothing at all. The
   * fallback is what makes a pasted `watch?v=…` link work with no credentials
   * configured, and what covers a key whose quota has run out.
   */
  async getTrack(env: Env, id: string): Promise<Track | null> {
    if (this.available(env)) {
      try {
        const data = await apiGet<{ items?: YtVideoItem[] }>(env, 'videos', {
          part: 'snippet,contentDetails',
          id,
        });
        const item = data.items?.[0];
        if (item?.id) return mapVideo(item);
      } catch {
        // Quota, outage, or a bad key — try the keyless path before giving up.
      }
    }
    return fetchOEmbed(id);
  },

  async resolve(env: Env, track: Track): Promise<ResolvedMatch> {
    if (track.provider === 'youtube') {
      return { link: exactTrackLink('youtube', track.id) }; // music.youtube.com/watch?v=…
    }
    const fallback = { link: searchTrackLink('youtube', track) };
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
      if (best) return { link: exactTrackLink('youtube', best.id), matched: best };
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
   * `watch?v=…` (any youtube.com subdomain) and `youtu.be/…` — between them,
   * every link you can copy out of a browser or a share sheet.
   *
   * A watch URL carrying `list=` parses here too, and that is not a conflict:
   * callers try `parsePlaylistUrl` first, so the playlist keeps winning.
   */
  parseTrackUrl(url: string): { trackId: string } | null {
    let u: URL;
    try {
      u = new URL(url.trim());
    } catch {
      return null;
    }
    const host = u.hostname.replace(/^(www|m)\./, '');
    const id =
      host === 'youtu.be'
        ? u.pathname.split('/').filter(Boolean)[0]
        : (host === 'youtube.com' || host === 'music.youtube.com') &&
            u.pathname === '/watch'
          ? u.searchParams.get('v')
          : undefined;
    if (!id) return null;
    return /^[A-Za-z0-9_-]+$/.test(id) ? { trackId: id } : null;
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
