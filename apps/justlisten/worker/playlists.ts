/**
 * Ephemeral imported-playlist storage in the PLAYLISTS KV namespace.
 * Playlists expire after 7 days (`expirationTtl`).
 */

import type { Env, Playlist } from './types';

export const PLAYLIST_TTL_SECONDS = 7 * 24 * 60 * 60;

/** 64-char url-safe alphabet — one byte maps to one char via `byte & 63`. */
const ID_ALPHABET =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';

const ID_LENGTH = 12;

/** Generate a random 12-char url-safe playlist id (crypto.getRandomValues). */
export function createId(): string {
  const bytes = new Uint8Array(ID_LENGTH);
  crypto.getRandomValues(bytes);
  let id = '';
  for (const byte of bytes) {
    id += ID_ALPHABET[byte & 63];
  }
  return id;
}

/** Alias kept for the original stub name. */
export const generatePlaylistId = createId;

/** Store a playlist with the 7-day TTL. */
export async function savePlaylist(env: Env, playlist: Playlist): Promise<void> {
  await env.PLAYLISTS.put(playlist.id, JSON.stringify(playlist), {
    expirationTtl: PLAYLIST_TTL_SECONDS,
  });
}

/** Load a playlist; null when expired/unknown. */
export async function loadPlaylist(
  env: Env,
  id: string
): Promise<Playlist | null> {
  return env.PLAYLISTS.get<Playlist>(id, 'json');
}
