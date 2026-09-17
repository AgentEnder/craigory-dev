import { describe, expect, it } from 'vitest';
import {
  blockRange,
  dropTarget,
  gapFromY,
  indentOptionsAt,
  moveBlock,
  nearestIndent,
  planDrop,
  toLines,
} from './reorder';

/** Fixtures read better written as one indented string than as an array. */
const src = (text: string) => text.replace(/^\n/, '').replace(/\n$/, '');

const SAMPLE = src(`
src/
  components/
    Button.tsx
    Card.tsx
  utils/
    format.ts
README.md
`);

describe('blockRange', () => {
  const lines = toLines(SAMPLE);

  it('takes a leaf on its own', () => {
    expect(blockRange(lines, 2)).toEqual({ start: 2, end: 3 });
  });

  it('takes a directory with everything nested under it', () => {
    // components/ and its two children.
    expect(blockRange(lines, 1)).toEqual({ start: 1, end: 4 });
  });

  it('takes the whole tree from the root', () => {
    expect(blockRange(lines, 0)).toEqual({ start: 0, end: 6 });
  });

  it('stops at a sibling, not at the end of the file', () => {
    expect(blockRange(lines, 4)).toEqual({ start: 4, end: 6 });
  });

  it('carries a blank line that sits between children', () => {
    const blanks = toLines(
      src(`
a/
  one

  two
b
`)
    );
    expect(blockRange(blanks, 0)).toEqual({ start: 0, end: 4 });
  });

  it('leaves a trailing blank line behind as a separator', () => {
    const blanks = toLines(
      src(`
a/
  one

b
`)
    );
    expect(blockRange(blanks, 0)).toEqual({ start: 0, end: 2 });
  });
});

describe('indentOptionsAt', () => {
  it('offers only the root level above the first line', () => {
    expect(indentOptionsAt(toLines(SAMPLE), 0)).toEqual([0]);
  });

  it('forces first-child depth in the gap between a parent and its children', () => {
    // Between 'src/' and 'components/' there is nowhere else a line can go.
    expect(indentOptionsAt(toLines(SAMPLE), 1)).toEqual([2]);
  });

  it('offers every level from the next line up to a child of the previous', () => {
    // After 'Card.tsx' (indent 4), before 'utils/' (indent 2).
    expect(indentOptionsAt(toLines(SAMPLE), 4)).toEqual([2, 4, 6]);
  });

  it('offers root and one level in at the end of the file', () => {
    const lines = toLines(SAMPLE);
    expect(indentOptionsAt(lines, lines.length)).toEqual([0, 2]);
  });

  it('reaches a ragged ceiling that is off the step grid', () => {
    const ragged = toLines('a\n   b\nc');
    // The line above is indented 3, so a child of it sits at 5 -- a level the
    // regular 0/2/4 steps would never land on.
    expect(indentOptionsAt(ragged, 2)).toEqual([0, 2, 4, 5]);
  });

  it('always offers something, even for an empty document', () => {
    expect(indentOptionsAt(toLines(''), 0)).toEqual([0]);
  });
});

describe('nearestIndent', () => {
  it('snaps to the closest legal level', () => {
    expect(nearestIndent([0, 2, 4], 4)).toBe(4);
    expect(nearestIndent([0, 2, 4], 5)).toBe(4);
  });

  it('breaks a tie towards the shallower level', () => {
    // Halfway between two levels, the drop that nests less is the safer read
    // of an ambiguous gesture.
    expect(nearestIndent([0, 2, 4], 3)).toBe(2);
  });

  it('clamps rather than extrapolating past the ends', () => {
    expect(nearestIndent([0, 2, 4], 99)).toBe(4);
    expect(nearestIndent([0, 2, 4], -99)).toBe(0);
  });
});

describe('gapFromY', () => {
  const rows = [0, 1, 2].map((i) => ({ top: i * 20, height: 20 }));

  it('targets the gap above a line until the pointer passes its middle', () => {
    expect(gapFromY(rows, 4)).toBe(0);
    expect(gapFromY(rows, 16)).toBe(1);
  });

  it('cannot go past the end of the document', () => {
    expect(gapFromY(rows, 5000)).toBe(3);
  });
});

describe('dropTarget', () => {
  it('shifts a gap below the block back by the block length', () => {
    expect(dropTarget(1, 4, 6)).toBe(3);
  });

  it('leaves a gap above the block alone', () => {
    expect(dropTarget(1, 4, 0)).toBe(0);
  });

  it('resolves a gap inside the block to the block itself', () => {
    expect(dropTarget(1, 4, 2)).toBe(1);
    expect(dropTarget(1, 4, 4)).toBe(1);
  });
});

describe('planDrop', () => {
  it('reports the span, the landing index, and the levels on offer', () => {
    // Dragging components/ into the gap just above README.md.
    expect(planDrop(toLines(SAMPLE), 1, 6)).toEqual({
      start: 1,
      end: 4,
      target: 3,
      // Lands between format.ts (indent 4) and README.md (indent 0), so
      // anything from root level to a child of format.ts is on offer.
      options: [0, 2, 4, 6],
    });

    // And at the very end of the file, where only README.md is above it.
    expect(planDrop(toLines(SAMPLE), 1, 7).options).toEqual([0, 2]);
  });
});

describe('moveBlock', () => {
  it('moves a leaf past its sibling', () => {
    expect(moveBlock(SAMPLE, 3, 2, 4)).toBe(
      src(`
src/
  components/
    Card.tsx
    Button.tsx
  utils/
    format.ts
README.md
`)
    );
  });

  it('carries a directory subtree along with it', () => {
    expect(moveBlock(SAMPLE, 1, 7, 0)).toBe(
      src(`
src/
  utils/
    format.ts
README.md
components/
  Button.tsx
  Card.tsx
`)
    );
  });

  it('re-indents the whole block, keeping its internal shape', () => {
    // Drop components/ into utils/ -- one level deeper than it was.
    expect(moveBlock(SAMPLE, 1, 5, 4)).toBe(
      src(`
src/
  utils/
    components/
      Button.tsx
      Card.tsx
    format.ts
README.md
`)
    );
  });

  it('reparents in place when only the indent changes', () => {
    expect(moveBlock(SAMPLE, 6, 7, 2)).toBe(
      src(`
src/
  components/
    Button.tsx
    Card.tsx
  utils/
    format.ts
  README.md
`)
    );
  });

  it('returns null when the block lands where it already was', () => {
    expect(moveBlock(SAMPLE, 3, 4, 4)).toBeNull();
    expect(moveBlock(SAMPLE, 1, 1, 2)).toBeNull();
  });

  it('refuses to drag a blank line', () => {
    expect(moveBlock('a\n\nb', 1, 0, 0)).toBeNull();
  });

  it('never outdents a nested line past the left margin', () => {
    const moved = moveBlock(
      src(`
  a/
    b
c
`),
      0,
      3,
      0
    );
    expect(moved).toBe(
      src(`
c
a/
  b
`)
    );
  });

  it('measures depth past a marker written in front of the indentation', () => {
    // Button.tsx is two deep despite the line starting with the marker, so
    // dragging src/ has to take it along.
    const marked = ['src/', '+   Button.tsx', 'README.md'].join('\n');
    expect(moveBlock(marked, 0, 3, 0)).toBe(
      ['README.md', 'src/', '  + Button.tsx'].join('\n')
    );
  });

  it('keeps the marker when a line changes depth', () => {
    expect(moveBlock(['a/', '  b/', '  - c.ts'].join('\n'), 2, 2, 4)).toBe(
      ['a/', '  b/', '    - c.ts'].join('\n')
    );
  });

  it('leaves whitespace it never counted as indentation alone', () => {
    // A non-breaking space is not indentation by indentWidth's reckoning, so
    // it is part of the label -- and a move that changes no indent at all must
    // not eat it. Pasting a tree out of a web page is how you get one.
    expect(moveBlock('a\n\u00A0\u00A0b\nc', 1, 0, 0)).toBe(
      '\u00A0\u00A0b\na\nc'
    );
  });

  it('normalises the moved block to spaces without touching the rest', () => {
    const tabbed = 'root/\n\tchild\nother';
    expect(moveBlock(tabbed, 1, 3, 0)).toBe('root/\nother\nchild');
  });
});
