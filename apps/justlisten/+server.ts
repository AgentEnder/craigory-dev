/**
 * The Worker entry.
 *
 * Hono owns the handful of paths that are genuinely APIs — the autocomplete
 * the search box polls, the playlist import the form POSTs, and the CSV
 * download — and `vike(app, [...])` catches everything else as SSR. Song and
 * playlist *pages* are not in that list: they load through their own `+data.ts`
 * hooks, which call the same worker modules in-process rather than over HTTP.
 *
 * `wrangler.jsonc` points `main` at `vike:server-entry`, which wraps this file.
 */
import vike from '@vikejs/hono';
import { Hono } from 'hono';

import { workerEnvMiddleware } from './worker/page-env';
import { playlistRoutes } from './worker/routes/playlist';
import { searchRoutes } from './worker/routes/search';
import type { Env } from './worker/types';

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

export type AppEnv = { Bindings: Env };

const app = new Hono<AppEnv>();

app.route('/api/search', searchRoutes);
app.route('/api/playlists', playlistRoutes);

// Error convention: { error: string } with the right status. Scoped to /api/*
// so a page render failure still reaches Vike's error page instead of being
// answered with JSON.
app.onError((err, c) => {
  console.error('Unhandled error:', err);
  if (!new URL(c.req.url).pathname.startsWith('/api/')) throw err;
  const status =
    'status' in err && typeof err.status === 'number' ? err.status : 500;
  return c.json({ error: err.message || 'Internal server error' }, status as 500);
});

// Unknown /api paths are JSON 404s; registered before the SSR catch-all so a
// typo'd endpoint doesn't render the HTML 404 page to a fetch() caller.
app.all('/api/*', (c) => c.json({ error: 'Not found' }, 404));

vike(app, [workerEnvMiddleware]);

export default {
  fetch: app.fetch,
  prod: { port },
};
