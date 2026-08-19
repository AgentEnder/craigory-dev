/**
 * YouTube playlist import without an API key.
 *
 * `youtube.com/playlist?list={id}` embeds a `ytInitialData` blob holding the
 * first 100 entries — the same cap the importer applies, so nothing is lost.
 * This matters more than the Spotify equivalent: `playlistItems.list` costs 50
 * quota units against a 10,000/day budget, and this costs none.
 *
 * NOTE ON SHAPE: YouTube migrated playlist rows from `playlistVideoRenderer` to
 * `lockupViewModel`. Parsers written against the old name return zero rows
 * against today's HTML — verified 2026-08-19, where the old selector found 0
 * and this one found 100. Expect to have to do this again; every field read
 * here is optional and a shape change yields null rather than a bad import.
 *
 * A video's "artist" is its channel, matching what the Data API path already
 * produces for the same playlist, so scraped and keyed imports resolve alike.
 */
import type { Track } from '../../types';

import type { ScrapedPlaylist } from './spotify-embed';

function str(value: unknown): string | undefined {
  return typeof value === 'string' && value.length > 0 ? value : undefined;
}

/** Collect every value stored under `key`, at any depth. */
function collect(node: unknown, key: string, out: unknown[] = []): unknown[] {
  if (Array.isArray(node)) {
    for (const item of node) collect(item, key, out);
  } else if (node && typeof node === 'object') {
    for (const [k, v] of Object.entries(node as Record<string, unknown>)) {
      if (k === key) out.push(v);
      collect(v, key, out);
    }
  }
  return out;
}

/** `8:57:39` / `1:17` → milliseconds. */
export function parseDurationBadge(text: string): number | undefined {
  if (!/^\d{1,2}(:\d{2}){1,2}$/.test(text)) return undefined;
  const parts = text.split(':').map(Number);
  const seconds = parts.reduce((total, part) => total * 60 + part, 0);
  return seconds * 1000;
}

/**
 * Rows YouTube renders for content the viewer cannot see. They carry no usable
 * title, so importing them would add blank tracks nothing can resolve.
 */
const UNAVAILABLE = /^\[(private|deleted|unavailable) video\]$/i;

export function parseYouTubeInitialData(html: string): ScrapedPlaylist | null {
  const script = /var ytInitialData\s*=\s*(\{[\s\S]*?\});\s*<\/script>/.exec(
    html
  );
  if (!script?.[1]) return null;

  let data: unknown;
  try {
    data = JSON.parse(script[1]);
  } catch {
    return null;
  }

  const title =
    str(
      (
        data as {
          metadata?: { playlistMetadataRenderer?: { title?: unknown } };
        }
      )?.metadata?.playlistMetadataRenderer?.title
    ) ??
    str(
      (data as { microformat?: { microformatDataRenderer?: { title?: unknown } } })
        ?.microformat?.microformatDataRenderer?.title
    );
  if (!title) return null;

  const tracks: Track[] = [];
  for (const raw of collect(data, 'lockupViewModel')) {
    const lockup = raw as {
      contentId?: unknown;
      contentType?: unknown;
      metadata?: { lockupMetadataViewModel?: unknown };
    };
    if (lockup.contentType !== 'LOCKUP_CONTENT_TYPE_VIDEO') continue;
    const id = str(lockup.contentId);
    if (!id) continue;

    const meta = lockup.metadata?.lockupMetadataViewModel as
      | { title?: { content?: unknown }; metadata?: unknown }
      | undefined;
    const videoTitle = str(meta?.title?.content);
    if (!videoTitle || UNAVAILABLE.test(videoTitle)) continue;

    // First metadata row's first part is the channel; later rows are view
    // counts and upload dates.
    const rowText = collect(meta?.metadata, 'content')
      .map(str)
      .find((value): value is string => Boolean(value));

    const badge = collect(lockup, 'thumbnailBadgeViewModel')
      .map((b) => str((b as { text?: unknown }).text))
      .find((value): value is string => Boolean(value));

    tracks.push({
      provider: 'youtube',
      id,
      title: videoTitle,
      artist: rowText ?? '',
      durationMs: badge ? parseDurationBadge(badge) : undefined,
    });
  }

  if (tracks.length === 0) return null;
  return { title, tracks };
}
