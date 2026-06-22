import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';

import { countFiles, removeAll } from './remove.js';

const dirs: string[] = [];

function makeDir(prefix = 'pristine-rm-'): string {
  const dir = mkdtempSync(join(tmpdir(), prefix));
  dirs.push(dir);
  return dir;
}

afterEach(() => {
  for (const dir of dirs.splice(0)) {
    rmSync(dir, { recursive: true, force: true });
  }
});

describe('removeAll', () => {
  it('removes files and directories within cwd', async () => {
    const cwd = makeDir();
    writeFileSync(join(cwd, 'a.txt'), 'x');
    mkdirSync(join(cwd, 'd/nested'), { recursive: true });
    writeFileSync(join(cwd, 'd/nested/f.txt'), 'y');

    const result = await removeAll(['a.txt', 'd/'], { cwd });

    expect(existsSync(join(cwd, 'a.txt'))).toBe(false);
    expect(existsSync(join(cwd, 'd'))).toBe(false);
    expect(result.removed).toBe(2);
    expect(result.failures).toEqual([]);
  });

  it('treats a missing path as a no-op success (force)', async () => {
    const cwd = makeDir();

    const result = await removeAll(['ghost'], { cwd });

    expect(result.failures).toEqual([]);
    expect(result.removed).toBe(1);
  });

  it('refuses to remove a path that escapes cwd via ..', async () => {
    const root = makeDir();
    const cwd = join(root, 'project');
    mkdirSync(cwd);
    const outside = join(root, 'secret.txt');
    writeFileSync(outside, 'keep');

    const result = await removeAll(['../secret.txt'], { cwd });

    expect(existsSync(outside)).toBe(true);
    expect(result.removed).toBe(0);
    expect(result.failures).toHaveLength(1);
    expect(result.failures[0].path).toBe('../secret.txt');
  });

  it('refuses an absolute path outside cwd', async () => {
    const root = makeDir();
    const cwd = join(root, 'project');
    mkdirSync(cwd);
    const outside = join(root, 'outside.txt');
    writeFileSync(outside, 'keep');

    const result = await removeAll([outside], { cwd });

    expect(existsSync(outside)).toBe(true);
    expect(result.failures).toHaveLength(1);
  });

  it('refuses to remove cwd itself', async () => {
    const cwd = makeDir();

    const result = await removeAll(['.'], { cwd });

    expect(existsSync(cwd)).toBe(true);
    expect(result.failures).toHaveLength(1);
  });

});

describe('countFiles', () => {
  it('counts files recursively, excluding directories', async () => {
    const dir = makeDir();
    writeFileSync(join(dir, 'a.txt'), '');
    mkdirSync(join(dir, 'sub/deep'), { recursive: true });
    writeFileSync(join(dir, 'sub/b.txt'), '');
    writeFileSync(join(dir, 'sub/deep/c.txt'), '');

    expect(await countFiles(dir)).toBe(3);
  });

  it('returns 0 for an empty directory', async () => {
    expect(await countFiles(makeDir())).toBe(0);
  });

  it('returns 0 for a nonexistent path', async () => {
    expect(await countFiles(join(makeDir(), 'ghost'))).toBe(0);
  });

  it('counts a symlinked directory as one entry without following it', async () => {
    const dir = makeDir();
    const target = makeDir();
    writeFileSync(join(target, 'x.txt'), '');
    writeFileSync(join(target, 'y.txt'), '');
    symlinkSync(target, join(dir, 'link'));

    expect(await countFiles(dir)).toBe(1);
  });
});

describe('progress', () => {
  it('reports progress ending at total', async () => {
    const cwd = makeDir();
    writeFileSync(join(cwd, 'a.txt'), 'x');
    writeFileSync(join(cwd, 'b.txt'), 'y');
    const calls: Array<[number, number]> = [];

    await removeAll(['a.txt', 'b.txt'], {
      cwd,
      onProgress: (done, total) => calls.push([done, total]),
    });

    expect(calls).toHaveLength(2);
    expect(calls[calls.length - 1]).toEqual([2, 2]);
  });
});
