import { describe, expect, it } from 'vitest';
import { spotifyProvider } from '../providers/spotify';
import { appleProvider } from '../providers/apple';
import { youtubeProvider } from '../providers/youtube';
import { deezerProvider } from '../providers/deezer';

describe('spotifyProvider.parseTrackUrl', () => {
  const parse = (u: string) => spotifyProvider.parseTrackUrl(u);

  it('parses track URLs', () => {
    expect(parse('https://open.spotify.com/track/4u7EnebtmKWzUH433cf5Qv')).toEqual(
      { trackId: '4u7EnebtmKWzUH433cf5Qv' }
    );
  });

  it('ignores query strings and locale/embed prefixes', () => {
    expect(
      parse('https://open.spotify.com/intl-de/track/4u7EnebtmKWzUH433cf5Qv?si=xyz')
    ).toEqual({ trackId: '4u7EnebtmKWzUH433cf5Qv' });
    expect(
      parse('https://open.spotify.com/embed/track/4u7EnebtmKWzUH433cf5Qv')
    ).toEqual({ trackId: '4u7EnebtmKWzUH433cf5Qv' });
  });

  it('tolerates surrounding whitespace', () => {
    expect(parse('  https://open.spotify.com/track/abc123DEF  ')).toEqual({
      trackId: 'abc123DEF',
    });
  });

  it('rejects playlist, album and foreign URLs', () => {
    expect(parse('https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M')).toBeNull();
    expect(parse('https://open.spotify.com/album/1DFixLWuPkv3KT3TnV35m3')).toBeNull();
    expect(parse('https://open.spotify.com/track/')).toBeNull();
    expect(parse('https://example.com/track/abc')).toBeNull();
    expect(parse('not a url')).toBeNull();
  });
});

describe('appleProvider.parseTrackUrl', () => {
  const parse = (u: string) => appleProvider.parseTrackUrl(u);

  it('parses /song/ URLs', () => {
    expect(
      parse('https://music.apple.com/us/song/trickle-down-blues/1712345678')
    ).toEqual({ trackId: '1712345678' });
  });

  it('parses an album URL carrying ?i= (the share link for one song)', () => {
    expect(
      parse('https://music.apple.com/us/album/thriller/269572838?i=269572839')
    ).toEqual({ trackId: '269572839' });
  });

  it('accepts other storefronts and itunes.apple.com', () => {
    expect(parse('https://music.apple.com/gb/song/hits/1111')).toEqual({
      trackId: '1111',
    });
    expect(
      parse('https://itunes.apple.com/us/album/x/269572838?i=269572839&l=en')
    ).toEqual({ trackId: '269572839' });
  });

  it('rejects bare albums, playlists and foreign URLs', () => {
    // An album with no ?i= is a whole album, not one song.
    expect(parse('https://music.apple.com/us/album/thriller/269572838')).toBeNull();
    expect(
      parse('https://music.apple.com/us/playlist/hits/pl.abc123')
    ).toBeNull();
    expect(parse('https://music.apple.com/us/song/no-id-here')).toBeNull();
    expect(parse('https://example.com/us/song/x/123')).toBeNull();
    expect(parse('garbage')).toBeNull();
  });
});

describe('youtubeProvider.parseTrackUrl', () => {
  const parse = (u: string) => youtubeProvider.parseTrackUrl(u);

  it('parses watch?v= URLs — the link you get from a desktop browser', () => {
    expect(parse('https://www.youtube.com/watch?v=NJKsTEeqL1s')).toEqual({
      trackId: 'NJKsTEeqL1s',
    });
    expect(parse('https://m.youtube.com/watch?v=NJKsTEeqL1s&t=30s')).toEqual({
      trackId: 'NJKsTEeqL1s',
    });
    expect(parse('https://music.youtube.com/watch?v=NJKsTEeqL1s')).toEqual({
      trackId: 'NJKsTEeqL1s',
    });
  });

  it('parses youtu.be share links', () => {
    expect(parse('https://youtu.be/NJKsTEeqL1s')).toEqual({
      trackId: 'NJKsTEeqL1s',
    });
    expect(parse('https://youtu.be/NJKsTEeqL1s?si=AbC-1_2')).toEqual({
      trackId: 'NJKsTEeqL1s',
    });
  });

  it('still names the video when a list is present', () => {
    // Harmless: the import route tries parsePlaylistUrl first, so a watch URL
    // inside a playlist keeps importing the playlist.
    expect(parse('https://www.youtube.com/watch?v=NJKsTEeqL1s&list=PLxyz')).toEqual(
      { trackId: 'NJKsTEeqL1s' }
    );
  });

  it('rejects playlist, channel and foreign URLs', () => {
    expect(parse('https://www.youtube.com/playlist?list=PLxyz')).toBeNull();
    expect(parse('https://www.youtube.com/watch')).toBeNull();
    expect(parse('https://www.youtube.com/@camburnette')).toBeNull();
    expect(parse('https://youtu.be/')).toBeNull();
    expect(parse('https://open.spotify.com/track/abc')).toBeNull();
    expect(parse('nope')).toBeNull();
  });
});

describe('deezerProvider.parseTrackUrl', () => {
  const parse = (u: string) => deezerProvider.parseTrackUrl(u);

  it('parses track URLs, with or without a locale prefix', () => {
    expect(parse('https://www.deezer.com/track/3135556')).toEqual({
      trackId: '3135556',
    });
    expect(parse('https://www.deezer.com/us/track/3135556')).toEqual({
      trackId: '3135556',
    });
  });

  it('ignores query strings', () => {
    expect(parse('https://deezer.com/fr/track/3135556?utm_source=x')).toEqual({
      trackId: '3135556',
    });
  });

  it('rejects playlist, album and foreign URLs', () => {
    expect(parse('https://www.deezer.com/us/playlist/1234')).toBeNull();
    expect(parse('https://www.deezer.com/us/album/1234')).toBeNull();
    expect(parse('https://www.deezer.com/us/track/abc')).toBeNull();
    expect(parse('https://example.com/track/1234')).toBeNull();
    expect(parse('nope')).toBeNull();
  });
});
