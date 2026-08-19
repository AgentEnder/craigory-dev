import type { PageContext } from 'vike/types';

import type { PlaylistView } from '../../../worker/playlists';

export default function title(pageContext: PageContext): string {
  const playlist = pageContext.data as PlaylistView | undefined;
  return playlist ? `${playlist.title} · JustListen` : 'Playlist · JustListen';
}
