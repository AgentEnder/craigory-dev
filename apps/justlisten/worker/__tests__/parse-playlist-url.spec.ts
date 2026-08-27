import { describe, expect, it } from 'vitest';
import { spotifyProvider } from '../providers/spotify';
import { appleProvider } from '../providers/apple';
import { youtubeProvider } from '../providers/youtube';

describe('spotifyProvider.parsePlaylistUrl', () => {
  const parse = (u: string) => spotifyProvider.parsePlaylistUrl(u);

  it('parses playlist URLs', () => {
    expect(
      parse('https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M')
    ).toEqual({ playlistId: 'playlist:37i9dQZF1DXcBWIGoYBM5M' });
  });

  it('parses album URLs', () => {
    expect(parse('https://open.spotify.com/album/1DFixLWuPkv3KT3TnV35m3')).toEqual(
      { playlistId: 'album:1DFixLWuPkv3KT3TnV35m3' }
    );
  });

  it('ignores query strings and locale/embed prefixes', () => {
    expect(
      parse(
        'https://open.spotify.com/intl-de/playlist/37i9dQZF1DXcBWIGoYBM5M?si=xyz&pt=1'
      )
    ).toEqual({ playlistId: 'playlist:37i9dQZF1DXcBWIGoYBM5M' });
    expect(parse('https://open.spotify.com/embed/album/1DFixLWuPkv3KT3TnV35m3')).toEqual(
      { playlistId: 'album:1DFixLWuPkv3KT3TnV35m3' }
    );
  });

  it('tolerates surrounding whitespace', () => {
    expect(parse('  https://open.spotify.com/playlist/abc123DEF  ')).toEqual({
      playlistId: 'playlist:abc123DEF',
    });
  });

  it('rejects non-playlist and foreign URLs', () => {
    expect(parse('https://open.spotify.com/track/4u7EnebtmKWzUH433cf5Qv')).toBeNull();
    expect(parse('https://open.spotify.com/playlist/')).toBeNull();
    expect(parse('https://example.com/playlist/abc')).toBeNull();
    expect(parse('https://music.youtube.com/playlist?list=PLx')).toBeNull();
    expect(parse('not a url')).toBeNull();
  });
});

describe('appleProvider.parsePlaylistUrl', () => {
  const parse = (u: string) => appleProvider.parsePlaylistUrl(u);

  it('parses storefront playlist URLs with slugs', () => {
    expect(
      parse(
        'https://music.apple.com/us/playlist/todays-hits/pl.f4d106fed2bd41149aaacabb233eb5eb'
      )
    ).toEqual({ playlistId: 'us/pl.f4d106fed2bd41149aaacabb233eb5eb' });
  });

  it('parses user playlists (pl.u-…) and other storefronts', () => {
    expect(
      parse('https://music.apple.com/gb/playlist/my-mix/pl.u-abc123XYZ')
    ).toEqual({ playlistId: 'gb/pl.u-abc123XYZ' });
  });

  it('defaults storefront to us when missing', () => {
    expect(parse('https://music.apple.com/playlist/pl.abc123')).toEqual({
      playlistId: 'us/pl.abc123',
    });
  });

  it('ignores query strings', () => {
    expect(
      parse('https://music.apple.com/us/playlist/hits/pl.abc?l=en-US')
    ).toEqual({ playlistId: 'us/pl.abc' });
  });

  it('rejects album/song and foreign URLs', () => {
    expect(
      parse('https://music.apple.com/us/album/thriller/269572838')
    ).toBeNull();
    expect(parse('https://music.apple.com/us/playlist/no-id-here')).toBeNull();
    expect(parse('https://example.com/us/playlist/x/pl.abc')).toBeNull();
    expect(parse('garbage')).toBeNull();
  });
});

describe('youtubeProvider.parsePlaylistUrl', () => {
  const parse = (u: string) => youtubeProvider.parsePlaylistUrl(u);

  it('parses youtube.com/playlist?list=', () => {
    expect(
      parse('https://www.youtube.com/playlist?list=PLBCF2DAC6FFB574DE')
    ).toEqual({ playlistId: 'PLBCF2DAC6FFB574DE' });
    expect(parse('https://youtube.com/playlist?list=PLabc_-123')).toEqual({
      playlistId: 'PLabc_-123',
    });
    expect(parse('https://m.youtube.com/playlist?list=PLabc')).toEqual({
      playlistId: 'PLabc',
    });
  });

  it('parses music.youtube.com variants', () => {
    expect(
      parse('https://music.youtube.com/playlist?list=OLAK5uy_kabc-123_XYZ')
    ).toEqual({ playlistId: 'OLAK5uy_kabc-123_XYZ' });
  });

  it('accepts watch URLs carrying a list param', () => {
    expect(
      parse('https://www.youtube.com/watch?v=fJ9rUzIMcZQ&list=PLxyz')
    ).toEqual({ playlistId: 'PLxyz' });
  });

  it('rejects URLs without a list id and foreign hosts', () => {
    expect(parse('https://www.youtube.com/watch?v=fJ9rUzIMcZQ')).toBeNull();
    expect(parse('https://www.youtube.com/playlist')).toBeNull();
    expect(parse('https://open.spotify.com/playlist/abc')).toBeNull();
    expect(parse('https://youtu.be/fJ9rUzIMcZQ')).toBeNull();
    expect(parse('nope')).toBeNull();
  });
});
