import { execFileSync } from 'node:child_process';

/** How aggressively to discard changes to tracked files. */
export type ResetMode = 'hard' | 'worktree';

/** Large enough to hold a fully-expanded untracked file listing. */
const MAX_BUFFER = 256 * 1024 * 1024;

function gitOutput(cwd: string, args: string[]): string {
  return execFileSync('git', args, {
    cwd,
    encoding: 'utf-8',
    maxBuffer: MAX_BUFFER,
  });
}

/** Split a `-z` (NUL-delimited) git output into non-empty entries. */
function parseZ(output: string): string[] {
  return output.split('\0').filter((entry) => entry.length > 0);
}

/** True when `cwd` is inside a git working tree. */
export function isInsideWorkTree(cwd: string): boolean {
  try {
    const out = execFileSync('git', ['rev-parse', '--is-inside-work-tree'], {
      cwd,
      encoding: 'utf-8',
      stdio: ['ignore', 'pipe', 'ignore'],
    });
    return out.trim() === 'true';
  } catch {
    return false;
  }
}

/**
 * Untracked files, matching `git clean`'s `-d` behavior: fully-untracked
 * directories collapse to a single `dir/` entry, while directories holding
 * tracked files expand to just their untracked children. Excludes ignored files.
 */
export function enumerateUntracked(cwd: string): string[] {
  return parseZ(
    gitOutput(cwd, [
      'ls-files',
      '-z',
      '--others',
      '--exclude-standard',
      '--directory',
    ])
  );
}

/**
 * Ignored entries, with the same directory-collapse behavior. Disjoint from
 * {@link enumerateUntracked} by construction (that query omits `--ignored`).
 */
export function enumerateIgnored(cwd: string): string[] {
  return parseZ(
    gitOutput(cwd, [
      'ls-files',
      '-z',
      '--others',
      '--ignored',
      '--exclude-standard',
      '--directory',
    ])
  );
}

/**
 * True when any tracked file has staged or unstaged modifications. Ignored and
 * untracked files (porcelain `??`) do not count.
 */
export function hasTrackedChanges(cwd: string): boolean {
  const entries = parseZ(gitOutput(cwd, ['status', '--porcelain', '-z']));
  return entries.some((entry) => !entry.startsWith('??'));
}

/** Discard changes to tracked files. Never touches untracked/ignored files. */
export function reset(cwd: string, mode: ResetMode): void {
  const args =
    mode === 'hard' ? ['reset', '--hard', 'HEAD'] : ['restore', '--', '.'];
  execFileSync('git', args, { cwd, stdio: 'pipe' });
}
