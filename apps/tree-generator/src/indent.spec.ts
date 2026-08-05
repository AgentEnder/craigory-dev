import { describe, expect, it } from 'vitest';
import { shiftIndent } from './indent';

/**
 * Writes a fixture as text with the selection marked by pipes, so the
 * assertions read as what the user sees rather than as index arithmetic.
 * A single pipe is a collapsed caret.
 */
function sel(marked: string) {
  const start = marked.indexOf('|');
  const rest = marked.slice(0, start) + marked.slice(start + 1);
  const second = rest.indexOf('|');
  return second === -1
    ? { value: rest, start, end: start }
    : {
        value: rest.slice(0, second) + rest.slice(second + 1),
        start,
        end: second,
      };
}

function show({ value, start, end }: ReturnType<typeof sel>) {
  return start === end
    ? value.slice(0, start) + '|' + value.slice(start)
    : value.slice(0, start) + '|' + value.slice(start, end) + '|' + value.slice(end);
}

const indent = (marked: string) => show(shiftIndent(sel(marked)));
const outdent = (marked: string) => show(shiftIndent(sel(marked), true));

describe('indent', () => {
  it('indents the caret line and carries the caret along', () => {
    expect(indent('a\nb|\nc')).toBe('a\n  b|\nc');
  });

  it('indents from a caret at the start of a line', () => {
    expect(indent('a\n|b')).toBe('a\n  |b');
  });

  it('indents an empty line so a nested node can be started', () => {
    expect(indent('a\n|')).toBe('a\n  |');
  });

  it('indents every line a selection spans', () => {
    expect(indent('|a\nb|\nc')).toBe('  |a\n  b|\nc');
  });

  it('leaves blank lines alone across a multi-line selection', () => {
    expect(indent('|a\n\nb|')).toBe('  |a\n\n  b|');
  });

  it('does not reach the line below when the selection ends on a newline', () => {
    expect(indent('|a\n|b')).toBe('  |a\n|b');
  });

  it('leaves text outside the touched lines untouched', () => {
    expect(indent('keep\nx|\nkeep')).toBe('keep\n  x|\nkeep');
  });
});

describe('outdent', () => {
  it('removes one level from the caret line', () => {
    expect(outdent('a\n  b|')).toBe('a\nb|');
  });

  it('removes one level from every selected line', () => {
    expect(outdent('|  a\n  b|')).toBe('|a\nb|');
  });

  it('does nothing to a line with no indentation', () => {
    expect(outdent('a|')).toBe('a|');
  });

  it('walks back a half indent rather than getting stuck', () => {
    expect(outdent(' a|')).toBe('a|');
  });

  it('treats a leading tab as one level', () => {
    expect(outdent('\ta|')).toBe('a|');
  });

  it('never drags the caret past the start of its line', () => {
    // Caret sits inside the indent it is about to remove.
    const out = shiftIndent({ value: '  ab', start: 1, end: 1 }, true);
    expect(out.value).toBe('ab');
    expect(out.start).toBe(0);
  });

  it('undoes an indent exactly', () => {
    const original = 'a\n  b\n\n  c';
    const marked = { value: original, start: 0, end: original.length };
    const there = shiftIndent(marked);
    const back = shiftIndent(there, true);
    expect(back.value).toBe(original);
  });
});
