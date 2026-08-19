import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Card, ErrorPill } from '@new-personal-monorepo/small-app-design-system';
import { ApiError, getPlaylist } from '../api';
import type { PlaylistWithOpenLinks } from '../api';
import { PlaylistView } from '../components/PlaylistView';

type State =
  | { kind: 'loading' }
  | { kind: 'missing'; message: string }
  | { kind: 'error'; message: string }
  | { kind: 'ready'; playlist: PlaylistWithOpenLinks };

export function PlaylistPage() {
  const { id } = useParams<{ id: string }>();
  const [state, setState] = useState<State>({ kind: 'loading' });

  useEffect(() => {
    if (!id) {
      setState({ kind: 'missing', message: 'That playlist link is not valid.' });
      return;
    }
    setState({ kind: 'loading' });
    const controller = new AbortController();
    getPlaylist(id, { signal: controller.signal })
      .then((playlist) => setState({ kind: 'ready', playlist }))
      .catch((err: unknown) => {
        if (controller.signal.aborted) return;
        if (err instanceof ApiError && err.status === 404) {
          setState({ kind: 'missing', message: err.message });
        } else {
          setState({
            kind: 'error',
            message:
              err instanceof Error
                ? err.message
                : 'Failed to load this playlist.',
          });
        }
      });
    return () => controller.abort();
  }, [id]);

  useEffect(() => {
    if (state.kind !== 'ready') return;
    const previous = document.title;
    document.title = `${state.playlist.title} · JustListen`;
    return () => {
      document.title = previous;
    };
  }, [state]);

  return (
    <div className="mx-auto max-w-3xl">
      <Link
        to="/"
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 transition-colors hover:text-blue-600"
      >
        <span aria-hidden="true">←</span> Back to search
      </Link>

      {state.kind === 'loading' && <PlaylistSkeleton />}

      {state.kind === 'missing' && (
        <Card className="text-center">
          <p aria-hidden="true" className="text-4xl text-gray-300">
            ♪
          </p>
          <h1 className="mt-3 text-xl font-bold text-gray-900">
            Playlist not found
          </h1>
          <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
            {state.message} Imported playlists expire after 7 days, so this one
            may simply have reached the end of its stay.
          </p>
          <Link
            to="/import"
            className="mt-6 inline-block rounded-2xl bg-blue-600 px-6 py-3 font-semibold text-white shadow-sm transition-all duration-200 hover:bg-blue-700 active:scale-[0.98]"
          >
            Import it again
          </Link>
        </Card>
      )}

      {state.kind === 'error' && (
        <Card>
          <ErrorPill>{state.message}</ErrorPill>
          <p className="mt-4 text-sm text-gray-500">
            Try reloading, or{' '}
            <Link
              to="/import"
              className="font-medium text-blue-600 hover:underline"
            >
              import the playlist again
            </Link>
            .
          </p>
        </Card>
      )}

      {state.kind === 'ready' && <PlaylistView playlist={state.playlist} />}
    </div>
  );
}

function PlaylistSkeleton() {
  return (
    <Card aria-busy="true" aria-label="Loading playlist">
      <div className="animate-pulse">
        <div className="h-5 w-24 rounded-full bg-gray-200" />
        <div className="mt-3 h-8 w-2/3 rounded-lg bg-gray-200" />
        <div className="mt-2 h-4 w-1/3 rounded-lg bg-gray-100" />
        <div className="mt-5 flex gap-2">
          <div className="h-9 w-32 rounded-full bg-gray-200" />
          <div className="h-9 w-32 rounded-full bg-gray-100" />
          <div className="h-9 w-32 rounded-full bg-gray-100" />
        </div>
        <div className="mt-8 space-y-4">
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-gray-200" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-1/2 rounded bg-gray-200" />
                <div className="h-3 w-1/3 rounded bg-gray-100" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
