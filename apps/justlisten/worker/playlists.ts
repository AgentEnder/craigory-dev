/**
 * Ephemeral imported-playlist storage in the PLAYLISTS KV namespace.
 * Playlists expire after 7 days (`expirationTtl`).
 */

import { scopedKey } from './kv-scope';
import { getProvider } from './providers/index';
import {
  exactPlaylistLink,
  providerDisplayName,
  searchPlaylistLink,
} from './providers/links';
import type {
  Env,
  Playlist,
  PlaylistOpenLinks,
  ProviderLink,
} from './types';
import { PROVIDER_IDS } from './types';

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
  await env.PLAYLISTS.put(
    scopedKey(env, playlist.id),
    JSON.stringify(playlist),
    { expirationTtl: PLAYLIST_TTL_SECONDS }
  );
}

/** Load a playlist; null when expired/unknown. */
export async function loadPlaylist(
  env: Env,
  id: string
): Promise<Playlist | null> {
  return env.PLAYLISTS.get<Playlist>(scopedKey(env, id), 'json');
}

/**
 * A stored playlist plus the per-platform links for opening it.
 *
 * Built here rather than in a route because the page's SSR data hook is the
 * only consumer — resolving these is pure string work over already-stored
 * data, so it costs no subrequests.
 */
export interface PlaylistView extends Playlist {
  open: PlaylistOpenLinks[];
}

export async function loadPlaylistView(
  env: Env,
  id: string
): Promise<PlaylistView | null> {
  const playlist = await loadPlaylist(env, id);
  if (!playlist) return null;

  const open: PlaylistOpenLinks[] = PROVIDER_IDS.map((providerId) => {
    if (providerId === playlist.sourceProvider) {
      // Exact source-platform link. Prefer the canonical builder (re-parse the
      // stored URL for the native playlist id); fall back to the stored URL.
      const parsed = getProvider(providerId)?.parsePlaylistUrl(
        playlist.sourceUrl
      );
      const link: ProviderLink = parsed
        ? exactPlaylistLink(providerId, parsed.playlistId)
        : { provider: providerId, kind: 'exact', url: playlist.sourceUrl };
      return { ...link, label: `Open on ${providerDisplayName(providerId)}` };
    }
    // Cross-platform playlist creation needs per-user OAuth (out of scope) —
    // offer a title search deep-link instead.
    const link = searchPlaylistLink(providerId, playlist.title);
    return { ...link, label: `Find on ${providerDisplayName(providerId)}` };
  });

  return { ...playlist, open };
}
