import { describe, expect, it } from 'vitest';
import {
  exactPlaylistLink,
  exactTrackLink,
  playlistOpenLinks,
  providerDisplayName,
  searchPlaylistLink,
  searchTrackLink,
  searchUrl,
} from '../providers/links';

describe('exactTrackLink', () => {
  it('builds provider-native track URLs', () => {
    expect(exactTrackLink('spotify', '4u7EnebtmKWzUH433cf5Qv')).toEqual({
      provider: 'spotify',
      kind: 'exact',
      url: 'https://open.spotify.com/track/4u7EnebtmKWzUH433cf5Qv',
    });
    expect(exactTrackLink('apple', '1440806041').url).toBe(
      'https://music.apple.com/us/song/1440806041'
    );
    expect(exactTrackLink('youtube', 'fJ9rUzIMcZQ')).toEqual({
      provider: 'youtube',
      kind: 'exact',
      url: 'https://music.youtube.com/watch?v=fJ9rUzIMcZQ',
    });
  });
});

describe('searchTrackLink', () => {
  const track = { title: 'Bohemian Rhapsody', artist: 'Queen & Friends' };

  it('builds encoded search deep-links', () => {
    expect(searchTrackLink('spotify', track)).toEqual({
      provider: 'spotify',
      kind: 'search',
      url: 'https://open.spotify.com/search/Bohemian%20Rhapsody%20Queen%20%26%20Friends',
    });
    expect(searchTrackLink('apple', track).url).toBe(
      'https://music.apple.com/us/search?term=Bohemian%20Rhapsody%20Queen%20%26%20Friends'
    );
    expect(searchTrackLink('youtube', track).url).toBe(
      'https://music.youtube.com/search?q=Bohemian%20Rhapsody%20Queen%20%26%20Friends'
    );
  });

  it('always has kind search', () => {
    for (const p of ['spotify', 'apple', 'youtube'] as const) {
      expect(searchTrackLink(p, track).kind).toBe('search');
    }
  });
});

describe('searchPlaylistLink / searchUrl', () => {
  it('links to a title search on each provider', () => {
    expect(searchPlaylistLink('youtube', 'Road Trip!').url).toBe(
      'https://music.youtube.com/search?q=Road%20Trip!'
    );
    expect(searchUrl('spotify', 'a/b')).toBe(
      'https://open.spotify.com/search/a%2Fb'
    );
  });
});

describe('exactPlaylistLink', () => {
  it('handles spotify playlist and album ids', () => {
    expect(exactPlaylistLink('spotify', 'playlist:37i9dQZF1DXcBWIGoYBM5M').url).toBe(
      'https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M'
    );
    expect(exactPlaylistLink('spotify', 'album:abc123').url).toBe(
      'https://open.spotify.com/album/abc123'
    );
    // Bare ids default to playlists.
    expect(exactPlaylistLink('spotify', 'xyz').url).toBe(
      'https://open.spotify.com/playlist/xyz'
    );
  });

  it('handles apple storefront-qualified ids', () => {
    expect(exactPlaylistLink('apple', 'gb/pl.abc123').url).toBe(
      'https://music.apple.com/gb/playlist/pl.abc123'
    );
    expect(exactPlaylistLink('apple', 'pl.abc123').url).toBe(
      'https://music.apple.com/us/playlist/pl.abc123'
    );
  });

  it('handles youtube list ids', () => {
    expect(exactPlaylistLink('youtube', 'PLabc_-123').url).toBe(
      'https://music.youtube.com/playlist?list=PLabc_-123'
    );
  });
});

describe('playlistOpenLinks', () => {
  it('returns all three providers in canonical order', () => {
    const links = playlistOpenLinks(
      'spotify',
      'https://open.spotify.com/playlist/abc',
      'My Mix'
    );
    expect(links.map((l) => l.provider)).toEqual(['spotify', 'apple', 'youtube']);
  });

  it('marks the source exact with an Open label, others search with Find', () => {
    const links = playlistOpenLinks(
      'youtube',
      'https://music.youtube.com/playlist?list=PLx',
      'Focus Beats'
    );
    const byProvider = Object.fromEntries(links.map((l) => [l.provider, l]));
    expect(byProvider['youtube']).toEqual({
      provider: 'youtube',
      kind: 'exact',
      url: 'https://music.youtube.com/playlist?list=PLx',
      label: 'Open on YouTube Music',
    });
    expect(byProvider['spotify']?.kind).toBe('search');
    expect(byProvider['spotify']?.label).toBe('Find on Spotify');
    expect(byProvider['spotify']?.url).toContain('Focus%20Beats');
    expect(byProvider['apple']?.label).toBe('Find on Apple Music');
  });
});

describe('providerDisplayName', () => {
  it('names all providers', () => {
    expect(providerDisplayName('spotify')).toBe('Spotify');
    expect(providerDisplayName('apple')).toBe('Apple Music');
    expect(providerDisplayName('youtube')).toBe('YouTube Music');
  });
});
