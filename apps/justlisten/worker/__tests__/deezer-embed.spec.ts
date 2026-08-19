import { describe, expect, it } from 'vitest';

import {
  deezerEmbedFromLinks,
  deezerEmbedFromUrl,
} from '../providers/links';
import type { ProviderLink } from '../types';

describe('deezerEmbedFromUrl', () => {
  it('reads track, album, and playlist URLs', () => {
    expect(deezerEmbedFromUrl('https://www.deezer.com/track/3135556')).toEqual({
      type: 'track',
      id: '3135556',
    });
    expect(deezerEmbedFromUrl('https://deezer.com/album/302127')).toEqual({
      type: 'album',
      id: '302127',
    });
    expect(deezerEmbedFromUrl('https://www.deezer.com/playlist/1234')).toEqual({
      type: 'playlist',
      id: '1234',
    });
  });

  it('tolerates the locale segment on shared links', () => {
    expect(deezerEmbedFromUrl('https://www.deezer.com/us/track/3135556')).toEqual({
      type: 'track',
      id: '3135556',
    });
  });

  it('ignores query strings and trailing whitespace', () => {
    expect(
      deezerEmbedFromUrl('  https://www.deezer.com/track/3135556?utm_source=x  ')
    ).toEqual({ type: 'track', id: '3135556' });
  });

  it('rejects non-embeddable resources and other hosts', () => {
    expect(deezerEmbedFromUrl('https://www.deezer.com/artist/27')).toBeNull();
    expect(deezerEmbedFromUrl('https://www.deezer.com/search/queen')).toBeNull();
    expect(deezerEmbedFromUrl('https://open.spotify.com/track/abc')).toBeNull();
    expect(deezerEmbedFromUrl('https://www.deezer.com/track/abc')).toBeNull();
    expect(deezerEmbedFromUrl('not a url')).toBeNull();
  });
});

describe('deezerEmbedFromLinks', () => {
  const deezerExact: ProviderLink = {
    provider: 'deezer',
    kind: 'exact',
    url: 'https://www.deezer.com/track/3135556',
  };
  const deezerSearch: ProviderLink = {
    provider: 'deezer',
    kind: 'search',
    url: 'https://www.deezer.com/search/queen',
  };
  const spotify: ProviderLink = {
    provider: 'spotify',
    kind: 'exact',
    url: 'https://open.spotify.com/track/abc',
  };

  it('finds the exact Deezer link', () => {
    expect(deezerEmbedFromLinks([spotify, deezerExact])).toEqual({
      type: 'track',
      id: '3135556',
    });
  });

  it('ignores a Deezer search link — a query is not a resource', () => {
    expect(deezerEmbedFromLinks([spotify, deezerSearch])).toBeNull();
  });

  it('returns null when no Deezer link is present', () => {
    expect(deezerEmbedFromLinks([spotify])).toBeNull();
    expect(deezerEmbedFromLinks([])).toBeNull();
  });
});
