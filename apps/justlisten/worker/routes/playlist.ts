/**
 * POST /api/playlists  body { url: string } → { id: string }
 *   Detect provider from URL (parsePlaylistUrl across registry), fetch tracks
 *   (cap 100), resolve links in small sequential batches (reusing the KV match
 *   cache), store Playlist in PLAYLISTS KV with 7-day TTL.
 *
 * GET /api/playlists/:id → Playlist & { open: PlaylistOpenLinks[] }
 *   404 with friendly message when expired/unknown.
 */

import { Hono } from 'hono';
import { csvFilename, playlistToCsv } from '../export';
import type {
  Env,
  MusicProvider,
  Playlist,
  PlaylistTrack,
  ProviderLink,
  ResolvedMatch,
  Track,
} from '../types';
import { PROVIDER_IDS } from '../types';
import { providers } from '../providers/index';
import { cachedTrackMatch, resolveTrackOnProvider } from '../providers/matching';
import {
  exactTrackLink,
  providerDisplayName,
  searchTrackLink,
} from '../providers/links';
import { createId, savePlaylist, loadPlaylist } from '../playlists';

const MAX_TRACKS = 100;

/**
 * Subrequest budget.
 *
 * Workers Free allows **50 subrequests per invocation**, and separately
 * **1,000 subrequests to internal services** (KV, R2, D1). KV reads and writes
 * draw on the second budget, not the 50 — an earlier version of this comment
 * had them competing, which is why the live cap sat at 4 and left ~5x the
 * budget unspent.
 *
 * So only provider HTTP counts here. Resolving one track costs at most 2
 * fetches per foreign provider (Apple: ISRC lookup + term search; YouTube:
 * search.list + videos.list; Deezer: ISRC + search), and providers without
 * credentials cost 0 because they return a search link without a request. The
 * realistic worst case with every credential configured is ~6 fetches/track;
 * with none it is 2. Cap at 20 against the pessimistic figure, leaving room
 * for the playlist fetch itself and its pagination.
 *
 * Beyond the cap, tracks fall to a cache-read-only pass and then to locally
 * built search links, and the client resolves the remainder in batches through
 * POST /:id/resolve — each of those is its own invocation with its own 50.
 */
const MAX_LIVE_RESOLVED_TRACKS = 20;

/** Extra tracks resolved from the KV match cache only (no provider HTTP). */
const MAX_CACHE_ONLY_RESOLVED_TRACKS = 20;

/** Resolve in small sequential batches to bound concurrency. */
const RESOLVE_BATCH_SIZE = 5;

/**
 * Source-provider link. Scraped tracks (e.g. Apple JSON-LD fallback) may
 * have an empty id — an "exact" link built from it would 404, so degrade to
 * a search link.
 */
function sourceTrackLink(track: Track): ProviderLink {
  return track.id
    ? exactTrackLink(track.provider, track.id)
    : searchTrackLink(track.provider, track);
}

/** All-local links (zero subrequests): exact for source, search for others. */
function localTrackLinks(track: Track): ProviderLink[] {
  return PROVIDER_IDS.map((target) =>
    target === track.provider
      ? sourceTrackLink(track)
      : searchTrackLink(target, track)
  );
}

/**
 * Build one stored row: the four provider links, plus any artwork/ISRC/album
 * the matched tracks carry.
 *
 * The enrichment is the point of returning matches at all. A Spotify embed
 * scrape has no artwork and no ISRC, but resolving the track against iTunes or
 * Deezer has already fetched a record that does — so the row ends up with cover
 * art, and with an ISRC that makes every later match exact.
 *
 * `mode: 'cache'` reads the KV match cache only (no provider HTTP, so no
 * subrequest cost); `mode: 'live'` performs the lookups.
 */
async function buildPlaylistTrack(
  env: Env,
  track: Track,
  mode: 'live' | 'cache'
): Promise<PlaylistTrack> {
  const results = await Promise.all(
    PROVIDER_IDS.map(async (target): Promise<ResolvedMatch> => {
      if (target === track.provider) {
        return { link: sourceTrackLink(track) };
      }
      try {
        const resolved =
          mode === 'live'
            ? await resolveTrackOnProvider(env, track, target)
            : await cachedTrackMatch(env, track, target);
        return resolved ?? { link: searchTrackLink(target, track) };
      } catch (err) {
        console.error(`Resolve failed for ${target}:`, err);
        return { link: searchTrackLink(target, track) };
      }
    })
  );

  const matches = results
    .map((result) => result.matched)
    .filter((match): match is Track => Boolean(match));

  return {
    track: {
      ...track,
      artworkUrl:
        track.artworkUrl ?? matches.find((m) => m.artworkUrl)?.artworkUrl,
      isrc: track.isrc ?? matches.find((m) => m.isrc)?.isrc,
      album: track.album ?? matches.find((m) => m.album)?.album,
    },
    links: results.map((result) => result.link),
    ...(mode === 'live' ? { resolved: true } : {}),
  };
}

export const playlistRoutes = new Hono<{ Bindings: Env }>();

playlistRoutes.post('/', async (c) => {
  let body: unknown;
  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: 'Request body must be JSON' }, 400);
  }
  const rawUrl =
    typeof body === 'object' && body !== null && 'url' in body
      ? (body as { url: unknown }).url
      : undefined;
  const url = typeof rawUrl === 'string' ? rawUrl.trim() : '';
  if (!url) {
    return c.json({ error: 'Missing required field: url' }, 400);
  }
  try {
    new URL(url);
  } catch {
    return c.json({ error: 'That does not look like a valid URL' }, 422);
  }

  // Find the owning provider via parsePlaylistUrl across the registry.
  let source: MusicProvider | undefined;
  let sourcePlaylistId: string | undefined;
  for (const provider of providers) {
    const parsed = provider.parsePlaylistUrl(url);
    if (parsed) {
      source = provider;
      sourcePlaylistId = parsed.playlistId;
      break;
    }
  }
  if (!source || sourcePlaylistId === undefined) {
    return c.json(
      {
        error:
          'Unsupported playlist URL. Supported: Spotify playlists/albums, ' +
          'YouTube playlists, and Apple Music public playlists.',
      },
      422
    );
  }

  const sourceName = providerDisplayName(source.id);
  let fetched: { title: string; tracks: Track[] } | null;
  try {
    fetched = await source.getPlaylist(c.env, sourcePlaylistId);
  } catch (err) {
    console.error(`Playlist fetch from ${source.id} failed:`, err);
    return c.json({ error: `Failed to fetch the playlist from ${sourceName}` }, 502);
  }
  if (!fetched) {
    return c.json(
      {
        error:
          `Could not import this ${sourceName} playlist. It may be private, ` +
          'may no longer exist, or the source may be temporarily ' +
          'unreachable — try again in a moment.',
      },
      422
    );
  }

  const tracks = fetched.tracks.slice(0, MAX_TRACKS);

  // Live-resolve within the subrequest budget (see MAX_LIVE_RESOLVED_TRACKS),
  // sequential batches of RESOLVE_BATCH_SIZE; the rest get local search links.
  const playlistTracks: PlaylistTrack[] = [];
  const liveCount = Math.min(tracks.length, MAX_LIVE_RESOLVED_TRACKS);
  for (let i = 0; i < liveCount; i += RESOLVE_BATCH_SIZE) {
    const batch = tracks.slice(i, Math.min(i + RESOLVE_BATCH_SIZE, liveCount));
    playlistTracks.push(
      ...(await Promise.all(
        batch.map((track) => buildPlaylistTrack(c.env, track, 'live'))
      ))
    );
  }
  // Cache-read-only pass for the next few tracks (no provider HTTP).
  const cacheOnlyEnd = Math.min(
    tracks.length,
    liveCount + MAX_CACHE_ONLY_RESOLVED_TRACKS
  );
  for (const track of tracks.slice(liveCount, cacheOnlyEnd)) {
    playlistTracks.push(await buildPlaylistTrack(c.env, track, 'cache'));
  }
  for (const track of tracks.slice(cacheOnlyEnd)) {
    playlistTracks.push({ track, links: localTrackLinks(track) });
  }

  const playlist: Playlist = {
    id: createId(),
    title: fetched.title,
    sourceProvider: source.id,
    sourceUrl: url,
    createdAt: new Date().toISOString(),
    tracks: playlistTracks,
  };
  try {
    await savePlaylist(c.env, playlist);
  } catch (err) {
    // e.g. "Too many subrequests" if the budget was exhausted, or KV outage.
    console.error('Playlist save failed:', err);
    return c.json(
      { error: 'The playlist was imported but could not be saved — please try again.' },
      503
    );
  }
  return c.json({ id: playlist.id }, 201);
});

/**
 * Tracks resolved per POST /:id/resolve call.
 *
 * Each call is its own Worker invocation with its own 50-fetch budget, which
 * is the whole point: import can only ever resolve what fits in one request,
 * so the tail of a long playlist is finished here instead. Sized against the
 * same pessimistic ~6 fetches/track as the import cap.
 */
const RESOLVE_ENDPOINT_BATCH = 8;

/**
 * POST /api/playlists/:id/resolve  body { from: number }
 *   → { tracks: PlaylistTrack[], from: number, done: boolean }
 *
 * Resolves the next unresolved slice and writes it back into the stored
 * playlist, so the page is complete server-side on the next visit rather than
 * re-resolving for every viewer. Re-running is harmless: an already-resolved
 * row costs a cache read.
 */
playlistRoutes.post('/:id/resolve', async (c) => {
  const id = c.req.param('id');
  const playlist = await loadPlaylist(c.env, id);
  if (!playlist) {
    return c.json({ error: 'Playlist not found or expired.' }, 404);
  }

  let body: unknown;
  try {
    body = await c.req.json();
  } catch {
    body = {};
  }
  const rawFrom = (body as { from?: unknown }).from;
  const from =
    typeof rawFrom === 'number' && Number.isFinite(rawFrom) && rawFrom > 0
      ? Math.floor(rawFrom)
      : 0;
  if (from >= playlist.tracks.length) {
    return c.json({ tracks: [], from, done: true });
  }

  const end = Math.min(playlist.tracks.length, from + RESOLVE_ENDPOINT_BATCH);
  const slice = playlist.tracks.slice(from, end);
  const resolved = await Promise.all(
    slice.map((row) => buildPlaylistTrack(c.env, row.track, 'live'))
  );

  playlist.tracks.splice(from, resolved.length, ...resolved);
  try {
    await savePlaylist(c.env, playlist);
  } catch (err) {
    // The rows are still correct for this caller; only the write-back that
    // would have spared the next visitor is lost.
    console.error('Playlist write-back failed:', err);
  }

  return c.json({
    tracks: resolved,
    from,
    done: end >= playlist.tracks.length,
  });
});

playlistRoutes.get('/:id/export.csv', async (c) => {
  const playlist = await loadPlaylist(c.env, c.req.param('id'));
  if (!playlist) {
    return c.json(
      {
        error:
          'Playlist not found. Imported playlists expire after 7 days — ' +
          'you can re-import it from its original URL.',
      },
      404
    );
  }
  return new Response(playlistToCsv(playlist), {
    headers: {
      'content-type': 'text/csv; charset=utf-8',
      'content-disposition': `attachment; filename="${csvFilename(playlist.title)}"`,
    },
  });
});
