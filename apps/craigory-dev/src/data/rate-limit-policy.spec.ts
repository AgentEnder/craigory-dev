import { describe, expect, it } from 'vitest';
import {
  decideRateLimitRetry,
  MAX_RATE_LIMIT_RETRIES,
  MAX_RETRY_AFTER_SECONDS,
} from './rate-limit-policy';

describe('decideRateLimitRetry', () => {
  it('waits out a short cooldown', () => {
    const d = decideRateLimitRetry('secondary', 5, 0);
    expect(d.retry).toBe(true);
    expect(d.reason).toContain('retrying in 5s');
  });

  it('refuses a cooldown longer than the ceiling, however early the attempt', () => {
    // The regression this exists for: PR #48 slept 1319s on attempt 0 because
    // only the retry *count* was bounded.
    const d = decideRateLimitRetry('primary', 1319, 0);
    expect(d.retry).toBe(false);
    expect(d.reason).toContain('1319s');
    expect(d.reason).toContain('too long to wait out');
  });

  it('treats the ceiling as inclusive', () => {
    expect(
      decideRateLimitRetry('primary', MAX_RETRY_AFTER_SECONDS, 0).retry
    ).toBe(true);
    expect(
      decideRateLimitRetry('primary', MAX_RETRY_AFTER_SECONDS + 1, 0).retry
    ).toBe(false);
  });

  it('gives up once attempts are exhausted', () => {
    for (let attempt = 0; attempt < MAX_RATE_LIMIT_RETRIES; attempt++) {
      expect(decideRateLimitRetry('secondary', 1, attempt).retry).toBe(true);
    }
    const spent = decideRateLimitRetry('secondary', 1, MAX_RATE_LIMIT_RETRIES);
    expect(spent.retry).toBe(false);
    expect(spent.reason).toContain('giving up');
  });

  it('names which limit was hit, so the log says which client is starved', () => {
    expect(decideRateLimitRetry('primary', 1, 0).reason).toContain('primary');
    expect(decideRateLimitRetry('secondary', 1, 0).reason).toContain(
      'secondary'
    );
  });
});
