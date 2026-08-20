import { describe, expect, it } from 'vitest';
import {
  cachedTrackMatch,
  matchKeysForTrack,
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
