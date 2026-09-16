/** A node parsed from one source line. */
export interface TreeNode {
  label: string;
  annotation?: string;
  children: TreeNode[];
}

/** Separates a node's label from its annotation. */
export const ANNOTATION_DELIMITER = ' -- ';

export const TAB_WIDTH = 4;

/**
 * Indentation of a line in columns, with tabs advancing to the next tab stop.
 * Exported because reordering has to reason about the same depths the parser
 * derives parentage from -- two measures would drift apart.
 */
export function indentWidth(line: string): number {
  let width = 0;
  for (const ch of indentPrefix(line)) {
    if (ch === ' ') width += 1;
    else width += TAB_WIDTH - (width % TAB_WIDTH);
  }
  return width;
}

/**
 * The leading run that counts as indentation: spaces and tabs, nothing else.
 *
 * Anything anyone else does to a line's indentation has to be bounded by this,
 * or the two disagree. A line pasted out of a web page can start with a
 * non-breaking space, which is not indentation by this measure -- so it is part
 * of the label, and re-indenting the line must leave it alone.
 */
export function indentPrefix(line: string): string {
  return /^[ \t]*/.exec(line)?.[0] ?? '';
}

function splitAnnotation(text: string): { label: string; annotation?: string } {
  const at = text.indexOf(ANNOTATION_DELIMITER);
  if (at === -1) return { label: text.trimEnd() };
  return {
    label: text.slice(0, at).trimEnd(),
    // Everything after the FIRST delimiter is annotation, so an annotation may
    // itself contain " -- " without being re-split.
    annotation: text.slice(at + ANNOTATION_DELIMITER.length).trim(),
  };
}

/**
 * Parse indented text into a forest. Indentation depth decides parentage; the
 * exact indent step does not have to be consistent, since each line is matched
 * against the stack of open ancestors rather than a fixed multiple.
 */
export function parseTree(source: string): TreeNode[] {
  const roots: TreeNode[] = [];
  const stack: { indent: number; node: TreeNode }[] = [];

  for (const raw of source.split('\n')) {
    if (!raw.trim()) continue;

    const indent = indentWidth(raw);
    const { label, annotation } = splitAnnotation(raw.trim());
    const node: TreeNode = { label, children: [] };
    if (annotation) node.annotation = annotation;

    // A line belongs to the deepest open ancestor indented strictly less than
    // it. Ragged indentation therefore lands somewhere sensible instead of
    // throwing.
    while (stack.length && stack[stack.length - 1].indent >= indent) {
      stack.pop();
    }

    if (stack.length) stack[stack.length - 1].node.children.push(node);
    else roots.push(node);

    stack.push({ indent, node });
  }

  return roots;
}
