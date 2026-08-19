import { useState } from 'react';
import type { FormEvent } from 'react';
import { navigate } from 'vike/client/router';
import { ErrorPill, TextInput } from '@new-personal-monorepo/small-app-design-system';
import { importPlaylist } from '../api';

/**
 * Playlist URL input + submit. POSTs to /api/playlists and navigates to
 * /playlist/:id on success. API error messages (422 and other 4xx/5xx) are
 * surfaced verbatim in an ErrorPill.
 */
export function ImportForm() {
  const [url, setUrl] = useState('');
  const [importing, setImporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = url.trim();
    if (!trimmed || importing) return;

    setImporting(true);
    setError(null);
    try {
      const { id } = await importPlaylist(trimmed);
      navigate(`/playlist/${encodeURIComponent(id)}`);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : 'Import failed. Please try again.'
      );
      setImporting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <label
        htmlFor="playlist-url"
        className="text-xs font-semibold uppercase tracking-wider text-gray-400"
      >
        Playlist URL
      </label>
      <div className="mt-2 flex flex-col gap-3 sm:flex-row">
        <TextInput
          id="playlist-url"
          type="url"
          inputMode="url"
          autoComplete="off"
          spellCheck={false}
          placeholder="https://open.spotify.com/playlist/…"
          value={url}
          disabled={importing}
          onChange={(event) => setUrl(event.target.value)}
          className="flex-1 disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={importing || !url.trim()}
          className="shrink-0 rounded-2xl bg-blue-600 px-6 py-4 font-semibold text-white shadow-sm transition-all duration-200 hover:bg-blue-700 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 sm:self-stretch"
        >
          {importing ? 'Importing…' : 'Import'}
        </button>
      </div>

      {importing && (
        <p
          role="status"
          className="mt-3 flex items-center gap-2 text-sm text-gray-500"
        >
          <span
            aria-hidden="true"
            className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600"
          />
          Importing… this can take a few seconds
        </p>
      )}

      {error && <ErrorPill className="mt-3">{error}</ErrorPill>}
    </form>
  );
}
