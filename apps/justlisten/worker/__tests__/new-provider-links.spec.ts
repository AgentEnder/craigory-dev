/**
 * Composite provider ids and the URLs built from them.
 *
 * Bandcamp, Last.fm and Pandora name a track with a tuple rather than an
 * opaque token, and that tuple has to survive a round trip through a single
 * `/song/:provider/:id` path segment. The round-trip cases here are the point:
 * an id that re-splits in the wrong place produces a confident link to the
 * wrong song, which is the one failure this app cannot degrade out of.
 */
import { describe, expect, it } from 'vitest';
import {
  bandcampTrackId,
  exactPlaylistLink,
  exactTrackLink,
  lastfmTrackId,
  pandoraTrackId,
  parseBandcampTrackId,
  parseLastfmTrackId,
  parsePandoraTrackId,
  providerDisplayName,
  searchTrackLink,
} from '../providers/links';

describe('provider display names', () => {
  it('names the new providers as they spell themselves', () => {
    expect(providerDisplayName('bandcamp')).toBe('Bandcamp');
    expect(providerDisplayName('lastfm')).toBe('Last.fm');
    expect(providerDisplayName('pandora')).toBe('Pandora');
  });
});

describe('lastfmTrackId', () => {
  it('round-trips artist and title', () => {
    const id = lastfmTrackId('Queen', 'Bohemian Rhapsody');
    expect(parseLastfmTrackId(id)).toEqual({
      artist: 'Queen',
      title: 'Bohemian Rhapsody',
    });
  });

  it('survives a separator inside a name', () => {
    const id = lastfmTrackId('~Tilde~', 'A ~ B');
    expect(parseLastfmTrackId(id)).toEqual({ artist: '~Tilde~', title: 'A ~ B' });
  });

  it('rejects ids with no separator or an empty half', () => {
    expect(parseLastfmTrackId('Queen')).toBeNull();
    expect(parseLastfmTrackId('~Bohemian')).toBeNull();
    expect(parseLastfmTrackId('Queen~')).toBeNull();
  });

  it('builds a /music/<artist>/_/<track> URL with + for spaces', () => {
    expect(exactTrackLink('lastfm', lastfmTrackId('Queen', 'Under Pressure'))).toEqual(
      {
        provider: 'lastfm',
        kind: 'exact',
        url: 'https://www.last.fm/music/Queen/_/Under+Pressure',
      }
    );
  });

  it('degrades to a search link when the id is unusable', () => {
    const link = exactTrackLink('lastfm', 'nope');
    expect(link.kind).toBe('search');
    expect(link.url).toBe('https://www.last.fm/search?q=nope');
  });
});

describe('bandcampTrackId', () => {
  it('round-trips host and slug', () => {
    const id = bandcampTrackId('radiohead.bandcamp.com', 'airbag');
    expect(parseBandcampTrackId(id)).toEqual({
      host: 'radiohead.bandcamp.com',
      slug: 'airbag',
    });
    expect(exactTrackLink('bandcamp', id).url).toBe(
      'https://radiohead.bandcamp.com/track/airbag'
    );
  });

  it('carries a custom domain, which is a real Bandcamp deployment', () => {
    const id = bandcampTrackId('music.example.org', 'b-side');
    expect(exactTrackLink('bandcamp', id).url).toBe(
      'https://music.example.org/track/b-side'
    );
  });

  it('refuses a host that would repoint the link at another origin', () => {
    // A decoded `/` or `@` in the host is how an "exact" link ends up
    // somewhere other than Bandcamp.
    expect(parseBandcampTrackId('evil.example%2F..%40x.com:slug')).toBeNull();
    expect(exactTrackLink('bandcamp', 'evil.example%2F..%40x.com:slug').kind).toBe(
      'search'
    );
  });

  it('builds album URLs from the same id shape', () => {
    expect(
      exactPlaylistLink('bandcamp', bandcampTrackId('radiohead.bandcamp.com', 'ok-computer'))
    ).toEqual({
      provider: 'bandcamp',
      kind: 'exact',
      url: 'https://radiohead.bandcamp.com/album/ok-computer',
    });
  });
});

describe('pandoraTrackId', () => {
  it('round-trips the three path slugs', () => {
    const id = pandoraTrackId(['queen', 'a-night-at-the-opera', 'bohemian-rhapsody']);
    expect(parsePandoraTrackId(id)).toEqual([
      'queen',
      'a-night-at-the-opera',
      'bohemian-rhapsody',
    ]);
    expect(exactTrackLink('pandora', id).url).toBe(
      'https://www.pandora.com/artist/queen/a-night-at-the-opera/bohemian-rhapsody'
    );
  });

  it('rejects an id that is not exactly three slugs', () => {
    expect(parsePandoraTrackId('queen:a-night-at-the-opera')).toBeNull();
    expect(parsePandoraTrackId('a:b:c:d')).toBeNull();
  });
});

describe('search links for the new providers', () => {
  const track = { title: 'Bohemian Rhapsody', artist: 'Queen & Friends' };

  it('encodes the query into each service’s own search route', () => {
    expect(searchTrackLink('bandcamp', track).url).toBe(
      'https://bandcamp.com/search?q=Bohemian%20Rhapsody%20Queen%20%26%20Friends'
    );
    expect(searchTrackLink('lastfm', track).url).toBe(
      'https://www.last.fm/search?q=Bohemian%20Rhapsody%20Queen%20%26%20Friends'
    );
    expect(searchTrackLink('pandora', track).url).toBe(
      'https://www.pandora.com/search/Bohemian%20Rhapsody%20Queen%20%26%20Friends/all'
    );
  });
});
