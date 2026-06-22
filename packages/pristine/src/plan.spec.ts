import { describe, expect, it } from 'vitest';

import {
  describePlan,
  flagsForPlan,
  hasActionFlags,
  planFromFlags,
  selectTargets,
} from './plan.js';

describe('hasActionFlags', () => {
  it('is true when any action flag is set', () => {
    expect(hasActionFlags({ reset: 'hard' })).toBe(true);
    expect(hasActionFlags({ untracked: true })).toBe(true);
    expect(hasActionFlags({ ignored: true })).toBe(true);
  });

  it('is false when nothing or only modifiers are set', () => {
    expect(hasActionFlags({})).toBe(false);
    expect(hasActionFlags({ nodeModules: true, env: true })).toBe(false);
  });
});

describe('planFromFlags', () => {
  it('maps flags to a plan', () => {
    expect(
      planFromFlags({ reset: 'worktree', untracked: true, ignored: true, nodeModules: true, env: true })
    ).toEqual({
      reset: 'worktree',
      untracked: true,
      ignored: true,
      vendor: true,
      env: true,
    });
  });

  it('defaults absent flags to off / no reset', () => {
    expect(planFromFlags({})).toEqual({
      reset: null,
      untracked: false,
      ignored: false,
      vendor: false,
      env: false,
    });
  });

  it('keeps vendor and env off when ignored is set without them', () => {
    const plan = planFromFlags({ ignored: true });
    expect(plan.vendor).toBe(false);
    expect(plan.env).toBe(false);
  });
});

describe('selectTargets', () => {
  const enumeration = {
    untracked: ['newdir/', 'src/extra.ts'],
    ignored: ['dist/', 'node_modules/', '.env', '.env.local'],
  };

  it('includes untracked when requested', () => {
    const plan = planFromFlags({ untracked: true });
    expect(selectTargets(plan, enumeration)).toEqual(['newdir/', 'src/extra.ts']);
  });

  it('includes only "other" ignored entries when vendor and env are off', () => {
    const plan = planFromFlags({ ignored: true });
    expect(selectTargets(plan, enumeration)).toEqual(['dist/']);
  });

  it('includes vendor entries when opted in', () => {
    const plan = planFromFlags({ ignored: true, nodeModules: true });
    expect(selectTargets(plan, enumeration)).toEqual(['dist/', 'node_modules/']);
  });

  it('includes env entries when opted in', () => {
    const plan = planFromFlags({ ignored: true, env: true });
    expect(selectTargets(plan, enumeration)).toEqual(['dist/', '.env', '.env.local']);
  });

  it('combines untracked and ignored', () => {
    const plan = planFromFlags({ untracked: true, ignored: true, nodeModules: true, env: true });
    expect(selectTargets(plan, enumeration)).toEqual([
      'newdir/',
      'src/extra.ts',
      'dist/',
      'node_modules/',
      '.env',
      '.env.local',
    ]);
  });

  it('selects nothing when neither untracked nor ignored is set', () => {
    expect(selectTargets(planFromFlags({ reset: 'hard' }), enumeration)).toEqual([]);
  });
});

describe('flagsForPlan', () => {
  it('reconstructs flags from a full plan', () => {
    const plan = planFromFlags({
      reset: 'hard',
      untracked: true,
      ignored: true,
      nodeModules: true,
      env: true,
    });
    expect(flagsForPlan(plan)).toEqual([
      '--reset',
      'hard',
      '--untracked',
      '--ignored',
      '--node-modules',
      '--env',
    ]);
  });

  it('reconstructs a reset-only worktree plan', () => {
    expect(flagsForPlan(planFromFlags({ reset: 'worktree' }))).toEqual([
      '--reset',
      'worktree',
    ]);
  });

  it('omits vendor/env flags when not opted in', () => {
    expect(flagsForPlan(planFromFlags({ ignored: true }))).toEqual(['--ignored']);
  });

  it('returns an empty array for an empty plan', () => {
    expect(flagsForPlan(planFromFlags({}))).toEqual([]);
  });
});

describe('describePlan', () => {
  it('lists the reset action followed by each removal', () => {
    const plan = planFromFlags({ reset: 'hard', untracked: true });
    expect(describePlan(plan, ['newdir/', 'a.txt'])).toEqual([
      'Reset tracked files (hard)',
      'Remove newdir/',
      'Remove a.txt',
    ]);
  });

  it('lists only removals when there is no reset', () => {
    expect(describePlan(planFromFlags({ ignored: true }), ['dist/'])).toEqual([
      'Remove dist/',
    ]);
  });

  it('lists only the reset when there are no targets', () => {
    expect(describePlan(planFromFlags({ reset: 'worktree' }), [])).toEqual([
      'Reset tracked files (worktree)',
    ]);
  });

  it('annotates directory entries with a recursive file count when available', () => {
    const lines = describePlan(
      planFromFlags({ untracked: true }),
      ['newdir/', 'a.txt'],
      (target) => (target === 'newdir/' ? 42 : undefined)
    );
    expect(lines).toEqual(['Remove newdir/ (42 files)', 'Remove a.txt']);
  });

  it('pluralizes a single-file count', () => {
    const lines = describePlan(planFromFlags({ untracked: true }), ['d/'], () => 1);
    expect(lines).toEqual(['Remove d/ (1 file)']);
  });

  it('omits the count for files and when the count is unavailable', () => {
    const lines = describePlan(
      planFromFlags({ untracked: true }),
      ['a.txt', 'd/'],
      () => undefined
    );
    expect(lines).toEqual(['Remove a.txt', 'Remove d/']);
  });

  it('aligns file counts into a column across paths of differing lengths', () => {
    const lines = describePlan(
      planFromFlags({ untracked: true }),
      ['short/', 'a-much-longer-dir/'],
      (target) => (target === 'short/' ? 1 : 5)
    );
    // counts start at the same column; the longest path keeps a single space
    expect(lines[0].indexOf('(')).toBe(lines[1].indexOf('('));
    expect(lines[1]).toBe('Remove a-much-longer-dir/ (5 files)');
    expect(lines[0]).toMatch(/^Remove short\/ +\(1 file\)$/);
  });
});
