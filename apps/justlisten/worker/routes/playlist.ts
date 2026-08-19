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
  Track,
} from '../types';
import { PROVIDER_IDS } from '../types';
import { providers } from '../providers/index';
import { cachedTrackLink, resolveTrackOnProvider } from '../providers/matching';
import {
  exactTrackLink,
  providerDisplayName,
  searchTrackLink,
} from '../providers/links';
import { createId, savePlaylist, loadPlaylist } from '../playlists';

const MAX_TRACKS = 100;

/**
 * Subrequest budget (Workers free tier ≈ 50 subrequests/request, and KV
 * operations count too). Live-resolving one track costs up to ~8
 * subrequests worst case: 2 other providers × (KV match-cache read + up to
 * TWO provider HTTP fetches — e.g. YouTube search.list + videos.list, or
 * Apple ISRC lookup + term search — + KV cache write). The playlist fetch
 * above uses a few more (token KV read/fetch/write + paged fetches) and the
 * KV save one. So we cap live resolution at 4 tracks (4 × 8 = 32, plus
 * fetch/save overhead stays under ~40); KV cache hits make each resolve
 * nearly free, but per-call subrequest usage is not observable, so the cap
 * is fixed conservatively. The next MAX_CACHE_ONLY_RESOLVED_TRACKS tracks
 * get a cache-READ-only pass (≤2 KV reads each, no provider HTTP), and
 * every remaining track gets `kind: 'search'` links built locally by pure
 * functions — zero subrequests — so the response still always carries one
 * link per provider. This cap is documented in README Limitations.
 */
const MAX_LIVE_RESOLVED_TRACKS = 4;

/** Extra tracks resolved from the KV match cache only (≤2 KV reads each). */
const MAX_CACHE_ONLY_RESOLVED_TRACKS = 4;

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
 * Cache-read-only links (≤2 KV reads, zero provider HTTP): cached exact
 * links where available, local search links otherwise.
 */
async function cachedTrackLinks(env: Env, track: Track): Promise<ProviderLink[]> {
  return Promise.all(
    PROVIDER_IDS.map(async (target) => {
      if (target === track.provider) {
        return sourceTrackLink(track);
      }
      return (await cachedTrackLink(env, track, target)) ?? searchTrackLink(target, track);
    })
  );
}

/** Live links: reuse the KV match cache; degrade failures to search links. */
async function liveTrackLinks(env: Env, track: Track): Promise<ProviderLink[]> {
  return Promise.all(
    PROVIDER_IDS.map(async (target) => {
      if (target === track.provider) {
        return sourceTrackLink(track);
      }
      try {
        return await resolveTrackOnProvider(env, track, target);
      } catch (err) {
        console.error(`Resolve failed for ${target}:`, err);
        return searchTrackLink(target, track);
      }
    })
  );
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
          `Could not import this ${sourceName} playlist. Import from ` +
          `${sourceName} may be unavailable on this deployment (missing API ` +
          'credentials — see the README), or the playlist is private or no ' +
          'longer exists.',
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
    const resolved = await Promise.all(
      batch.map(async (track) => ({
        track,
        links: await liveTrackLinks(c.env, track),
      }))
    );
    playlistTracks.push(...resolved);
  }
  // Cache-read-only pass for the next few tracks (no provider HTTP).
  const cacheOnlyEnd = Math.min(
    tracks.length,
    liveCount + MAX_CACHE_ONLY_RESOLVED_TRACKS
  );
  for (const track of tracks.slice(liveCount, cacheOnlyEnd)) {
    playlistTracks.push({ track, links: await cachedTrackLinks(c.env, track) });
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
