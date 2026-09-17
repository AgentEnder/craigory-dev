/**
 * YouTube keyless search-page parsing — pure, no network.
 *
 * Two renderers are read because YouTube is mid-migration between them, and
 * which one a request gets is not stable. The playlist parser already had to be
 * rewritten once when `playlistVideoRenderer` became `lockupViewModel`; these
 * tests pin that both shapes work now, so the next migration degrades to "no
 * candidates" rather than to wrong ones.
 */
import { describe, expect, it } from 'vitest';
import {
  parseYouTubeSearchResults,
  youtubeSearchUrl,
} from '../providers/scrape/youtube-search';

function page(data: unknown): string {
  return `<html><body><script>var ytInitialData = ${JSON.stringify(
    data
  )};</script></body></html>`;
}

const videoRenderer = (
  videoId: string,
  title: string,
  owner: string,
  length?: string
) => ({
  videoRenderer: {
    videoId,
    title: { runs: [{ text: title }] },
    ownerText: { runs: [{ text: owner }] },
    ...(length ? { lengthText: { simpleText: length } } : {}),
  },
});

describe('parseYouTubeSearchResults', () => {
  it('reads classic videoRenderer rows', () => {
    const html = page({
      contents: [
        videoRenderer('fJ9rUzIMcZQ', 'Bohemian Rhapsody', 'Queen Official', '5:55'),
      ],
    });
    expect(parseYouTubeSearchResults(html, 5)).toEqual([
      {
        provider: 'youtube',
        id: 'fJ9rUzIMcZQ',
        title: 'Bohemian Rhapsody',
        artist: 'Queen Official',
        durationMs: 355000,
      },
    ]);
  });

  it('joins a multi-run title, which is how YouTube marks matched terms', () => {
    const html = page({
      contents: [
        {
          videoRenderer: {
            videoId: 'x1',
            title: { runs: [{ text: 'Bohemian ' }, { text: 'Rhapsody' }] },
            ownerText: { simpleText: 'Queen' },
          },
        },
      ],
    });
    expect(parseYouTubeSearchResults(html, 5)[0]?.title).toBe('Bohemian Rhapsody');
  });

  it('reads the newer lockupViewModel rows', () => {
    const html = page({
      contents: [
        {
          lockupViewModel: {
            contentId: 'abc123',
            contentType: 'LOCKUP_CONTENT_TYPE_VIDEO',
            metadata: {
              lockupMetadataViewModel: {
                title: { content: 'Under Pressure' },
                metadata: { rows: [{ content: 'Queen' }] },
              },
            },
            badges: [{ thumbnailBadgeViewModel: { text: '4:04' } }],
          },
        },
      ],
    });
    expect(parseYouTubeSearchResults(html, 5)).toEqual([
      {
        provider: 'youtube',
        id: 'abc123',
        title: 'Under Pressure',
        artist: 'Queen',
        durationMs: 244000,
      },
    ]);
  });

  it('skips a lockup that is not a video', () => {
    const html = page({
      contents: [
        {
          lockupViewModel: {
            contentId: 'PL123',
            contentType: 'LOCKUP_CONTENT_TYPE_PLAYLIST',
            metadata: {
              lockupMetadataViewModel: { title: { content: 'Queen Mix' } },
            },
          },
        },
      ],
    });
    expect(parseYouTubeSearchResults(html, 5)).toEqual([]);
  });

  it('omits a duration it cannot read, rather than inventing one', () => {
    // No length badge means a live stream or premiere; `scoreMatch` should
    // simply not get its ±5s bonus rather than be handed a wrong number.
    const html = page({ contents: [videoRenderer('x', 'Song', 'Chan')] });
    expect(parseYouTubeSearchResults(html, 5)[0]?.durationMs).toBeUndefined();
  });

  it('drops unavailable rows', () => {
    const html = page({
      contents: [
        videoRenderer('x1', '[Private video]', 'Chan'),
        videoRenderer('x2', 'Real Song', 'Chan'),
      ],
    });
    expect(parseYouTubeSearchResults(html, 5).map((t) => t.id)).toEqual(['x2']);
  });

  it('dedupes a video id repeated across shelves and honours the limit', () => {
    const html = page({
      contents: [
        videoRenderer('dup', 'Song', 'Chan'),
        videoRenderer('dup', 'Song', 'Chan'),
        videoRenderer('other', 'Other', 'Chan'),
      ],
    });
    expect(parseYouTubeSearchResults(html, 5).map((t) => t.id)).toEqual([
      'dup',
      'other',
    ]);
    expect(parseYouTubeSearchResults(html, 1)).toHaveLength(1);
  });

  it('returns nothing for a page with no blob, or an unparseable one', () => {
    expect(parseYouTubeSearchResults('<html></html>', 5)).toEqual([]);
    expect(
      parseYouTubeSearchResults('<script>var ytInitialData = {oops;</script>', 5)
    ).toEqual([]);
    expect(parseYouTubeSearchResults(page({ contents: [] }), 5)).toEqual([]);
  });
});

describe('youtubeSearchUrl', () => {
  it('encodes the query and pins the video-only filter', () => {
    const url = youtubeSearchUrl('Queen Bohemian Rhapsody');
    expect(url).toContain('search_query=Queen%20Bohemian%20Rhapsody');
    // Keeps channels, playlists and Shorts shelves out of the blob.
    expect(url).toContain('sp=EgIQAQ%3D%3D');
  });
});
