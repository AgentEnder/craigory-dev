/**
 * MusicBrainz URL-relationship mapping — pure, no network.
 *
 * The load-bearing behaviour is the mapping step: MusicBrainz hands back URLs,
 * and they are turned into provider links by the registry's *own* parsers
 * rather than a second set of patterns. These tests pin that reuse, and pin the
 * filtering that keeps a credit relationship or a dead link from becoming a
 * confident "Listen on …" button.
 */
import { describe, expect, it } from 'vitest';
import {
  linksFromIsrcLookup,
  linksFromUrls,
  listenableUrls,
} from '../musicbrainz/parse';

/** Shaped like `/ws/2/isrc/<code>?inc=url-rels&fmt=json`. */
function isrcResponse(relations: unknown[]) {
  return { isrc: 'GBUM71029604', recordings: [{ id: 'mbid-1', relations }] };
}

const rel = (type: string, resource: string, extra: object = {}) => ({
  type,
  url: { resource },
  ...extra,
});

describe('listenableUrls', () => {
  it('keeps streaming and purchase relationships', () => {
    const urls = listenableUrls(
      isrcResponse([
        rel('free streaming', 'https://www.youtube.com/watch?v=fJ9rUzIMcZQ'),
        rel('streaming', 'https://open.spotify.com/track/4u7EnebtmKWzUH433cf5Qv'),
        rel('purchase for download', 'https://radiohead.bandcamp.com/track/airbag'),
      ])
    );
    expect(urls).toHaveLength(3);
  });

  it('drops credit relationships, which name people not places to listen', () => {
    const urls = listenableUrls(
      isrcResponse([
        rel('production', 'https://example.com/producer'),
        rel('wikidata', 'https://www.wikidata.org/wiki/Q123'),
        rel('free streaming', 'https://www.youtube.com/watch?v=fJ9rUzIMcZQ'),
      ])
    );
    expect(urls).toEqual(['https://www.youtube.com/watch?v=fJ9rUzIMcZQ']);
  });

  it('drops links MusicBrainz marks as ended', () => {
    // A delisted track's URL is worse than a search link: it looks exact and
    // goes nowhere.
    const urls = listenableUrls(
      isrcResponse([
        rel('streaming', 'https://open.spotify.com/track/gone', { ended: true }),
      ])
    );
    expect(urls).toEqual([]);
  });

  it('pools relationships across every recording under one ISRC', () => {
    const urls = listenableUrls({
      recordings: [
        { relations: [rel('streaming', 'https://www.deezer.com/track/3135556')] },
        { relations: [rel('free streaming', 'https://www.youtube.com/watch?v=abc')] },
      ],
    });
    expect(urls).toHaveLength(2);
  });

  it('dedupes a URL repeated across recordings', () => {
    const urls = listenableUrls({
      recordings: [
        { relations: [rel('streaming', 'https://www.deezer.com/track/3135556')] },
        { relations: [rel('streaming', 'https://www.deezer.com/track/3135556')] },
      ],
    });
    expect(urls).toHaveLength(1);
  });

  it('survives every shape that is not the one documented', () => {
    expect(listenableUrls(null)).toEqual([]);
    expect(listenableUrls({ recordings: 'nope' })).toEqual([]);
    expect(listenableUrls({ recordings: [{ relations: [{}] }] })).toEqual([]);
    expect(listenableUrls({ recordings: [{ relations: [{ type: 'streaming' }] }] })).toEqual([]);
  });
});

describe('linksFromUrls', () => {
  it('maps URLs through the providers’ own parsers', () => {
    const links = linksFromUrls([
      'https://open.spotify.com/track/4u7EnebtmKWzUH433cf5Qv',
      'https://www.youtube.com/watch?v=fJ9rUzIMcZQ',
      'https://www.deezer.com/track/3135556',
    ]);
    expect(links).toEqual(
      expect.arrayContaining([
        {
          provider: 'spotify',
          kind: 'exact',
          url: 'https://open.spotify.com/track/4u7EnebtmKWzUH433cf5Qv',
        },
        {
          provider: 'youtube',
          kind: 'exact',
          url: 'https://music.youtube.com/watch?v=fJ9rUzIMcZQ',
        },
        {
          provider: 'deezer',
          kind: 'exact',
          url: 'https://www.deezer.com/track/3135556',
        },
      ])
    );
  });

  it('every link it returns is exact — never a search fallback', () => {
    // A search link here would claim MusicBrainz found something it didn't.
    for (const link of linksFromUrls(['https://www.deezer.com/track/3135556'])) {
      expect(link.kind).toBe('exact');
    }
  });

  it('ignores platforms this app does not carry', () => {
    expect(
      linksFromUrls([
        'https://tidal.com/browse/track/12345',
        'https://soundcloud.com/artist/track',
        'https://en.wikipedia.org/wiki/Bohemian_Rhapsody',
      ])
    ).toEqual([]);
  });

  it('takes at most one link per provider, first wins', () => {
    // MusicBrainz routinely lists several YouTube uploads for one recording.
    const links = linksFromUrls([
      'https://www.youtube.com/watch?v=first',
      'https://www.youtube.com/watch?v=second',
    ]);
    expect(links).toHaveLength(1);
    expect(links[0]?.url).toContain('first');
  });

  it('does not let Bandcamp’s permissive parser steal another provider’s URL', () => {
    // Bandcamp matches /track/<slug> on any host; registry order protects the
    // host-locked providers, and this pins that.
    const links = linksFromUrls(['https://www.deezer.com/track/3135556']);
    expect(links.map((l) => l.provider)).toEqual(['deezer']);
  });

  it('handles a hostile URL without losing the rest', () => {
    const links = linksFromUrls([
      'not a url at all',
      'https://www.deezer.com/track/3135556',
    ]);
    expect(links.map((l) => l.provider)).toEqual(['deezer']);
  });
});

describe('linksFromIsrcLookup', () => {
  it('goes from a raw response to provider links in one step', () => {
    const links = linksFromIsrcLookup(
      isrcResponse([
        rel('free streaming', 'https://www.youtube.com/watch?v=fJ9rUzIMcZQ'),
        rel('production', 'https://example.com/nope'),
      ])
    );
    expect(links).toEqual([
      {
        provider: 'youtube',
        kind: 'exact',
        url: 'https://music.youtube.com/watch?v=fJ9rUzIMcZQ',
      },
    ]);
  });
});
