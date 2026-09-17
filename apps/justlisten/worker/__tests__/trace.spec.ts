/**
 * Trace collection and summarizing — pure, no network.
 *
 * `summarize` is the part that does the actual work: it turns a pile of events
 * into the one sentence answering "why is this a search link?". Its ordering is
 * load-bearing, because several causes can be present at once and only the
 * most-upstream one is the real answer — a 403 explains a zero-candidate
 * result, so reporting "no candidates" there would send someone off fixing the
 * scorer for a rate-limit problem.
 */
import { describe, expect, it } from 'vitest';
import {
  groupByScope,
  summarize,
  trace,
  tracing,
  withTrace,
  type TraceEvent,
} from '../trace';

const ev = (
  scope: string,
  event: string,
  detail?: Record<string, unknown>
): TraceEvent => ({ ms: 0, scope, event, ...(detail ? { detail } : {}) });

describe('withTrace', () => {
  it('collects events logged anywhere under it', async () => {
    const { value, events } = await withTrace(async () => {
      trace('apple', 'http', { status: 200 });
      // Through an await boundary: AsyncLocalStorage has to carry the context
      // across continuations or nothing nested would ever be recorded.
      await Promise.resolve();
      await Promise.all([
        (async () => trace('deezer', 'http', { status: 200 }))(),
        (async () => trace('bandcamp', 'http', { status: 500 }))(),
      ]);
      return 'done';
    });
    expect(value).toBe('done');
    expect(events.map((e) => e.scope)).toEqual(['apple', 'deezer', 'bandcamp']);
  });

  it('is inert outside a trace, so instrumented code is free in production', () => {
    expect(tracing()).toBe(false);
    // The whole design rests on this not throwing and not accumulating.
    expect(() => trace('apple', 'http', { status: 200 })).not.toThrow();
  });

  it('does not leak between traces', async () => {
    await withTrace(async () => trace('apple', 'http'));
    const { events } = await withTrace(async () => trace('deezer', 'http'));
    expect(events.map((e) => e.scope)).toEqual(['deezer']);
  });
});

describe('groupByScope', () => {
  it('buckets by scope, preserving order within each', () => {
    const grouped = groupByScope([
      ev('apple', 'http', { status: 403 }),
      ev('deezer', 'http', { status: 200 }),
      ev('apple', 'candidates', { count: 0 }),
    ]);
    expect(Object.keys(grouped).sort()).toEqual(['apple', 'deezer']);
    expect(grouped['apple']?.map((e) => e.event)).toEqual(['http', 'candidates']);
  });
});

describe('summarize', () => {
  it('reports a provider that was never reached', () => {
    expect(summarize([])).toBe('not attempted');
  });

  it('leads with a missing credential, the most common cause', () => {
    expect(
      summarize([ev('spotify', 'skipped', { reason: 'provider reports no credentials' })])
    ).toBe('skipped: provider reports no credentials');
  });

  it('names a 403 as a likely shared-IP rate limit', () => {
    // The whole reason this endpoint exists: a throttled iTunes is otherwise
    // indistinguishable from "Apple does not have this track".
    const summary = summarize([ev('apple', 'http', { status: 403 })]);
    expect(summary).toContain('403');
    expect(summary).toContain('rate limited');
  });

  it('treats an upstream failure as outranking a low score', () => {
    // Both are present when a 403 yields an empty body; the 403 is the cause.
    const summary = summarize([
      ev('apple', 'http', { status: 403 }),
      ev('apple', 'candidates', { count: 0, bestScore: 0, threshold: 0.6 }),
    ]);
    expect(summary).toContain('403');
    expect(summary).not.toContain('candidate');
  });

  it('distinguishes "upstream had nothing" from "we rejected what it sent"', () => {
    expect(
      summarize([
        ev('bandcamp', 'http', { status: 200 }),
        ev('bandcamp', 'candidates', { count: 0, bestScore: 0, threshold: 0.8 }),
      ])
    ).toBe('upstream returned no candidates');

    const rejected = summarize([
      ev('bandcamp', 'http', { status: 200 }),
      ev('bandcamp', 'candidates', { count: 5, bestScore: 0.71, threshold: 0.8 }),
    ]);
    expect(rejected).toContain('5 candidate(s)');
    expect(rejected).toContain('0.71');
    expect(rejected).toContain('0.8');
  });

  it('reports a cache hit, which explains an absence of any request', () => {
    expect(
      summarize([ev('apple', 'cache-hit', { url: 'https://music.apple.com/…' })])
    ).toBe('resolved from the match cache');
  });

  it('reports a transport failure with its message', () => {
    expect(
      summarize([ev('musicbrainz', 'error', { message: 'TimeoutError' })])
    ).toContain('TimeoutError');
  });

  it('reports an accepted match as a match, not as "below threshold"', () => {
    // Accepted and rejected share the one `candidates` event; calling a
    // successful match "below threshold" would send someone to fix a scorer
    // that had just done its job.
    const summary = summarize([
      ev('apple', 'candidates', {
        count: 5,
        bestScore: 0.94,
        threshold: 0.6,
        accepted: true,
        bestTitle: 'Bohemian Rhapsody',
        bestArtist: 'Queen',
      }),
    ]);
    expect(summary).toContain('matched');
    expect(summary).toContain('Queen');
    expect(summary).not.toContain('below threshold');
  });

  it('explains an exact link that never scored anything', () => {
    // The ISRC path short-circuits `pickBestMatch`, so a success can arrive
    // with nothing but an HTTP event behind it.
    expect(summarize([ev('apple', 'http', { status: 200 })], 'exact')).toBe(
      'resolved by ISRC lookup (no scoring needed)'
    );
  });
});
