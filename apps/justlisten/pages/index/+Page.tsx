import { AppHeader } from '@new-personal-monorepo/small-app-design-system';
import { Logo } from '../../src/components/Logo';
import { SearchBox } from '../../src/components/SearchBox';
import { ProviderBadge } from '../../src/components/ProviderBadge';

export function Page() {
  return (
    <>
      <div className="mb-3 flex justify-center">
        <Logo size={44} />
      </div>
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
            Search any track and get listen links for Spotify, Apple Music,
            YouTube Music, and Deezer.
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
          <ProviderBadge provider="deezer" />
        </div>

        <div className="mt-12 text-center">
          <a href="/import"
            className="inline-flex items-center gap-2 rounded-2xl border border-gray-200 bg-white px-5 py-3 text-sm font-medium text-gray-700 transition-all duration-200 hover:border-blue-300 hover:text-blue-600 active:scale-[0.98]"
          >
            Import a playlist
            <span aria-hidden="true">→</span>
          </a>
          <p className="mt-3 text-xs text-gray-400">
            Paste a Spotify, Apple Music, YouTube, or Deezer playlist link to
            get listen links for every track.
          </p>
        </div>
      </main>
    </>
  );
}
