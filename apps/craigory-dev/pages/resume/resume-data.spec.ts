import { describe, expect, it } from 'vitest';
import { PRESENTATIONS } from '@new-personal-monorepo/presentations';

import { allEntries, resume, talkLinks } from './resume-data';

describe('resume data', () => {
  it('gives every entry a unique id', () => {
    const ids = allEntries(resume).map((entry) => entry.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('names only presentations that exist', () => {
    for (const talk of resume.talks) {
      for (const slug of talk.slugs) {
        expect(PRESENTATIONS, `${talk.title} -> ${slug}`).toHaveProperty(slug);
      }
    }
  });
});

describe('talkLinks', () => {
  it('links slides only for presentations whose slides page is built', () => {
    expect(
      talkLinks([
        'that-conf-tx-2023-full-stack-type-safety',
        'devup-2023-full-stack-type-safety',
      ])
    ).toEqual({
      slides: '/presentations/view/devup-2023-full-stack-type-safety',
      recording: undefined,
    });
  });

  it('falls back to the recording when there are no slides', () => {
    expect(talkLinks(['nx-conf-2021-nx-for-your-stack'])).toEqual({
      slides: undefined,
      recording: 'https://www.youtube.com/watch?v=IRIXPTIKTmA',
    });
  });

  it('throws on a slug the presentations lib does not have', () => {
    expect(() => talkLinks(['no-such-talk'])).toThrow('no-such-talk');
  });
});
