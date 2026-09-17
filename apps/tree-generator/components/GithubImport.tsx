import { useState } from 'react';
import { ErrorPill } from '@new-personal-monorepo/small-app-design-system';
import {
  DEFAULT_DEPTH,
  DEFAULT_REF,
  entriesToSource,
  parseRepoRef,
  treeUrl,
} from '../src/github';

interface GithubImportProps {
  onImport: (source: string, notice: string) => void;
  onClose: () => void;
  /** True when there is work in the field that an import would overwrite. */
  replacing: boolean;
}

/**
 * Say what went wrong in terms of what the user can do about it.
 *
 * GitHub exposes its rate-limit headers to cross-origin readers, so the one
 * failure people will actually hit can name the time it clears rather than
 * being a shrug.
 */
async function describe(response: Response): Promise<string> {
  if (response.status === 404) {
    return 'No repository or ref by that name. Private repositories need a token, and this tool does not ask for one.';
  }

  if (response.status === 403 || response.status === 429) {
    if (response.headers.get('x-ratelimit-remaining') === '0') {
      const reset = Number(response.headers.get('x-ratelimit-reset'));
      const at = Number.isFinite(reset)
        ? new Date(reset * 1000).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })
        : null;
      return `GitHub allows 60 unauthenticated requests an hour and this address has spent them${
        at ? `. They come back at ${at}` : ''
      }.`;
    }
    return 'GitHub refused the request.';
  }

  // An empty repository has no tree to return.
  if (response.status === 409) return 'That repository is empty.';

  return `GitHub returned ${response.status}.`;
}

export function GithubImport({
  onImport,
  onClose,
  replacing,
}: GithubImportProps) {
  const [input, setInput] = useState('');
  const [ref, setRef] = useState('');
  const [depth, setDepth] = useState(DEFAULT_DEPTH);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Shown as the branch field's placeholder, so a pasted /tree/ URL visibly
  // fills it in without the field having to be kept in sync with the input.
  const parsed = parseRepoRef(input);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!parsed) {
      setError('Give a repository as owner/repo, or paste a github.com URL.');
      return;
    }

    const target = { ...parsed, ref: ref.trim() || parsed.ref };
    setBusy(true);
    setError(null);

    try {
      const response = await fetch(treeUrl(target), {
        headers: { Accept: 'application/vnd.github+json' },
      });

      if (!response.ok) {
        setError(await describe(response));
        return;
      }

      const body = await response.json();
      const { source, omitted } = entriesToSource(body.tree ?? [], depth);

      if (!source) {
        setError(
          `Nothing at depth ${depth} in ${target.owner}/${target.repo}.`
        );
        return;
      }

      const lines = source.split('\n').length;
      const short = [
        omitted && `${omitted} more at this depth`,
        // GitHub stops early on very large repositories and says so.
        body.truncated && 'GitHub truncated the response',
      ].filter(Boolean);

      onImport(
        source,
        `Imported ${lines} lines from ${target.owner}/${target.repo}${
          short.length ? ` (${short.join(', ')})` : ''
        }`
      );
    } catch {
      setError('Could not reach GitHub. Check the connection and try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="mb-4 p-3 bg-gray-50 rounded-2xl">
      <div className="flex flex-wrap items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          autoFocus
          placeholder="owner/repo, or a github.com URL"
          aria-label="Repository"
          className="flex-1 min-w-[12rem] px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <input
          type="text"
          value={ref}
          onChange={(e) => setRef(e.target.value)}
          placeholder={parsed?.ref ?? DEFAULT_REF}
          aria-label="Branch, tag or commit"
          title="Leave empty for the default branch"
          className="w-28 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <label className="flex items-center gap-2 text-sm text-gray-600">
          Depth
          <input
            type="number"
            min={1}
            max={10}
            value={depth}
            onChange={(e) => {
              const next = Number(e.target.value);
              if (Number.isFinite(next)) setDepth(next);
            }}
            title="How many levels to bring in. A big repository is roughly 20 lines at depth 1 and 150 at depth 2."
            className="w-16 px-2 py-1.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </label>
        <button
          type="submit"
          disabled={busy}
          className="bg-black text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition-all duration-200 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {busy ? 'Importing…' : 'Import'}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="px-3 py-1.5 rounded-lg text-sm text-gray-500 hover:text-gray-800 transition-colors"
        >
          Cancel
        </button>
      </div>

      {error && <ErrorPill className="mt-3">{error}</ErrorPill>}

      {!error && replacing && (
        <p className="mt-2 text-xs text-gray-400">
          Importing replaces what is in the field.
        </p>
      )}
    </form>
  );
}
