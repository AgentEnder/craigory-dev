import { describe, expect, it } from 'vitest';
import { mergeCatalogResults, metadataRichness } from '../providers/aggregate';
import type { ProviderId, SearchResult } from '../types';

function track(
  provider: ProviderId,
  id: string,
  title: string,
  artist: string,
  extra: Partial<SearchResult> = {}
): SearchResult {
  return { provider, id, title, artist, ...extra };
}

describe('mergeCatalogResults', () => {
  it('merges rows from different catalogs that share an ISRC', () => {
    const merged = mergeCatalogResults([
      {
        provider: 'deezer',
        results: [
          track('deezer', '1', 'Bohemian Rhapsody', 'Queen', {
            isrc: 'GBUM71029604',
          }),
        ],
      },
      {
        provider: 'spotify',
        results: [
          track('spotify', 'sp1', 'Bohemian Rhapsody', 'Queen', {
            isrc: 'gbum71029604',
          }),
        ],
      },
    ]);

    expect(merged).toHaveLength(1);
    expect(merged[0]!.sources).toEqual([
      { provider: 'deezer', id: '1' },
      { provider: 'spotify', id: 'sp1' },
    ]);
  });

  it('merges on the normalized key when one catalog reports no ISRC', () => {
    const merged = mergeCatalogResults([
      {
        provider: 'deezer',
        results: [
          track('deezer', '1', 'Bohemian Rhapsody', 'Queen', {
            isrc: 'GBUM71029604',
            durationMs: 358_000,
          }),
        ],
      },
      {
        provider: 'apple',
        results: [
          // iTunes search rows carry no ISRC at all.
          track('apple', 'ap1', 'Bohemian Rhapsody', 'Queen', {
            durationMs: 355_000,
          }),
        ],
      },
    ]);

    expect(merged).toHaveLength(1);
    expect(merged[0]!.sources.map((s) => s.provider)).toEqual([
      'deezer',
      'apple',
    ]);
  });

  it('keeps distinct takes apart when noise-stripped titles collide', () => {
    // normalizeTitle drops "(2013 Remaster)" / "(Live ...)" as noise, so all
    // four normalize to `eagles~hotel-california`. Only the duration guard
    // stops them collapsing into one row.
    const merged = mergeCatalogResults([
      {
        provider: 'deezer',
        results: [
          track('deezer', '1', 'Hotel California (2013 Remaster)', 'Eagles', {
            durationMs: 391_000,
          }),
          track('deezer', '2', 'Hotel California (Live On MTV, 1994)', 'Eagles', {
            durationMs: 432_000,
          }),
          track('deezer', '3', 'Hotel California (Live at The Forum)', 'Eagles', {
            durationMs: 409_000,
          }),
        ],
      },
    ]);

    expect(merged).toHaveLength(3);
  });

  it('collapses a catalog listing the same recording on two albums', () => {
    const merged = mergeCatalogResults([
      {
        provider: 'apple',
        results: [
          track('apple', 'a1', 'Trickle Down Blues', 'Daddy Mack Blues Band', {
            durationMs: 210_000,
          }),
          track('apple', 'a2', 'Trickle Down Blues', 'Daddy Mack Blues Band', {
            durationMs: 210_000,
          }),
        ],
      },
    ]);

    expect(merged).toHaveLength(1);
    // One source per provider — a duplicate listing is not extra availability.
    expect(merged[0]!.sources).toEqual([{ provider: 'apple', id: 'a1' }]);
  });

  it('merges when a duration is missing on either side', () => {
    const merged = mergeCatalogResults([
      { provider: 'deezer', results: [track('deezer', '1', 'Song', 'Artist')] },
      {
        provider: 'apple',
        results: [track('apple', 'a1', 'Song', 'Artist', { durationMs: 200_000 })],
      },
    ]);
    expect(merged).toHaveLength(1);
  });

  it('does not merge different artists with the same title', () => {
    const merged = mergeCatalogResults([
      {
        provider: 'deezer',
        results: [
          track('deezer', '1', 'Trickle Down Blues', 'Cam Burnette'),
          track('deezer', '2', 'Trickle Down Blues', 'John Whipple'),
        ],
      },
    ]);
    expect(merged).toHaveLength(2);
  });

  it('preserves first-appearance order so the lead catalog ranking survives', () => {
    const merged = mergeCatalogResults([
      {
        provider: 'deezer',
        results: [
          track('deezer', '1', 'Exact Match', 'Indie Artist'),
          track('deezer', '2', 'Something Else', 'Other'),
        ],
      },
      {
        provider: 'apple',
        results: [track('apple', 'a1', 'Something Else', 'Other')],
      },
    ]);

    // "Something Else" is on two catalogs but must not outrank the row the
    // lead catalog ranked first.
    expect(merged.map((r) => r.track.title)).toEqual([
      'Exact Match',
      'Something Else',
    ]);
  });

  it('represents a group with its richest row, preferring one with an ISRC', () => {
    const merged = mergeCatalogResults([
      {
        provider: 'deezer',
        results: [track('deezer', '1', 'Song', 'Artist', { durationMs: 200_000 })],
      },
      {
        provider: 'apple',
        results: [
          track('apple', 'a1', 'Song', 'Artist', {
            durationMs: 200_000,
            isrc: 'USUM71100001',
            album: 'The Album',
            artworkUrl: 'https://example.test/a.jpg',
          }),
        ],
      },
    ]);

    expect(merged[0]!.track.provider).toBe('apple');
    expect(merged[0]!.track.isrc).toBe('USUM71100001');
  });

  it('honours the limit', () => {
    const results = Array.from({ length: 10 }, (_, i) =>
      track('deezer', String(i), `Song ${i}`, 'Artist')
    );
    expect(mergeCatalogResults([{ provider: 'deezer', results }], 3)).toHaveLength(
      3
    );
  });

  it('returns an empty list when every catalog returned nothing', () => {
    expect(
      mergeCatalogResults([
        { provider: 'deezer', results: [] },
        { provider: 'apple', results: [] },
      ])
    ).toEqual([]);
  });
});

describe('metadataRichness', () => {
  it('ranks an ISRC above any other single field', () => {
    const withIsrc = metadataRichness(
      track('apple', '1', 'T', 'A', { isrc: 'USUM71100001' })
    );
    const withArtwork = metadataRichness(
      track('deezer', '1', 'T', 'A', { artworkUrl: 'https://x.test/a.jpg' })
    );
    expect(withIsrc).toBeGreaterThan(withArtwork);
  });
});
