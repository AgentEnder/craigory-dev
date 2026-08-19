import { describe, expect, it } from 'vitest';

import { csvFilename, playlistToCsv } from '../export';
import type { Playlist, PlaylistTrack } from '../types';

function track(overrides: Partial<PlaylistTrack['track']> = {}): PlaylistTrack {
  return {
    track: {
      provider: 'spotify',
      id: 'abc',
      title: 'Bohemian Rhapsody',
      artist: 'Queen',
      album: 'A Night at the Opera',
      releaseDate: '1975-10-31',
      isrc: 'GBUM71029604',
      ...overrides,
    },
    links: [
      { provider: 'spotify', kind: 'exact', url: 'https://open.spotify.com/track/abc' },
      { provider: 'apple', kind: 'search', url: 'https://music.apple.com/search?term=x' },
      { provider: 'youtube', kind: 'exact', url: 'https://music.youtube.com/watch?v=xyz' },
    ],
  };
}

function playlist(tracks: PlaylistTrack[], title = 'Road Trip'): Playlist {
  return {
    id: 'p1',
    title,
    sourceProvider: 'spotify',
    sourceUrl: 'https://open.spotify.com/playlist/p1',
    createdAt: '2026-08-19T00:00:00.000Z',
    tracks,
  };
}

describe('playlistToCsv', () => {
  it('emits a header and one row per track', () => {
    const rows = playlistToCsv(playlist([track()])).trimEnd().split('\r\n');
    expect(rows[0]).toBe('Title,Artist,Album,ISRC,Release Date,Spotify,Apple Music,YouTube');
    expect(rows).toHaveLength(2);
    expect(rows[1]).toContain('Bohemian Rhapsody,Queen,A Night at the Opera,GBUM71029604');
  });

  it('emits exact links only, leaving search links blank', () => {
    const [, row] = playlistToCsv(playlist([track()])).trimEnd().split('\r\n');
    const cells = row.split(',');
    expect(cells[5]).toBe('https://open.spotify.com/track/abc');
    expect(cells[6]).toBe(''); // apple resolved to a search link
    expect(cells[7]).toBe('https://music.youtube.com/watch?v=xyz');
  });

  it('quotes fields containing commas, quotes, or newlines', () => {
    const csv = playlistToCsv(
      playlist([track({ title: 'Hello, Goodbye', album: 'The "White" Album' })])
    );
    expect(csv).toContain('"Hello, Goodbye"');
    expect(csv).toContain('"The ""White"" Album"');
  });

  it('leaves missing optional fields empty rather than undefined', () => {
    const csv = playlistToCsv(
      playlist([track({ album: undefined, isrc: undefined, releaseDate: undefined })])
    );
    expect(csv).not.toContain('undefined');
    expect(csv).toContain('Bohemian Rhapsody,Queen,,,');
  });

  it('terminates the final row', () => {
    expect(playlistToCsv(playlist([track()])).endsWith('\r\n')).toBe(true);
  });

  it('handles an empty playlist', () => {
    expect(playlistToCsv(playlist([]))).toBe(
      'Title,Artist,Album,ISRC,Release Date,Spotify,Apple Music,YouTube\r\n'
    );
  });
});

describe('csvFilename', () => {
  it('slugifies the playlist title', () => {
    expect(csvFilename('Road Trip 2026!')).toBe('road-trip-2026.csv');
  });

  it('falls back when a title has no usable characters', () => {
    expect(csvFilename('!!!')).toBe('playlist.csv');
  });

  it('truncates very long titles', () => {
    expect(csvFilename('a'.repeat(200)).length).toBeLessThanOrEqual(64);
  });
});
