import { describe, expect, it } from 'vitest';
import type { Track } from '../types';
import {
  DEFAULT_MATCH_THRESHOLD,
  matchKeyForTrack,
  normKey,
  normalizeArtist,
  normalizeForMatching,
  normalizeTitle,
  pickBestMatch,
  scoreMatch,
  similarity,
} from '../providers/matching';

function track(overrides: Partial<Track>): Track {
  return {
    provider: 'spotify',
    id: 'id',
    title: 'Title',
    artist: 'Artist',
    ...overrides,
  };
}

describe('normalizeTitle', () => {
  it('lowercases and strips punctuation', () => {
    expect(normalizeTitle("Don't Stop Me Now!")).toBe('dont stop me now');
    expect(normalizeTitle('MR. BRIGHTSIDE')).toBe('mr brightside');
  });

  it('strips feat. clauses, parenthesized and trailing', () => {
    expect(normalizeTitle('Blinding Lights (feat. Someone)')).toBe(
      'blinding lights'
    );
    expect(normalizeTitle('Blinding Lights feat. Someone')).toBe(
      'blinding lights'
    );
    expect(normalizeTitle('Blinding Lights ft. Someone Else')).toBe(
      'blinding lights'
    );
  });

  it('strips remaster/version dash suffixes', () => {
    expect(normalizeTitle('Bohemian Rhapsody - 2011 Remaster')).toBe(
      'bohemian rhapsody'
    );
    expect(normalizeTitle('Africa - Single Version')).toBe('africa');
  });

  it('strips bracketed noise like [Official Video]', () => {
    expect(normalizeTitle('Song Name [Official Video]')).toBe('song name');
    expect(normalizeTitle('Song Name (Remastered 2009)')).toBe('song name');
  });

  it('keeps meaningful parenthetical content', () => {
    expect(normalizeTitle('The Ecstasy of Gold (Pt. II)')).toBe(
      'the ecstasy of gold pt ii'
    );
  });

  it('does not treat "Artist - Title" dashes as noise', () => {
    expect(normalizeTitle('Queen - Bohemian Rhapsody')).toBe(
      'queen bohemian rhapsody'
    );
  });
});

describe('normalizeArtist', () => {
  it('strips YouTube " - Topic" suffix', () => {
    expect(normalizeArtist('Queen - Topic')).toBe('queen');
  });

  it('strips feat clauses and punctuation', () => {
    expect(normalizeArtist('Major Lazer feat. MØ & DJ Snake')).toBe(
      'major lazer'
    );
    expect(normalizeArtist('AC/DC')).toBe('ac dc');
  });

  it('normalizes case and whitespace', () => {
    expect(normalizeArtist('  The   Beatles ')).toBe('the beatles');
  });
});

describe('normKey / matchKeyForTrack', () => {
  it('is stable across noisy variants of the same track', () => {
    const a = normKey({ title: 'Song (Remastered)', artist: 'The Band' });
    const b = normKey({ title: 'Song', artist: 'The Band' });
    expect(a).toBe(b);
  });

  it('combines artist and title', () => {
    expect(normKey({ title: 'Go Now', artist: 'The Cats' })).toBe(
      'the-cats~go-now'
    );
  });

  it('prefers ISRC (uppercased) when present', () => {
    expect(
      matchKeyForTrack(track({ isrc: 'usum71703861', title: 'X', artist: 'Y' }))
    ).toBe('isrc:USUM71703861');
  });

  it('falls back to the normalized key without ISRC', () => {
    expect(matchKeyForTrack(track({ title: 'Go Now', artist: 'The Cats' }))).toBe(
      'norm:the-cats~go-now'
    );
  });
});

describe('similarity', () => {
  it('returns 1 for identical strings and 0 for empty input', () => {
    expect(similarity('a b c', 'a b c')).toBe(1);
    expect(similarity('', 'a')).toBe(0);
  });

  it('rewards compact containment (channel-name style)', () => {
    expect(similarity('queen', 'queen official')).toBeGreaterThanOrEqual(0.85);
  });
});

describe('scoreMatch / pickBestMatch', () => {
  const source = track({
    title: 'Bohemian Rhapsody',
    artist: 'Queen',
    durationMs: 354000,
  });

  it('scores the right candidate above the threshold', () => {
    const good = track({
      provider: 'youtube',
      id: 'good',
      title: 'Queen – Bohemian Rhapsody (Official Video Remastered)',
      artist: 'Queen Official',
    });
    expect(scoreMatch(source, good)).toBeGreaterThanOrEqual(
      DEFAULT_MATCH_THRESHOLD
    );
  });

  it('applies the duration bonus within a 5s window', () => {
    const base = track({ title: 'Bohemian Rhapsody', artist: 'Queen' });
    const near = { ...base, durationMs: 356000 };
    const far = { ...base, durationMs: 200000 };
    expect(scoreMatch(source, near)).toBeCloseTo(
      scoreMatch(source, far) + 0.1,
      10
    );
  });

  it('picks the best candidate among decoys', () => {
    const candidates = [
      track({ id: 'decoy1', title: 'Bohemian Like You', artist: 'The Dandy Warhols' }),
      track({ id: 'winner', title: 'Bohemian Rhapsody - 2011 Remaster', artist: 'Queen', durationMs: 355000 }),
      track({ id: 'decoy2', title: 'Killer Queen', artist: 'Queen' }),
    ];
    expect(pickBestMatch(source, candidates)?.id).toBe('winner');
  });

  it('returns null when nothing is convincing', () => {
    const candidates = [
      track({ id: 'x', title: 'Completely Different', artist: 'Someone Else' }),
    ];
    expect(pickBestMatch(source, candidates)).toBeNull();
    expect(pickBestMatch(source, [])).toBeNull();
  });

  it('honors a custom threshold', () => {
    const meh = track({ id: 'meh', title: 'Bohemian', artist: 'Nobody' });
    expect(pickBestMatch(source, [meh], 0.01)?.id).toBe('meh');
    expect(pickBestMatch(source, [meh], 0.99)).toBeNull();
  });
});

describe('normalizeForMatching (stub-compat alias)', () => {
  it('behaves like normalizeTitle', () => {
    expect(normalizeForMatching('Song (Remastered)')).toBe(
      normalizeTitle('Song (Remastered)')
    );
  });
});
