import { describe, expect, it } from 'vitest';
import { duplicateLines, moveLines, shiftIndent } from './edits';

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
const moveUp = (marked: string) => show(moveLines(sel(marked), -1));
const moveDown = (marked: string) => show(moveLines(sel(marked), 1));
const dupUp = (marked: string) => show(duplicateLines(sel(marked), -1));
const dupDown = (marked: string) => show(duplicateLines(sel(marked), 1));

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

describe('moveLines', () => {
  it('swaps the caret line with the one above', () => {
    expect(moveUp('a\nb|')).toBe('b|\na');
  });

  it('swaps the caret line with the one below', () => {
    expect(moveDown('a|\nb')).toBe('b\na|');
  });

  it('does nothing at the top', () => {
    expect(moveUp('a|\nb')).toBe('a|\nb');
  });

  it('does nothing at the bottom', () => {
    expect(moveDown('a\nb|')).toBe('a\nb|');
  });

  it('moves a whole selected block as one unit', () => {
    expect(moveUp('a\n|b\nc|')).toBe('|b\nc|\na');
  });

  it('carries the selection with the block moving down', () => {
    expect(moveDown('|a\nb|\nc')).toBe('c\n|a\nb|');
  });

  it('preserves indentation on the lines it moves', () => {
    expect(moveUp('a\n    b|')).toBe('    b|\na');
  });

  it('round-trips back to where it started', () => {
    const start = 'a\nb\nc';
    const down = moveLines({ value: start, start: 0, end: 0 }, 1);
    const back = moveLines(down, -1);
    expect(back.value).toBe(start);
    expect(back.start).toBe(0);
  });
});

describe('duplicateLines', () => {
  it('copies the caret line downward and follows the copy', () => {
    expect(dupDown('a|')).toBe('a\na|');
  });

  it('copies the caret line upward and stays on top', () => {
    expect(dupUp('a|')).toBe('a|\na');
  });

  it('copies a whole selected block', () => {
    expect(dupDown('|a\nb|')).toBe('a\nb\n|a\nb|');
  });

  it('produces the same text in both directions', () => {
    const input = { value: 'a\nb', start: 0, end: 0 };
    expect(duplicateLines(input, 1).value).toBe(
      duplicateLines(input, -1).value
    );
  });

  it('keeps indentation in the copy', () => {
    expect(dupDown('    a|')).toBe('    a\n    a|');
  });

  it('copies the last line without needing a trailing newline', () => {
    expect(dupDown('a\nb|')).toBe('a\nb\nb|');
  });
});
