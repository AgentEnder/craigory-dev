import { INDENT } from './edits';
import { compilePatterns } from './glob';

/**
 * Reading a repository's file tree off GitHub.
 *
 * The fetch is unauthenticated and goes straight from the browser, which
 * GitHub allows (`Access-Control-Allow-Origin: *`) and rate limits to 60 an
 * hour per address. That is plenty for a tool someone reaches for a few times
 * a day, and it means no token has to be stored anywhere.
 */

export interface RepoRef {
  owner: string;
  repo: string;
  /**
   * Branch, tag or commit. `HEAD` resolves to the default branch, so an
   * unspecified ref costs no extra request to look one up.
   */
  ref: string;
}

export const DEFAULT_REF = 'HEAD';

/** Nesting levels imported by default. Two is about 150 lines for a big repo. */
export const DEFAULT_DEPTH = 2;

/**
 * Ceiling on imported lines, whatever the depth.
 *
 * A flat repository with thousands of files at one level would otherwise put
 * every one of them in the editor, and the source pane measures a box per line
 * to place its drag handles.
 */
export const MAX_LINES = 2000;

/**
 * Pull a repo out of whatever the user pasted.
 *
 * Accepts `owner/repo`, `owner/repo@branch`, a github.com URL with or without
 * a `/tree/<ref>` or `/blob/<ref>` tail, and an SSH remote.
 *
 * A ref containing a slash is taken as just its first segment, because
 * `/tree/feature/login` and `/tree/main/src` are the same shape and only
 * GitHub knows which is which. The branch is an editable field, so guessing
 * the common case and letting it be corrected beats refusing the URL.
 */
export function parseRepoRef(input: string): RepoRef | null {
  const path = input
    .trim()
    .replace(/^git@github\.com:/i, '')
    .replace(/^(https?:\/\/)?(www\.)?github\.com\//i, '')
    .replace(/\.git$/i, '')
    .replace(/^\/+|\/+$/g, '');

  const [owner, repoSegment, ...rest] = path.split('/');
  if (!owner || !repoSegment) return null;

  const [repo, suffixRef] = repoSegment.split('@');
  if (!repo) return null;

  const tail = rest[0] === 'tree' || rest[0] === 'blob' ? rest[1] : undefined;

  return { owner, repo, ref: tail || suffixRef || DEFAULT_REF };
}

/** The one call that returns a whole repository tree. */
export function treeUrl({ owner, repo, ref }: RepoRef): string {
  return `https://api.github.com/repos/${encodeURIComponent(
    owner
  )}/${encodeURIComponent(repo)}/git/trees/${encodeURIComponent(
    ref
  )}?recursive=1`;
}

export interface TreeEntry {
  path: string;
  type: string;
}

export interface Selection {
  /** Keep only paths matching one of these. Empty keeps everything. */
  only?: string[];
  /** Drop paths matching one of these, whatever `only` said. */
  except?: string[];
}

/**
 * The top-level names in a tree, for offering them as keep-or-drop choices.
 *
 * Directories first, the way the renderer orders a group, because those are
 * what an import is usually narrowed by.
 */
export function topLevelPaths(entries: TreeEntry[]): TreeEntry[] {
  const roots = entries.filter((entry) => !entry.path.includes('/'));
  const byName = (a: TreeEntry, b: TreeEntry) => a.path.localeCompare(b.path);

  return [
    ...roots.filter((entry) => entry.type === 'tree').sort(byName),
    ...roots.filter((entry) => entry.type !== 'tree').sort(byName),
  ];
}

/**
 * Narrow a repository tree to the paths worth importing.
 *
 * Exclusion wins, so unticking a directory still drops it when a pattern would
 * have kept it. That is the order people expect from every other tool, and the
 * alternative makes an untick look broken.
 *
 * Directories above a kept path come back whether they matched or not. Without
 * that, `only: apps/**` keeps `apps/web` and drops `apps`, and since indent
 * comes from the segment count the child would arrive two levels deep under a
 * parent that is no longer there.
 */
export function selectEntries(
  entries: TreeEntry[],
  { only = [], except = [] }: Selection
): TreeEntry[] {
  const included = compilePatterns(only);
  const excluded = compilePatterns(except);

  const kept = entries.filter(
    (entry) => !excluded(entry.path) && (!only.length || included(entry.path))
  );

  const keptPaths = new Set(kept.map((entry) => entry.path));
  const wanted = new Set<string>();
  for (const entry of kept) {
    const segments = entry.path.split('/');
    for (let depth = 1; depth < segments.length; depth++) {
      wanted.add(segments.slice(0, depth).join('/'));
    }
  }

  const ancestors = entries.filter(
    (entry) => wanted.has(entry.path) && !keptPaths.has(entry.path)
  );

  return [...kept, ...ancestors];
}

export interface Conversion {
  source: string;
  /** Entries dropped by the line ceiling rather than by the depth limit. */
  omitted: number;
}

/**
 * Turn the flat, slash-separated paths GitHub returns into indented source.
 *
 * Sorting by path is what makes the nesting work. A parent is always a strict
 * prefix of its children, so it always sorts ahead of them, and no separate
 * pass is needed to place directories before what they contain.
 */
export function entriesToSource(
  entries: TreeEntry[],
  depth = DEFAULT_DEPTH,
  limit = MAX_LINES
): Conversion {
  const kept = entries
    .filter((entry) => entry.path.split('/').length <= depth)
    .sort((a, b) => a.path.localeCompare(b.path));

  const lines = kept.slice(0, limit).map((entry) => {
    const segments = entry.path.split('/');
    const name = segments[segments.length - 1];
    // A trailing slash is the only way to say "directory" for one that is
    // empty, or whose contents fell outside the depth limit.
    const suffix = entry.type === 'tree' ? '/' : '';
    return INDENT.repeat(segments.length - 1) + name + suffix;
  });

  return { source: lines.join('\n'), omitted: kept.length - lines.length };
}
