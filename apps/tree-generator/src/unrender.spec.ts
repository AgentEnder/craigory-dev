import { describe, expect, it } from 'vitest';
import { looksRendered, unrenderTree } from './unrender';
import { renderTree } from './render';
import { parseTree } from './tree';

const src = (text: string) => text.replace(/^\n/, '').replace(/\n$/, '');

describe('looksRendered', () => {
  it('recognises this tool"s own output', () => {
    expect(looksRendered('src/\n├── a.ts')).toBe(true);
  });

  it('recognises the ASCII markers `tree` falls back to', () => {
    expect(looksRendered('src/\n|-- a.ts')).toBe(true);
    expect(looksRendered('src/\n`-- a.ts')).toBe(true);
  });

  it('leaves ordinary indented source alone', () => {
    expect(looksRendered('src/\n  a.ts\n  b.ts')).toBe(false);
  });

  it('is not fooled by a unified diff, which is a likelier paste', () => {
    expect(looksRendered('--- a/x\n+++ b/x\n+-- not a tree')).toBe(false);
  });

  it('says nothing of an empty clipboard', () => {
    expect(looksRendered('')).toBe(false);
  });
});

describe('unrenderTree', () => {
  it('turns guides back into indentation', () => {
    expect(
      unrenderTree(
        src(`
src/
├── components/
│   ├── Button.tsx
│   └── Card.tsx
└── utils/
    └── format.ts
`)
      )
    ).toBe(
      src(`
src/
  components/
    Button.tsx
    Card.tsx
  utils/
    format.ts
`)
    );
  });

  it('keeps an annotation attached to its node', () => {
    expect(unrenderTree('├── a.ts -- does a thing')).toBe(
      '  a.ts -- does a thing'
    );
  });

  it('folds a wrapped annotation back onto one line', () => {
    expect(
      unrenderTree(
        src(`
src/
└── Button.tsx -- every variant lives
                  here, so restyling
                  is one file
`)
      )
    ).toBe(
      src(`
src/
  Button.tsx -- every variant lives here, so restyling is one file
`)
    );
  });

  it('folds a continuation that still carries a sibling guide', () => {
    expect(
      unrenderTree(
        src(`
├── a.ts -- one
│          two
└── b.ts
`)
      )
    ).toBe(
      src(`
  a.ts -- one two
  b.ts
`)
    );
  });

  it('reads the ASCII form `tree` emits', () => {
    expect(
      unrenderTree(
        src(`
src
|-- components
|   \`-- Button.tsx
\`-- index.ts
`)
      )
    ).toBe(
      src(`
src
  components
    Button.tsx
  index.ts
`)
    );
  });

  it('keeps several roots at the left margin', () => {
    expect(unrenderTree('a/\n└── x\nb/\n└── y')).toBe('a/\n  x\nb/\n  y');
  });

  it('preserves blank lines between groups', () => {
    expect(unrenderTree('a/\n└── x\n\nb/')).toBe('a/\n  x\n\nb/');
  });
});

describe('round trip', () => {
  /**
   * The property that matters: un-rendering output and rendering it again has
   * to land on the same tree. Anything else means a paste silently edits the
   * thing it was meant to reproduce.
   */
  const stable = (source: string, options = {}) => {
    const once = renderTree(parseTree(source), options);
    const again = renderTree(parseTree(unrenderTree(once)), options);
    expect(again).toBe(once);
  };

  it('survives a plain tree', () => {
    stable('src/\n  a.ts\n  b.ts\nREADME.md');
  });

  it('survives annotations that wrap', () => {
    stable(
      src(`
src/
  components/
    Button.tsx -- every variant lives here, so restyling the set is a single file to open
    Card.tsx
  utils/
    format.ts -- date and number helpers
README.md
`),
      { width: 60, wrap: true }
    );
  });

  it('survives an unwrapped render', () => {
    stable(
      'a/\n  b.ts -- a long annotation that is left to run past the edge',
      {
        wrap: false,
      }
    );
  });

  it('survives a deeply nested tree', () => {
    stable('a/\n  b/\n    c/\n      d/\n        e.ts -- leaf', { width: 40 });
  });
});

describe('status gutter', () => {
  it('recognises a marked tree as rendered', () => {
    expect(looksRendered(['  src/', '+ └── a.ts'].join('\n'))).toBe(true);
  });

  it('puts the markers back into source form', () => {
    expect(
      unrenderTree(
        ['  src/', '+ ├── a.ts', '  ├── b.ts', '- └── c.ts'].join('\n')
      )
    ).toBe(['src/', '  + a.ts', '  b.ts', '  - c.ts'].join('\n'));
  });

  it('marks a root, which renders bare but still has a column', () => {
    expect(unrenderTree(['- old/', '- └── a.ts'].join('\n'))).toBe(
      ['- old/', '  - a.ts'].join('\n')
    );
  });

  it('does not read a blank gutter as indentation', () => {
    // Two leading spaces on an unmarked root would otherwise look like a
    // nested node with nothing above it.
    expect(unrenderTree(['  src/', '+ └── a.ts'].join('\n'))).toBe(
      ['src/', '  + a.ts'].join('\n')
    );
  });

  it('folds a wrapped annotation whose continuation has a blank gutter', () => {
    expect(
      unrenderTree(
        [
          '  src/',
          '~ └── main.ts -- now mounts the',
          '                 new shell',
        ].join('\n')
      )
    ).toBe(['src/', '  ~ main.ts -- now mounts the new shell'].join('\n'));
  });
});

describe('round trip with status', () => {
  const stable = (source: string, options = {}) => {
    const once = renderTree(parseTree(source), options);
    const again = renderTree(parseTree(unrenderTree(once)), options);
    expect(again).toBe(once);
  };

  it('survives a marked tree', () => {
    stable(
      ['src/', '  + components/', '      Button.tsx', '  - legacy.ts'].join(
        '\n'
      )
    );
  });

  it('survives a marked tree with wrapping annotations', () => {
    stable(
      [
        'src/',
        '  + components/',
        '      Button.tsx -- every variant lives here, so restyling the set is one file',
        '  ~ main.ts -- now mounts the new shell instead of the old root component',
        '  - legacy.ts',
      ].join('\n'),
      { width: 56 }
    );
  });
});
