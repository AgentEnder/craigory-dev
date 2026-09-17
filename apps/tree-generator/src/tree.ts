import { DEFAULT_TOKEN, delimiterFor } from './delimiter';
import { extractStatus, type NodeStatus } from './status';

/** A node parsed from one source line. */
export interface TreeNode {
  label: string;
  annotation?: string;
  /** Set when the line was marked as part of a change. */
  status?: NodeStatus;
  children: TreeNode[];
}

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

function splitAnnotation(
  text: string,
  delimiter: string
): { label: string; annotation?: string } {
  const at = text.indexOf(delimiter);
  if (at === -1) return { label: text.trimEnd() };
  return {
    label: text.slice(0, at).trimEnd(),
    // Everything after the FIRST delimiter is annotation, so an annotation may
    // itself contain the delimiter again without being re-split.
    annotation: text.slice(at + delimiter.length).trim(),
  };
}

/**
 * Parse indented text into a forest. Indentation depth decides parentage; the
 * exact indent step does not have to be consistent, since each line is matched
 * against the stack of open ancestors rather than a fixed multiple.
 *
 * `token` has to be the same one the output was rendered with, or a label and
 * its annotation come back as one label.
 */
export function parseTree(source: string, token = DEFAULT_TOKEN): TreeNode[] {
  const delimiter = delimiterFor(token);
  const roots: TreeNode[] = [];
  const stack: { indent: number; node: TreeNode }[] = [];

  for (const raw of source.split('\n')) {
    if (!raw.trim()) continue;

    // Status comes off before anything else looks at the line. It can sit
    // either side of the indentation, so measuring depth first would count a
    // leading marker as part of the name and read the line as a root.
    const { status, line } = extractStatus(raw);
    const indent = indentWidth(line);
    const { label, annotation } = splitAnnotation(line.trim(), delimiter);
    const node: TreeNode = { label, children: [] };
    if (annotation) node.annotation = annotation;
    if (status) node.status = status;

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
