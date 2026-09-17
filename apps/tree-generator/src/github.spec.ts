import { describe, expect, it } from 'vitest';
import {
  DEFAULT_REF,
  entriesToSource,
  parseRepoRef,
  treeUrl,
  type TreeEntry,
} from './github';

const ref = (owner: string, repo: string, r = DEFAULT_REF) => ({
  owner,
  repo,
  ref: r,
});

describe('parseRepoRef', () => {
  it('takes a bare owner/repo', () => {
    expect(parseRepoRef('vitejs/vite')).toEqual(ref('vitejs', 'vite'));
  });

  it('takes a github URL', () => {
    expect(parseRepoRef('https://github.com/vitejs/vite')).toEqual(
      ref('vitejs', 'vite')
    );
    expect(parseRepoRef('github.com/vitejs/vite/')).toEqual(
      ref('vitejs', 'vite')
    );
  });

  it('takes an SSH remote and drops the .git', () => {
    expect(parseRepoRef('git@github.com:vitejs/vite.git')).toEqual(
      ref('vitejs', 'vite')
    );
    expect(parseRepoRef('https://github.com/vitejs/vite.git')).toEqual(
      ref('vitejs', 'vite')
    );
  });

  it('reads a branch off a /tree/ or /blob/ URL', () => {
    expect(parseRepoRef('https://github.com/vitejs/vite/tree/v6')).toEqual(
      ref('vitejs', 'vite', 'v6')
    );
    expect(
      parseRepoRef('https://github.com/vitejs/vite/blob/v6/README.md')
    ).toEqual(ref('vitejs', 'vite', 'v6'));
  });

  it('reads a branch off an @ suffix', () => {
    expect(parseRepoRef('vitejs/vite@v6')).toEqual(ref('vitejs', 'vite', 'v6'));
  });

  it('takes the first segment of a slashed ref, which the field can correct', () => {
    // /tree/feature/login and /tree/main/src are the same shape, and only
    // GitHub can say which half is the branch.
    expect(parseRepoRef('https://github.com/o/r/tree/feature/login')).toEqual(
      ref('o', 'r', 'feature')
    );
  });

  it('defaults to HEAD, so the default branch costs no extra request', () => {
    expect(parseRepoRef('vitejs/vite')?.ref).toBe('HEAD');
  });

  it('rejects anything that is not a repo', () => {
    expect(parseRepoRef('')).toBeNull();
    expect(parseRepoRef('   ')).toBeNull();
    expect(parseRepoRef('vitejs')).toBeNull();
    expect(parseRepoRef('https://github.com/vitejs')).toBeNull();
  });
});

describe('treeUrl', () => {
  it('asks for the whole tree in one call', () => {
    expect(treeUrl(ref('vitejs', 'vite'))).toBe(
      'https://api.github.com/repos/vitejs/vite/git/trees/HEAD?recursive=1'
    );
  });

  it('escapes a ref that contains a slash', () => {
    expect(treeUrl(ref('o', 'r', 'feature/login'))).toContain(
      'trees/feature%2Flogin'
    );
  });
});

describe('entriesToSource', () => {
  const entries: TreeEntry[] = [
    { path: 'README.md', type: 'blob' },
    { path: 'src', type: 'tree' },
    { path: 'src/index.ts', type: 'blob' },
    { path: 'src/lib', type: 'tree' },
    { path: 'src/lib/deep.ts', type: 'blob' },
  ];

  it('indents by path depth and marks directories', () => {
    expect(entriesToSource(entries, 3).source).toBe(
      ['README.md', 'src/', '  index.ts', '  lib/', '    deep.ts'].join('\n')
    );
  });

  it('cuts at the depth limit, leaving the directory as a stub', () => {
    expect(entriesToSource(entries, 2).source).toBe(
      ['README.md', 'src/', '  index.ts', '  lib/'].join('\n')
    );
  });

  it('places a parent ahead of its children whatever order they arrive in', () => {
    const shuffled = [...entries].reverse();
    expect(entriesToSource(shuffled, 3).source).toBe(
      entriesToSource(entries, 3).source
    );
  });

  it('stops at the line ceiling and says how much it dropped', () => {
    const flat = Array.from({ length: 10 }, (_, i) => ({
      path: `f${i}.ts`,
      type: 'blob',
    }));
    const result = entriesToSource(flat, 2, 4);
    expect(result.source.split('\n')).toHaveLength(4);
    expect(result.omitted).toBe(6);
  });

  it('reports nothing omitted when everything fit', () => {
    expect(entriesToSource(entries, 3).omitted).toBe(0);
  });

  it('survives an empty repository', () => {
    expect(entriesToSource([], 2)).toEqual({ source: '', omitted: 0 });
  });
});
