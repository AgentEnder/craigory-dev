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

/** Decode git's C-style path quoting (used for paths with unusual characters). */
function unquotePath(raw: string): string {
  if (raw.length < 2 || !raw.startsWith('"') || !raw.endsWith('"')) {
    return raw;
  }
  return raw.slice(1, -1).replace(
    /\\(["\\abtnvfr]|[0-7]{1,3})/g,
    (_match, esc: string) => {
      const simple: Record<string, string> = {
        '\\': '\\',
        '"': '"',
        a: '\x07',
        b: '\b',
        t: '\t',
        n: '\n',
        v: '\v',
        f: '\f',
        r: '\r',
      };
      return esc in simple ? simple[esc] : String.fromCharCode(parseInt(esc, 8));
    }
  );
}

const WOULD_REMOVE = 'Would remove ';

/**
 * Parse `git clean -n` output. Only `Would remove …` lines are targets;
 * `Would skip …` lines (e.g. nested git repositories) are intentionally left
 * alone, matching `git clean`'s own conservatism.
 */
function parseCleanOutput(output: string): string[] {
  const targets: string[] = [];
  for (const rawLine of output.split('\n')) {
    const line = rawLine.replace(/\r$/, '');
    if (line.startsWith(WOULD_REMOVE)) {
      targets.push(unquotePath(line.slice(WOULD_REMOVE.length)));
    }
  }
  return targets;
}

/**
 * Run `git clean -n` (dry run) and return the paths it would remove. `LANG=C`
 * forces the English `Would remove` prefix; `core.quotePath=false` avoids
 * octal-escaping non-ASCII bytes.
 */
function cleanDryRun(cwd: string, modeArgs: string[]): string[] {
  const output = execFileSync(
    'git',
    ['-c', 'core.quotePath=false', 'clean', '-n', '-d', ...modeArgs],
    {
      cwd,
      encoding: 'utf-8',
      maxBuffer: MAX_BUFFER,
      env: { ...process.env, LANG: 'C', LC_ALL: 'C' },
    }
  );
  return parseCleanOutput(output);
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
 * Untracked files to remove, computed by `git clean -dn`. A directory collapses
 * to a single `dir/` entry only when everything under it is untracked; a
 * directory that also holds ignored (or tracked) files descends to just its
 * untracked children, so removing these paths never touches an ignored file.
 */
export function enumerateUntracked(cwd: string): string[] {
  return cleanDryRun(cwd, []);
}

/**
 * Ignored entries to remove, computed by `git clean -dXn` (`-X` = ignored only).
 * Same collapse-when-safe / descend-when-mixed behavior, so removing these never
 * touches an untracked file. Disjoint from {@link enumerateUntracked}.
 */
export function enumerateIgnored(cwd: string): string[] {
  return cleanDryRun(cwd, ['-X']);
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
