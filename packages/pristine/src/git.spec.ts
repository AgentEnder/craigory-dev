import { execFileSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';

import {
  enumerateIgnored,
  enumerateUntracked,
  hasTrackedChanges,
  isInsideWorkTree,
  reset,
} from './git.js';

const repos: string[] = [];

function git(cwd: string, ...args: string[]): void {
  execFileSync('git', args, { cwd, stdio: 'pipe' });
}

function write(root: string, rel: string, content = ''): void {
  const full = join(root, rel);
  mkdirSync(dirname(full), { recursive: true });
  writeFileSync(full, content);
}

/** Create an initialized git repo with the given committed files. */
function makeRepo(committed: Record<string, string> = {}): string {
  const root = mkdtempSync(join(tmpdir(), 'pristine-git-'));
  repos.push(root);
  git(root, 'init', '-q');
  git(root, 'config', 'user.email', 'test@example.com');
  git(root, 'config', 'user.name', 'Test');
  git(root, 'config', 'commit.gpgsign', 'false');
  for (const [rel, content] of Object.entries(committed)) {
    write(root, rel, content);
  }
  git(root, 'add', '-A');
  git(root, 'commit', '-q', '--allow-empty', '-m', 'init');
  return root;
}

afterEach(() => {
  for (const dir of repos.splice(0)) {
    rmSync(dir, { recursive: true, force: true });
  }
});

describe('isInsideWorkTree', () => {
  it('is true inside a repo', () => {
    expect(isInsideWorkTree(makeRepo())).toBe(true);
  });

  it('is false outside a repo', () => {
    const notARepo = mkdtempSync(join(tmpdir(), 'pristine-bare-'));
    repos.push(notARepo);
    expect(isInsideWorkTree(notARepo)).toBe(false);
  });
});

describe('enumerateUntracked', () => {
  it('collapses fully-untracked directories but expands those holding tracked files', () => {
    const root = makeRepo({ 'src/app.ts': 'x', '.gitignore': 'dist/\n' });
    write(root, 'newdir/a.txt', '');
    write(root, 'newdir/b.txt', '');
    write(root, 'src/extra.ts', '');
    write(root, 'dist/out.js', ''); // ignored — must not appear

    const result = enumerateUntracked(root).sort();
    expect(result).toEqual(['newdir/', 'src/extra.ts']);
  });
});

describe('enumerateIgnored', () => {
  it('collapses ignored directories and lists ignored files, excluding untracked', () => {
    const root = makeRepo({
      'src/app.ts': 'x',
      '.gitignore': 'node_modules/\ndist/\n*.log\n',
    });
    write(root, 'node_modules/pkg/index.js', '');
    write(root, 'dist/out.js', '');
    write(root, 'debug.log', '');
    write(root, 'untracked.txt', ''); // untracked, not ignored — must not appear

    const result = enumerateIgnored(root).sort();
    expect(result).toEqual(['debug.log', 'dist/', 'node_modules/']);
  });
});

describe('hasTrackedChanges', () => {
  it('is false on a clean repo', () => {
    expect(hasTrackedChanges(makeRepo({ 'a.txt': 'v1' }))).toBe(false);
  });

  it('is true when a tracked file is modified', () => {
    const root = makeRepo({ 'a.txt': 'v1' });
    write(root, 'a.txt', 'v2');
    expect(hasTrackedChanges(root)).toBe(true);
  });

  it('is false when only untracked files are present', () => {
    const root = makeRepo({ 'a.txt': 'v1' });
    write(root, 'b.txt', 'new');
    expect(hasTrackedChanges(root)).toBe(false);
  });
});

describe('reset', () => {
  it('worktree mode reverts unstaged changes to tracked files', () => {
    const root = makeRepo({ 'a.txt': 'v1' });
    write(root, 'a.txt', 'v2');

    reset(root, 'worktree');

    expect(readFileSync(join(root, 'a.txt'), 'utf-8')).toBe('v1');
  });

  it('hard mode discards staged changes to tracked files', () => {
    const root = makeRepo({ 'a.txt': 'v1' });
    write(root, 'a.txt', 'v2');
    git(root, 'add', 'a.txt');

    reset(root, 'hard');

    expect(readFileSync(join(root, 'a.txt'), 'utf-8')).toBe('v1');
  });

  it('does not remove untracked files', () => {
    const root = makeRepo({ 'a.txt': 'v1' });
    write(root, 'untracked.txt', 'keep');

    reset(root, 'hard');

    expect(readFileSync(join(root, 'untracked.txt'), 'utf-8')).toBe('keep');
  });
});
