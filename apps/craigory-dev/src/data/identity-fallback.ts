/**
 * Try a request against a series of identities, falling through when one is
 * refused.
 *
 * GitHub org policies reject a *kind of credential* rather than the data: a
 * fine-grained PAT can be forbidden from reading a public repo that an
 * anonymous request may read freely. So the way past a block is a different
 * identity, and the last one has to be "no identity" — anonymous reads are slow
 * but they always work for public data, which makes them the floor a build can
 * safely land on.
 *
 * Generic over the client so it can be tested without constructing octokits.
 */
export interface Identity<C> {
  name: string;
  client: C;
}

export interface FallbackOptions<C> {
  /** True when this failure means "try the next identity" rather than "give up". */
  isRefusal: (error: unknown, identity: Identity<C>) => boolean;
  /** Called when falling through, for logging. */
  onFallback?: (from: Identity<C>, to: Identity<C>, error: unknown) => void;
  /** Skip identities before this one (e.g. one already known to be refused). */
  startAt?: number;
}

export async function runWithFallback<C, T>(
  identities: Identity<C>[],
  fn: (client: C) => Promise<T>,
  { isRefusal, onFallback, startAt = 0 }: FallbackOptions<C>
): Promise<T> {
  const usable = identities.slice(startAt);
  if (usable.length === 0) {
    throw new Error('runWithFallback: no identities to try');
  }

  for (let i = 0; i < usable.length; i++) {
    try {
      return await fn(usable[i].client);
    } catch (error) {
      const last = i === usable.length - 1;
      // The final identity has nothing to fall through to, so its failure is
      // the real answer — never swallow it.
      if (last || !isRefusal(error, usable[i])) {
        throw error;
      }
      onFallback?.(usable[i], usable[i + 1], error);
    }
  }

  /* istanbul ignore next — the loop either returns or throws. */
  throw new Error('runWithFallback: unreachable');
}
