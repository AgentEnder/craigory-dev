/**
 * GET /api/song/:provider/:id/trace?token=… → why each link is what it is.
 *
 * ## The question it answers
 *
 * A song page renders "Search on Spotify" for five different reasons — no
 * credentials, no such recording, a 403 from a shared-IP rate limit, a match
 * that scored below threshold, or a request shape that was written against
 * documentation and never verified. They demand different fixes and look
 * identical. This reports which one actually happened, per provider, for one
 * track.
 *
 * ## Why it is gated
 *
 * The trace has to bypass the song page's 24-hour memo, because a trace of a
 * cache hit records nothing — none of the instrumented code runs. That makes
 * this an uncached fan-out across every upstream, on demand, which is exactly
 * the shape of request that would get this Worker's shared egress IP throttled
 * by iTunes and MusicBrainz if anyone looped it. So it exists only when
 * `TRACE_TOKEN` is set, and 404s otherwise — the same answer an unknown path
 * gets, so its presence is not discoverable by probing.
 *
 * Set it like any other secret:
 *
 *     pnpm --filter justlisten secrets:push     # with TRACE_TOKEN in 1Password
 *     curl 'https://…/api/song/deezer/123/trace?token=…' | jq
 */
import { Hono } from 'hono';

import { loadSongDetail, UnknownProviderError } from '../song';
import { groupByScope, summarize, withTrace } from '../trace';
import type { Env, SongDetail } from '../types';
import { PROVIDER_IDS } from '../types';

export const traceRoutes = new Hono<{ Bindings: Env }>();

/**
 * Constant-time-ish comparison. The token only guards a debug endpoint, but
 * comparing with `===` leaks length and prefix through timing, and writing the
 * careful version costs four lines.
 */
function tokenMatches(expected: string, given: string): boolean {
  if (expected.length !== given.length) return false;
  let diff = 0;
  for (let i = 0; i < expected.length; i++) {
    diff |= expected.charCodeAt(i) ^ given.charCodeAt(i);
  }
  return diff === 0;
}

traceRoutes.get('/:provider/:id/trace', async (c) => {
  const expected = c.env.TRACE_TOKEN;
  const given = c.req.query('token') ?? '';
  // Indistinguishable from an unregistered path, deliberately.
  if (!expected || !tokenMatches(expected, given)) {
    return c.json({ error: 'Not found' }, 404);
  }

  const provider = c.req.param('provider');
  const id = c.req.param('id');

  let detail: SongDetail | null;
  let events;
  try {
    ({ value: detail, events } = await withTrace(() =>
      loadSongDetail(c.env, provider, id, { fresh: true })
    ));
  } catch (err) {
    if (err instanceof UnknownProviderError) {
      return c.json({ error: `Unknown provider: ${provider}` }, 404);
    }
    throw err;
  }
  if (!detail) {
    return c.json({ error: 'That track was not found on its own provider.' }, 404);
  }

  const byScope = groupByScope(events);

  // One row per provider, in the order the page renders them, so the report
  // reads alongside the screenshot it is explaining.
  const providers = PROVIDER_IDS.map((providerId) => {
    const link = detail.links.find((l) => l.provider === providerId);
    const scoped = byScope[providerId] ?? [];
    return {
      provider: providerId,
      outcome: link?.kind ?? 'missing',
      why:
        link?.kind === 'exact' && scoped.length === 0
          ? 'source provider — link built from the id, no request made'
          : summarize(scoped, link?.kind ?? 'missing'),
      url: link?.url,
      events: scoped,
    };
  });

  return c.json({
    track: detail.track,
    // The two enrichment layers are reported separately because neither is a
    // provider, and "why is there no audio-features panel" is its own question.
    oracles: {
      musicbrainz: {
        why: summarize(byScope['musicbrainz'] ?? []),
        events: byScope['musicbrainz'] ?? [],
      },
      reccobeats: {
        why: summarize(byScope['reccobeats'] ?? []),
        events: byScope['reccobeats'] ?? [],
        gotFeatures: Boolean(detail.audioFeatures),
        gotRecommendations: detail.similar?.length ?? 0,
      },
    },
    providers,
    // Page fetches are shared by several providers (YouTube search, Bandcamp
    // album/track pages), so they get their own bucket rather than being
    // attributed to whichever one happened to trigger them.
    pages: byScope['page'] ?? [],
    source: byScope['source'] ?? [],
    events,
  });
});
