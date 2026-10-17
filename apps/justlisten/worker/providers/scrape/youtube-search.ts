/**
 * YouTube track resolution without an API key.
 *
 * This is the one that was costing the most. `search.list` costs **100 of a
 * 10,000-unit daily quota**, which is why `SEARCH_CATALOG_IDS` excludes YouTube
 * outright — but it also means a deployment with no `YOUTUBE_API_KEY` could
 * never produce an exact YouTube link at all, only a
 * `music.youtube.com/search?q=…` deep link. For most people YouTube is the one
 * platform they can definitely play something on, so that gap mattered more
 * than the other absent providers.
 *
 * `youtube.com/results?search_query=…` ships the same `ytInitialData` blob the
 * playlist page does, containing the result rows. Same technique, same module,
 * same caveats as `youtube-initial-data.ts` — and the same failure mode: a
 * shape change yields no rows, the caller degrades to a search link, and
 * nothing breaks.
 *
 * Two renderers are read because YouTube is mid-migration between them and
 * which one a given request gets is not stable:
 * - `videoRenderer`, the long-standing search row;
 * - `lockupViewModel`, the newer shape that already replaced
 *   `playlistVideoRenderer` on playlist pages.
 *
 * Results are *candidates*, not answers. They go through `pickBestMatch` like
 * every other provider's, because YouTube search happily returns a lyric video,
 * a cover, or a completely unrelated upload for a title it does not have.
 */
import type { Track } from '../../types';
import {
  collect,
  isUnavailableTitle,
  parseDurationBadge,
  ytInitialData,
} from './youtube-initial-data';

function str(value: unknown): string | undefined {
  return typeof value === 'string' && value.length > 0 ? value : undefined;
}

/**
 * YouTube writes a display string either as `{ simpleText }` or as
 * `{ runs: [{ text }, …] }`, interchangeably and in the same response.
 */
function text(node: unknown): string | undefined {
  if (!node || typeof node !== 'object') return undefined;
  const obj = node as { simpleText?: unknown; runs?: unknown };
  const simple = str(obj.simpleText);
  if (simple) return simple;
  if (!Array.isArray(obj.runs)) return undefined;
  const joined = obj.runs
    .map((run) => str((run as { text?: unknown })?.text))
    .filter((part): part is string => Boolean(part))
    .join('');
  return joined.length > 0 ? joined : undefined;
}

/** A classic `videoRenderer` search row. */
function fromVideoRenderer(raw: unknown): Track | null {
  const row = raw as {
    videoId?: unknown;
    title?: unknown;
    ownerText?: unknown;
    longBylineText?: unknown;
    shortBylineText?: unknown;
    lengthText?: unknown;
  };
  const id = str(row.videoId);
  const title = text(row.title);
  if (!id || !title || isUnavailableTitle(title)) return null;

  const track: Track = {
    provider: 'youtube',
    id,
    title,
    artist:
      text(row.ownerText) ??
      text(row.longBylineText) ??
      text(row.shortBylineText) ??
      '',
  };
  const length = text(row.lengthText);
  // A row with no length badge is a live stream or a premiere, not a track.
  const ms = length ? parseDurationBadge(length) : undefined;
  if (ms) track.durationMs = ms;
  return track;
}

/** A newer `lockupViewModel` search row. */
function fromLockup(raw: unknown): Track | null {
  const lockup = raw as {
    contentId?: unknown;
    contentType?: unknown;
    metadata?: { lockupMetadataViewModel?: unknown };
  };
  if (lockup.contentType !== 'LOCKUP_CONTENT_TYPE_VIDEO') return null;
  const id = str(lockup.contentId);
  if (!id) return null;

  const meta = lockup.metadata?.lockupMetadataViewModel as
    | { title?: { content?: unknown }; metadata?: unknown }
    | undefined;
  const title = str(meta?.title?.content);
  if (!title || isUnavailableTitle(title)) return null;

  // First metadata row's first part is the channel; the rest are view counts
  // and upload dates.
  const channel = collect(meta?.metadata, 'content')
    .map(str)
    .find((value): value is string => Boolean(value));

  const badge = collect(lockup, 'thumbnailBadgeViewModel')
    .map((b) => str((b as { text?: unknown }).text))
    .find((value): value is string => Boolean(value));

  const track: Track = {
    provider: 'youtube',
    id,
    title,
    artist: channel ?? '',
  };
  const ms = badge ? parseDurationBadge(badge) : undefined;
  if (ms) track.durationMs = ms;
  return track;
}

/**
 * Candidate videos from a YouTube search results page, in the order YouTube
 * ranked them, deduped by video id and capped at `limit`.
 *
 * Empty for a blob that parsed but held no rows, which is indistinguishable
 * from — and handled the same as — a page that did not parse at all.
 */
export function parseYouTubeSearchResults(
  html: string,
  limit: number
): Track[] {
  const data = ytInitialData(html);
  if (!data) return [];

  const tracks: Track[] = [];
  const seen = new Set<string>();
  const push = (track: Track | null) => {
    if (!track || seen.has(track.id) || tracks.length >= limit) return;
    seen.add(track.id);
    tracks.push(track);
  };

  // `videoRenderer` first: where both shapes are present it is the one that
  // carries a channel name and a length, which the scorer actually uses.
  for (const raw of collect(data, 'videoRenderer')) push(fromVideoRenderer(raw));
  for (const raw of collect(data, 'lockupViewModel')) push(fromLockup(raw));
  return tracks;
}

/**
 * The search URL to read.
 *
 * `sp=EgIQAQ%3D%3D` is YouTube's "Type: Video" filter, which keeps channels,
 * playlists and Shorts shelves out of the blob — fewer renderers to sift, and
 * no risk of scoring a playlist's title as if it were a recording.
 */
export function youtubeSearchUrl(query: string): string {
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(
    query
  )}&sp=EgIQAQ%3D%3D`;
}
