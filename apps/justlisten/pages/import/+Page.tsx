import { Card } from '@new-personal-monorepo/small-app-design-system';
import type { ProviderId } from '../../worker/types';
import { ImportForm } from '../../src/components/ImportForm';
import { ProviderBadge } from '../../src/components/ProviderBadge';

const URL_SHAPES: {
  provider: ProviderId;
  what: string;
  example: string;
  caveat?: string;
}[] = [
  {
    provider: 'spotify',
    what: 'Public playlists and albums',
    example: 'https://open.spotify.com/playlist/… or …/album/…',
  },
  {
    provider: 'youtube',
    what: 'Playlists (including YouTube Music)',
    example: 'https://www.youtube.com/playlist?list=… or https://music.youtube.com/playlist?list=…',
  },
  {
    provider: 'deezer',
    what: 'Public playlists and albums',
    example: 'https://www.deezer.com/playlist/… or …/album/…',
  },
  {
    provider: 'apple',
    what: 'Public playlists',
    example: 'https://music.apple.com/us/playlist/…/pl.…',
    caveat:
      'Apple Music support is best-effort: some playlists cannot be read without an Apple developer token and will be rejected with an explanation.',
  },
];

export function Page() {
  return (
    <div className="mx-auto max-w-xl">
      <a href="/"
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 transition-colors hover:text-ink"
      >
        <span aria-hidden="true">←</span> Back to search
      </a>

      <Card>
        <h1 className="text-2xl font-bold text-gray-900">Import a playlist</h1>
        <p className="mt-2 text-sm text-gray-600">
          Paste a playlist link and we'll build a shareable page with listen
          links for every track on Spotify, Apple Music, YouTube Music, and
          Deezer.
        </p>

        <div className="mt-6">
          <ImportForm />
        </div>

        <section className="mt-8" aria-label="Supported playlist links">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-400">
            Supported links
          </h2>
          <ul className="mt-3 space-y-3">
            {URL_SHAPES.map(({ provider, what, example, caveat }) => (
              <li
                key={provider}
                className="rounded-xl border border-gray-100 bg-gray-50/50 px-4 py-3"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <ProviderBadge provider={provider} />
                  <span className="text-sm font-medium text-gray-700">
                    {what}
                  </span>
                </div>
                <p className="mt-1.5 break-all font-mono text-xs text-gray-500">
                  {example}
                </p>
                {caveat && (
                  <p className="mt-1.5 text-xs text-gray-500">{caveat}</p>
                )}
              </li>
            ))}
          </ul>
        </section>

        <p className="mt-6 rounded-xl bg-ink/5 px-4 py-3 text-sm text-ink">
          Imported playlists are ephemeral: they expire{' '}
          <strong>7 days</strong> after import. Re-import the playlist any time
          to get a fresh link.
        </p>
      </Card>
    </div>
  );
}
