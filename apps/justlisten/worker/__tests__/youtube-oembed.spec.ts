import { describe, expect, it } from 'vitest';
import { parseYouTubeOEmbed } from '../providers/youtube';

/** The live response for https://www.youtube.com/watch?v=NJKsTEeqL1s. */
const REAL = {
  title: 'Trickle Down Blues',
  author_name: 'Cam Burnette - Topic',
  author_url: 'https://www.youtube.com/channel/UCLxyNmcTsWhTGnX-JtEDNzQ',
  type: 'video',
  provider_name: 'YouTube',
  thumbnail_url: 'https://i.ytimg.com/vi/NJKsTEeqL1s/hqdefault.jpg',
};

describe('parseYouTubeOEmbed', () => {
  it('maps a real auto-generated music response', () => {
    expect(parseYouTubeOEmbed('NJKsTEeqL1s', REAL)).toEqual({
      provider: 'youtube',
      id: 'NJKsTEeqL1s',
      title: 'Trickle Down Blues',
      artist: 'Cam Burnette',
      artworkUrl: 'https://i.ytimg.com/vi/NJKsTEeqL1s/hqdefault.jpg',
    });
  });

  it('strips the " - Topic" suffix so the artist matches other catalogs', () => {
    const track = parseYouTubeOEmbed('abc', {
      title: 'Song',
      author_name: 'Some Artist - Topic',
    });
    expect(track?.artist).toBe('Some Artist');
  });

  it('keeps a normal channel name as-is', () => {
    const track = parseYouTubeOEmbed('abc', {
      title: 'Song',
      author_name: 'CamBurnetteVEVO',
    });
    expect(track?.artist).toBe('CamBurnetteVEVO');
  });

  it('omits artwork when the response carries none', () => {
    const track = parseYouTubeOEmbed('abc', {
      title: 'Song',
      author_name: 'Artist',
    });
    expect(track).toEqual({
      provider: 'youtube',
      id: 'abc',
      title: 'Song',
      artist: 'Artist',
    });
  });

  it('tolerates a missing author — the title still identifies the song', () => {
    expect(parseYouTubeOEmbed('abc', { title: 'Song' })).toEqual({
      provider: 'youtube',
      id: 'abc',
      title: 'Song',
      artist: '',
    });
  });

  it('returns null without a usable title', () => {
    expect(parseYouTubeOEmbed('abc', { author_name: 'Artist' })).toBeNull();
    expect(parseYouTubeOEmbed('abc', { title: '' })).toBeNull();
    expect(parseYouTubeOEmbed('abc', {})).toBeNull();
    expect(parseYouTubeOEmbed('abc', null)).toBeNull();
    expect(parseYouTubeOEmbed('abc', 'not json')).toBeNull();
  });
});
