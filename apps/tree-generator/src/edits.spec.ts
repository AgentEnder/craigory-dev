import { describe, expect, it } from 'vitest';
import { duplicateLines, moveLines, openChild, shiftIndent } from './edits';

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
    : value.slice(0, start) +
        '|' +
        value.slice(start, end) +
        '|' +
        value.slice(end);
}

const indent = (marked: string) => show(shiftIndent(sel(marked)));
const outdent = (marked: string) => show(shiftIndent(sel(marked), true));
const moveUp = (marked: string) => {
  const moved = moveLines(sel(marked), -1);
  return moved && show(moved);
};
const moveDown = (marked: string) => {
  const moved = moveLines(sel(marked), 1);
  return moved && show(moved);
};
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

  it('reports nothing to do at the top', () => {
    expect(moveUp('a|\nb')).toBeNull();
  });

  it('reports nothing to do at the bottom', () => {
    expect(moveDown('a\nb|')).toBeNull();
  });

  it('still moves the caret when the swapped lines are identical', () => {
    // The text comes back identical here, so the caller cannot use text
    // equality to detect a no-op -- doing so strands the caret on the bottom
    // line and stops it walking any further up.
    expect(moveUp('src\n  test\n  test|')).toBe('src\n  test|\n  test');
  });

  it('walks a line up past an identical twin on successive moves', () => {
    let state = moveLines(sel('src\n  test\n  test|'), -1)!;
    expect(state.start).toBe(10);
    state = moveLines(state, -1)!;
    expect(state.value).toBe('  test\nsrc\n  test');
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
    const down = moveLines({ value: start, start: 0, end: 0 }, 1)!;
    const back = moveLines(down, -1)!;
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

describe('indenting past a status marker', () => {
  const at = (value: string, caret: number) => ({
    value,
    start: caret,
    end: caret,
  });

  it('indents behind a marker rather than in front of it', () => {
    // Putting the indent first would bury the marker in the indentation.
    expect(shiftIndent(at('+ a.ts', 6)).value).toBe('+   a.ts');
  });

  it('outdents behind a marker', () => {
    expect(shiftIndent(at('+   a.ts', 8), true).value).toBe('+ a.ts');
  });

  it('walks a front-marked line all the way back out', () => {
    expect(shiftIndent(at('+ a.ts', 6), true).value).toBe('+ a.ts');
  });

  it('leaves a marker written after the indentation where it is', () => {
    expect(shiftIndent(at('  + a.ts', 8)).value).toBe('    + a.ts');
    expect(shiftIndent(at('  + a.ts', 8), true).value).toBe('+ a.ts');
  });

  it('does not mistake a filename for a marker', () => {
    expect(shiftIndent(at('-legacy.ts', 10)).value).toBe('  -legacy.ts');
  });
});

describe('openChild', () => {
  const DELIMITER = ' -- ';
  /** Fixtures read better with the caret written in than counted out. */
  const at = (marked: string) => {
    const caret = marked.indexOf('|');
    const value = marked.replace('|', '');
    return { value, start: caret, end: caret };
  };
  const open = (marked: string) => openChild(at(marked), DELIMITER);

  it('closes the name and opens a line one level in', () => {
    expect(open('src|')).toEqual({ value: 'src/\n  ', start: 7, end: 7 });
  });

  it('opens at the depth of the line it was typed on', () => {
    expect(open('src/\n  components|')?.value).toBe(
      'src/\n  components/\n    '
    );
  });

  it('measures depth past a status marker', () => {
    expect(open('  + components|')?.value).toBe('  + components/\n    ');
  });

  it('leaves the rest of the document alone', () => {
    expect(open('src|\nREADME.md')?.value).toBe('src/\n  \nREADME.md');
  });

  it('declines mid-line, where it would break the line in two', () => {
    expect(open('sr|c')).toBeNull();
  });

  it('declines when a selection would be replaced instead of extended', () => {
    expect(openChild({ value: 'src', start: 0, end: 3 }, DELIMITER)).toBeNull();
  });

  it('declines on a line with no name on it yet', () => {
    expect(open('|')).toBeNull();
    expect(open('    |')).toBeNull();
  });

  it('declines on a name that already ends in a slash', () => {
    // Which is also how a literal second slash still gets typed.
    expect(open('src/|')).toBeNull();
  });

  it('declines inside an annotation, where a path is just a path', () => {
    expect(open('a.ts -- see src|')).toBeNull();
    expect(open('a.ts -- see http:|')).toBeNull();
  });

  it('follows the delimiter in use rather than assuming one', () => {
    expect(openChild(at('a.ts # see src|'), ' # ')).toBeNull();
    // With a different delimiter in force, the same text is all name.
    expect(openChild(at('a.ts # see src|'), ' -- ')).not.toBeNull();
  });
});
