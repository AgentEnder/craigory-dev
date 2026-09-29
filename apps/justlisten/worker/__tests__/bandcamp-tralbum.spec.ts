/**
 * The `data-tralbum` parser — pure string/JSON work against fixture HTML
 * shaped like a real Bandcamp page (attribute-escaped JSON, `og:image` meta,
 * `trackinfo` rows with float-second durations).
 *
 * As with the Spotify embed and YouTube `ytInitialData` parsers, the contract
 * under test is mostly about *failing* correctly: undocumented markup will
 * change, and every shape it can change into has to return null so the caller
 * degrades to a search link.
 */
import { describe, expect, it } from 'vitest';
import {
  parseBandcampAlbum,
  parseBandcampTrack,
} from '../providers/scrape/bandcamp-tralbum';

/** Bandcamp embeds the blob as an HTML attribute, so quotes arrive escaped. */
function page(blob: unknown, image = 'https://f4.bcbits.com/img/a123_10.jpg') {
  const attr = JSON.stringify(blob).replace(/&/g, '&amp;').replace(/"/g, '&quot;');
  return [
    '<html><head>',
    `<meta property="og:image" content="${image}">`,
    '</head><body>',
    `<script type="text/javascript" data-tralbum="${attr}" data-embed="{}"></script>`,
    '</body></html>',
  ].join('');
}

const TRACK_BLOB = {
  item_type: 'track',
  artist: 'Radiohead',
  url: 'https://radiohead.bandcamp.com/track/airbag',
  current: { title: 'Airbag', release_date: '16 Jun 1997 00:00:00 GMT' },
  trackinfo: [{ title: 'Airbag', duration: 284.44, title_link: '/track/airbag' }],
};

const ALBUM_BLOB = {
  item_type: 'album',
  artist: 'Radiohead',
  url: 'https://radiohead.bandcamp.com/album/ok-computer',
  current: { title: 'OK Computer', release_date: '16 Jun 1997 00:00:00 GMT' },
  trackinfo: [
    { title: 'Airbag', duration: 284.44, title_link: '/track/airbag' },
    { title: 'Paranoid Android', duration: 383.2, title_link: '/track/paranoid-android' },
    // No page of its own — an "exact" link cannot be built, so it is dropped.
    { title: 'Unreleased', duration: 0 },
  ],
};

describe('parseBandcampTrack', () => {
  it('reads title, artist, artwork, duration and release date', () => {
    expect(parseBandcampTrack(page(TRACK_BLOB), 'radiohead.bandcamp.com')).toEqual({
      provider: 'bandcamp',
      id: 'radiohead.bandcamp.com:airbag',
      title: 'Airbag',
      artist: 'Radiohead',
      releaseDate: '1997-06-16',
      artworkUrl: 'https://f4.bcbits.com/img/a123_10.jpg',
      durationMs: 284440,
    });
  });

  it('refuses an album page, so a collection cannot become one song', () => {
    expect(parseBandcampTrack(page(ALBUM_BLOB), 'radiohead.bandcamp.com')).toBeNull();
  });

  it('returns null for a page with no blob, or a broken one', () => {
    expect(parseBandcampTrack('<html></html>', 'x.bandcamp.com')).toBeNull();
    expect(
      parseBandcampTrack(
        '<script data-tralbum="{not json"></script>',
        'x.bandcamp.com'
      )
    ).toBeNull();
  });

  it('omits a zero duration rather than reporting a 0ms recording', () => {
    const blob = { ...TRACK_BLOB, trackinfo: [{ title: 'Airbag', duration: 0, title_link: '/track/airbag' }] };
    expect(parseBandcampTrack(page(blob), 'x.bandcamp.com')?.durationMs).toBeUndefined();
  });
});

describe('parseBandcampAlbum', () => {
  it('returns every track that has a page, with the album on each row', () => {
    const album = parseBandcampAlbum(page(ALBUM_BLOB), 'radiohead.bandcamp.com', 100);
    expect(album?.title).toBe('OK Computer');
    expect(album?.tracks.map((t) => t.id)).toEqual([
      'radiohead.bandcamp.com:airbag',
      'radiohead.bandcamp.com:paranoid-android',
    ]);
    expect(album?.tracks[0]).toMatchObject({
      album: 'OK Computer',
      artist: 'Radiohead',
      artworkUrl: 'https://f4.bcbits.com/img/a123_10.jpg',
    });
  });

  it('honours the import cap', () => {
    expect(parseBandcampAlbum(page(ALBUM_BLOB), 'x.bandcamp.com', 1)?.tracks).toHaveLength(1);
  });

  it('prefers the blob’s own host over the one it was fetched from', () => {
    // A custom domain redirecting to the bandcamp.com subdomain (or the other
    // way) must not leave ids pointing at a host that does not serve the page.
    const album = parseBandcampAlbum(page(ALBUM_BLOB), 'shop.example.org', 100);
    expect(album?.tracks[0]?.id).toBe('radiohead.bandcamp.com:airbag');
  });

  it('refuses a track page, and a blob whose rows are all unlinkable', () => {
    expect(parseBandcampAlbum(page(TRACK_BLOB), 'x.bandcamp.com', 100)).toBeNull();
    const empty = { ...ALBUM_BLOB, trackinfo: [{ title: 'Unreleased', duration: 0 }] };
    expect(parseBandcampAlbum(page(empty), 'x.bandcamp.com', 100)).toBeNull();
  });
});
