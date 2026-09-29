/**
 * Request-scoped resolution tracing.
 *
 * ## Why this exists
 *
 * Every way a provider can fail to produce an exact link renders as the same
 * button: "Search on X". That one string currently means any of
 *
 *   - the provider needs credentials this deployment does not have;
 *   - it was asked and genuinely has no such recording;
 *   - it was asked and answered 403 because a shared Cloudflare egress IP blew
 *     through an unauthenticated per-IP rate limit;
 *   - it answered fine and the match scored below threshold;
 *   - the request shape is wrong, because three of these integrations were
 *     written against documentation rather than a live response.
 *
 * Those demand completely different fixes and are indistinguishable from the
 * outside, which makes every diagnosis a guess. This turns them into a record.
 *
 * ## How it stays free when it is off
 *
 * `AsyncLocalStorage` (available because `wrangler.jsonc` sets `nodejs_compat`)
 * carries the collector down the async call tree without threading a parameter
 * through `MusicProvider.resolve` and the seven implementations of it. When no
 * trace is running `getStore()` returns undefined and `trace()` returns
 * immediately — so instrumented code costs one property read per call on the
 * normal path, and the interface never grew a debug argument.
 */
import { AsyncLocalStorage } from 'node:async_hooks';

export interface TraceEvent {
  /** Milliseconds since the trace began — enough to spot a slow upstream. */
  ms: number;
  /** Who logged it: a provider id, `musicbrainz`, `reccobeats`, `resolve`. */
  scope: string;
  /** What happened: `skipped`, `http`, `candidates`, `cache`, `error`, … */
  event: string;
  detail?: Record<string, unknown>;
}

interface TraceContext {
  started: number;
  events: TraceEvent[];
}

const storage = new AsyncLocalStorage<TraceContext>();

/**
 * Run `fn` with tracing on, returning its value alongside everything logged.
 *
 * Nesting is not supported and not needed: a trace covers one page load.
 */
export async function withTrace<T>(
  fn: () => Promise<T>
): Promise<{ value: T; events: TraceEvent[] }> {
  const context: TraceContext = { started: Date.now(), events: [] };
  const value = await storage.run(context, fn);
  return { value, events: context.events };
}

/** Record an event, or do nothing at all when no trace is running. */
export function trace(
  scope: string,
  event: string,
  detail?: Record<string, unknown>
): void {
  const context = storage.getStore();
  if (!context) return;
  context.events.push({
    ms: Date.now() - context.started,
    scope,
    event,
    ...(detail ? { detail } : {}),
  });
}

/**
 * Whether a trace is running.
 *
 * For the rare caller that would have to *compute* something solely to log it —
 * `trace()` itself is already free, so most code should just call it.
 */
export function tracing(): boolean {
  return storage.getStore() !== undefined;
}

/** Events grouped by scope, preserving order within each. */
export function groupByScope(
  events: readonly TraceEvent[]
): Record<string, TraceEvent[]> {
  const grouped: Record<string, TraceEvent[]> = {};
  for (const event of events) {
    (grouped[event.scope] ??= []).push(event);
  }
  return grouped;
}

/**
 * The one-line answer per scope: what actually happened, in the vocabulary of
 * the question being asked ("why is this a search link?").
 *
 * Derived from the events rather than recorded separately, so a scope can never
 * report a verdict its own log contradicts. Ordered most-conclusive first: an
 * HTTP failure explains a low score, so it wins over one.
 */
export function summarize(
  events: readonly TraceEvent[],
  outcome?: 'exact' | 'search' | 'missing'
): string {
  const has = (event: string) => events.some((e) => e.event === event);
  const find = (event: string) => events.find((e) => e.event === event);

  if (events.length === 0) return 'not attempted';

  // Only conclusive when the scope did nothing else. A provider can report no
  // credentials and *still* resolve — YouTube falls through to its keyless page
  // scrape — and leading with "skipped" there would hide the attempt that
  // actually decided the outcome.
  const skipped = find('skipped');
  const attempted = events.some((e) =>
    ['http', 'candidates', 'error', 'cache-hit', 'rows'].includes(e.event)
  );
  if (skipped && !attempted) {
    return `skipped: ${String(skipped.detail?.['reason'] ?? 'unknown reason')}`;
  }

  const cached = find('cache-hit');
  if (cached) return 'resolved from the match cache';

  const failedHttp = events.find(
    (e) => e.event === 'http' && Number(e.detail?.['status']) >= 400
  );
  if (failedHttp) {
    const status = Number(failedHttp.detail?.['status']);
    // 403 on an unauthenticated API is almost always a per-IP rate limit, and
    // Workers share egress addresses per PoP — worth naming, because it reads
    // as "no match" everywhere else.
    const hint =
      status === 403 || status === 429
        ? ' (rate limited? shared Worker egress IP)'
        : '';
    return `upstream returned ${status}${hint}`;
  }

  if (has('error')) {
    return `request failed: ${String(find('error')?.detail?.['message'] ?? '')}`;
  }

  const candidates = find('candidates');
  if (candidates) {
    const count = Number(candidates.detail?.['count'] ?? 0);
    const best = candidates.detail?.['bestScore'];
    const threshold = candidates.detail?.['threshold'];
    // Accepted and rejected share one event, and calling an accepted match
    // "below threshold" would send someone to fix a scorer that just worked.
    if (candidates.detail?.['accepted'] === true) {
      return `matched: ${String(candidates.detail?.['bestArtist'] ?? '')} — ${String(
        candidates.detail?.['bestTitle'] ?? ''
      )} (score ${String(best)} of ${count} candidate(s))`;
    }
    if (count === 0) return 'upstream returned no candidates';
    return `${count} candidate(s), best score ${String(best)} — below threshold ${String(
      threshold
    )}`;
  }

  // An ISRC lookup short-circuits scoring entirely, so a success can reach
  // here with nothing but an HTTP event to show for it.
  if (outcome === 'exact') {
    return has('http')
      ? 'resolved by ISRC lookup (no scoring needed)'
      : 'resolved';
  }
  if (has('http')) return 'upstream answered, no usable result';
  return 'no conclusive outcome recorded';
}
