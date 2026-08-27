import { useData } from 'vike-react/useData';

import { PlaylistView as PlaylistViewCard } from '../../../src/components/PlaylistView';
import type { PlaylistView } from '../../../worker/playlists';

/**
 * The playlist is resolved server-side in `+data.ts`; an expired or unknown id
 * aborts to the error page, so the "not found" branch lives there rather than
 * as a state in this component.
 */
export function Page() {
  const playlist = useData<PlaylistView>();

  return (
    <div className="mx-auto max-w-3xl">
      <a
        href="/"
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 transition-colors hover:text-ink"
      >
        <span aria-hidden="true">←</span> Back to search
      </a>
      <PlaylistViewCard playlist={playlist} />
    </div>
  );
}
