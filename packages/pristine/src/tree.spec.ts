import { describe, expect, it } from 'vitest';

import { renderTree } from './tree.js';

describe('renderTree', () => {
  it('returns nothing for no targets', () => {
    expect(renderTree([])).toEqual([]);
  });

  it('groups targets under shared parents with tree connectors', () => {
    expect(
      renderTree(['a.txt', 'apps/one/dist/', 'apps/two/dist/', 'dist/'])
    ).toEqual([
      '├── a.txt',
      '├── apps/',
      '│   ├── one/dist/',
      '│   └── two/dist/',
      '└── dist/',
    ]);
  });

  it('collapses single-child grouping directories into one segment', () => {
    expect(renderTree(['tools/a/b/dist/'])).toEqual(['└── tools/a/b/dist/']);
  });

  it('stops collapsing where a directory branches', () => {
    expect(renderTree(['x/a/', 'x/b/'])).toEqual([
      '└── x/',
      '    ├── a/',
      '    └── b/',
    ]);
  });

  it('annotates directory targets with file counts but never files', () => {
    expect(renderTree(['d/', 'f.txt'], (t) => (t === 'd/' ? 3 : 99))).toEqual([
      '├── d/ (3 files)',
      '└── f.txt',
    ]);
  });

  it('pluralizes a single-file count', () => {
    expect(renderTree(['d/'], () => 1)).toEqual(['└── d/ (1 file)']);
  });

  it('aligns counts into a column across differing depths', () => {
    const lines = renderTree(
      ['nested/deep/longer/', 'short/'],
      (t) => (t === 'short/' ? 1 : 5)
    );
    expect(lines[0].indexOf('(')).toBe(lines[1].indexOf('('));
    expect(lines[0]).toBe('├── nested/deep/longer/ (5 files)');
    expect(lines[1]).toMatch(/^└── short\/ +\(1 file\)$/);
  });
});
