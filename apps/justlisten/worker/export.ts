/**
 * CSV export for imported playlists.
 *
 * Every route to a *real* playlist on another platform is per-user OAuth
 * (Spotify PKCE, YouTube, MusicKit) — no service accepts a file as a write
 * path, including Apple Music, whose native import only matches tracks already
 * in your local library. A CSV is the one artifact the transfer services
 * (Soundiiz, TuneMyMusic, PlaylistGo) all read, so it is how a JustListen
 * playlist reaches any platform without JustListen holding user credentials.
 *
 * Pure string building: no network, no KV, no subrequests.
 */
import type { Playlist, ProviderId } from './types';

const COLUMNS = [
  'Title',
  'Artist',
  'Album',
  'ISRC',
  'Release Date',
  'Spotify',
  'Apple Music',
  'YouTube',
] as const;

const LINK_PROVIDERS: ProviderId[] = ['spotify', 'apple', 'youtube'];

/**
 * RFC 4180 quoting. Values are passed through verbatim otherwise — the
 * consumer is an import tool matching on title/artist/ISRC, so mangling a
 * field to defuse spreadsheet formula interpretation would cost real matches.
 */
function csvField(value: string | undefined): string {
  const text = value ?? '';
  if (!/[",\r\n]/.test(text)) return text;
  return `"${text.replace(/"/g, '""')}"`;
}

export function playlistToCsv(playlist: Playlist): string {
  const rows = [COLUMNS.join(',')];
  for (const { track, links } of playlist.tracks) {
    // A search link is a query, not a track URL — emit a cell only for a
    // resolved match so importers never follow one as if it were the song.
    const urls = LINK_PROVIDERS.map((provider) => {
      const link = links.find((candidate) => candidate.provider === provider);
      return link?.kind === 'exact' ? link.url : '';
    });
    rows.push(
      [
        track.title,
        track.artist,
        track.album,
        track.isrc,
        track.releaseDate,
        ...urls,
      ]
        .map(csvField)
        .join(',')
    );
  }
  // Trailing newline: some importers drop a final unterminated row.
  return `${rows.join('\r\n')}\r\n`;
}

/** Filesystem-safe download name derived from the playlist title. */
export function csvFilename(title: string): string {
  const slug = title
    .normalize('NFKD')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .toLowerCase()
    .slice(0, 60);
  return `${slug || 'playlist'}.csv`;
}
