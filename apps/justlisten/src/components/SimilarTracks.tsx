import type { Track } from '../../worker/types';

/**
 * "More like this" — ReccoBeats recommendations for the song being viewed.
 *
 * Every row links to this app's own `/song/spotify/:id` rather than out to a
 * platform, which is the whole reason the section is affordable. A
 * recommendation arrives carrying one durable identifier, its Spotify track id;
 * turning six of those into six sets of listen links would mean six full
 * cross-provider resolutions on a page that has already done one. Linking
 * inward defers that to the click, where exactly one of the six gets resolved
 * and the rest cost nothing.
 *
 * It also happens to be the better page: a recommendation you can only open on
 * Spotify is useless to someone who does not use Spotify, and "where can I
 * listen to this" is the question this app exists to answer.
 *
 * No artwork, deliberately. ReccoBeats' track rows carry no image URL, and the
 * alternative — resolving each row against a catalog that does — is the cost
 * this section is built to avoid. Title and artist are what it can honestly
 * show.
 */
export function SimilarTracks({
  tracks,
  className,
}: {
  tracks: Track[];
  className?: string;
}) {
  if (tracks.length === 0) return null;

  return (
    <section className={className} aria-label="More like this">
      <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-400">
        More like this
      </h2>
      {/* Pulled out by the row padding, so the titles line up with the
          heading instead of sitting indented under it. */}
      <ul className="mt-3 -mx-3 flex flex-col gap-1">
        {tracks.map((track) => (
          <li key={track.id}>
            <a
              href={`/song/spotify/${encodeURIComponent(track.id)}`}
              className="flex items-baseline gap-2 rounded-xl px-3 py-2 transition-colors hover:bg-gray-50"
            >
              <span className="min-w-0 flex-1 truncate text-sm font-medium text-gray-900">
                {track.title}
              </span>
              <span className="min-w-0 max-w-[45%] truncate text-xs text-gray-500">
                {track.artist}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
