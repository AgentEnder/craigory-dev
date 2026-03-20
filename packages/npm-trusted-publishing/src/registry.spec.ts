import { describe, it, expect } from 'vitest';

import { isVersionAtLeast } from './registry.js';

describe('isVersionAtLeast', () => {
  it('returns true when versions are equal', () => {
    expect(isVersionAtLeast('11.10.0', '11.10.0')).toBe(true);
  });

  it('returns true when major is higher', () => {
    expect(isVersionAtLeast('12.0.0', '11.10.0')).toBe(true);
  });

  it('returns true when minor is higher', () => {
    expect(isVersionAtLeast('11.11.0', '11.10.0')).toBe(true);
  });

  it('returns true when patch is higher', () => {
    expect(isVersionAtLeast('11.10.1', '11.10.0')).toBe(true);
  });

  it('returns false when major is lower', () => {
    expect(isVersionAtLeast('10.0.0', '11.10.0')).toBe(false);
  });

  it('returns false when minor is lower', () => {
    expect(isVersionAtLeast('11.9.0', '11.10.0')).toBe(false);
  });

  it('returns false when patch is lower', () => {
    expect(isVersionAtLeast('11.10.0', '11.10.1')).toBe(false);
  });
});
