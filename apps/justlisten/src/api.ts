/**
 * Typed fetch client for the JustListen API (/api/*).
 * Error convention: non-2xx responses carry `{ error: string }`.
 */

import type {
  Playlist,
  PlaylistOpenLinks,
  ProviderId,
  SearchResult,
  SongDetail,
} from '../worker/types';

export type PlaylistWithOpenLinks = Playlist & { open: PlaylistOpenLinks[] };

export class ApiError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    ...init,
    headers: {
      accept: 'application/json',
      ...(init?.body ? { 'content-type': 'application/json' } : {}),
      ...init?.headers,
    },
  });
  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const body = (await res.json()) as { error?: string };
      if (body.error) message = body.error;
    } catch {
      // Non-JSON error body; keep the generic message.
    }
    throw new ApiError(res.status, message);
  }
  return (await res.json()) as T;
}

/** GET /api/search?q=<text>&limit=8 */
export function searchTracks(
  q: string,
  limit = 8,
  init?: { signal?: AbortSignal }
): Promise<SearchResult[]> {
  const params = new URLSearchParams({ q, limit: String(limit) });
  return request<SearchResult[]>(`/api/search?${params}`, init);
}

/** GET /api/song/:provider/:id */
export function getSong(
  provider: ProviderId,
  id: string,
  init?: { signal?: AbortSignal }
): Promise<SongDetail> {
  return request<SongDetail>(
    `/api/song/${encodeURIComponent(provider)}/${encodeURIComponent(id)}`,
    init
  );
}

/** POST /api/playlists  body { url } */
export function importPlaylist(url: string): Promise<{ id: string }> {
  return request<{ id: string }>('/api/playlists', {
    method: 'POST',
    body: JSON.stringify({ url }),
  });
}

/** GET /api/playlists/:id */
export function getPlaylist(
  id: string,
  init?: { signal?: AbortSignal }
): Promise<PlaylistWithOpenLinks> {
  return request<PlaylistWithOpenLinks>(
    `/api/playlists/${encodeURIComponent(id)}`,
    init
  );
}
