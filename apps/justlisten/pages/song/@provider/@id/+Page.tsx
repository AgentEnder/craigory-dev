import { Card } from '@new-personal-monorepo/small-app-design-system';
import { useData } from 'vike-react/useData';

import { Artwork } from '../../../../src/components/Artwork';
import { DeezerEmbed } from '../../../../src/components/DeezerEmbed';
import { ProviderLinkButton } from '../../../../src/components/ProviderBadge';
import { deezerEmbedFromLinks } from '../../../../worker/providers/links';
import type { ProviderLink, SongDetail } from '../../../../worker/types';
import { PROVIDER_IDS } from '../../../../worker/types';

/**
 * iTunes/Apple artwork URLs embed the size (…/100x100bb.jpg) and serve any
 * requested size, so ask for a detail-page-worthy one. Non-matching URLs
 * (e.g. Spotify CDN) pass through untouched.
 */
function upscaleArtwork(url: string | undefined): string | undefined {
  return url?.replace(/\/(\d{2,4})x\1([a-z-]*)\.(jpg|png)$/i, '/400x400$2.$3');
}

function formatReleaseDate(value: string | undefined): string | undefined {
  if (!value) return undefined;
  if (/^\d{4}$/.test(value)) return value;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  });
}

/**
 * The song data is resolved server-side in `+data.ts`, so there is no loading
 * or error state to model here — a miss aborts to the error page during render.
 */
export function Page() {
  const song = useData<SongDetail>();

  return (
    <div className="mx-auto max-w-xl">
      <a
        href="/"
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 transition-colors hover:text-blue-600"
      >
        <span aria-hidden="true">←</span> Back to search
      </a>
      <SongDetailCard song={song} />
    </div>
  );
}

function SongDetailCard({ song }: { song: SongDetail }) {
  const { track, links } = song;
  const orderedLinks = PROVIDER_IDS.map((p) =>
    links.find((link) => link.provider === p)
  ).filter((link): link is ProviderLink => link !== undefined);

  const release = formatReleaseDate(track.releaseDate);
  const meta = [track.album, release && `Released ${release}`]
    .filter(Boolean)
    .join(' · ');
  const trackLabel = `${track.title} by ${track.artist}`;

  const embed = deezerEmbedFromLinks(links);

  return (
    <Card>
      <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:items-start sm:text-left">
        <Artwork
          url={upscaleArtwork(track.artworkUrl)}
          fallbackUrl={track.artworkUrl}
          alt={`Album artwork for ${trackLabel}`}
          className="h-40 w-40 shrink-0 rounded-2xl shadow-md"
        />
        <div className="min-w-0 flex-1 sm:pt-2">
          <h1 className="break-words text-2xl font-bold text-gray-900 sm:text-3xl">
            {track.title}
          </h1>
          <p className="mt-1 text-lg text-gray-600">{track.artist}</p>
          {meta && <p className="mt-2 text-sm text-gray-500">{meta}</p>}
        </div>
      </div>

      {embed && (
        <section className="mt-8" aria-label="Preview">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-400">
            Preview
          </h2>
          <div className="mt-3">
            <DeezerEmbed target={embed} title={`Deezer player for ${trackLabel}`} />
          </div>
          <p className="mt-2 text-xs text-gray-400">
            30-second preview from Deezer — sign in to Deezer to hear the full
            track.
          </p>
        </section>
      )}

      <section className="mt-8" aria-label="Listen on">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-400">
          Listen on
        </h2>
        <div className="mt-3 flex flex-col gap-3">
          {orderedLinks.map((link) => (
            <ProviderLinkButton
              key={link.provider}
              link={link}
              trackLabel={trackLabel}
            />
          ))}
        </div>
        {orderedLinks.some((link) => link.kind === 'search') && (
          <p className="mt-3 text-xs text-gray-400">
            “Search on …” opens that platform's search — we couldn't confirm an
            exact match there.
          </p>
        )}
      </section>
    </Card>
  );
}
