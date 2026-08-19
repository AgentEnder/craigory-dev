/**
 * Spotify playlist/album import without credentials.
 *
 * `open.spotify.com/embed/{kind}/{id}` server-renders a Next.js page whose
 * `__NEXT_DATA__` blob carries the entity and its tracks. This is the only
 * keyless route into Spotify playlist data: the same blob also ships an
 * anonymous bearer token, but api.spotify.com answers that token with
 * 429 QUOTA_EXCEEDED immediately, so it buys nothing.
 *
 * What you give up versus the Web API: no ISRC and no album, so cross-provider
 * matching for these tracks falls back to normalized title + artist + duration.
 * The API path is still preferred whenever credentials exist.
 *
 * Caps at 100 tracks, which is also the importer's own limit — so nothing is
 * lost today, but a raised cap would not be honoured here.
 *
 * Shape verified against live embed pages 2026-08-19.
 */
import type { Track } from '../../types';

export interface ScrapedPlaylist {
  title: string;
  tracks: Track[];
}

interface EmbedTrack {
  uri?: unknown;
  title?: unknown;
  subtitle?: unknown;
  duration?: unknown;
}

function str(value: unknown): string | undefined {
  return typeof value === 'string' && value.length > 0 ? value : undefined;
}

/** `spotify:track:3ouNEk0tv5TTi8VWMe1xbX` → `3ouNEk0tv5TTi8VWMe1xbX`. */
function trackIdFromUri(uri: unknown): string | undefined {
  const text = str(uri);
  if (!text) return undefined;
  const match = /^spotify:track:([A-Za-z0-9]+)$/.exec(text);
  return match?.[1];
}

export function parseSpotifyEmbed(html: string): ScrapedPlaylist | null {
  const script = /<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/i.exec(
    html
  );
  if (!script?.[1]) return null;

  let data: unknown;
  try {
    data = JSON.parse(script[1]);
  } catch {
    return null;
  }

  // A private or nonexistent playlist still renders the page, but with
  // `state.data` null — so a miss is detectable rather than silently empty.
  const entity = (
    data as {
      props?: { pageProps?: { state?: { data?: { entity?: unknown } } } };
    }
  )?.props?.pageProps?.state?.data?.entity as
    | { name?: unknown; trackList?: unknown }
    | undefined;
  if (!entity) return null;

  const title = str(entity.name);
  if (!title) return null;

  const rows = Array.isArray(entity.trackList)
    ? (entity.trackList as EmbedTrack[])
    : [];
  const tracks: Track[] = [];
  for (const row of rows) {
    const id = trackIdFromUri(row.uri);
    const trackTitle = str(row.title);
    if (!id || !trackTitle) continue;
    tracks.push({
      provider: 'spotify',
      id,
      title: trackTitle,
      artist: str(row.subtitle) ?? '',
      durationMs: typeof row.duration === 'number' ? row.duration : undefined,
    });
  }
  if (tracks.length === 0) return null;
  return { title, tracks };
}
