/**
 * Cross-catalog search merging — pure functions, unit-tested in
 * worker/__tests__ (no network).
 *
 * The full search page queries several catalogs and has to answer "are these
 * two rows the same recording?" without spending a `resolve()` subrequest.
 * Two rows merge when either:
 *
 * 1. their ISRCs match exactly (an identity claim — always trusted), or
 * 2. their normalized `artist~title` keys match AND their durations are
 *    compatible.
 *
 * The duration guard on rule 2 is load-bearing, not defensive padding.
 * `normalizeTitle` deliberately strips "(Live at the Forum)", "- 2013
 * Remaster" and friends as noise so that fuzzy matching can work, which means
 * four distinct Eagles recordings of "Hotel California" all normalize to the
 * same key. They run 391s / 432s / 409s / 420s, so the ±5s window keeps them
 * as the four separate rows a user would expect to see.
 */

import type {
  AggregatedSearchResult,
  ProviderId,
  SearchResult,
} from '../types';
import { DURATION_BONUS_WINDOW_MS, normKey } from './matching';

/** One catalog's contribution to a merge, in preference order. */
export interface CatalogResults {
  provider: ProviderId;
  results: SearchResult[];
}

interface Group {
  members: SearchResult[];
  isrcs: Set<string>;
  normKeys: Set<string>;
}

/**
 * Whether two rows' durations are close enough to be the same recording.
 * Unknown durations abstain (return true) rather than block a merge — most
 * catalogs report one, and refusing to merge on missing data would split
 * rows that rule 1 already couldn't join.
 */
function durationsCompatible(a: SearchResult, b: SearchResult): boolean {
  if (typeof a.durationMs !== 'number' || typeof b.durationMs !== 'number') {
    return true;
  }
  return Math.abs(a.durationMs - b.durationMs) <= DURATION_BONUS_WINDOW_MS;
}

/**
 * How much usable metadata a row carries. Drives which member represents the
 * merged group — and therefore which provider the "open song" link points at.
 * ISRC is weighted heavily because a source track that has one unlocks the
 * ISRC-first path in `resolveTrackOnProvider`, which is far more reliable
 * than the fuzzy scorer for every other provider on the detail page.
 */
export function metadataRichness(track: SearchResult): number {
  let score = 0;
  if (track.isrc) score += 4;
  if (track.artworkUrl) score += 2;
  if (track.album) score += 1;
  if (track.releaseDate) score += 1;
  if (typeof track.durationMs === 'number') score += 1;
  return score;
}

function pickRepresentative(members: SearchResult[]): SearchResult {
  let best = members[0]!;
  let bestScore = metadataRichness(best);
  for (const member of members.slice(1)) {
    const score = metadataRichness(member);
    // Strictly greater: ties keep the earlier (better-ranked) row.
    if (score > bestScore) {
      best = member;
      bestScore = score;
    }
  }
  return best;
}

/**
 * Merge catalog results into one deduped list.
 *
 * Ordering is by first appearance, so the lead catalog's own relevance
 * ranking survives; rows are NOT re-sorted by how many catalogs carry them,
 * since a widely-available irrelevant track should not outrank the exact
 * match a user typed.
 */
export function mergeCatalogResults(
  catalogs: CatalogResults[],
  limit = 25
): AggregatedSearchResult[] {
  const groups: Group[] = [];
  const byIsrc = new Map<string, Group>();
  const byNormKey = new Map<string, Group>();

  for (const { results } of catalogs) {
    for (const track of results) {
      const isrc = track.isrc?.toUpperCase();
      const key = normKey(track);

      let group = isrc ? byIsrc.get(isrc) : undefined;
      if (!group) {
        const candidate = byNormKey.get(key);
        // Rule 2 — only accept the normalized-key match when the durations
        // agree, so noise-stripped titles cannot collapse distinct takes.
        if (
          candidate &&
          candidate.members.some((m) => durationsCompatible(m, track))
        ) {
          group = candidate;
        }
      }

      if (!group) {
        group = { members: [], isrcs: new Set(), normKeys: new Set() };
        groups.push(group);
      }

      group.members.push(track);
      // Register every alias the group now answers to, so a later row
      // matching on *any* member's isrc/key lands in the same group.
      if (isrc) {
        group.isrcs.add(isrc);
        byIsrc.set(isrc, group);
      }
      group.normKeys.add(key);
      if (!byNormKey.has(key)) byNormKey.set(key, group);
    }
  }

  return groups.slice(0, limit).map((group) => {
    const seen = new Set<ProviderId>();
    const sources: { provider: ProviderId; id: string }[] = [];
    for (const member of group.members) {
      // One entry per provider: a catalog listing the same recording on two
      // albums is a duplicate, not extra availability.
      if (seen.has(member.provider)) continue;
      seen.add(member.provider);
      sources.push({ provider: member.provider, id: member.id });
    }
    return { track: pickRepresentative(group.members), sources };
  });
}
