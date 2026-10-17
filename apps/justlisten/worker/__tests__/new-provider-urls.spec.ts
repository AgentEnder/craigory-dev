/**
 * URL parsing for Bandcamp, Last.fm and Pandora — pure, no network.
 *
 * These decide what a pasted link *is*, which is the only job the search box
 * delegates entirely to the server. Getting it wrong is visible twice: a link
 * that should open a song answers "unsupported", or one provider's parser
 * claims another's URL and the song page 404s on an id it cannot look up.
 */
import { describe, expect, it } from 'vitest';
import { bandcampProvider } from '../providers/bandcamp';
import { lastfmProvider } from '../providers/lastfm';
import { pandoraProvider, unslug } from '../providers/pandora';
import { providers } from '../providers/index';
import { parseBandcampTrackId, parseLastfmTrackId } from '../providers/links';

describe('bandcamp URL parsing', () => {
  it('parses a track URL on a bandcamp.com subdomain', () => {
    const parsed = bandcampProvider.parseTrackUrl(
      'https://radiohead.bandcamp.com/track/airbag'
    );
    expect(parseBandcampTrackId(parsed!.trackId)).toEqual({
      host: 'radiohead.bandcamp.com',
      slug: 'airbag',
    });
  });

  it('parses a track URL on an artist’s custom domain', () => {
    const parsed = bandcampProvider.parseTrackUrl(
      'https://music.example.org/track/b-side?from=embed'
    );
    expect(parseBandcampTrackId(parsed!.trackId)?.host).toBe('music.example.org');
  });

  it('parses an album URL as the importable collection', () => {
    const parsed = bandcampProvider.parsePlaylistUrl(
      'https://radiohead.bandcamp.com/album/ok-computer'
    );
    expect(parseBandcampTrackId(parsed!.playlistId)).toEqual({
      host: 'radiohead.bandcamp.com',
      slug: 'ok-computer',
    });
  });

  it('rejects artist and merch pages', () => {
    expect(bandcampProvider.parseTrackUrl('https://radiohead.bandcamp.com/')).toBeNull();
    expect(
      bandcampProvider.parseTrackUrl('https://radiohead.bandcamp.com/merch/shirt')
    ).toBeNull();
    expect(bandcampProvider.parsePlaylistUrl('https://bandcamp.com/discover')).toBeNull();
  });

  it('never steals a link another provider owns', () => {
    // Bandcamp's parsers are host-permissive (custom domains are real), so the
    // guarantee comes from registry order: every earlier provider is
    // host-locked and gets asked first.
    const urls = [
      'https://open.spotify.com/track/4u7EnebtmKWzUH433cf5Qv',
      'https://open.spotify.com/album/1F1S6K8IcHPdRqL7cUtzQ2',
      'https://music.apple.com/us/song/bohemian-rhapsody/1440806041',
      'https://www.youtube.com/watch?v=fJ9rUzIMcZQ',
      'https://www.deezer.com/track/3135556',
      'https://www.deezer.com/us/album/302127',
    ];
    for (const url of urls) {
      const owner = providers.find(
        (p) => p.parsePlaylistUrl(url) ?? p.parseTrackUrl(url)
      );
      expect(owner?.id).not.toBe('bandcamp');
    }
  });
});

describe('last.fm URL parsing', () => {
  it('parses /music/<artist>/_/<track>, decoding + as a space', () => {
    const parsed = lastfmProvider.parseTrackUrl(
      'https://www.last.fm/music/Queen/_/Bohemian+Rhapsody'
    );
    expect(parseLastfmTrackId(parsed!.trackId)).toEqual({
      artist: 'Queen',
      title: 'Bohemian Rhapsody',
    });
  });

  it('tolerates a locale prefix on a shared link', () => {
    const parsed = lastfmProvider.parseTrackUrl(
      'https://www.last.fm/ja/music/Boris/_/Farewell'
    );
    expect(parseLastfmTrackId(parsed!.trackId)?.artist).toBe('Boris');
  });

  it('rejects artist and album pages, which name no track', () => {
    expect(lastfmProvider.parseTrackUrl('https://www.last.fm/music/Queen')).toBeNull();
    expect(
      lastfmProvider.parseTrackUrl(
        'https://www.last.fm/music/Queen/A+Night+at+the+Opera'
      )
    ).toBeNull();
  });

  it('has no importable collections', () => {
    expect(
      lastfmProvider.parsePlaylistUrl('https://www.last.fm/user/someone/playlists')
    ).toBeNull();
  });
});

describe('pandora URL parsing', () => {
  it('parses an artist/album/track URL', () => {
    expect(
      pandoraProvider.parseTrackUrl(
        'https://www.pandora.com/artist/queen/a-night-at-the-opera/bohemian-rhapsody'
      )
    ).toEqual({ trackId: 'queen:a-night-at-the-opera:bohemian-rhapsody' });
  });

  it('drops the share token so two links to one track share an id', () => {
    const bare = pandoraProvider.parseTrackUrl(
      'https://www.pandora.com/artist/queen/a-night-at-the-opera/bohemian-rhapsody'
    );
    const shared = pandoraProvider.parseTrackUrl(
      'https://www.pandora.com/artist/queen/a-night-at-the-opera/bohemian-rhapsody/TRqmwq6Vbtfxqjk'
    );
    expect(shared).toEqual(bare);
  });

  it('rejects artist and album pages', () => {
    expect(pandoraProvider.parseTrackUrl('https://www.pandora.com/artist/queen')).toBeNull();
    expect(
      pandoraProvider.parseTrackUrl(
        'https://www.pandora.com/artist/queen/a-night-at-the-opera'
      )
    ).toBeNull();
  });

  it('has no importable collections', () => {
    expect(
      pandoraProvider.parsePlaylistUrl('https://www.pandora.com/playlist/PL:123:456')
    ).toBeNull();
    expect(
      pandoraProvider.parsePlaylistUrl('https://www.pandora.com/station/play/123')
    ).toBeNull();
  });

  it('names the recording from the id alone, with no request', async () => {
    const track = await pandoraProvider.getTrack(
      {} as never,
      'queen:a-night-at-the-opera:bohemian-rhapsody'
    );
    expect(track).toMatchObject({
      provider: 'pandora',
      title: 'Bohemian Rhapsody',
      artist: 'Queen',
      album: 'A Night At The Opera',
    });
  });

  it('unslugs into something matching normalizes to the same key', () => {
    expect(unslug('bohemian-rhapsody')).toBe('Bohemian Rhapsody');
    // Case and punctuation are lost, which is why nothing downstream compares
    // these strings raw.
    expect(unslug('ac-dc')).toBe('Ac Dc');
  });
});
