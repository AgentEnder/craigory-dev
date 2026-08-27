import { describe, expect, it } from 'vitest';
import { parseSpotifyEmbedTrack } from '../providers/scrape/spotify-embed';

/**
 * Trimmed from the live response for
 * open.spotify.com/embed/track/4u7EnebtmKWzUH433cf5Qv (2026-08-20). Field
 * names and nesting are verbatim; unused branches (sentry, machineState, the
 * anonymous token) are dropped.
 */
function html(entity: unknown): string {
  const data = { props: { pageProps: { state: { data: { entity } } } } };
  return `<!doctype html><html><body><script id="__NEXT_DATA__" type="application/json">${JSON.stringify(
    data
  )}</script></body></html>`;
}

const REAL_ENTITY = {
  type: 'track',
  name: 'Bohemian Rhapsody - Remastered 2011',
  uri: 'spotify:track:4u7EnebtmKWzUH433cf5Qv',
  id: '4u7EnebtmKWzUH433cf5Qv',
  title: 'Bohemian Rhapsody - Remastered 2011',
  artists: [{ name: 'Queen', uri: 'spotify:artist:1dfeR4HaWDbWqFHLkxsg1d' }],
  releaseDate: { isoString: '1975-11-21T00:00:00Z' },
  duration: 354320,
  isPlayable: true,
  visualIdentity: {
    image: [
      { url: 'https://image-cdn-fa.spotifycdn.com/image/300.jpg', maxHeight: 300, maxWidth: 300 },
      { url: 'https://image-cdn-fa.spotifycdn.com/image/64.jpg', maxHeight: 64, maxWidth: 64 },
      { url: 'https://image-cdn-fa.spotifycdn.com/image/640.jpg', maxHeight: 640, maxWidth: 640 },
    ],
  },
};

describe('parseSpotifyEmbedTrack', () => {
  it('maps a real track embed', () => {
    expect(parseSpotifyEmbedTrack(html(REAL_ENTITY))).toEqual({
      provider: 'spotify',
      id: '4u7EnebtmKWzUH433cf5Qv',
      title: 'Bohemian Rhapsody - Remastered 2011',
      artist: 'Queen',
      releaseDate: '1975-11-21',
      durationMs: 354320,
      artworkUrl: 'https://image-cdn-fa.spotifycdn.com/image/300.jpg',
    });
  });

  it('joins multiple artists the way the Web API path does', () => {
    const track = parseSpotifyEmbedTrack(
      html({ ...REAL_ENTITY, artists: [{ name: 'Queen' }, { name: 'David Bowie' }] })
    );
    expect(track?.artist).toBe('Queen, David Bowie');
  });

  it('falls back to the uri when no id field is present', () => {
    const { id: _dropped, ...withoutId } = REAL_ENTITY;
    expect(parseSpotifyEmbedTrack(html(withoutId))?.id).toBe(
      '4u7EnebtmKWzUH433cf5Qv'
    );
  });

  it('omits optional fields the embed did not carry', () => {
    expect(
      parseSpotifyEmbedTrack(
        html({ type: 'track', id: 'abc', name: 'Song', artists: [{ name: 'A' }] })
      )
    ).toEqual({ provider: 'spotify', id: 'abc', title: 'Song', artist: 'A' });
  });

  it('carries no ISRC — the embed has none, and matching must not invent one', () => {
    expect(parseSpotifyEmbedTrack(html(REAL_ENTITY))).not.toHaveProperty('isrc');
  });

  it('refuses a non-track entity, so a playlist embed cannot map to a song', () => {
    expect(
      parseSpotifyEmbedTrack(
        html({ type: 'playlist', id: 'abc', name: 'Mix', trackList: [] })
      )
    ).toBeNull();
  });

  it('returns null for an unusable page', () => {
    // A private or nonexistent track still renders, with `data.entity` null.
    expect(parseSpotifyEmbedTrack(html(null))).toBeNull();
    expect(parseSpotifyEmbedTrack(html({ type: 'track', id: 'abc' }))).toBeNull();
    expect(
      parseSpotifyEmbedTrack(html({ type: 'track', name: 'Song', artists: [] }))
    ).toBeNull();
    expect(parseSpotifyEmbedTrack('<html>no next data</html>')).toBeNull();
    expect(parseSpotifyEmbedTrack('')).toBeNull();
  });
});
