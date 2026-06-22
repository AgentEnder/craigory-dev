import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';

import { removeAll } from './remove.js';

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
