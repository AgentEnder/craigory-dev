import { describe, expect, it } from 'vitest';
import { compilePatterns, matchesGlob, parsePatterns } from './glob';

describe('parsePatterns', () => {
  it('splits on commas or whitespace', () => {
    expect(parsePatterns('.github, docs')).toEqual(['.github', 'docs']);
    expect(parsePatterns('.github docs')).toEqual(['.github', 'docs']);
    expect(parsePatterns('.github,\n docs')).toEqual(['.github', 'docs']);
  });

  it('drops a trailing slash, which says nothing extra here', () => {
    expect(parsePatterns('docs/')).toEqual(['docs']);
  });

  it('comes back empty for an empty field', () => {
    expect(parsePatterns('')).toEqual([]);
    expect(parsePatterns('  ')).toEqual([]);
  });
});

describe('matchesGlob', () => {
  it('matches a plain name', () => {
    expect(matchesGlob('docs', 'docs')).toBe(true);
    expect(matchesGlob('docsite', 'docs')).toBe(false);
  });

  it('covers everything under a directory it names', () => {
    // Nobody writes `.github/**` when they mean the folder.
    expect(matchesGlob('.github/workflows/ci.yml', '.github')).toBe(true);
    expect(matchesGlob('apps/web/src/main.ts', 'apps/web')).toBe(true);
  });

  it('stops a single star at a separator', () => {
    expect(matchesGlob('README.md', '*.md')).toBe(true);
    expect(matchesGlob('docs/README.md', '*.md')).toBe(false);
  });

  it('lets a double star cross directories', () => {
    expect(matchesGlob('docs/guide/README.md', '**/*.md')).toBe(true);
    // And still matches at the top level, where there is nothing to cross.
    expect(matchesGlob('README.md', '**/*.md')).toBe(true);
  });

  it('matches one character with a question mark', () => {
    expect(matchesGlob('a.ts', '?.ts')).toBe(true);
    expect(matchesGlob('ab.ts', '?.ts')).toBe(false);
  });

  it('takes a dot literally rather than as any character', () => {
    expect(matchesGlob('axgithub', '.github')).toBe(false);
  });

  it('matches a segment in the middle of a path', () => {
    expect(matchesGlob('apps/web/dist/main.js', 'apps/*/dist')).toBe(true);
  });
});

describe('compilePatterns', () => {
  it('matches nothing when there are no patterns', () => {
    const matches = compilePatterns([]);
    expect(matches('anything/at/all')).toBe(false);
  });

  it('matches when any one pattern does', () => {
    const matches = compilePatterns(['docs', 'apps/**']);
    expect(matches('docs/a.md')).toBe(true);
    expect(matches('apps/web/main.ts')).toBe(true);
    expect(matches('libs/util.ts')).toBe(false);
  });
});
