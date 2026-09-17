import { describe, expect, it } from 'vitest';
import { parseTree } from './tree';
import { measureTree, renderTree, wrapText } from './render';

const render = (src: string, opts?: Parameters<typeof renderTree>[1]) =>
  renderTree(parseTree(src), opts);

describe('parseTree', () => {
  it('nests by indentation depth', () => {
    const [root] = parseTree('a\n  b\n    c\n  d');
    expect(root.label).toBe('a');
    expect(root.children.map((n) => n.label)).toEqual(['b', 'd']);
    expect(root.children[0].children.map((n) => n.label)).toEqual(['c']);
  });

  it('supports multiple roots', () => {
    expect(parseTree('a\nb').map((n) => n.label)).toEqual(['a', 'b']);
  });

  it('ignores blank lines', () => {
    expect(parseTree('a\n\n  b\n\n').map((n) => n.label)).toEqual(['a']);
  });

  it('recovers from ragged indentation by attaching to the nearest ancestor', () => {
    // 3-space then 7-space indents: no consistent step, still unambiguous.
    const [root] = parseTree('a\n   b\n       c\n   d');
    expect(root.children.map((n) => n.label)).toEqual(['b', 'd']);
    expect(root.children[0].children.map((n) => n.label)).toEqual(['c']);
  });

  it('treats tabs as indentation', () => {
    const [root] = parseTree('a\n\tb');
    expect(root.children.map((n) => n.label)).toEqual(['b']);
  });

  it('keeps a trailing slash as part of the label', () => {
    expect(parseTree('src/')[0].label).toBe('src/');
  });

  describe('annotations', () => {
    it('splits on the delimiter', () => {
      const [n] = parseTree('file.ts -- does a thing');
      expect(n.label).toBe('file.ts');
      expect(n.annotation).toBe('does a thing');
    });

    it('leaves a bare double hyphen in the label alone', () => {
      const [n] = parseTree('some--file.ts');
      expect(n.label).toBe('some--file.ts');
      expect(n.annotation).toBeUndefined();
    });

    it('splits only on the first delimiter', () => {
      const [n] = parseTree('a.ts -- first -- second');
      expect(n.label).toBe('a.ts');
      expect(n.annotation).toBe('first -- second');
    });

    it('has no annotation when the delimiter is absent', () => {
      expect(parseTree('plain.ts')[0].annotation).toBeUndefined();
    });
  });
});

describe('wrapText', () => {
  it('breaks on word boundaries', () => {
    expect(wrapText('aaa bbb ccc', 7)).toEqual(['aaa bbb', 'ccc']);
  });

  it('hard-breaks a word that cannot fit alone', () => {
    expect(wrapText('abcdefghij', 4)).toEqual(['abcd', 'efgh', 'ij']);
  });

  it('never loops on a non-positive budget', () => {
    expect(wrapText('ab', 0)).toEqual(['a', 'b']);
  });
});

describe('renderTree guides', () => {
  it('marks last children differently from siblings', () => {
    expect(render('root\n  a\n  b')).toBe(
      ['root/', '├── a', '└── b'].join('\n')
    );
  });

  it('continues a guide past a parent that has siblings', () => {
    expect(render('root\n  a\n    x\n  b')).toBe(
      ['root/', '├── a/', '│   └── x', '└── b'].join('\n')
    );
  });

  it('drops the guide under a last child', () => {
    // Both children are directories, so hoisting leaves their order alone and
    // the last one is still the one carrying a child.
    expect(render('root\n  a\n    x\n  b\n    y')).toBe(
      ['root/', '├── a/', '│   └── x', '└── b/', '    └── y'].join('\n')
    );
  });

  it('renders each root bare', () => {
    expect(render('a\nb')).toBe(['a', 'b'].join('\n'));
  });
});

describe('annotation wrapping', () => {
  // The structural contract the spec's worked example pins down.
  const SOURCE = [
    'packages/',
    '  three-js-pipeline/',
    '    src/',
    '      components/',
    '        malagan-statue-1/',
    '          REFERENCES/',
    '            readme.md -- contains links to the cultural docs we have already created, textures, materials, etc',
    '            specific-real-artifact.png',
    '            other-artifact.png',
    '          mesh.scad',
    '          canvas-texture.ts',
  ].join('\n');

  it('reproduces the worked example at width 80', () => {
    expect(render(SOURCE, { width: 80 })).toBe(
      [
        'packages/',
        '└── three-js-pipeline/',
        '    └── src/',
        '        └── components/',
        '            └── malagan-statue-1/',
        '                ├── REFERENCES/',
        '                │   ├── readme.md -- contains links to the cultural docs we have',
        '                │   │                already created, textures, materials, etc',
        '                │   ├── specific-real-artifact.png',
        '                │   └── other-artifact.png',
        '                ├── mesh.scad',
        '                └── canvas-texture.ts',
      ].join('\n')
    );
  });

  it('starts every continuation at the annotation column', () => {
    const lines = render(SOURCE, { width: 80 }).split('\n');
    const first = lines.find((l) => l.includes('readme.md'))!;
    const column = first.indexOf('contains');
    const continuation = lines.find((l) => l.includes('already created'))!;
    expect(continuation.indexOf('already')).toBe(column);
    expect(column).toBe(37);
  });

  it('carries guides but no node marker on continuation lines', () => {
    const continuation = render(SOURCE, { width: 80 })
      .split('\n')
      .find((l) => l.includes('already created'))!;
    expect(continuation).toContain('│');
    expect(continuation).not.toContain('├──');
    expect(continuation).not.toContain('└──');
  });

  it('never exceeds the requested width when there is room to wrap', () => {
    for (const width of [60, 80, 120]) {
      for (const line of render(SOURCE, { width }).split('\n')) {
        expect(line.length).toBeLessThanOrEqual(width);
      }
    }
  });

  it('keeps the annotation on one line when wrapping is off', () => {
    const lines = render(SOURCE, { wrap: false }).split('\n');
    const annotated = lines.filter((l) => l.includes('readme.md'));
    expect(annotated).toHaveLength(1);
    expect(annotated[0]).toContain('materials, etc');
    expect(annotated[0].length).toBeGreaterThan(80);
  });

  it('uses a space, not a guide, under a last child', () => {
    const out = render('root\n  only.ts -- alpha beta gamma delta', {
      width: 24,
    });
    const [head, ...rest] = out.split('\n').slice(1);
    expect(head.startsWith('└── ')).toBe(true);
    // Last child: nothing below it, so the continuation carries no bar.
    expect(rest.every((l) => !l.includes('│'))).toBe(true);
    expect(rest.every((l) => l.startsWith(' '))).toBe(true);
  });

  it('overflows rather than shredding when nesting eats the width', () => {
    // The annotation column already sits past width 10 here. Running long beats
    // emitting one character per line.
    const deep = [
      'a',
      ' b',
      '  c',
      '   d',
      '    e -- some annotation here',
    ].join('\n');
    const out = render(deep, { width: 10 });
    expect(out).toContain('some');
    expect(out).toContain('annotation');
    expect(out.split('\n').some((l) => l.length > 10)).toBe(true);
  });

  it('gives a narrow width the minimum room instead of one char per line', () => {
    const out = render(SOURCE, { width: 40 });
    const continuation = out.split('\n').find((l) => l.includes('already'))!;
    // Words stay whole even though 40 leaves only 3 columns after the marker.
    expect(continuation).toMatch(/\balready\b/);
  });
});

describe('directories', () => {
  it('appends a slash to anything with children', () => {
    expect(render('src\n  a.ts')).toBe(['src/', '└── a.ts'].join('\n'));
  });

  it('does not double a slash that was already written', () => {
    expect(render('src/\n  a.ts')).toBe(['src/', '└── a.ts'].join('\n'));
  });

  it('treats a childless node written with a slash as an empty directory', () => {
    expect(render('empty/')).toBe('empty/');
  });

  it('leaves files alone', () => {
    expect(render('a.ts')).toBe('a.ts');
  });

  it('hoists directories above files within a group', () => {
    expect(render('root\n  b.ts\n  dir\n    x.ts\n  a.ts')).toBe(
      ['root/', '├── dir/', '│   └── x.ts', '├── b.ts', '└── a.ts'].join('\n')
    );
  });

  it('keeps the written order inside each group', () => {
    // Neither the directories nor the files are alphabetised -- only split.
    expect(render('root\n  z.ts\n  zdir/\n  a.ts\n  adir/')).toBe(
      ['root/', '├── zdir/', '├── adir/', '├── z.ts', '└── a.ts'].join('\n')
    );
  });

  it('orders roots the same way', () => {
    expect(render('README.md\nsrc/')).toBe(['src/', 'README.md'].join('\n'));
  });

  it('counts the added slash in the annotation column', () => {
    const out = render('src -- the code lives here and keeps going\n  a.ts', {
      width: 24,
    });
    const [first, second] = out.split('\n');
    // "src/ -- " is 8 columns, one more than the bare "src" label would give.
    expect(first.startsWith('src/ -- ')).toBe(true);
    // src/ has a child, so the continuation opens with the connector down to
    // it; the wrapped text still resumes at the annotation column.
    expect(second.startsWith('│')).toBe(true);
    expect(second.slice(1, 8)).toBe(' '.repeat(7));
    expect(second[8]).not.toBe(' ');
  });
});

describe('annotations on nodes that have children', () => {
  it('keeps the connector running down to the first child', () => {
    // Without this the branch line stops at the annotation and reappears a row
    // later, leaving the directory looking detached from its contents.
    expect(
      render('root\n  dir -- alpha beta gamma delta\n    kid\n  other', {
        width: 30,
      })
    ).toBe(
      [
        'root/',
        '├── dir/ -- alpha beta gamma',
        '│   │       delta',
        '│   └── kid',
        '└── other',
      ].join('\n')
    );
  });

  it('does the same for a last child, where the sibling guide is blank', () => {
    expect(
      render('root\n  only -- alpha beta gamma delta\n    kid', { width: 30 })
    ).toBe(
      [
        'root/',
        '└── only/ -- alpha beta gamma',
        '    │        delta',
        '    └── kid',
      ].join('\n')
    );
  });

  it('leaves a childless node continuing only its own sibling guide', () => {
    expect(
      render('root\n  a -- alpha beta gamma delta\n  b', { width: 26 })
    ).toBe(
      ['root/', '├── a -- alpha beta gamma', '│        delta', '└── b'].join(
        '\n'
      )
    );
  });

  it('draws a connector under an annotated root that has children', () => {
    expect(render('root -- alpha beta gamma delta\n  kid', { width: 26 })).toBe(
      ['root/ -- alpha beta gamma', '│        delta', '└── kid'].join('\n')
    );
  });
});

describe('whitespace inside annotations', () => {
  it('keeps a run of spaces that fits on one line', () => {
    expect(wrapText('a  b', 10)).toEqual(['a  b']);
  });

  it('keeps runs on a line even when a later one wraps', () => {
    expect(wrapText('aa  bb cccccc', 8)).toEqual(['aa  bb', 'cccccc']);
  });

  it('consumes only the gap it breaks at', () => {
    expect(wrapText('aaaa  bbbb', 5)).toEqual(['aaaa', 'bbbb']);
  });

  it('preserves a tab between words', () => {
    expect(wrapText('a\tb', 10)).toEqual(['a\tb']);
  });

  it('renders an unwrapped annotation exactly as written', () => {
    expect(render('a.ts -- two  spaces  here')).toBe(
      'a.ts -- two  spaces  here'
    );
  });

  it('does not reflow spacing just because wrapping is enabled', () => {
    // The line fits, so nothing should have been touched.
    const spaced = render('a.ts -- keep  the   gaps', { width: 80 });
    const raw = render('a.ts -- keep  the   gaps', { wrap: false });
    expect(spaced).toBe(raw);
  });
});

describe('measureTree', () => {
  it('reports nothing for empty output', () => {
    expect(measureTree('')).toEqual({ lines: 0, widest: 0 });
  });

  it('counts lines and the longest of them', () => {
    expect(measureTree('abc\nab\nabcd')).toEqual({ lines: 3, widest: 4 });
  });

  it('counts a trailing blank line, since it is one the user copies', () => {
    expect(measureTree('abc\n')).toEqual({ lines: 2, widest: 3 });
  });

  it('measures an astral character the way the wrap logic does', () => {
    // Two UTF-16 units, which is what wrapText counts against the width, and
    // roughly what a monospace font advances for it too.
    expect(measureTree('\u{1F332}').widest).toBe(2);
  });

  it('measures the guide columns, not just the label', () => {
    const tree = renderTree(parseTree('src/\n  a.ts'));
    // '\u251c\u2500\u2500 a.ts' is four guide columns plus the label.
    expect(measureTree(tree)).toEqual({ lines: 2, widest: 8 });
  });
});

describe('annotation token', () => {
  it('renders annotations with the token it was given', () => {
    expect(
      renderTree(parseTree('a.ts # does a thing', '#'), { token: '#' })
    ).toBe('a.ts # does a thing');
  });

  it('reads a label containing the other token as plain text', () => {
    const nodes = parseTree('nx build -- verbose', '#');
    expect(nodes[0].label).toBe('nx build -- verbose');
    expect(nodes[0].annotation).toBeUndefined();
  });

  it('shifts the hanging indent by the length of the token', () => {
    // The token sits in the head, so its length moves the column the
    // continuation lines pad out to.
    const annotation = 'one two three four five six';

    expect(renderTree(parseTree(`a.ts -- ${annotation}`), { width: 30 })).toBe(
      ['a.ts -- one two three four', '        five six'].join('\n')
    );

    expect(
      renderTree(parseTree(`a.ts ### ${annotation}`, '###'), {
        token: '###',
        width: 30,
      })
    ).toBe(['a.ts ### one two three four', '         five six'].join('\n'));
  });
});

describe('diff status', () => {
  const render = (source: string, opts = {}) =>
    renderTree(parseTree(source), opts);

  it('adds no gutter at all when nothing is marked', () => {
    expect(render('src/\n  a.ts')).toBe('src/\n└── a.ts');
  });

  it('gives every line a status column once anything is marked', () => {
    expect(render('src/\n  + a.ts\n  b.ts')).toBe(
      ['~ src/', '+ ├── a.ts', '  └── b.ts'].join('\n')
    );
  });

  it('does not call a folder new on the strength of one new file in it', () => {
    // src holds an untouched folder as well as a new one, so it is changed.
    // foo holds nothing but the new file, so it is new.
    expect(render('src\n  components\n  foo\n    + tree')).toBe(
      ['~ src/', '+ ├── foo/', '+ │   └── tree', '  └── components'].join('\n')
    );
  });

  it('counts an untouched empty folder against its parent', () => {
    expect(render('src/\n  + a.ts\n  empty/')).toBe(
      // empty/ sorts first because directories are hoisted.
      ['~ src/', '  ├── empty/', '+ └── a.ts'].join('\n')
    );
  });

  it('calls a folder of nothing but new files new', () => {
    expect(render('src/\n  + a.ts\n  + b.ts')).toBe(
      ['+ src/', '+ ├── a.ts', '+ └── b.ts'].join('\n')
    );
  });

  it('calls a folder changed when what is beneath it disagrees', () => {
    expect(render('src/\n  + a.ts\n  - b.ts')).toBe(
      ['~ src/', '+ ├── a.ts', '- └── b.ts'].join('\n')
    );
  });

  it('calls a folder that only lost a file changed, not deleted', () => {
    expect(render('src/\n  - a.ts')).toBe(['~ src/', '- └── a.ts'].join('\n'));
  });

  it('rolls a marker all the way up, not just one level', () => {
    expect(render('a/\n  b/\n    + c.ts')).toBe(
      ['+ a/', '+ └── b/', '+     └── c.ts'].join('\n')
    );
  });

  it('rains a deleted folder down over everything inside it', () => {
    expect(render('- src/\n  a.ts\n  b/\n    deep.ts')).toBe(
      ['- src/', '- ├── b/', '- │   └── deep.ts', '- └── a.ts'].join('\n')
    );
  });

  it('lets a deleted folder settle what its contents say of themselves', () => {
    // There is nothing useful to say about a file inside a folder that is
    // going away.
    expect(render('- src/\n  + a.ts')).toBe(
      ['- src/', '- └── a.ts'].join('\n')
    );
  });

  it('does not rain an added folder down onto its contents', () => {
    // If it did, a folder that rolled up to + from one new file would mark
    // every untouched sibling as new too.
    expect(render('+ src/\n  a.ts\n  b.ts')).toBe(
      ['+ src/', '  ├── a.ts', '  └── b.ts'].join('\n')
    );
  });

  it('stops a change at the line it was written on', () => {
    expect(render('~ src/\n  a.ts')).toBe(['~ src/', '  └── a.ts'].join('\n'));
  });

  it("lets a line's own marker beat what would have rolled up to it", () => {
    expect(render('~ src/\n  + a.ts\n  + b.ts')).toBe(
      ['~ src/', '+ ├── a.ts', '+ └── b.ts'].join('\n')
    );
  });

  it('blanks the status column on a wrapped annotation', () => {
    expect(
      render('src/\n  ~ main.ts -- now mounts the new shell', { width: 34 })
    ).toBe(
      [
        '~ src/',
        '~ └── main.ts -- now mounts the',
        '                 new shell',
      ].join('\n')
    );
  });

  it('reads a marker written in front of the indentation', () => {
    // The marker is not indentation, so Button.tsx is still inside src/.
    expect(render(['src/', '+   Button.tsx'].join('\n'))).toBe(
      ['+ src/', '+ └── Button.tsx'].join('\n')
    );
  });

  it('gives the same tree either side of the indentation', () => {
    expect(render(['src/', '  + Button.tsx'].join('\n'))).toBe(
      render(['src/', '+   Button.tsx'].join('\n'))
    );
  });

  it('reads a marker at the left margin as a root', () => {
    expect(render(['src/', '+ other/'].join('\n'))).toBe(
      ['  src/', '+ other/'].join('\n')
    );
  });

  it('still lets a filename begin with a marker character', () => {
    expect(render('-legacy.ts')).toBe('-legacy.ts');
    expect(render(['pages/', '  +page.tsx'].join('\n'))).toBe(
      ['pages/', '└── +page.tsx'].join('\n')
    );
  });

  it('renders the whole propagation model at once', () => {
    // Every rule in one tree. components/ holds only new files so it is new;
    // utils/ only lost one so it changed; legacy/ was deleted so its contents
    // go with it; src/ mixes all three so it changed.
    const source = [
      'src/',
      '  components/',
      '    + Button.tsx',
      '    + Card.tsx',
      '  utils/',
      '    - old.ts',
      '  ~ main.ts',
      '  - legacy/',
      '      dead.ts',
    ].join('\n');

    expect(render(source)).toBe(
      [
        '~ src/',
        '+ ├── components/',
        '+ │   ├── Button.tsx',
        '+ │   └── Card.tsx',
        '~ ├── utils/',
        '- │   └── old.ts',
        '- ├── legacy/',
        '- │   └── dead.ts',
        '~ └── main.ts',
      ].join('\n')
    );
  });

  it('counts the gutter against the wrap width', () => {
    // The status column is real output, so it eats two columns out of the room
    // an annotation has before it must break. Same text, same width, one break
    // earlier once the tree is marked.
    const words = 'aaa bbb ccc ddd eee fff ggg hhh iii';

    expect(render(`a.ts -- ${words}`, { width: 40 }).split('\n')[0]).toBe(
      'a.ts -- aaa bbb ccc ddd eee fff ggg hhh'
    );
    expect(render(`+ a.ts -- ${words}`, { width: 40 }).split('\n')[0]).toBe(
      '+ a.ts -- aaa bbb ccc ddd eee fff ggg'
    );
  });
});
