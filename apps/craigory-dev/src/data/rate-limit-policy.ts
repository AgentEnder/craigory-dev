/**
 * Whether to wait out a GitHub rate limit, or give up and let it surface.
 *
 * Kept as a pure decision (no logging, no sleeping) so the policy can be tested
 * directly; the caller owns the message and the octokit plugin owns the wait.
 */

/** Attempts to make before conceding the budget is genuinely gone. */
export const MAX_RATE_LIMIT_RETRIES = 3;

/**
 * Longest cooldown worth sleeping through.
 *
 * A *primary* limit's `retry-after` is the time until the hour-long window
 * resets, so it can be most of an hour — PR #48 spent 1319s of build time
 * sleeping off exactly that. Bounding the retry *count* does not bound the
 * retry *duration*; this does.
 */
export const MAX_RETRY_AFTER_SECONDS = 60;

export type RateLimitKind = 'primary' | 'secondary';

export interface RateLimitDecision {
  retry: boolean;
  /** Human-readable rationale, for the caller to log. */
  reason: string;
}

export function decideRateLimitRetry(
  kind: RateLimitKind,
  retryAfter: number,
  attempt: number
): RateLimitDecision {
  if (retryAfter > MAX_RETRY_AFTER_SECONDS) {
    return {
      retry: false,
      reason: `${kind} rate limit with a ${retryAfter}s cooldown — too long to wait out, failing instead`,
    };
  }
  if (attempt >= MAX_RATE_LIMIT_RETRIES) {
    return {
      retry: false,
      reason: `${kind} rate limit hit (attempt ${attempt}); giving up`,
    };
  }
  return {
    retry: true,
    reason: `${kind} rate limit hit (attempt ${attempt}); retrying in ${retryAfter}s`,
  };
}
