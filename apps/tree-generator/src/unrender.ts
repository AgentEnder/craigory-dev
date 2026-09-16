import { INDENT } from './edits';

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
  return text.split('\n').some((line) => NODE.test(line));
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

  for (const raw of rendered.split('\n')) {
    if (!raw.trim()) {
      out.push('');
      continue;
    }

    const node = NODE.exec(raw);
    if (node) {
      const [, guides, , text] = node;
      // Roots render bare, so a line carrying a marker is at least one deep.
      const depth = guides.length / GUIDE_WIDTH + 1;
      out.push(INDENT.repeat(depth) + text.trim());
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

    out.push(raw.trim());
  }

  return out.join('\n');
}
