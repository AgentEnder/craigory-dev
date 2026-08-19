import { Link } from 'react-router-dom';
import { AppHeader } from '@new-personal-monorepo/small-app-design-system';
import { SearchBox } from '../components/SearchBox';
import { ProviderBadge } from '../components/ProviderBadge';

export function HomePage() {
  return (
    <>
      <AppHeader
        title="JustListen"
        tagline="Find where to listen to any song"
      />
      <main className="mx-auto max-w-xl">
        <section className="pt-4 text-center sm:pt-10">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            One song, every platform.
          </h2>
          <p className="mt-3 text-base text-gray-500">
            Search any track and get listen links for Spotify, Apple Music, and
            YouTube Music.
          </p>
        </section>

        <section className="mt-8" aria-label="Song search">
          <SearchBox autoFocus />
        </section>

        <div
          className="mt-4 flex flex-wrap items-center justify-center gap-2"
          aria-hidden="true"
        >
          <ProviderBadge provider="spotify" />
          <ProviderBadge provider="apple" />
          <ProviderBadge provider="youtube" />
        </div>

        <div className="mt-12 text-center">
          <Link
            to="/import"
            className="inline-flex items-center gap-2 rounded-2xl border border-gray-200 bg-white px-5 py-3 text-sm font-medium text-gray-700 transition-all duration-200 hover:border-blue-300 hover:text-blue-600 active:scale-[0.98]"
          >
            Import a playlist
            <span aria-hidden="true">→</span>
          </Link>
          <p className="mt-3 text-xs text-gray-400">
            Paste a Spotify, Apple Music, or YouTube playlist link to get listen
            links for every track.
          </p>
        </div>
      </main>
    </>
  );
}
