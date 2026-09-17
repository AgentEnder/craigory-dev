/**
 * ReccoBeats response mapping — pure functions, unit-tested in
 * worker/__tests__ (no network).
 *
 * ## Why the parsing here is unusually defensive
 *
 * Every other upstream in this app was verified against live responses before
 * its parser was written. ReccoBeats was not: the network policy on the machine
 * this was built on returns 403 for `reccobeats.com` and `api.reccobeats.com`
 * alike, so the field names below come from ReccoBeats' published docs and from
 * other public consumers of the API, not from a response anybody here has seen.
 *
 * The response is therefore treated as *shape-uncertain* in two specific ways,
 * and only these two:
 *
 * 1. **The list envelope is accepted in any of its plausible forms** — a bare
 *    array, or an object with the rows under `content`, `data` or `tracks`.
 *    Spring-style APIs (which the `availableCountries` / `popularity` field
 *    naming suggests this is) usually page under `content`, but guessing wrong
 *    would mean every lookup silently returning nothing, and the cost of
 *    accepting all four is a few lines.
 * 2. **Every field is optional and type-checked at the boundary.** A missing
 *    tempo omits the tempo, it does not produce `NaN` in the UI.
 *
 * What is NOT guessed: endpoint paths and query parameters live in `index.ts`
 * and are documented there with their source. If those are wrong the calls
 * fail, the callers degrade, and the song page renders exactly as it did
 * before ReccoBeats existed.
 */
import type { AudioFeatures, Track } from '../types';

/** A ReccoBeats track row: its own UUID plus the identifiers we care about. */
export interface ReccoTrack {
  /** ReccoBeats UUID — the key for the audio-features and recommendation calls. */
  id: string;
  title?: string;
  artist?: string;
  durationMs?: number;
  isrc?: string;
  /** The Spotify track id, recovered from the row's `href`. */
  spotifyId?: string;
}

function str(value: unknown): string | undefined {
  return typeof value === 'string' && value.length > 0 ? value : undefined;
}

/** A finite number, from either a JSON number or a numeric string. */
function num(value: unknown): number | undefined {
  const parsed = typeof value === 'string' ? Number(value) : value;
  return typeof parsed === 'number' && Number.isFinite(parsed)
    ? parsed
    : undefined;
}

/**
 * The rows out of a list response, whatever it wraps them in.
 *
 * See the header: the envelope is the one part of the contract that could not
 * be confirmed, so all four plausible shapes are accepted rather than betting
 * on one and failing closed.
 */
export function listRows(payload: unknown): unknown[] {
  if (Array.isArray(payload)) return payload;
  if (!payload || typeof payload !== 'object') return [];
  const obj = payload as Record<string, unknown>;
  for (const key of ['content', 'data', 'tracks']) {
    const rows = obj[key];
    if (Array.isArray(rows)) return rows;
  }
  return [];
}

/** `https://open.spotify.com/track/<id>` → `<id>`. */
export function spotifyIdFromHref(href: unknown): string | undefined {
  const url = str(href);
  if (!url) return undefined;
  const match = /open\.spotify\.com\/track\/([A-Za-z0-9]+)/.exec(url);
  return match?.[1];
}

/**
 * Artist names joined as this app spells them — ReccoBeats returns an array of
 * `{ id, name, href }`, and a `Track.artist` is one string.
 */
function artistNames(value: unknown): string | undefined {
  if (!Array.isArray(value)) return undefined;
  const names = value
    .map((entry) => str((entry as { name?: unknown })?.name))
    .filter((name): name is string => Boolean(name));
  return names.length > 0 ? names.join(', ') : undefined;
}

/** One `/v1/track` row; null when it carries no usable id. */
export function parseReccoTrack(raw: unknown): ReccoTrack | null {
  if (!raw || typeof raw !== 'object') return null;
  const row = raw as Record<string, unknown>;
  const id = str(row['id']);
  if (!id) return null;

  const track: ReccoTrack = { id };
  const title = str(row['trackTitle']) ?? str(row['title']);
  if (title) track.title = title;
  const artist = artistNames(row['artists']);
  if (artist) track.artist = artist;
  const duration = num(row['durationMs']);
  if (duration !== undefined && duration > 0) track.durationMs = duration;
  const isrc = str(row['isrc']);
  // ISRCs are 12 chars, `CCXXXNNNNNNN`. Validated rather than trusted because
  // this value is about to be written into the match cache as an identity
  // claim — a malformed one would key an entry nothing ever reads again.
  if (isrc && /^[A-Za-z]{2}[A-Za-z0-9]{3}\d{7}$/.test(isrc)) {
    track.isrc = isrc.toUpperCase();
  }
  const spotifyId = spotifyIdFromHref(row['href']);
  if (spotifyId) track.spotifyId = spotifyId;
  return track;
}

/** The first row of a `/v1/track` list response, or null. */
export function parseFirstReccoTrack(payload: unknown): ReccoTrack | null {
  for (const row of listRows(payload)) {
    const track = parseReccoTrack(row);
    if (track) return track;
  }
  return null;
}

/** The 0–1 normalized measures, in the order the UI renders them. */
const UNIT_FEATURES = [
  'energy',
  'danceability',
  'valence',
  'acousticness',
  'instrumentalness',
  'liveness',
  'speechiness',
] as const;

/**
 * Audio features for one track.
 *
 * ReccoBeats mirrors Spotify's field names and scales (Spotify deprecated its
 * own `/v1/audio-features` in November 2024 and shipped no replacement), minus
 * `time_signature`, which it does not return. The values are ReccoBeats' own
 * estimates rather than Spotify's original numbers.
 *
 * Returns null when nothing usable came back, so a caller can tell "no features
 * for this recording" from "features that happen to be all zero" — zero is a
 * meaningful value on every one of these scales.
 */
export function parseAudioFeatures(raw: unknown): AudioFeatures | null {
  if (!raw || typeof raw !== 'object') return null;
  const row = raw as Record<string, unknown>;
  const features: AudioFeatures = {};

  for (const name of UNIT_FEATURES) {
    const value = num(row[name]);
    // Out-of-range means a field this parser has misread, not a strange song.
    if (value !== undefined && value >= 0 && value <= 1) {
      features[name] = value;
    }
  }

  const tempo = num(row['tempo']);
  if (tempo !== undefined && tempo > 0) features.tempo = tempo;

  const key = num(row['key']);
  // -1 is Spotify's "no key detected"; it is dropped rather than rendered.
  if (key !== undefined && Number.isInteger(key) && key >= 0 && key <= 11) {
    features.key = key;
  }

  const mode = num(row['mode']);
  if (mode === 0 || mode === 1) features.mode = mode;

  const loudness = num(row['loudness']);
  // Full-scale dB: negative, and never usefully below about -60.
  if (loudness !== undefined && loudness <= 0 && loudness >= -60) {
    features.loudness = loudness;
  }

  return Object.keys(features).length > 0 ? features : null;
}

/** Features out of a response that may be the object itself or a list of one. */
export function parseFirstAudioFeatures(payload: unknown): AudioFeatures | null {
  const direct = parseAudioFeatures(payload);
  if (direct) return direct;
  for (const row of listRows(payload)) {
    const features = parseAudioFeatures(row);
    if (features) return features;
  }
  return null;
}

const PITCH_CLASSES = [
  'C',
  'C♯',
  'D',
  'E♭',
  'E',
  'F',
  'F♯',
  'G',
  'A♭',
  'A',
  'B♭',
  'B',
] as const;

/**
 * `key` + `mode` as a musician would say it — "F♯ minor", "E♭ major".
 *
 * Sharps for the black keys that are usually named sharp and flats for the
 * ones usually named flat, rather than one accidental applied mechanically to
 * all five: "D♯ major" and "G♯ major" are keys almost nobody writes.
 *
 * Returns undefined when the key was not detected, which is the one case the
 * caller must not render — "C major" is indistinguishable from "we don't know"
 * once it is on the page.
 */
export function keyName(features: AudioFeatures): string | undefined {
  if (features.key === undefined) return undefined;
  const pitch = PITCH_CLASSES[features.key];
  if (!pitch) return undefined;
  if (features.mode === undefined) return pitch;
  return `${pitch} ${features.mode === 1 ? 'major' : 'minor'}`;
}

/**
 * A ReccoBeats recommendation as a `Track` on the Spotify provider.
 *
 * Filed under `spotify` rather than a provider of its own because the only
 * durable id a recommendation carries is its Spotify track id, and
 * `/song/spotify/<id>` already knows how to resolve one of those across every
 * platform. A recommendation row therefore costs no resolution of its own: it
 * links into the app, and the song page it lands on does the work.
 *
 * Null when the row has no Spotify id, no title or no artist — a row that
 * cannot be linked or named is not worth a line on the page.
 */
export function parseRecommendation(raw: unknown): Track | null {
  const recco = parseReccoTrack(raw);
  if (!recco?.spotifyId || !recco.title || !recco.artist) return null;
  const track: Track = {
    provider: 'spotify',
    id: recco.spotifyId,
    title: recco.title,
    artist: recco.artist,
  };
  if (recco.durationMs) track.durationMs = recco.durationMs;
  if (recco.isrc) track.isrc = recco.isrc;
  return track;
}

/**
 * Recommendation rows, deduped and with the seed itself removed.
 *
 * ReccoBeats is under no obligation to exclude the seed from its own
 * recommendations, and "more like this" listing the song you are already
 * looking at reads as a bug.
 */
export function parseRecommendations(
  payload: unknown,
  seedSpotifyId: string | undefined,
  limit: number
): Track[] {
  const seen = new Set<string>();
  if (seedSpotifyId) seen.add(seedSpotifyId);
  const tracks: Track[] = [];
  for (const row of listRows(payload)) {
    if (tracks.length >= limit) break;
    const track = parseRecommendation(row);
    if (!track || seen.has(track.id)) continue;
    seen.add(track.id);
    tracks.push(track);
  }
  return tracks;
}
