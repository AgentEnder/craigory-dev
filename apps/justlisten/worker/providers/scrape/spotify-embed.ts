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

/**
 * The `__NEXT_DATA__` entity an embed page was rendered for, or null.
 *
 * A private or nonexistent entity still renders the page, but with
 * `state.data` null — so a miss is detectable rather than silently empty.
 */
function embedEntity(html: string): Record<string, unknown> | null {
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

  const entity = (
    data as {
      props?: { pageProps?: { state?: { data?: { entity?: unknown } } } };
    }
  )?.props?.pageProps?.state?.data?.entity;
  return entity && typeof entity === 'object'
    ? (entity as Record<string, unknown>)
    : null;
}

/**
 * One track from `open.spotify.com/embed/track/{id}` — the keyless route into
 * a single Spotify song, and what makes a pasted `open.spotify.com/track/…`
 * link open a real song page with no credentials configured.
 *
 * Same blob and same limits as the playlist path above: no ISRC, so a track
 * sourced here matches on normalized title + artist + duration rather than
 * exactly. It carries artwork, duration and release date, which is everything
 * else the song page shows.
 *
 * Guards on `type === 'track'` so a playlist or album embed can never be
 * mapped into a single song.
 */
export function parseSpotifyEmbedTrack(html: string): Track | null {
  const entity = embedEntity(html);
  if (!entity || entity['type'] !== 'track') return null;

  const id = str(entity['id']) ?? trackIdFromUri(entity['uri']);
  const title = str(entity['name']) ?? str(entity['title']);
  if (!id || !title) return null;

  const artist = (Array.isArray(entity['artists']) ? entity['artists'] : [])
    .map((a) => str((a as { name?: unknown })?.name))
    .filter((name): name is string => Boolean(name))
    .join(', ');
  if (!artist) return null;

  const track: Track = { provider: 'spotify', id, title, artist };

  const duration = entity['duration'];
  if (typeof duration === 'number') track.durationMs = duration;

  const iso = str((entity['releaseDate'] as { isoString?: unknown })?.isoString);
  if (iso) track.releaseDate = iso.slice(0, 10);

  // `visualIdentity.image` is unsorted; prefer a mid-size cover, matching
  // `artworkFrom` on the Web API path.
  const images = (entity['visualIdentity'] as { image?: unknown })?.image;
  const covers = (Array.isArray(images) ? images : [])
    .map((i) => i as { url?: unknown; maxWidth?: unknown })
    .filter((i) => str(i.url));
  const cover =
    covers.find(
      (i) => typeof i.maxWidth === 'number' && i.maxWidth > 0 && i.maxWidth <= 300
    ) ?? covers[0];
  const artworkUrl = cover ? str(cover.url) : undefined;
  if (artworkUrl) track.artworkUrl = artworkUrl;

  return track;
}

export function parseSpotifyEmbed(html: string): ScrapedPlaylist | null {
  const entity = embedEntity(html) as
    | { name?: unknown; trackList?: unknown }
    | null;
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
