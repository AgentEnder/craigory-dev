/**
 * GET /api/preview/deezer/:id → { url, durationMs }
 *
 * Deezer's track endpoint carries a `preview` field: a direct MP3 of the
 * 30-second sample, served `audio/mpeg` with `access-control-allow-origin: *`.
 * That last header is the whole reason this route exists — the browser can
 * stream it straight from Deezer's CDN, so seeking and range requests never
 * come back through the Worker. We only broker the lookup.
 *
 * The lookup cannot be skipped by storing the URL on a playlist row: preview
 * URLs carry an `exp` token and die after ~15 minutes, long before a 7-day
 * share link is opened. Hence a fresh lookup per play, cached briefly.
 */
import { Hono } from 'hono';

import { cacheJson } from '../cache';
import type { Env } from '../types';

/**
 * Comfortably inside the ~15 minute signature lifetime, so a cache hit still
 * leaves minutes of validity — far more than a 30-second preview needs.
 */
const PREVIEW_CACHE_TTL_SECONDS = 10 * 60;

/** Thrown inside the cache producer so a miss is never cached. */
class NoPreviewError extends Error {}

interface DeezerTrackResponse {
  preview?: unknown;
  duration?: unknown;
  error?: unknown;
}

export const previewRoutes = new Hono<{ Bindings: Env }>();

previewRoutes.get('/deezer/:id', async (c) => {
  const id = c.req.param('id');
  if (!/^\d+$/.test(id)) {
    return c.json({ error: 'Invalid Deezer track id' }, 400);
  }

  try {
    const preview = await cacheJson(
      `preview:deezer:${id}`,
      PREVIEW_CACHE_TTL_SECONDS,
      async () => {
        const res = await fetch(`https://api.deezer.com/track/${id}`, {
          headers: { accept: 'application/json' },
        });
        if (!res.ok) throw new Error(`Deezer responded ${res.status}`);
        const body = (await res.json()) as DeezerTrackResponse;
        // Deezer answers 200 with an `error` object for unknown ids.
        if (body.error || typeof body.preview !== 'string' || !body.preview) {
          throw new NoPreviewError();
        }
        return {
          url: body.preview,
          durationMs:
            typeof body.duration === 'number' ? body.duration * 1000 : undefined,
        };
      }
    );
    return c.json(preview);
  } catch (err) {
    if (err instanceof NoPreviewError) {
      return c.json({ error: 'No preview available for this track' }, 404);
    }
    console.error('Deezer preview lookup failed:', err);
    return c.json({ error: 'Could not load a preview for this track' }, 502);
  }
});
