import { describe, expect, it } from 'vitest';

import { parseSpotifyEmbed } from '../providers/scrape/spotify-embed';
import {
  parseDurationBadge,
  parseYouTubeInitialData,
} from '../providers/scrape/youtube-initial-data';

/**
 * Fixtures mirror the structure of the live pages as captured 2026-08-19,
 * trimmed to the fields the parsers read. Keeping them synthetic rather than
 * checking in multi-megabyte HTML means a shape change shows up as a parser
 * change here, deliberately, rather than as a stale blob that still passes.
 */
function spotifyPage(entity: unknown): string {
  const payload = { props: { pageProps: { state: { data: { entity } } } } };
  return `<html><body><script id="__NEXT_DATA__" type="application/json">${JSON.stringify(
    payload
  )}</script></body></html>`;
}

function youtubePage(data: unknown): string {
  return `<html><script nonce="x">var ytInitialData = ${JSON.stringify(
    data
  )};</script></html>`;
}

function lockup(
  contentId: string,
  title: string,
  channel: string,
  duration?: string
) {
  return {
    lockupViewModel: {
      contentId,
      contentType: 'LOCKUP_CONTENT_TYPE_VIDEO',
      contentImage: {
        thumbnailViewModel: {
          overlays: duration
            ? [
                {
                  thumbnailBottomOverlayViewModel: {
                    badges: [{ thumbnailBadgeViewModel: { text: duration } }],
                  },
                },
              ]
            : [],
        },
      },
      metadata: {
        lockupMetadataViewModel: {
          title: { content: title },
          metadata: {
            contentMetadataViewModel: {
              metadataRows: [
                { metadataParts: [{ text: { content: channel } }] },
                { metadataParts: [{ text: { content: '239K views' } }] },
              ],
            },
          },
        },
      },
    },
  };
}

describe('parseSpotifyEmbed', () => {
  const entity = {
    name: 'All Out 2010s',
    trackList: [
      {
        uri: 'spotify:track:3ouNEk0tv5TTi8VWMe1xbX',
        title: 'Animal',
        subtitle: 'KATSEYE',
        duration: 158494,
      },
      {
        uri: 'spotify:track:abc123',
        title: 'Hello, Goodbye',
        subtitle: 'The Beatles',
        duration: 205000,
      },
    ],
  };

  it('reads the playlist name and tracks', () => {
    const result = parseSpotifyEmbed(spotifyPage(entity))!;
    expect(result.title).toBe('All Out 2010s');
    expect(result.tracks).toHaveLength(2);
    expect(result.tracks[0]).toEqual({
      provider: 'spotify',
      id: '3ouNEk0tv5TTi8VWMe1xbX',
      title: 'Animal',
      artist: 'KATSEYE',
      durationMs: 158494,
    });
  });

  it('carries no ISRC — matching falls back to title/artist/duration', () => {
    const result = parseSpotifyEmbed(spotifyPage(entity))!;
    expect(result.tracks.every((track) => track.isrc === undefined)).toBe(true);
  });

  it('returns null for a private or missing playlist (entity is null)', () => {
    expect(parseSpotifyEmbed(spotifyPage(null))).toBeNull();
  });

  it('skips rows without a usable track uri', () => {
    const result = parseSpotifyEmbed(
      spotifyPage({
        name: 'Mixed',
        trackList: [
          { uri: 'spotify:episode:pod1', title: 'An Episode' },
          { uri: 'spotify:track:keep', title: 'Keeper', subtitle: 'A' },
        ],
      })
    )!;
    expect(result.tracks.map((track) => track.id)).toEqual(['keep']);
  });

  it('returns null when the page carries no __NEXT_DATA__ or bad JSON', () => {
    expect(parseSpotifyEmbed('<html><body>nope</body></html>')).toBeNull();
    expect(
      parseSpotifyEmbed('<script id="__NEXT_DATA__">{oops</script>')
    ).toBeNull();
  });
});

describe('parseDurationBadge', () => {
  it('parses mm:ss and h:mm:ss', () => {
    expect(parseDurationBadge('1:17')).toBe(77_000);
    expect(parseDurationBadge('8:57:39')).toBe(32_259_000);
  });

  it('rejects anything that is not a duration', () => {
    expect(parseDurationBadge('LIVE')).toBeUndefined();
    expect(parseDurationBadge('')).toBeUndefined();
  });
});

describe('parseYouTubeInitialData', () => {
  const page = (items: unknown[]) =>
    youtubePage({
      metadata: { playlistMetadataRenderer: { title: 'Road Trip' } },
      contents: { items },
    });

  it('reads tracks from lockupViewModel, the current shape', () => {
    const result = parseYouTubeInitialData(
      page([
        lockup('yW-VAhqVJok', 'Bohemian Rhapsody', 'Queen', '5:55'),
        lockup('abc', 'Another One Bites the Dust', 'Queen', '3:35'),
      ])
    )!;
    expect(result.title).toBe('Road Trip');
    expect(result.tracks[0]).toEqual({
      provider: 'youtube',
      id: 'yW-VAhqVJok',
      title: 'Bohemian Rhapsody',
      artist: 'Queen',
      durationMs: 355_000,
    });
  });

  it('keeps a row whose duration badge is missing (live or upcoming)', () => {
    const result = parseYouTubeInitialData(
      page([lockup('live1', 'Live Stream', 'Channel')])
    )!;
    expect(result.tracks[0]?.durationMs).toBeUndefined();
    expect(result.tracks).toHaveLength(1);
  });

  it('skips private and deleted rows, which have no usable title', () => {
    const result = parseYouTubeInitialData(
      page([
        lockup('p1', '[Private video]', ''),
        lockup('d1', '[Deleted video]', ''),
        lockup('ok', 'Real Song', 'Artist', '2:00'),
      ])
    )!;
    expect(result.tracks.map((track) => track.id)).toEqual(['ok']);
  });

  it('falls back to the microformat title', () => {
    const result = parseYouTubeInitialData(
      youtubePage({
        microformat: { microformatDataRenderer: { title: 'From Microformat' } },
        contents: { items: [lockup('a', 'Song', 'Artist', '1:00')] },
      })
    )!;
    expect(result.title).toBe('From Microformat');
  });

  it('returns null on the pre-migration shape rather than importing nothing', () => {
    const result = parseYouTubeInitialData(
      page([{ playlistVideoRenderer: { videoId: 'old', title: { runs: [{ text: 'Old' }] } } }])
    );
    expect(result).toBeNull();
  });

  it('returns null when ytInitialData is absent or malformed', () => {
    expect(parseYouTubeInitialData('<html>nothing</html>')).toBeNull();
    expect(
      parseYouTubeInitialData('<script>var ytInitialData = {oops};</script>')
    ).toBeNull();
  });
});
