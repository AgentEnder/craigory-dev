import { describe, expect, it } from 'vitest';
import {
  DEFAULT_REF,
  entriesToSource,
  parseRepoRef,
  selectEntries,
  topLevelPaths,
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

describe('selectEntries', () => {
  const entries: TreeEntry[] = [
    { path: '.github', type: 'tree' },
    { path: '.github/workflows', type: 'tree' },
    { path: '.github/workflows/ci.yml', type: 'blob' },
    { path: 'README.md', type: 'blob' },
    { path: 'apps', type: 'tree' },
    { path: 'apps/web', type: 'tree' },
    { path: 'apps/web/main.ts', type: 'blob' },
    { path: 'libs', type: 'tree' },
    { path: 'libs/util.ts', type: 'blob' },
  ];

  const paths = (result: TreeEntry[]) =>
    result.map((entry) => entry.path).sort();

  it('keeps everything when nothing is asked for', () => {
    expect(selectEntries(entries, {})).toHaveLength(entries.length);
  });

  it('drops a directory and everything inside it', () => {
    expect(paths(selectEntries(entries, { except: ['.github'] }))).toEqual([
      'README.md',
      'apps',
      'apps/web',
      'apps/web/main.ts',
      'libs',
      'libs/util.ts',
    ]);
  });

  it('keeps only what was asked for', () => {
    expect(paths(selectEntries(entries, { only: ['libs'] }))).toEqual([
      'libs',
      'libs/util.ts',
    ]);
  });

  it('brings back the directories above whatever survived', () => {
    // apps/** never matches apps itself, and without it apps/web arrives one
    // level deep with nothing above it.
    expect(paths(selectEntries(entries, { only: ['apps/**'] }))).toEqual([
      'apps',
      'apps/web',
      'apps/web/main.ts',
    ]);
  });

  it('lets an exclusion beat an inclusion', () => {
    expect(
      paths(selectEntries(entries, { only: ['**'], except: ['.github'] }))
    ).not.toContain('.github');
  });

  it('can come back empty', () => {
    expect(selectEntries(entries, { only: ['nothing-here'] })).toEqual([]);
  });
});

describe('topLevelPaths', () => {
  it('lists the names an import can be narrowed by, directories first', () => {
    expect(
      topLevelPaths([
        { path: 'libs', type: 'tree' },
        { path: 'apps/web', type: 'tree' },
        { path: 'apps', type: 'tree' },
        { path: 'README.md', type: 'blob' },
      ]).map((entry) => entry.path)
    ).toEqual(['apps', 'libs', 'README.md']);
  });
});
