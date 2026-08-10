/**
 * A counting semaphore for outbound GitHub calls.
 *
 * GitHub's secondary rate limit is triggered by burst concurrency rather than
 * total volume, and it answers with a cooldown measured in minutes. The project
 * loader's fan-out is naturally unbounded — one page of 30 repos expands to
 * hundreds of parallel calls (five per repo, plus a blob fetch per discovered
 * package.json) — so the burst has to be held down before GitHub sees it.
 *
 * `@octokit/plugin-throttling` is the complement to this, not a substitute: it
 * only reacts once GitHub has already begun refusing us.
 */
export class RequestSlots {
  #inFlight = 0;
  readonly #waiting: Array<() => void> = [];

  constructor(private readonly limit: number) {
    if (!Number.isInteger(limit) || limit < 1) {
      throw new Error(
        `RequestSlots limit must be a positive integer, got ${limit}`
      );
    }
  }

  /** Currently-held slots. Exposed for assertions and diagnostics. */
  get inFlight(): number {
    return this.#inFlight;
  }

  /** Callers queued behind the limit. */
  get waiting(): number {
    return this.#waiting.length;
  }

  /**
   * Runs `fn` once a slot is free, releasing the slot however `fn` settles.
   *
   * `fn` must not itself call `run` on the same instance: it would wait on a
   * slot it is already holding, and with `limit` such callers the whole set
   * deadlocks.
   */
  async run<T>(fn: () => Promise<T>): Promise<T> {
    await this.#acquire();
    try {
      // Awaited, not returned: `finally` must fire when the request *settles*,
      // not when its promise is created, or the slot frees immediately and the
      // limit means nothing.
      return await fn();
    } finally {
      this.#release();
    }
  }

  async #acquire(): Promise<void> {
    if (this.#inFlight < this.limit) {
      this.#inFlight++;
      return;
    }
    await new Promise<void>((resolve) => this.#waiting.push(resolve));
  }

  #release(): void {
    // Hand the slot directly to the next waiter rather than decrementing and
    // letting it re-acquire. A decrement followed by an await boundary leaves a
    // window where a fresh caller reads a stale count and over-admits.
    const next = this.#waiting.shift();
    if (next) {
      next();
      return;
    }
    this.#inFlight--;
  }
}
