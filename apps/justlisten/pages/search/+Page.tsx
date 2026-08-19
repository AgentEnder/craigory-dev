import { useEffect, useState } from 'react';
import { usePageContext } from 'vike-react/usePageContext';
import {
  AppHeader,
  Card,
  ErrorPill,
} from '@new-personal-monorepo/small-app-design-system';
import type {
  AggregatedSearch,
  AggregatedSearchResult,
  SearchCatalogStatus,
} from '../../worker/types';
import { searchAllTracks } from '../../src/api';
import { Artwork } from '../../src/components/Artwork';
import { SearchBox } from '../../src/components/SearchBox';
import { PROVIDER_LABELS, ProviderBadge } from '../../src/components/ProviderBadge';
import {
  DeezerCueButton,
  DeezerPlayerPanel,
  useDeezerPlayer,
} from '../../src/components/DeezerPlayer';
import type { DeezerEmbed as DeezerEmbedTarget } from '../../worker/providers/links';

const RESULT_LIMIT = 25;

function formatDuration(ms: number | undefined): string | undefined {
  if (typeof ms !== 'number' || ms <= 0) return undefined;
  const totalSeconds = Math.round(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

type State =
  | { kind: 'idle' }
  | { kind: 'loading' }
  | { kind: 'error'; message: string }
  | { kind: 'ready'; data: AggregatedSearch };

/**
 * The deliberate, full search: unlike the per-keystroke autocomplete it fans
 * out across every catalog, so a recording only one platform carries still
 * turns up. Each row reports which catalogs actually list it — that comes
 * free from the server-side dedupe, with no per-provider resolution.
 */
export function Page() {
  const pageContext = usePageContext();
  const query = (pageContext.urlParsed.search.q ?? '').trim();
  const [state, setState] = useState<State>({ kind: 'idle' });

  useEffect(() => {
    if (query.length < 2) {
      setState({ kind: 'idle' });
      return;
    }
    setState({ kind: 'loading' });
    const controller = new AbortController();
    searchAllTracks(query, RESULT_LIMIT, { signal: controller.signal })
      .then((data) => setState({ kind: 'ready', data }))
      .catch((err: unknown) => {
        if (controller.signal.aborted) return;
        setState({
          kind: 'error',
          message: err instanceof Error ? err.message : 'Search failed.',
        });
      });
    return () => controller.abort();
  }, [query]);

  return (
    <>
      <AppHeader title="JustListen" tagline="Find where to listen to any song" />
      <main className="mx-auto max-w-2xl">
        <a href="/"
          className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 transition-colors hover:text-blue-600"
        >
          <span aria-hidden="true">←</span> Back to search
        </a>

        {/* Keyed on the query so navigating between searches reseeds the input. */}
        <SearchBox key={query} initialQuery={query} className="mb-8" />

        {state.kind === 'idle' && (
          <p className="text-sm text-gray-500">
            Type at least two characters to search.
          </p>
        )}

        {state.kind === 'loading' && <ResultsSkeleton />}

        {state.kind === 'error' && (
          <Card>
            <ErrorPill>{state.message}</ErrorPill>
          </Card>
        )}

        {state.kind === 'ready' && (
          <SearchResults query={query} data={state.data} />
        )}
      </main>
    </>
  );
}

function ResultsSkeleton() {
  return (
    <div aria-busy="true" aria-label="Searching" className="animate-pulse space-y-3">
      {[0, 1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-3"
        >
          <div className="h-14 w-14 shrink-0 rounded-xl bg-gray-200" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-2/3 rounded bg-gray-200" />
            <div className="h-3 w-1/2 rounded bg-gray-100" />
          </div>
        </div>
      ))}
    </div>
  );
}

function SearchResults({
  query,
  data,
}: {
  query: string;
  data: AggregatedSearch;
}) {
  const { results, catalogs } = data;
  // No fallback target: a search has no whole-collection Deezer resource, so
  // the player appears only once a row is cued.
  const player = useDeezerPlayer();

  if (results.length === 0) {
    return (
      <Card>
        <h2 className="text-lg font-semibold text-gray-900">
          No results for “{query}”
        </h2>
        <p className="mt-2 text-sm text-gray-500">
          Try just the song title, or the artist on their own — an exact
          phrase with both can miss when a catalog spells either differently.
        </p>
        <CatalogSummary catalogs={catalogs} className="mt-4" />
      </Card>
    );
  }

  return (
    <>
      <h2 className="mb-3 text-sm font-medium text-gray-500">
        {results.length} {results.length === 1 ? 'result' : 'results'} for “
        {query}”
      </h2>
      <DeezerPlayerPanel player={player} returnLabel="Close" />

      <ul className="mt-3 space-y-3">
        {results.map((result) => {
          const key = `${result.track.provider}:${result.track.id}`;
          return (
            <ResultRow
              key={key}
              result={result}
              isCued={player.cued?.key === key}
              isPlaying={player.cued?.key === key && player.playing}
              onCue={(target, label) => player.cue(key, target, label)}
            />
          );
        })}
      </ul>
      <CatalogSummary catalogs={catalogs} className="mt-6" />
    </>
  );
}

function ResultRow({
  result,
  isCued,
  isPlaying,
  onCue,
}: {
  result: AggregatedSearchResult;
  isCued: boolean;
  isPlaying: boolean;
  onCue: (target: DeezerEmbedTarget, label: string) => void;
}) {
  const { track, sources } = result;
  const year = track.releaseDate?.slice(0, 4);
  const duration = formatDuration(track.durationMs);
  const meta = [track.album, year, duration].filter(Boolean).join(' · ');
  const label = `${track.title} by ${track.artist}`;
  // `sources` already carries each catalog's native id, so a Deezer hit needs
  // no link parsing to become an embed target.
  const deezerId = sources.find((source) => source.provider === 'deezer')?.id;

  return (
    // The card is the <li>, not the link: a cue button cannot be nested inside
    // an anchor, and the row still has to navigate to the song page.
    <li className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white p-3 transition-all duration-200 hover:border-blue-300 hover:shadow-sm">
      {deezerId ? (
        <DeezerCueButton
          target={{ type: 'track', id: deezerId }}
          label={label}
          isCued={isCued}
          isPlaying={isPlaying}
          onCue={onCue}
        />
      ) : (
        <span className="w-6 shrink-0" aria-hidden="true" />
      )}
      <a
        href={`/song/${track.provider}/${encodeURIComponent(track.id)}`}
        className="flex min-w-0 flex-1 items-center gap-4 active:scale-[0.99]"
      >
        <Artwork
          url={track.artworkUrl}
          alt={`Album artwork for ${label}`}
          className="h-14 w-14 shrink-0 rounded-xl"
        />
        <div className="min-w-0 flex-1">
          <p className="truncate font-medium text-gray-900">{track.title}</p>
          <p className="truncate text-sm text-gray-600">{track.artist}</p>
          {meta && <p className="truncate text-xs text-gray-400">{meta}</p>}
          <div className="mt-1.5 flex flex-wrap gap-1">
            {sources.map((source) => (
              <ProviderBadge key={source.provider} provider={source.provider} />
            ))}
          </div>
        </div>
        <span aria-hidden="true" className="shrink-0 text-gray-300">
          →
        </span>
      </a>
    </li>
  );
}

/**
 * Names the catalogs that were actually queried and why any is missing —
 * a silently-skipped catalog would otherwise read as "not available there".
 */
function CatalogSummary({
  catalogs,
  className,
}: {
  catalogs: SearchCatalogStatus[];
  className?: string;
}) {
  const searched = catalogs.filter((c) => c.available && c.ok);
  const unconfigured = catalogs.filter((c) => !c.available);
  const failed = catalogs.filter((c) => c.available && !c.ok);
  const names = (list: SearchCatalogStatus[]) =>
    list.map((c) => PROVIDER_LABELS[c.provider]).join(', ');

  return (
    <div className={className}>
      <p className="text-xs text-gray-400">
        {searched.length > 0
          ? `Searched ${names(searched)}.`
          : 'No catalogs could be searched.'}{' '}
        YouTube Music links are resolved when you open a song — its search API
        is too quota-expensive to query here.
      </p>
      {unconfigured.length > 0 && (
        <p className="mt-1 text-xs text-gray-400">
          Not searched (no credentials configured): {names(unconfigured)}.
        </p>
      )}
      {failed.length > 0 && (
        <p className="mt-1 text-xs text-amber-600">
          Temporarily unavailable: {names(failed)}.
        </p>
      )}
    </div>
  );
}
