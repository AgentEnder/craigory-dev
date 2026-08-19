/**
 * Cross-provider track matching: ISRC first (iTunes `lookup?isrc=`; Spotify
 * `search?q=isrc:<code>`), then normalized `artist title` search.
 * Pure helpers here (normalization, keys, scoring) are unit-tested in
 * worker/__tests__; the resolve* orchestration wraps the provider registry
 * and the KV match cache.
 */

import type {
  Env,
  ProviderId,
  ResolvedMatch,
  Track,
} from '../types';
import { kvGetJson, kvPutJson, matchCacheKey } from '../cache';
import { searchTrackLink } from './links';
import { getProvider } from './index';

/** TTL for per-provider match cache entries (30 days, per SPEC). */
export const MATCH_TTL_SECONDS = 30 * 24 * 60 * 60;

/** Minimum score for `pickBestMatch` to accept a candidate. */
export const DEFAULT_MATCH_THRESHOLD = 0.6;

/** Duration window (ms) considered "the same recording" for the score bonus. */
export const DURATION_BONUS_WINDOW_MS = 5000;

const NOISE_WORDS =
  'feat|ft|featuring|with|remaster(?:ed)?|remix|mix|version|edit|edition|' +
  'live|mono|stereo|deluxe|bonus|single|radio|explicit|clean|instrumental|' +
  'acoustic|demo|anniversary|extended|original|official|video|audio|' +
  'lyric(?:s)?|visualizer|hd|4k';
const NOISE_RE = new RegExp(`\\b(?:${NOISE_WORDS})\\b`, 'i');

function collapse(s: string): string {
  return s
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .replace(/\s+/g, ' ');
}

/**
 * Normalize a track title for matching: lowercase, drop parenthetical /
 * bracketed noise ("(feat. …)", "[Official Video]"), trailing dash-noise
 * suffixes ("… - 2011 Remaster"), trailing feat. clauses, and punctuation.
 */
export function normalizeTitle(raw: string): string {
  let s = raw.toLowerCase();
  // Parenthetical groups: drop noisy ones, keep meaningful content unparen'd.
  s = s.replace(/[([{][^)\]}]*[)\]}]/g, (group) =>
    NOISE_RE.test(group) ? ' ' : ` ${group.slice(1, -1)} `
  );
  // Trailing " - <noise>" segments (e.g. "Song - 2011 Remaster").
  const parts = s.split(/\s+[-–—]\s+/);
  while (parts.length > 1 && NOISE_RE.test(parts[parts.length - 1]!)) {
    parts.pop();
  }
  s = parts.join(' ');
  // Trailing feat clause outside parens.
  s = s.replace(/\b(?:feat|ft|featuring)\b\.?\s+.*$/i, ' ');
  return collapse(s);
}

/**
 * Normalize an artist string for matching: lowercase, strip a YouTube
 * " - Topic" suffix, feat. clauses, "VEVO", and punctuation.
 */
export function normalizeArtist(raw: string): string {
  let s = raw.toLowerCase();
  s = s.replace(/\s*-\s*topic\s*$/i, '');
  s = s.replace(/\b(?:feat|ft|featuring)\b\.?\s+.*$/i, ' ');
  s = s.replace(/vevo\b/g, ' ');
  return collapse(s);
}

/** Back-compat alias (original stub name). */
export function normalizeForMatching(text: string): string {
  return normalizeTitle(text);
}

/** Normalized `artist|title` key for a track (url/KV safe). */
export function normKey(track: Pick<Track, 'title' | 'artist'>): string {
  const artist = normalizeArtist(track.artist).replace(/ /g, '-');
  const title = normalizeTitle(track.title).replace(/ /g, '-');
  return `${artist}~${title}`;
}

/** Build the `<isrc-or-normkey>` portion of the KV match cache key. */
export function matchKeyForTrack(
  track: Pick<Track, 'title' | 'artist' | 'isrc'>
): string {
  return track.isrc
    ? `isrc:${track.isrc.toUpperCase()}`
    : `norm:${normKey(track)}`;
}

function tokens(s: string): string[] {
  return s ? s.split(' ').filter(Boolean) : [];
}

/**
 * Similarity of two already-normalized strings in [0, 1]: token Dice
 * coefficient, with a floor of 0.85 when one compacted string contains the
 * other (handles "queen" vs "queenofficial").
 */
export function similarity(a: string, b: string): number {
  if (!a || !b) return 0;
  if (a === b) return 1;
  const ta = new Set(tokens(a));
  const tb = new Set(tokens(b));
  let inter = 0;
  for (const t of ta) if (tb.has(t)) inter++;
  const dice = (2 * inter) / (ta.size + tb.size);
  const ca = a.replace(/ /g, '');
  const cb = b.replace(/ /g, '');
  const contains = ca.includes(cb) || cb.includes(ca) ? 0.85 : 0;
  return Math.max(dice, contains);
}

/** Fraction of `needle` tokens present in `haystack` (both normalized). */
function tokenCoverage(needle: string, haystack: string): number {
  const tn = tokens(needle);
  if (tn.length === 0) return 0;
  const th = new Set(tokens(haystack));
  let hit = 0;
  for (const t of tn) if (th.has(t)) hit++;
  return hit / tn.length;
}

/**
 * Score a candidate against the source track: title similarity (60%) +
 * artist similarity (40%, also credited when the artist appears inside the
 * candidate title — YouTube video titles), plus a +0.1 bonus when durations
 * are within 5s of each other.
 */
export function scoreMatch(
  source: Pick<Track, 'title' | 'artist' | 'durationMs'>,
  candidate: Pick<Track, 'title' | 'artist' | 'durationMs'>
): number {
  const sourceTitle = normalizeTitle(source.title);
  const candidateTitle = normalizeTitle(candidate.title);
  const sourceArtist = normalizeArtist(source.artist);
  const titleScore = similarity(sourceTitle, candidateTitle);
  const artistScore = Math.max(
    similarity(sourceArtist, normalizeArtist(candidate.artist)),
    tokenCoverage(sourceArtist, candidateTitle)
  );
  let score = 0.6 * titleScore + 0.4 * artistScore;
  if (
    typeof source.durationMs === 'number' &&
    typeof candidate.durationMs === 'number' &&
    Math.abs(source.durationMs - candidate.durationMs) <=
      DURATION_BONUS_WINDOW_MS
  ) {
    score += 0.1;
  }
  return score;
}

/**
 * Pick the best-scoring candidate at or above `threshold`; null when nothing
 * is convincing (callers then degrade to a search link).
 */
export function pickBestMatch<T extends Track>(
  source: Pick<Track, 'title' | 'artist' | 'durationMs'>,
  candidates: readonly T[],
  threshold: number = DEFAULT_MATCH_THRESHOLD
): T | null {
  let best: T | null = null;
  let bestScore = 0;
  for (const candidate of candidates) {
    const score = scoreMatch(source, candidate);
    if (score > bestScore) {
      best = candidate;
      bestScore = score;
    }
  }
  return bestScore >= threshold ? best : null;
}

/**
 * Whether a track carries enough identity to key the KV match cache. With no
 * ISRC and an artist that normalizes to empty (e.g. Apple JSON-LD-scraped
 * tracks), `matchKeyForTrack` degenerates to title-only (`norm:~<title>`),
 * so different artists' same-titled songs would collide in the cache.
 */
function hasCacheableIdentity(track: Track): boolean {
  return Boolean(track.isrc) || normalizeArtist(track.artist) !== '';
}

/**
 * Cache-read-only resolution: return the cached exact link for `track` on
 * `target` (2 KV reads max per track across providers; zero provider HTTP),
 * or null on a miss. Never throws.
 */
export async function cachedTrackMatch(
  env: Env,
  track: Track,
  target: ProviderId
): Promise<ResolvedMatch | null> {
  if (track.provider === target || !hasCacheableIdentity(track)) return null;
  try {
    const cached = await kvGetJson<ResolvedMatch>(
      env,
      matchCacheKey(matchKeyForTrack(track), target)
    );
    if (
      cached?.link &&
      cached.link.kind === 'exact' &&
      typeof cached.link.url === 'string'
    ) {
      return cached;
    }
  } catch {
    // Cache unavailable — treat as a miss.
  }
  return null;
}

/**
 * Resolve a link on `target` provider for a track sourced elsewhere, using
 * the KV match cache (`match:<isrc-or-normkey>:<provider>`, 30-day TTL).
 * Never throws — degrades to a `kind: 'search'` link.
 */
export async function resolveTrackOnProvider(
  env: Env,
  track: Track,
  target: ProviderId
): Promise<ResolvedMatch> {
  const provider = getProvider(target);
  if (!provider) return { link: searchTrackLink(target, track) };

  const cacheKey = matchCacheKey(matchKeyForTrack(track), target);
  // Same-provider links are derived directly from the id — skip the cache.
  // Tracks whose match key would be title-only (no ISRC, empty-normalized
  // artist) are never cached: the key collides across artists.
  const cacheable = track.provider !== target && hasCacheableIdentity(track);

  if (cacheable) {
    try {
      // The matched track is cached alongside the link so a cache hit still
      // supplies the artwork and ISRC the importer copies onto its own row —
      // otherwise a warm cache would produce worse rows than a cold one.
      const cached = await kvGetJson<ResolvedMatch>(env, cacheKey);
      if (
        cached?.link &&
        cached.link.kind === 'exact' &&
        typeof cached.link.url === 'string'
      ) {
        return cached;
      }
    } catch {
      // Cache unavailable — fall through to a live resolve.
    }
  }

  let resolved: ResolvedMatch;
  try {
    resolved = await provider.resolve(env, track);
  } catch {
    resolved = { link: searchTrackLink(target, track) };
  }

  if (cacheable && resolved.link.kind === 'exact') {
    try {
      await kvPutJson(env, cacheKey, resolved, MATCH_TTL_SECONDS);
    } catch {
      // Best-effort cache write.
    }
  }
  return resolved;
}

