import type { PageContext } from 'vike/types';

import type { SongDetail } from '../../../../worker/types';

/**
 * A runtime `title` has to live in its own `+title.ts` — Vike serializes
 * `+config.ts` values and cannot carry a function across that boundary.
 */
export default function title(pageContext: PageContext): string {
  const song = pageContext.data as SongDetail | undefined;
  return song ? `${song.track.title} · JustListen` : 'Song · JustListen';
}
