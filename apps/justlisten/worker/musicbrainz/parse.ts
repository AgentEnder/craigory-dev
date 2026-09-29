/**
 * MusicBrainz response mapping — pure functions, unit-tested in
 * worker/__tests__ (no network).
 *
 * ## What MusicBrainz is doing here
 *
 * Every other resolution path in this app *searches* a platform and then has to
 * decide whether what came back is the same recording — fuzzy scoring on title,
 * artist and duration, which is why `matching.ts` exists and why it is the
 * largest module in the provider layer. MusicBrainz skips that question
 * entirely: look up an ISRC, and it hands back the URLs its editors have
 * already attached to that exact recording. There is nothing to score, because
 * identity was established by the ISRC, not guessed.
 *
 * That makes it the one keyless way to get an exact link on a platform this
 * deployment holds no credentials for. Spotify, YouTube and Last.fm all refuse
 * to resolve without a key; MusicBrainz can hand us their URLs anyway.
 *
 * ## Turning a URL back into a provider link
 *
 * The mapping step reuses the registry's own `parseTrackUrl` implementations
 * rather than adding a second set of URL patterns. Those parsers already know
 * every shape each platform uses — Apple album URLs carrying `?i=`, Deezer's
 * locale prefix, Bandcamp's custom domains — and keeping one copy means a
 * MusicBrainz link and a pasted link are understood identically. A URL no
 * parser claims (Tidal, Amazon Music, SoundCloud, a Wikipedia page) is simply
 * dropped.
 *
 * ## Coverage is honest, not complete
 *
 * These relationships are contributed by MusicBrainz editors, so coverage is
 * uneven: strong on well-known releases, thin on the long tail, and better for
 * "free streaming" (YouTube) than for the subscription services. It is a
 * supplement to resolution, never a replacement — which is exactly how
 * `song.ts` wires it in: only for providers that came back with a search link.
 */
import type { ProviderLink, ProviderId } from '../types';
import { exactTrackLink } from '../providers/links';
import { providers } from '../providers/index';

/**
 * Relationship types worth reading off a recording.
 *
 * MusicBrainz distinguishes free streaming (YouTube) from subscription
 * streaming (Spotify, Apple Music, Deezer) and from paid download (Bandcamp,
 * iTunes). All three name a place the recording can be heard or bought, which
 * is what this app points at. Deliberately excluded: `production`, `remaster`,
 * `samples material` and the rest of the credit relationships, which name
 * people and works rather than URLs anyone can listen at.
 */
const LISTENABLE_RELATION_TYPES = new Set([
  'free streaming',
  'streaming',
  'download for free',
  'purchase for download',
]);

function str(value: unknown): string | undefined {
  return typeof value === 'string' && value.length > 0 ? value : undefined;
}

/**
 * Every listenable URL on a recording payload.
 *
 * Accepts either a single recording object or an `/isrc/<code>` response, whose
 * `recordings` array can hold several entries — one ISRC legitimately maps to
 * more than one MusicBrainz recording when the same master appears under
 * separate entries, and their URLs are pooled rather than picking one
 * arbitrarily.
 */
export function listenableUrls(payload: unknown): string[] {
  if (!payload || typeof payload !== 'object') return [];
  const root = payload as { recordings?: unknown; relations?: unknown };
  const recordings = Array.isArray(root.recordings)
    ? root.recordings
    : [payload];

  const urls: string[] = [];
  const seen = new Set<string>();
  for (const recording of recordings) {
    const relations = (recording as { relations?: unknown })?.relations;
    if (!Array.isArray(relations)) continue;
    for (const relation of relations) {
      const rel = relation as {
        type?: unknown;
        ended?: unknown;
        url?: { resource?: unknown };
      };
      const type = str(rel.type);
      if (!type || !LISTENABLE_RELATION_TYPES.has(type)) continue;
      // `ended: true` marks a link MusicBrainz knows is dead — a service that
      // delisted the track. Following one would be worse than a search link.
      if (rel.ended === true) continue;
      const resource = str(rel.url?.resource);
      if (!resource || seen.has(resource)) continue;
      seen.add(resource);
      urls.push(resource);
    }
  }
  return urls;
}

/**
 * Exact provider links for a set of URLs, at most one per provider.
 *
 * Providers are tried in `PROVIDER_IDS` order for each URL, and the first
 * claim wins — the same precedence the pasted-link route uses, so Bandcamp's
 * deliberately host-permissive parser cannot take a URL that belongs to a
 * host-locked provider.
 *
 * First URL wins per provider too: MusicBrainz often carries several YouTube
 * links for one recording (an official video, a topic upload, a lyric video),
 * and they are listed roughly best-first.
 */
export function linksFromUrls(urls: readonly string[]): ProviderLink[] {
  const byProvider = new Map<ProviderId, ProviderLink>();
  for (const url of urls) {
    for (const provider of providers) {
      if (byProvider.has(provider.id)) continue;
      let parsed: { trackId: string } | null = null;
      try {
        parsed = provider.parseTrackUrl(url);
      } catch {
        // A parser throwing on hostile input must not lose the other URLs.
        continue;
      }
      if (!parsed?.trackId) continue;
      const link = exactTrackLink(provider.id, parsed.trackId);
      // `exactTrackLink` degrades to a search link for an id it cannot rebuild;
      // storing that would claim MusicBrainz found something when it did not.
      if (link.kind !== 'exact') continue;
      byProvider.set(provider.id, link);
      break;
    }
  }
  return [...byProvider.values()];
}

/** The listenable provider links a MusicBrainz payload yields, deduped. */
export function linksFromIsrcLookup(payload: unknown): ProviderLink[] {
  return linksFromUrls(listenableUrls(payload));
}
