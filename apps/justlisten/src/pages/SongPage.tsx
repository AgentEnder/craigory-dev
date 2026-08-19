import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Card, ErrorPill } from '@new-personal-monorepo/small-app-design-system';
import type { ProviderId, ProviderLink, SongDetail } from '../../worker/types';
import { getSong } from '../api';
import { Artwork } from '../components/Artwork';
import { ProviderLinkButton } from '../components/ProviderBadge';

const PROVIDER_ORDER: readonly ProviderId[] = ['spotify', 'apple', 'youtube'];

function isProviderId(value: string | undefined): value is ProviderId {
  return value === 'spotify' || value === 'apple' || value === 'youtube';
}

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

type State =
  | { kind: 'loading' }
  | { kind: 'error'; message: string }
  | { kind: 'ready'; song: SongDetail };

export function SongPage() {
  const { provider, id } = useParams<{ provider: string; id: string }>();
  const [state, setState] = useState<State>({ kind: 'loading' });

  useEffect(() => {
    if (!isProviderId(provider) || !id) {
      setState({
        kind: 'error',
        message: 'That song link is not valid — the provider is unknown.',
      });
      return;
    }
    setState({ kind: 'loading' });
    const controller = new AbortController();
    getSong(provider, id, { signal: controller.signal })
      .then((song) => setState({ kind: 'ready', song }))
      .catch((err: unknown) => {
        if (controller.signal.aborted) return;
        setState({
          kind: 'error',
          message:
            err instanceof Error ? err.message : 'Failed to load this song.',
        });
      });
    return () => controller.abort();
  }, [provider, id]);

  useEffect(() => {
    if (state.kind !== 'ready') return;
    const previous = document.title;
    document.title = `${state.song.track.title} · JustListen`;
    return () => {
      document.title = previous;
    };
  }, [state]);

  return (
    <div className="mx-auto max-w-xl">
      <Link
        to="/"
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 transition-colors hover:text-blue-600"
      >
        <span aria-hidden="true">←</span> Back to search
      </Link>

      {state.kind === 'loading' && <SongSkeleton />}

      {state.kind === 'error' && (
        <Card>
          <ErrorPill>{state.message}</ErrorPill>
          <p className="mt-4 text-sm text-gray-500">
            Try searching again from the{' '}
            <Link to="/" className="font-medium text-blue-600 hover:underline">
              home page
            </Link>
            .
          </p>
        </Card>
      )}

      {state.kind === 'ready' && <SongDetailCard song={state.song} />}
    </div>
  );
}

function SongSkeleton() {
  return (
    <Card aria-busy="true" aria-label="Loading song details">
      <div className="animate-pulse">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
          <div className="h-40 w-40 shrink-0 rounded-2xl bg-gray-200" />
          <div className="w-full flex-1 space-y-3 pt-2">
            <div className="mx-auto h-7 w-3/4 rounded-lg bg-gray-200 sm:mx-0" />
            <div className="mx-auto h-5 w-1/2 rounded-lg bg-gray-200 sm:mx-0" />
            <div className="mx-auto h-4 w-2/3 rounded-lg bg-gray-100 sm:mx-0" />
          </div>
        </div>
        <div className="mt-8 space-y-3">
          <div className="h-13 rounded-2xl bg-gray-200" />
          <div className="h-13 rounded-2xl bg-gray-100" />
          <div className="h-13 rounded-2xl bg-gray-100" />
        </div>
      </div>
    </Card>
  );
}

function SongDetailCard({ song }: { song: SongDetail }) {
  const { track, links } = song;
  const orderedLinks = PROVIDER_ORDER.map((p) =>
    links.find((link) => link.provider === p)
  ).filter((link): link is ProviderLink => link !== undefined);

  const release = formatReleaseDate(track.releaseDate);
  const meta = [track.album, release && `Released ${release}`]
    .filter(Boolean)
    .join(' · ');
  const trackLabel = `${track.title} by ${track.artist}`;

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
