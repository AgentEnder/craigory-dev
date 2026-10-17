/**
 * ReccoBeats response mapping — pure, no network.
 *
 * These matter more than the usual parser suite. Every other upstream in this
 * app was checked against a live response before its parser was written;
 * ReccoBeats could not be (the build machine's egress policy blocks
 * `api.reccobeats.com`), so the tests below are the only thing standing between
 * a field-name assumption and a `NaN` on the song page. They lean on the two
 * behaviours that make a wrong assumption safe: unknown shapes yield null, and
 * out-of-range values are dropped rather than rendered.
 */
import { describe, expect, it } from 'vitest';
import {
  keyName,
  listRows,
  parseAudioFeatures,
  parseFirstAudioFeatures,
  parseFirstReccoTrack,
  parseRecommendation,
  parseRecommendations,
  spotifyIdFromHref,
} from '../reccobeats/parse';

const TRACK_ROW = {
  id: '6a1b0c9e-0000-4000-8000-000000000001',
  trackTitle: 'Bohemian Rhapsody',
  artists: [{ id: 'a1', name: 'Queen', href: 'https://open.spotify.com/artist/x' }],
  durationMs: 354320,
  isrc: 'GBUM71029604',
  href: 'https://open.spotify.com/track/4u7EnebtmKWzUH433cf5Qv',
  popularity: 77,
};

const FEATURES_ROW = {
  acousticness: 0.288,
  danceability: 0.392,
  energy: 0.402,
  instrumentalness: 0.0,
  key: 10,
  liveness: 0.243,
  loudness: -9.961,
  mode: 0,
  speechiness: 0.0536,
  tempo: 143.883,
  valence: 0.228,
};

describe('listRows', () => {
  it('accepts every envelope the API might use', () => {
    // The one part of the contract that could not be verified, so all four
    // plausible shapes are accepted rather than betting on one.
    expect(listRows([TRACK_ROW])).toHaveLength(1);
    expect(listRows({ content: [TRACK_ROW] })).toHaveLength(1);
    expect(listRows({ data: [TRACK_ROW] })).toHaveLength(1);
    expect(listRows({ tracks: [TRACK_ROW] })).toHaveLength(1);
  });

  it('is empty for anything else, rather than throwing', () => {
    expect(listRows(null)).toEqual([]);
    expect(listRows('nope')).toEqual([]);
    expect(listRows({ content: 'not an array' })).toEqual([]);
  });
});

describe('spotifyIdFromHref', () => {
  it('pulls the track id out of a Spotify URL', () => {
    expect(
      spotifyIdFromHref('https://open.spotify.com/track/4u7EnebtmKWzUH433cf5Qv')
    ).toBe('4u7EnebtmKWzUH433cf5Qv');
  });

  it('ignores an artist or album href, and junk', () => {
    expect(spotifyIdFromHref('https://open.spotify.com/artist/abc')).toBeUndefined();
    expect(spotifyIdFromHref(42)).toBeUndefined();
    expect(spotifyIdFromHref('')).toBeUndefined();
  });
});

describe('parseFirstReccoTrack', () => {
  it('maps a row, joining artists and recovering the Spotify id', () => {
    expect(parseFirstReccoTrack({ content: [TRACK_ROW] })).toEqual({
      id: '6a1b0c9e-0000-4000-8000-000000000001',
      title: 'Bohemian Rhapsody',
      artist: 'Queen',
      durationMs: 354320,
      isrc: 'GBUM71029604',
      spotifyId: '4u7EnebtmKWzUH433cf5Qv',
    });
  });

  it('joins multiple artists', () => {
    const row = {
      ...TRACK_ROW,
      artists: [{ name: 'Queen' }, { name: 'David Bowie' }],
    };
    expect(parseFirstReccoTrack([row])?.artist).toBe('Queen, David Bowie');
  });

  it('drops a malformed ISRC rather than caching it as an identity', () => {
    // This value is about to be written into the match cache as an identity
    // claim, so a bad one is worse than none.
    expect(parseFirstReccoTrack([{ ...TRACK_ROW, isrc: 'nope' }])?.isrc).toBeUndefined();
    expect(parseFirstReccoTrack([{ ...TRACK_ROW, isrc: '' }])?.isrc).toBeUndefined();
  });

  it('requires an id', () => {
    expect(parseFirstReccoTrack([{ trackTitle: 'x' }])).toBeNull();
    expect(parseFirstReccoTrack({ content: [] })).toBeNull();
  });
});

describe('parseAudioFeatures', () => {
  it('maps the documented field set', () => {
    expect(parseAudioFeatures(FEATURES_ROW)).toEqual({
      acousticness: 0.288,
      danceability: 0.392,
      energy: 0.402,
      instrumentalness: 0,
      key: 10,
      liveness: 0.243,
      loudness: -9.961,
      mode: 0,
      speechiness: 0.0536,
      tempo: 143.883,
      valence: 0.228,
    });
  });

  it('keeps a genuine zero, which is a real value on every scale', () => {
    const parsed = parseAudioFeatures({ energy: 0, mode: 0, key: 0 });
    expect(parsed).toEqual({ energy: 0, mode: 0, key: 0 });
  });

  it('drops values outside their documented range', () => {
    // Out of range means a field this parser has misread, not a strange song.
    const parsed = parseAudioFeatures({
      ...FEATURES_ROW,
      energy: 1.4,
      loudness: 12,
      key: 99,
      tempo: 0,
    });
    expect(parsed?.energy).toBeUndefined();
    expect(parsed?.loudness).toBeUndefined();
    expect(parsed?.key).toBeUndefined();
    expect(parsed?.tempo).toBeUndefined();
    // …without discarding the fields that were fine.
    expect(parsed?.danceability).toBe(0.392);
  });

  it('drops key -1, which means "no key detected"', () => {
    expect(parseAudioFeatures({ key: -1, energy: 0.5 })?.key).toBeUndefined();
  });

  it('accepts numbers sent as strings', () => {
    expect(parseAudioFeatures({ tempo: '128.5', energy: '0.7' })).toEqual({
      tempo: 128.5,
      energy: 0.7,
    });
  });

  it('returns null when nothing usable came back', () => {
    expect(parseAudioFeatures({})).toBeNull();
    expect(parseAudioFeatures(null)).toBeNull();
    expect(parseAudioFeatures({ timeSignature: 4 })).toBeNull();
  });

  it('reads features whether they arrive bare or in a list', () => {
    expect(parseFirstAudioFeatures(FEATURES_ROW)?.tempo).toBe(143.883);
    expect(parseFirstAudioFeatures({ content: [FEATURES_ROW] })?.tempo).toBe(143.883);
  });
});

describe('keyName', () => {
  it('names the key the way a musician would', () => {
    expect(keyName({ key: 10, mode: 0 })).toBe('B♭ minor');
    expect(keyName({ key: 0, mode: 1 })).toBe('C major');
    expect(keyName({ key: 6, mode: 1 })).toBe('F♯ major');
  });

  it('gives the pitch alone when the mode is unknown', () => {
    expect(keyName({ key: 2 })).toBe('D');
  });

  it('is undefined when no key was detected', () => {
    // "C major" would be indistinguishable from "we don't know" on the page.
    expect(keyName({ mode: 1 })).toBeUndefined();
    expect(keyName({})).toBeUndefined();
  });
});

describe('parseRecommendations', () => {
  const rows = [
    { ...TRACK_ROW, href: 'https://open.spotify.com/track/aaa', trackTitle: 'A' },
    { ...TRACK_ROW, href: 'https://open.spotify.com/track/bbb', trackTitle: 'B' },
    { ...TRACK_ROW, href: 'https://open.spotify.com/track/aaa', trackTitle: 'A again' },
  ];

  it('maps rows onto the Spotify provider so they link back into the app', () => {
    expect(parseRecommendation(rows[0])).toMatchObject({
      provider: 'spotify',
      id: 'aaa',
      title: 'A',
      artist: 'Queen',
    });
  });

  it('drops the seed from its own recommendations', () => {
    const out = parseRecommendations({ content: rows }, 'aaa', 10);
    expect(out.map((t) => t.id)).toEqual(['bbb']);
  });

  it('dedupes repeated ids and honours the limit', () => {
    expect(parseRecommendations({ content: rows }, undefined, 10).map((t) => t.id)).toEqual([
      'aaa',
      'bbb',
    ]);
    expect(parseRecommendations({ content: rows }, undefined, 1)).toHaveLength(1);
  });

  it('skips rows that cannot be linked or named', () => {
    expect(
      parseRecommendations(
        { content: [{ id: 'x', trackTitle: 'No href', artists: [{ name: 'Q' }] }] },
        undefined,
        5
      )
    ).toEqual([]);
    expect(
      parseRecommendations(
        { content: [{ id: 'x', href: 'https://open.spotify.com/track/zzz' }] },
        undefined,
        5
      )
    ).toEqual([]);
  });
});
