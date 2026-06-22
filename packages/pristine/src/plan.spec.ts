import { describe, expect, it } from 'vitest';

import { hasActionFlags, planFromFlags, selectTargets } from './plan.js';

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
