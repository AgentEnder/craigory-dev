import { describe, expect, it } from 'vitest';

import { categorizeIgnored } from './categorize.js';

describe('categorizeIgnored', () => {
  it('classifies a collapsed node_modules directory as vendor', () => {
    const result = categorizeIgnored(['node_modules/']);
    expect(result.vendor).toEqual(['node_modules/']);
    expect(result.env).toEqual([]);
    expect(result.other).toEqual([]);
  });

  it('classifies nested node_modules directories as vendor', () => {
    const result = categorizeIgnored([
      'apps/web/node_modules/',
      'packages/cli/node_modules/',
    ]);
    expect(result.vendor).toEqual([
      'apps/web/node_modules/',
      'packages/cli/node_modules/',
    ]);
  });

  it('classifies *.env* files as env', () => {
    const result = categorizeIgnored([
      '.env',
      '.env.local',
      'config/prod.env',
    ]);
    expect(result.env).toEqual(['.env', '.env.local', 'config/prod.env']);
    expect(result.other).toEqual([]);
  });

  it('classifies everything else as other', () => {
    const result = categorizeIgnored([
      'dist/',
      '.cache/',
      'coverage/index.html',
    ]);
    expect(result.other).toEqual(['dist/', '.cache/', 'coverage/index.html']);
    expect(result.vendor).toEqual([]);
    expect(result.env).toEqual([]);
  });

  it('does not misclassify directories that merely contain "env" without a dot', () => {
    const result = categorizeIgnored(['environments/', 'src/environment.ts']);
    expect(result.other).toEqual(['environments/', 'src/environment.ts']);
    expect(result.env).toEqual([]);
  });

  it('treats vendor as higher precedence than env for paths under node_modules', () => {
    const result = categorizeIgnored(['node_modules/pkg/.env']);
    expect(result.vendor).toEqual(['node_modules/pkg/.env']);
    expect(result.env).toEqual([]);
  });

  it('returns empty buckets for empty input', () => {
    expect(categorizeIgnored([])).toEqual({
      vendor: [],
      env: [],
      other: [],
    });
  });
});
