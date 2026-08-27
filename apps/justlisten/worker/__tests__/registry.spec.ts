import { describe, expect, it } from 'vitest';
import { getProvider, isProviderId, providers } from '../providers/index';

// Skeleton smoke test — real suites (matching, links, url parsing) land with
// their implementations. Pure logic only: no network, no Workers runtime.
describe('provider registry', () => {
  it('contains every provider in canonical order', () => {
    expect(providers.map((p) => p.id)).toEqual([
      'spotify',
      'apple',
      'youtube',
      'deezer',
    ]);
  });

  it('looks providers up by id', () => {
    expect(getProvider('apple')?.id).toBe('apple');
  });

  it('validates provider ids', () => {
    expect(isProviderId('spotify')).toBe(true);
    expect(isProviderId('tidal')).toBe(false);
  });
});
