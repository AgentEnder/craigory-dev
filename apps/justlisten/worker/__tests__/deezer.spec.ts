import { describe, expect, it } from 'vitest';
import { deezerProvider, mapDeezerTrack } from '../providers/deezer';

describe('mapDeezerTrack', () => {
  const row = {
    id: 3814389462,
    title: 'Trickle Down Blues',
    isrc: 'qzhn72627781',
    duration: 120,
    artist: { name: 'Cam Burnette' },
    album: {
      title: 'Trickle Down Blues',
      cover_medium: 'https://cdn-images.dzcdn.net/images/cover/x/250x250.jpg',
      cover_big: 'https://cdn-images.dzcdn.net/images/cover/x/500x500.jpg',
    },
  };

  it('maps a search row onto the shared Track shape', () => {
    expect(mapDeezerTrack(row)).toEqual({
      provider: 'deezer',
      id: '3814389462',
      title: 'Trickle Down Blues',
      artist: 'Cam Burnette',
      album: 'Trickle Down Blues',
      artworkUrl: 'https://cdn-images.dzcdn.net/images/cover/x/250x250.jpg',
      durationMs: 120_000,
      isrc: 'QZHN72627781',
    });
  });

  it('converts seconds to milliseconds', () => {
    expect(mapDeezerTrack({ ...row, duration: 358 }).durationMs).toBe(358_000);
  });

  it('upper-cases the ISRC so it keys the match cache consistently', () => {
    expect(mapDeezerTrack(row).isrc).toBe('QZHN72627781');
  });

  it('coerces numeric ids to strings for the route param', () => {
    expect(mapDeezerTrack(row).id).toBe('3814389462');
  });

  it('omits absent optional fields rather than emitting undefined values', () => {
    const sparse = mapDeezerTrack({ id: 1, title: 'X', artist: { name: 'Y' } });
    expect(sparse).toEqual({
      provider: 'deezer',
      id: '1',
      title: 'X',
      artist: 'Y',
    });
  });

  it('prefers the track release date, falling back to the album', () => {
    expect(
      mapDeezerTrack({ ...row, release_date: '2026-01-30' }).releaseDate
    ).toBe('2026-01-30');
    expect(
      mapDeezerTrack({
        ...row,
        album: { ...row.album, release_date: '1999-05-04' },
      }).releaseDate
    ).toBe('1999-05-04');
  });

  it('drops a zero duration rather than reporting a 0ms track', () => {
    expect(mapDeezerTrack({ ...row, duration: 0 }).durationMs).toBeUndefined();
  });
});

describe('deezerProvider.available', () => {
  it('is always true — the public API needs no credentials', () => {
    expect(deezerProvider.available({} as never)).toBe(true);
  });
});

describe('deezerProvider.parsePlaylistUrl', () => {
  const parse = (u: string) => deezerProvider.parsePlaylistUrl(u);

  it('parses playlist URLs', () => {
    expect(parse('https://www.deezer.com/playlist/908622995')).toEqual({
      playlistId: 'playlist:908622995',
    });
  });

  it('parses album URLs', () => {
    expect(parse('https://www.deezer.com/album/908742312')).toEqual({
      playlistId: 'album:908742312',
    });
  });

  it('ignores the locale segment and query strings', () => {
    expect(parse('https://www.deezer.com/us/playlist/908622995?utm=x')).toEqual({
      playlistId: 'playlist:908622995',
    });
    expect(parse('https://deezer.com/fr/album/908742312')).toEqual({
      playlistId: 'album:908742312',
    });
  });

  it('tolerates surrounding whitespace', () => {
    expect(parse('  https://www.deezer.com/playlist/12  ')).toEqual({
      playlistId: 'playlist:12',
    });
  });

  it('rejects track URLs, foreign hosts and non-numeric ids', () => {
    expect(parse('https://www.deezer.com/track/3814389462')).toBeNull();
    expect(parse('https://open.spotify.com/playlist/abc')).toBeNull();
    expect(parse('https://www.deezer.com/playlist/not-a-number')).toBeNull();
    expect(parse('https://www.deezer.com/playlist/')).toBeNull();
    expect(parse('not a url')).toBeNull();
  });
});
