/**
 * Server-side song lookup.
 *
 * Calls the provider layer in-process rather than fetching this app's own API
 * over HTTP: the Worker already holds the KV bindings and credentials, so the
 * round trip would buy nothing and cost a subrequest. The page therefore
 * arrives fully rendered — which is the point for a song page, since it is the
 * URL people share.
 */
import { render } from 'vike/abort';
import type { PageContextServer } from 'vike/types';

import { loadSongDetail, UnknownProviderError } from '../../../../worker/song';
import type { SongDetail } from '../../../../worker/types';

export async function data(
  pageContext: PageContextServer
): Promise<SongDetail> {
  const { provider, id } = pageContext.routeParams as {
    provider: string;
    id: string;
  };
  const env = pageContext.workerEnv;
  if (!env) {
    throw render(500, 'The song service is unavailable right now.');
  }

  let detail: SongDetail | null;
  try {
    detail = await loadSongDetail(env, provider, id);
  } catch (err) {
    if (err instanceof UnknownProviderError) {
      throw render(404, 'That song link is not valid — the provider is unknown.');
    }
    console.error('Song lookup failed:', err);
    throw render(503, 'We could not load this song. Please try again.');
  }
  if (!detail) {
    throw render(404, 'We could not find that song.');
  }
  return detail;
}
