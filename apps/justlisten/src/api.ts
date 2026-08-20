/**
 * Typed fetch client for the JustListen API (/api/*).
 *
 * Only the genuinely interactive calls live here — autocomplete, the deliberate
 * search, and playlist import. Song and playlist *pages* load their data in
 * `+data.ts` on the server, so they never round-trip through this client.
 *
 * Error convention: non-2xx responses carry `{ error: string }`.
 */

import type {
  AggregatedSearch,
  PlaylistTrack,
  SearchResult,
} from '../worker/types';

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

/**
 * GET /api/search/all?q=<text>&limit=25
 *
 * The deliberate, user-initiated search: fans out across every catalog and
 * merges duplicates, unlike the single-catalog autocomplete above.
 */
export function searchAllTracks(
  q: string,
  limit = 25,
  init?: { signal?: AbortSignal }
): Promise<AggregatedSearch> {
  const params = new URLSearchParams({ q, limit: String(limit) });
  return request<AggregatedSearch>(`/api/search/all?${params}`, init);
}

/** POST /api/playlists  body { url } */
export function importPlaylist(url: string): Promise<{ id: string }> {
  return request<{ id: string }>('/api/playlists', {
    method: 'POST',
    body: JSON.stringify({ url }),
  });
}

/**
 * POST /api/playlists/:id/resolve  body { from }
 *
 * Finishes the cross-provider links for a slice of an imported playlist.
 * Import resolves only what fits in one Worker invocation; each call here is
 * a fresh invocation with its own budget, so the browser walks the tail.
 */
export function resolvePlaylistSlice(
  id: string,
  from: number,
  init?: { signal?: AbortSignal }
): Promise<{ tracks: PlaylistTrack[]; from: number; done: boolean }> {
  return request(`/api/playlists/${encodeURIComponent(id)}/resolve`, {
    ...init,
    method: 'POST',
    body: JSON.stringify({ from }),
  });
}
