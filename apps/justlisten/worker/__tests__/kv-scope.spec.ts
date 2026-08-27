import { describe, expect, it } from 'vitest';
import { kvGetJson, kvPutJson } from '../cache';
import { scopedKey } from '../kv-scope';
import { loadPlaylist, savePlaylist } from '../playlists';
import type { Env, Playlist } from '../types';

/**
 * Minimal in-memory stand-in for a KV namespace — enough surface for the
 * get/put paths under test, and it exposes `store` so a test can assert on
 * the *literal* keys written, which is the whole point of scoping.
 */
function fakeKv() {
  const store = new Map<string, string>();
  return {
    store,
    async get(key: string, type?: string) {
      const raw = store.get(key);
      if (raw === undefined) return null;
      return type === 'json' ? JSON.parse(raw) : raw;
    },
    async put(key: string, value: string) {
      store.set(key, value);
    },
    async delete(key: string) {
      store.delete(key);
    },
  };
}

function envWith(prefix?: string) {
  const CACHE = fakeKv();
  const PLAYLISTS = fakeKv();
  const env = { CACHE, PLAYLISTS, KV_PREFIX: prefix } as unknown as Env;
  return { env, CACHE, PLAYLISTS };
}

const playlist = (id: string): Playlist => ({
  id,
  title: 'Road trip',
  sourceProvider: 'deezer',
  sourceUrl: 'https://www.deezer.com/playlist/1',
  createdAt: '2026-08-20T00:00:00.000Z',
  tracks: [],
});

describe('scopedKey', () => {
  it('leaves keys untouched when no prefix is set', () => {
    const { env } = envWith(undefined);
    expect(scopedKey(env, 'match:USRC17607839:apple')).toBe(
      'match:USRC17607839:apple'
    );
  });

  it('prefixes keys with a colon separator when one is set', () => {
    const { env } = envWith('pr-42');
    expect(scopedKey(env, 'match:USRC17607839:apple')).toBe(
      'pr-42:match:USRC17607839:apple'
    );
  });

  it('treats an empty prefix as unset, so a blank var cannot scope keys', () => {
    const { env } = envWith('');
    expect(scopedKey(env, 'spotify:token')).toBe('spotify:token');
  });
});

describe('KV scoping through the cache helpers', () => {
  it('writes the cache under the prefixed key', async () => {
    const { env, CACHE } = envWith('pr-42');
    await kvPutJson(env, 'match:abc:apple', { hit: true }, 60);
    expect([...CACHE.store.keys()]).toEqual(['pr-42:match:abc:apple']);
  });

  it('round-trips a value it wrote itself', async () => {
    const { env } = envWith('pr-42');
    await kvPutJson(env, 'match:abc:apple', { hit: true }, 60);
    await expect(kvGetJson(env, 'match:abc:apple')).resolves.toEqual({
      hit: true,
    });
  });

  it('cannot read production keys written without a prefix', async () => {
    const { env, CACHE } = envWith('pr-42');
    CACHE.store.set('match:abc:apple', JSON.stringify({ hit: 'production' }));
    await expect(kvGetJson(env, 'match:abc:apple')).resolves.toBeNull();
  });
});

describe('KV scoping through the playlist store', () => {
  it('stores a preview playlist under the prefixed key', async () => {
    const { env, PLAYLISTS } = envWith('pr-42');
    await savePlaylist(env, playlist('aaaaaaaaaaaa'));
    expect([...PLAYLISTS.store.keys()]).toEqual(['pr-42:aaaaaaaaaaaa']);
  });

  it('keeps production keys bare when no prefix is set', async () => {
    const { env, PLAYLISTS } = envWith(undefined);
    await savePlaylist(env, playlist('bbbbbbbbbbbb'));
    expect([...PLAYLISTS.store.keys()]).toEqual(['bbbbbbbbbbbb']);
  });

  it('does not serve a production playlist to a preview version', async () => {
    const { env: prod, PLAYLISTS } = envWith(undefined);
    await savePlaylist(prod, playlist('cccccccccccc'));

    const preview = {
      ...prod,
      PLAYLISTS,
      KV_PREFIX: 'pr-42',
    } as unknown as Env;
    await expect(loadPlaylist(preview, 'cccccccccccc')).resolves.toBeNull();
  });
});
