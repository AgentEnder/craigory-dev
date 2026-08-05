import { describe, expect, it } from 'vitest';
import { parseTree } from './tree';
import { renderTree, wrapText } from './render';

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
      ['root', '├── a', '└── b'].join('\n')
    );
  });

  it('continues a guide past a parent that has siblings', () => {
    expect(render('root\n  a\n    x\n  b')).toBe(
      ['root', '├── a', '│   └── x', '└── b'].join('\n')
    );
  });

  it('drops the guide under a last child', () => {
    expect(render('root\n  a\n  b\n    x')).toBe(
      ['root', '├── a', '└── b', '    └── x'].join('\n')
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
    const deep = ['a', ' b', '  c', '   d', '    e -- some annotation here'].join(
      '\n'
    );
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
