/**
 * Server-side playlist lookup.
 *
 * Reads the stored playlist straight from KV and builds its open-links in
 * process — both are work the Worker already has the bindings for, so the page
 * renders complete rather than fetching itself over HTTP after hydration.
 */
import { render } from 'vike/abort';
import type { PageContextServer } from 'vike/types';

import { loadPlaylistView, type PlaylistView } from '../../../worker/playlists';

const EXPIRED_MESSAGE =
  'Playlist not found. Imported playlists expire after 7 days — ' +
  'you can re-import it from its original URL.';

export async function data(
  pageContext: PageContextServer
): Promise<PlaylistView> {
  const { id } = pageContext.routeParams as { id: string };
  const env = pageContext.workerEnv;
  if (!env) {
    throw render(500, 'The playlist service is unavailable right now.');
  }

  let playlist: PlaylistView | null;
  try {
    playlist = await loadPlaylistView(env, id);
  } catch (err) {
    console.error('Playlist lookup failed:', err);
    throw render(503, 'We could not load this playlist. Please try again.');
  }
  if (!playlist) {
    throw render(404, EXPIRED_MESSAGE);
  }
  return playlist;
}
