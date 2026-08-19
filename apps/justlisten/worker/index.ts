import { Hono } from 'hono';
import type { Env } from './types';
import { searchRoutes } from './routes/search';
import { songRoutes } from './routes/song';
import { playlistRoutes } from './routes/playlist';

export type AppEnv = { Bindings: Env };

const app = new Hono<AppEnv>();

// API routes.
app.route('/api/search', searchRoutes);
app.route('/api/song', songRoutes);
app.route('/api/playlists', playlistRoutes);

// Error convention: { error: string } with proper HTTP status.
app.onError((err, c) => {
  console.error('Unhandled error:', err);
  const status =
    'status' in err && typeof err.status === 'number' ? err.status : 500;
  return c.json(
    { error: err.message || 'Internal server error' },
    status as 500
  );
});

// Unknown /api routes are JSON 404s; everything else falls through to the
// static assets binding (SPA with not_found_handling: single-page-application).
app.all('*', async (c) => {
  if (new URL(c.req.url).pathname.startsWith('/api/')) {
    return c.json({ error: 'Not found' }, 404);
  }
  return c.env.ASSETS.fetch(c.req.raw);
});

export default app;
