import { describe, expect, it } from 'vitest';
import {
  cachedTrackMatch,
  matchKeysForTrack,
  seedAggregateMatches,
  seedSourceMatch,
} from '../providers/matching';
import type { Env, Track } from '../types';

/** In-memory stand-in for the CACHE KV namespace. No network, no runtime. */
function fakeEnv(seed: Record<string, unknown> = {}) {
  const store = new Map<string, string>(
    Object.entries(seed).map(([k, v]) => [k, JSON.stringify(v)])
  );
  const env = {
    CACHE: {
      get: async (key: string) => {
        const raw = store.get(key);
        return raw === undefined ? null : JSON.parse(raw);
      },
      put: async (key: string, value: string) => {
        store.set(key, value);
      },
    },
  } as unknown as Env;
  return { env, store };
}

const YT_TRACK: Track = {
  provider: 'youtube',
  id: 'NJKsTEeqL1s',
  title: 'Trickle Down Blues',
  artist: 'Cam Burnette',
};

/** Same recording as YT_TRACK, but sourced from a catalog that has ISRCs. */
const DEEZER_TRACK: Track = {
  provider: 'deezer',
  id: '3814389462',
  title: 'Trickle Down Blues',
  artist: 'Cam Burnette',
  isrc: 'QZHN72627781',
};

describe('matchKeysForTrack', () => {
  it('prefers ISRC but still offers the normalized key', () => {
    expect(matchKeysForTrack(DEEZER_TRACK)).toEqual([
      'isrc:QZHN72627781',
      'norm:cam-burnette~trickle-down-blues',
    ]);
  });

  it('offers only the normalized key when there is no ISRC', () => {
    expect(matchKeysForTrack(YT_TRACK)).toEqual([
      'norm:cam-burnette~trickle-down-blues',
    ]);
  });

  it('drops the normalized key when the artist normalizes to nothing', () => {
    // `norm:~title` would collide across every artist with that song title.
    expect(matchKeysForTrack({ title: 'Song', artist: '', isrc: 'X1' })).toEqual([
      'isrc:X1',
    ]);
    expect(matchKeysForTrack({ title: 'Song', artist: '' })).toEqual([]);
  });
});

describe('seedSourceMatch', () => {
  it('records the source provider’s own exact link under the normalized key', async () => {
    const { env, store } = fakeEnv();
    await seedSourceMatch(env, YT_TRACK);
    expect(
      JSON.parse(store.get('match:norm:cam-burnette~trickle-down-blues:youtube')!)
    ).toEqual({
      link: {
        provider: 'youtube',
        kind: 'exact',
        url: 'https://music.youtube.com/watch?v=NJKsTEeqL1s',
      },
      matched: YT_TRACK,
    });
  });

  it('uses the normalized key even when the track has an ISRC', async () => {
    // The readers who need this most are keyless-sourced tracks, which have no
    // ISRC and therefore only ever look under the normalized key.
    const { env, store } = fakeEnv();
    await seedSourceMatch(env, DEEZER_TRACK);
    expect([...store.keys()]).toEqual([
      'match:norm:cam-burnette~trickle-down-blues:deezer',
    ]);
  });

  it('writes nothing without an id or a usable artist', async () => {
    const { env, store } = fakeEnv();
    await seedSourceMatch(env, { ...YT_TRACK, id: '' });
    await seedSourceMatch(env, { ...YT_TRACK, artist: '' });
    expect(store.size).toBe(0);
  });

  it('never throws when KV is unavailable', async () => {
    const env = {
      CACHE: {
        put: async () => {
          throw new Error('KV down');
        },
      },
    } as unknown as Env;
    await expect(seedSourceMatch(env, YT_TRACK)).resolves.toBeUndefined();
  });
});

describe('cachedTrackMatch reads every key a track can be filed under', () => {
  it('finds a seed left by a keyless paste, for a track that has an ISRC', async () => {
    // The whole point: someone pasted a Spotify link, so we know a real
    // Spotify id for this recording even with no Spotify credentials. A later
    // Deezer-sourced view carries an ISRC and would miss `isrc:…:spotify`.
    const { env } = fakeEnv();
    await seedSourceMatch(env, {
      provider: 'spotify',
      id: '4u7EnebtmKWzUH433cf5Qv',
      title: 'Trickle Down Blues',
      artist: 'Cam Burnette',
    });

    const hit = await cachedTrackMatch(env, DEEZER_TRACK, 'spotify');
    expect(hit?.link).toEqual({
      provider: 'spotify',
      kind: 'exact',
      url: 'https://open.spotify.com/track/4u7EnebtmKWzUH433cf5Qv',
    });
  });

  it('still prefers an ISRC-keyed entry when one exists', async () => {
    const { env } = fakeEnv({
      'match:isrc:QZHN72627781:spotify': {
        link: { provider: 'spotify', kind: 'exact', url: 'https://exact/by-isrc' },
      },
      'match:norm:cam-burnette~trickle-down-blues:spotify': {
        link: { provider: 'spotify', kind: 'exact', url: 'https://exact/by-norm' },
      },
    });
    const hit = await cachedTrackMatch(env, DEEZER_TRACK, 'spotify');
    expect(hit?.link.url).toBe('https://exact/by-isrc');
  });

  it('ignores a cached search link — only exact matches are worth reusing', async () => {
    const { env } = fakeEnv({
      'match:norm:cam-burnette~trickle-down-blues:spotify': {
        link: { provider: 'spotify', kind: 'search', url: 'https://search/x' },
      },
    });
    expect(await cachedTrackMatch(env, YT_TRACK, 'spotify')).toBeNull();
  });

  it('returns null for the track’s own provider', async () => {
    const { env } = fakeEnv();
    await seedSourceMatch(env, YT_TRACK);
    expect(await cachedTrackMatch(env, YT_TRACK, 'youtube')).toBeNull();
  });
});

describe('seeding writes only net-new information', () => {
  it('skips the write when an exact entry is already on file', async () => {
    const { env, store } = fakeEnv({
      'match:norm:cam-burnette~trickle-down-blues:youtube': {
        link: {
          provider: 'youtube',
          kind: 'exact',
          url: 'https://music.youtube.com/watch?v=alreadyKnown',
        },
      },
    });
    await seedSourceMatch(env, YT_TRACK);
    // First writer wins: no churn, and the existing id is left alone.
    expect(
      JSON.parse(store.get('match:norm:cam-burnette~trickle-down-blues:youtube')!)
        .link.url
    ).toContain('alreadyKnown');
  });

  it('does write over a cached search link, which carries no id', async () => {
    const { env, store } = fakeEnv({
      'match:norm:cam-burnette~trickle-down-blues:youtube': {
        link: { provider: 'youtube', kind: 'search', url: 'https://search/x' },
      },
    });
    await seedSourceMatch(env, YT_TRACK);
    expect(
      JSON.parse(store.get('match:norm:cam-burnette~trickle-down-blues:youtube')!)
        .link
    ).toMatchObject({ kind: 'exact' });
  });
});

describe('seedAggregateMatches', () => {
  const row = {
    track: {
      provider: 'deezer' as const,
      id: '3814389462',
      title: 'Trickle Down Blues',
      artist: 'Cam Burnette',
      isrc: 'QZHN72627781',
    },
    sources: [
      { provider: 'deezer' as const, id: '3814389462' },
      { provider: 'spotify' as const, id: 'spot123' },
      { provider: 'apple' as const, id: '999' },
    ],
  };

  it('records every catalog the merge proved carries the recording', async () => {
    const { env, store } = fakeEnv();
    await seedAggregateMatches(env, [row]);
    expect([...store.keys()].sort()).toEqual([
      'match:norm:cam-burnette~trickle-down-blues:apple',
      'match:norm:cam-burnette~trickle-down-blues:deezer',
      'match:norm:cam-burnette~trickle-down-blues:spotify',
    ]);
    expect(
      JSON.parse(store.get('match:norm:cam-burnette~trickle-down-blues:spotify')!)
        .link.url
    ).toBe('https://open.spotify.com/track/spot123');
  });

  it('keys every source on the representative, not on its own catalog row', async () => {
    // The group merged because these ARE one recording; the representative is
    // the richest description of it, so it names the key all sources file under.
    const { env, store } = fakeEnv();
    await seedAggregateMatches(env, [
      { ...row, sources: [{ provider: 'spotify', id: 'spot123' }] },
    ]);
    expect([...store.keys()]).toEqual([
      'match:norm:cam-burnette~trickle-down-blues:spotify',
    ]);
  });

  it('writes nothing on a second pass over the same results', async () => {
    const { env, store } = fakeEnv();
    await seedAggregateMatches(env, [row]);
    const first = new Map(store);
    await seedAggregateMatches(env, [row]);
    expect([...store.entries()]).toEqual([...first.entries()]);
  });

  it('skips rows with no usable artist', async () => {
    const { env, store } = fakeEnv();
    await seedAggregateMatches(env, [
      { track: { ...row.track, artist: '' }, sources: row.sources },
    ]);
    expect(store.size).toBe(0);
  });
});
