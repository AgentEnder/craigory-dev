import { INDENT } from './edits';
import { GUTTER_WIDTH, extractStatus, markerFor } from './status';

/**
 * Turning a rendered tree back into source.
 *
 * Pasting a tree into the source field is the obvious thing to try when you
 * want to edit one you rendered earlier, or one you got out of `tree`. Left
 * alone, the guide characters would be read as part of the labels and the
 * result would be a tree of box-drawing characters.
 */

/** One level of guide, drawn either as a bar or as the gap after a last child. */
const GUIDE = String.raw`(?:[│|]   |    )`;
const GUIDE_WIDTH = 4;

/**
 * The marker that introduces a node.
 *
 * Both the box-drawing form this tool emits and the ASCII form `tree` falls
 * back to. `+-- ` is deliberately not accepted: it is the rarest of the ASCII
 * variants and the only one that collides with a unified diff, which is a much
 * likelier thing to paste by accident.
 */
const MARKER = String.raw`(?:[├└]── |[|\x60]-- )`;

const NODE = new RegExp(`^(${GUIDE}*)(${MARKER})(.*)$`);

/**
 * Whether text looks like a rendered tree rather than source.
 *
 * One node marker is enough. Source lines cannot contain one -- there is no way
 * to type a guide as part of a label and have it survive a render -- so this
 * does not have to weigh how much of the paste is tree.
 */
export function looksRendered(text: string): boolean {
  const lines = text.split('\n');
  // Whether there is a status column is a property of the whole paste, so it
  // has to be settled before any single line is tested.
  const gutter = hasGutter(lines);
  return lines.some((line) => NODE.test(stripGutter(line, gutter)));
}

/**
 * Whether the output carries a status column.
 *
 * One marked line is enough, because the renderer gives the column to the
 * whole tree or to none of it. Asking per line would misread the blank gutter
 * on an unmarked line as two spaces of indentation.
 */
function hasGutter(lines: string[]): boolean {
  return lines.some((line) => /^[+~-] /.test(line));
}

function stripGutter(line: string, gutter: boolean): string {
  return gutter ? line.slice(GUTTER_WIDTH) : line;
}

/**
 * Rewrite a rendered tree as the indented source that produces it.
 *
 * Three kinds of line come out of the renderer and all three have to be read
 * back differently: a node line carries guides and a marker, a bare line at the
 * left margin is a root, and a line with guides but no marker is the
 * continuation of the annotation above it, which folds back into that line.
 *
 * The fold is lossy in exactly one way: a run of several spaces inside an
 * annotation that happened to fall on a line break comes back as one space.
 * Nothing records where the break was, and the alternative -- keeping the
 * break -- would put a newline in the middle of an annotation.
 */
export function unrenderTree(rendered: string): string {
  const out: string[] = [];
  const all = rendered.split('\n');
  const gutter = hasGutter(all);

  for (const full of all) {
    if (!full.trim()) {
      out.push('');
      continue;
    }

    // The status column is not part of the tree drawing, so it comes off
    // before anything tries to read guides out of the line. A marked line
    // gives its marker up to the same extraction the parser uses; an unmarked
    // one has two blank columns to drop instead.
    const { status, line } = gutter
      ? extractStatus(full)
      : { status: undefined, line: full };
    const raw = status ? line : stripGutter(full, gutter);
    const mark = status ? markerFor(status) : '';

    const node = NODE.exec(raw);
    if (node) {
      const [, guides, , text] = node;
      // Roots render bare, so a line carrying a marker is at least one deep.
      const depth = guides.length / GUIDE_WIDTH + 1;
      out.push(INDENT.repeat(depth) + mark + text.trim());
      continue;
    }

    // Anything still indented, by a guide or by the padding that lines a
    // hanging annotation up under itself, is a continuation.
    const previous = out.length - 1;
    if (/^[│| ]/.test(raw) && previous >= 0 && out[previous] !== '') {
      // trim() alone would leave the bar: a continuation under a node that
      // still has siblings below it carries its ancestors' guides, and those
      // are drawn characters, not whitespace.
      out[previous] = `${out[previous]} ${raw
        .replace(/^[│| \t]+/, '')
        .trimEnd()}`;
      continue;
    }

    out.push(mark + raw.trim());
  }

  return out.join('\n');
}
