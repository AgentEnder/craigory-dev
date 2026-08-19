/**
 * Provider registry.
 */

import type { MusicProvider, ProviderId } from '../types';
import { spotifyProvider } from './spotify';
import { appleProvider } from './apple';
import { youtubeProvider } from './youtube';

/** All providers, in canonical display order. */
export const providers: MusicProvider[] = [
  spotifyProvider,
  appleProvider,
  youtubeProvider,
];

/** Look a provider up by id; undefined for unknown ids. */
export function getProvider(id: ProviderId): MusicProvider | undefined {
  return providers.find((p) => p.id === id);
}

/** Type guard for validating raw route params. */
export function isProviderId(value: string): value is ProviderId {
  return providers.some((p) => p.id === value);
}
