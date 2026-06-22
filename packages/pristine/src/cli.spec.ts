import { execFileSync } from 'node:child_process';
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';

import { run } from './cli.js';

const repos: string[] = [];
const savedExitCode = process.exitCode;

function git(cwd: string, ...args: string[]): void {
  execFileSync('git', args, { cwd, stdio: 'pipe' });
}

function write(root: string, rel: string, content = ''): void {
  const full = join(root, rel);
  mkdirSync(dirname(full), { recursive: true });
  writeFileSync(full, content);
}

function makeRepo(committed: Record<string, string>): string {
  const root = mkdtempSync(join(tmpdir(), 'pristine-cli-'));
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
  process.exitCode = savedExitCode;
});

describe('run (non-interactive)', () => {
  function seed(): string {
    const root = makeRepo({
      'src/app.ts': 'tracked',
      '.gitignore': 'node_modules/\ndist/\n*.log\n',
    });
    write(root, 'newdir/a.txt', 'untracked');
    write(root, 'node_modules/pkg/index.js', 'vendor');
    write(root, 'dist/out.js', 'ignored');
    write(root, 'debug.log', 'ignored');
    return root;
  }

  it('removes untracked and ignored (incl. node_modules) while keeping tracked files', async () => {
    const root = seed();

    await run({ untracked: true, ignored: true, nodeModules: true, yes: true, cwd: root });

    expect(existsSync(join(root, 'newdir'))).toBe(false);
    expect(existsSync(join(root, 'node_modules'))).toBe(false);
    expect(existsSync(join(root, 'dist'))).toBe(false);
    expect(existsSync(join(root, 'debug.log'))).toBe(false);
    expect(existsSync(join(root, 'src/app.ts'))).toBe(true);
    expect(existsSync(join(root, '.gitignore'))).toBe(true);
  });

  it('keeps node_modules when vendor is not opted in', async () => {
    const root = seed();

    await run({ ignored: true, yes: true, cwd: root });

    expect(existsSync(join(root, 'node_modules'))).toBe(true);
    expect(existsSync(join(root, 'dist'))).toBe(false);
  });

  it('does not remove ignored files inside an untracked directory (untracked-only)', async () => {
    const root = makeRepo({ 'root.txt': 'x', '.gitignore': 'cache.txt\n' });
    write(root, 'mixed/keep.txt', 'untracked');
    write(root, 'mixed/cache.txt', 'ignored');

    await run({ untracked: true, yes: true, cwd: root });

    expect(existsSync(join(root, 'mixed/keep.txt'))).toBe(false);
    expect(existsSync(join(root, 'mixed/cache.txt'))).toBe(true);
  });

  it('removes nothing on a dry run', async () => {
    const root = seed();

    await run({ untracked: true, ignored: true, nodeModules: true, yes: true, dryRun: true, cwd: root });

    expect(existsSync(join(root, 'newdir'))).toBe(true);
    expect(existsSync(join(root, 'node_modules'))).toBe(true);
    expect(existsSync(join(root, 'dist'))).toBe(true);
  });

  it('hard-resets tracked files when requested', async () => {
    const root = makeRepo({ 'a.txt': 'v1' });
    write(root, 'a.txt', 'v2');

    await run({ reset: 'hard', yes: true, cwd: root });

    expect(readFileSync(join(root, 'a.txt'), 'utf-8')).toBe('v1');
  });

  it('sets a non-zero exit code outside a git work tree', async () => {
    const notARepo = mkdtempSync(join(tmpdir(), 'pristine-bare-'));
    repos.push(notARepo);

    await run({ untracked: true, yes: true, cwd: notARepo });

    expect(process.exitCode).toBe(1);
  });
});
