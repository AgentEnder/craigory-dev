/**
 * Pandora provider — link-only, and deliberately so.
 *
 * Pandora publishes no public catalog API. The one API that exists is a
 * partner/device integration behind a commercial agreement, its web app is a
 * client-rendered SPA whose data arrives over an authenticated JSON endpoint,
 * and there is no keyless page equivalent to Spotify's embed or Bandcamp's
 * `data-tralbum`. So unlike every other provider here, Pandora cannot be
 * searched, and a fetch would buy nothing a fetch is allowed to buy.
 *
 * What it *can* do is the two things that matter most:
 *
 * 1. **A pasted Pandora link opens a real song page.** Pandora's track URLs are
 *    `/artist/<artist>/<album>/<track>` — human-written slugs, not opaque ids —
 *    so the recording can be named from the URL alone, with no request at all.
 *    The names come back lowercased and punctuation-stripped, which costs
 *    nothing downstream: `matching.ts` normalizes exactly that away before
 *    comparing anything, so "bohemian-rhapsody" and "Bohemian Rhapsody (2011
 *    Remaster)" already meet at the same key.
 *
 * 2. **One paste teaches everyone else.** `seedSourceMatch` files the pasted
 *    id under the recording's normalized key, so every later visitor who
 *    reaches that song from Deezer, Spotify or a search gets a direct Pandora
 *    link rather than a search box — on a platform this app holds, and needs,
 *    no credentials for. Pandora is the clearest case for that mechanism in the
 *    whole registry: the cache is the *only* way an exact Pandora link is ever
 *    produced for a track sourced elsewhere.
 *
 * Everything else degrades honestly to `https://www.pandora.com/search/…/all`.
 */

import type {
  Env,
  MusicProvider,
  ResolvedMatch,
  SearchResult,
  Track,
} from '../types';
import {
  exactTrackLink,
  pandoraTrackId,
  parsePandoraTrackId,
  searchTrackLink,
} from './links';

/**
 * The opaque token Pandora appends to shared track links
 * (`…/bohemian-rhapsody/TRqmwq6Vbtfxqjk`). Dropped rather than stored: the
 * three slugs before it already address the page, and the token varies between
 * share surfaces for the same track, so keeping it would file two cache
 * entries for one recording.
 */
const SHARE_TOKEN_RE = /^TR[A-Za-z0-9]+$/;

/**
 * `"a-night-at-the-opera"` → `"A Night At The Opera"`.
 *
 * Title case rather than a bare de-hyphenation because these strings are shown
 * to a person on the song page. It is a reconstruction, not the real metadata —
 * Pandora's slugs have already lost case and punctuation, so "AC/DC" comes back
 * as "Ac Dc" — but every comparison downstream runs through `normalizeArtist` /
 * `normalizeTitle`, which lowercase and strip punctuation anyway, so the loss
 * is invisible to matching and only mildly visible to the reader.
 */
export function unslug(slug: string): string {
  return slug
    .split('-')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export const pandoraProvider: MusicProvider = {
  id: 'pandora',

  // Nothing to configure, and nothing that could be misconfigured: every
  // Pandora link this provider produces is built locally.
  available(_env: Env): boolean {
    return true;
  },

  /**
   * Always empty. Pandora is absent from `SEARCH_CATALOG_IDS`, so this is
   * never called by a route; it returns rather than throws so that adding it
   * there by mistake degrades to "contributed no rows" instead of a 502.
   */
  async search(): Promise<SearchResult[]> {
    return [];
  },

  /**
   * Named from the id's own slugs — no request. Returns null only when the id
   * is not the three-slug shape `parseTrackUrl` produces.
   */
  async getTrack(_env: Env, id: string): Promise<Track | null> {
    const parts = parsePandoraTrackId(id);
    if (!parts) return null;
    const [artist, album, title] = parts as [string, string, string];
    return {
      provider: 'pandora',
      id,
      title: unslug(title),
      artist: unslug(artist),
      album: unslug(album),
    };
  },

  /**
   * A search link, unless the track is Pandora's own.
   *
   * There is no lookup to make — but this is not the last word on the matter:
   * `resolveTrackOnProvider` checks the KV match cache before calling any
   * provider, so a recording somebody once pasted a Pandora link for resolves
   * to that exact link without ever reaching here.
   */
  async resolve(_env: Env, track: Track): Promise<ResolvedMatch> {
    return {
      link:
        track.provider === 'pandora'
          ? exactTrackLink('pandora', track.id)
          : searchTrackLink('pandora', track),
    };
  },

  /**
   * Pandora collections are not importable. A station is an algorithm rather
   * than a track list, and `pandora.com/playlist/PL:…` needs a signed-in
   * session to enumerate — so a pasted collection link falls through to the
   * route's 422, which names what is supported, rather than to a "could not
   * import" that implies it might work next time.
   */
  parsePlaylistUrl(_url: string): { playlistId: string } | null {
    return null;
  },

  /** `pandora.com/artist/<artist>/<album>/<track>[/TR…]`. */
  parseTrackUrl(url: string): { trackId: string } | null {
    let parsed: URL;
    try {
      parsed = new URL(url.trim());
    } catch {
      return null;
    }
    if (parsed.hostname.replace(/^www\./, '') !== 'pandora.com') return null;

    const segments = parsed.pathname.split('/').filter(Boolean);
    if (segments[0] !== 'artist') return null;
    const slugs = segments.slice(1);
    // Drop the share token so two links to one track produce one id.
    if (slugs.length === 4 && SHARE_TOKEN_RE.test(slugs[3]!)) slugs.pop();
    // Two slugs is an album page and one is an artist page — neither is a
    // track, and neither should be answered with a song route that 404s.
    if (slugs.length !== 3) return null;
    return { trackId: pandoraTrackId(slugs) };
  },

  async getPlaylist(): Promise<{ title: string; tracks: Track[] } | null> {
    return null;
  },
};
