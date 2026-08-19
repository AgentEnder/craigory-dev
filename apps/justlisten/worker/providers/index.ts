/**
 * Provider registry.
 */

import type { MusicProvider, ProviderId } from '../types';
import { PROVIDER_IDS, SEARCH_CATALOG_IDS } from '../types';
import { spotifyProvider } from './spotify';
import { appleProvider } from './apple';
import { youtubeProvider } from './youtube';
import { deezerProvider } from './deezer';

const BY_ID: Record<ProviderId, MusicProvider> = {
  spotify: spotifyProvider,
  apple: appleProvider,
  youtube: youtubeProvider,
  deezer: deezerProvider,
};

/** All providers, in canonical display order (`PROVIDER_IDS`). */
export const providers: MusicProvider[] = PROVIDER_IDS.map((id) => BY_ID[id]);

/**
 * Providers whose catalogs back search, in preference order. Derived from
 * `SEARCH_CATALOG_IDS` — YouTube is excluded there because `search.list`
 * costs 100 of a 10,000-unit daily quota.
 */
export const searchCatalogs: MusicProvider[] = SEARCH_CATALOG_IDS.map(
  (id) => BY_ID[id]
);

/** Look a provider up by id; undefined for unknown ids. */
export function getProvider(id: ProviderId): MusicProvider | undefined {
  return BY_ID[id];
}

/** Type guard for validating raw route params. */
export function isProviderId(value: string): value is ProviderId {
  return Object.prototype.hasOwnProperty.call(BY_ID, value);
}
