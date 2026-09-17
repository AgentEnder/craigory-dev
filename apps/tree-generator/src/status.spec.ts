import { describe, expect, it } from 'vitest';
import {
  coversContents,
  extractStatus,
  gutterFor,
  markerFor,
  rollUp,
} from './status';

describe('extractStatus', () => {
  it('reads each marker', () => {
    expect(extractStatus('+ a.ts')).toEqual({ status: 'added', line: 'a.ts' });
    expect(extractStatus('~ a.ts')).toEqual({
      status: 'changed',
      line: 'a.ts',
    });
    expect(extractStatus('- a.ts')).toEqual({
      status: 'deleted',
      line: 'a.ts',
    });
  });

  it('leaves an unmarked line alone', () => {
    expect(extractStatus('  a.ts')).toEqual({ line: '  a.ts' });
  });

  it('reads a marker written after the indentation', () => {
    expect(extractStatus('    + a.ts')).toEqual({
      status: 'added',
      line: '    a.ts',
    });
  });

  it('reads a marker written in front of the indentation', () => {
    expect(extractStatus('+     a.ts')).toEqual({
      status: 'added',
      line: '    a.ts',
    });
  });

  it('gives a line the same depth either side of its indentation', () => {
    // The marker is not indentation, and neither is the space after it, so
    // these two have to describe the same node.
    expect(extractStatus('  + a.ts').line).toBe(extractStatus('+   a.ts').line);
  });

  it('reads a marker sitting part way through the indentation', () => {
    expect(extractStatus('  +   a.ts')).toEqual({
      status: 'added',
      line: '    a.ts',
    });
  });

  it('needs the space, so a real filename keeps its leading character', () => {
    // Both of these are names people actually have.
    expect(extractStatus('-legacy.ts')).toEqual({ line: '-legacy.ts' });
    expect(extractStatus('  +page.tsx')).toEqual({ line: '  +page.tsx' });
  });

  it('takes a tab as the separator', () => {
    expect(extractStatus('+\ta.ts')).toEqual({ status: 'added', line: 'a.ts' });
  });

  it('is not tripped by a marker with nothing after it', () => {
    expect(extractStatus('+')).toEqual({ line: '+' });
    expect(extractStatus('+ ')).toEqual({ line: '+ ' });
  });

  it('takes only the first marker', () => {
    expect(extractStatus('+ - a.ts')).toEqual({
      status: 'added',
      line: '- a.ts',
    });
  });
});

describe('gutterFor', () => {
  it('is two columns wide either way, so the tree stays aligned', () => {
    expect(gutterFor('added')).toBe('+ ');
    expect(gutterFor(undefined)).toBe('  ');
    expect(gutterFor('added')).toHaveLength(gutterFor(undefined).length);
  });
});

describe('markerFor', () => {
  it('round-trips through extractStatus', () => {
    expect(extractStatus(`${markerFor('deleted')}a.ts`)).toEqual({
      status: 'deleted',
      line: 'a.ts',
    });
  });
});

describe('coversContents', () => {
  it('sends a deletion down over everything inside', () => {
    expect(coversContents('deleted')).toBe(true);
  });

  it('sends nothing else down', () => {
    // + must not, or a folder that rolled up to + from one new file would
    // paint every untouched sibling as new.
    expect(coversContents('added')).toBe(false);
    expect(coversContents('changed')).toBe(false);
  });
});

describe('rollUp', () => {
  it('leaves a folder with nothing in it unmarked', () => {
    expect(rollUp([])).toBeUndefined();
  });

  it('leaves a folder whose contents are all untouched unmarked', () => {
    expect(rollUp([undefined, undefined])).toBeUndefined();
  });

  it('calls a folder new only when everything in it is new', () => {
    expect(rollUp(['added'])).toBe('added');
    expect(rollUp(['added', 'added'])).toBe('added');
  });

  it('calls a folder holding one untouched file changed, not new', () => {
    // The folder was already there holding that file, so it is not new.
    // Weighing only the marked children would call it new on the strength of
    // the one added file and ignore everything beside it.
    expect(rollUp(['added', undefined])).toBe('changed');
  });

  it('calls a folder that only lost a file changed, not deleted', () => {
    // Removing one file does not remove the folder it was in.
    expect(rollUp(['deleted'])).toBe('changed');
  });

  it('calls a mixed folder changed', () => {
    expect(rollUp(['added', 'deleted'])).toBe('changed');
    expect(rollUp(['added', 'changed'])).toBe('changed');
  });

  it('carries a change up on its own', () => {
    expect(rollUp(['changed'])).toBe('changed');
  });
});
