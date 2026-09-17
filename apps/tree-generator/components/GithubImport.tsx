import { useMemo, useState } from 'react';
import { ErrorPill, cx } from '@new-personal-monorepo/small-app-design-system';
import {
  DEFAULT_DEPTH,
  DEFAULT_REF,
  entriesToSource,
  parseRepoRef,
  selectEntries,
  topLevelPaths,
  treeUrl,
  type RepoRef,
  type TreeEntry,
} from '../src/github';
import { parsePatterns } from '../src/glob';

interface GithubImportProps {
  onImport: (source: string, notice: string) => void;
  onClose: () => void;
  /** True when there is work in the field that an import would overwrite. */
  replacing: boolean;
}

/** A tree already fetched, held so that narrowing it costs no request. */
interface Fetched {
  repo: RepoRef;
  entries: TreeEntry[];
  truncated: boolean;
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

const FIELD =
  'px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent';

/**
 * Import a repository's file tree, in two steps.
 *
 * Fetching and narrowing are separate because you cannot sensibly say which
 * directories to keep before you have seen them. Depth alone brought in a
 * hundred and forty lines of tooling directories for a real repository, which
 * is most of the way to useless.
 *
 * The fetched tree is held here, so unticking a directory or editing a pattern
 * re-filters what is already in hand. Sixty unauthenticated requests an hour
 * does not stretch to one per keystroke.
 */
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

  const [fetched, setFetched] = useState<Fetched | null>(null);
  const [dropped, setDropped] = useState<Set<string>>(new Set());
  const [only, setOnly] = useState('');
  const [except, setExcept] = useState('');

  // Shown as the branch field's placeholder, so a pasted /tree/ URL visibly
  // fills it in without the field having to be kept in sync with the input.
  const parsed = parseRepoRef(input);

  const roots = useMemo(
    () => (fetched ? topLevelPaths(fetched.entries) : []),
    [fetched]
  );

  const preview = useMemo(() => {
    if (!fetched) return null;
    const selected = selectEntries(fetched.entries, {
      only: parsePatterns(only),
      // An unticked directory is an exclusion like any other, so the chips and
      // the field are one mechanism rather than two that can disagree.
      except: [...dropped, ...parsePatterns(except)],
    });
    return entriesToSource(selected, depth);
  }, [fetched, dropped, only, except, depth]);

  const lines = preview?.source ? preview.source.split('\n').length : 0;

  const fetchTree = async () => {
    if (!parsed) {
      setError('Give a repository as owner/repo, or paste a github.com URL.');
      return;
    }

    const repo = { ...parsed, ref: ref.trim() || parsed.ref };
    setBusy(true);
    setError(null);

    try {
      const response = await fetch(treeUrl(repo), {
        headers: { Accept: 'application/vnd.github+json' },
      });

      if (!response.ok) {
        setError(await describe(response));
        return;
      }

      const body = await response.json();
      setFetched({
        repo,
        entries: body.tree ?? [],
        truncated: Boolean(body.truncated),
      });
      setDropped(new Set());
    } catch {
      setError('Could not reach GitHub. Check the connection and try again.');
    } finally {
      setBusy(false);
    }
  };

  const insert = () => {
    if (!fetched || !preview?.source) return;
    const { owner, repo } = fetched.repo;
    const aside = [
      preview.omitted && `${preview.omitted} more at this depth`,
      fetched.truncated && 'GitHub truncated the response',
    ].filter(Boolean);

    onImport(
      preview.source,
      `Imported ${lines} lines from ${owner}/${repo}${
        aside.length ? ` (${aside.join(', ')})` : ''
      }`
    );
  };

  const toggle = (path: string) =>
    setDropped((current) => {
      const next = new Set(current);
      if (!next.delete(path)) next.add(path);
      return next;
    });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (fetched) insert();
        else void fetchTree();
      }}
      className="mb-4 p-3 bg-gray-50 rounded-2xl"
    >
      <div className="flex flex-wrap items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            // The tree in hand belongs to the old repo name.
            setFetched(null);
          }}
          autoFocus
          placeholder="owner/repo, or a github.com URL"
          aria-label="Repository"
          className={cx(FIELD, 'flex-1 min-w-[12rem]')}
        />
        <input
          type="text"
          value={ref}
          onChange={(e) => {
            setRef(e.target.value);
            setFetched(null);
          }}
          placeholder={parsed?.ref ?? DEFAULT_REF}
          aria-label="Branch, tag or commit"
          title="Leave empty for the default branch"
          className={cx(FIELD, 'w-28 font-mono')}
        />
        <button
          type="submit"
          disabled={busy || (Boolean(fetched) && !lines)}
          className="bg-black text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition-all duration-200 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {busy ? 'Fetching…' : fetched ? `Insert ${lines} lines` : 'Fetch'}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="px-3 py-1.5 rounded-lg text-sm text-gray-500 hover:text-gray-800 transition-colors"
        >
          Cancel
        </button>
      </div>

      {fetched && (
        <>
          <div className="mt-3 flex flex-wrap items-center gap-2">
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
                className={cx(FIELD, 'w-16')}
              />
            </label>
            <input
              type="text"
              value={only}
              onChange={(e) => setOnly(e.target.value)}
              placeholder="only  e.g. apps/**"
              aria-label="Only these paths"
              title="Globs over the whole path. ** crosses directories, * stops at one. Naming a directory covers everything in it."
              className={cx(FIELD, 'flex-1 min-w-[9rem] font-mono')}
            />
            <input
              type="text"
              value={except}
              onChange={(e) => setExcept(e.target.value)}
              placeholder="except  e.g. **/*.test.ts"
              aria-label="Except these paths"
              title="Globs over the whole path. Anything matching here is dropped, whatever the other field said."
              className={cx(FIELD, 'flex-1 min-w-[9rem] font-mono')}
            />
          </div>

          {/* Capped and scrollable: a repository root can run to thirty
              entries, and this sits above the field it is about to fill. */}
          <div className="mt-2 flex flex-wrap gap-1.5 max-h-20 overflow-auto">
            {roots.map((entry) => {
              const keeping = !dropped.has(entry.path);
              return (
                <button
                  key={entry.path}
                  type="button"
                  aria-pressed={keeping}
                  onClick={() => toggle(entry.path)}
                  className={cx(
                    'px-2 py-0.5 rounded-md border text-xs font-mono transition-all duration-150',
                    'focus:outline-none focus:ring-2 focus:ring-blue-500',
                    keeping
                      ? 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
                      : 'bg-transparent border-gray-200 text-gray-400 line-through hover:text-gray-500'
                  )}
                >
                  {entry.path}
                  {entry.type === 'tree' ? '/' : ''}
                </button>
              );
            })}
          </div>
        </>
      )}

      {error && <ErrorPill className="mt-3">{error}</ErrorPill>}

      {!error && fetched && !lines && (
        <p className="mt-2 text-xs text-amber-600">
          Nothing left to import. Widen the filters or raise the depth.
        </p>
      )}

      {!error && replacing && (
        <p className="mt-2 text-xs text-gray-400">
          Importing replaces what is in the field.
        </p>
      )}
    </form>
  );
}
