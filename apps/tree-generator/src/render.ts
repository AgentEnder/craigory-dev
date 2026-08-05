import { ANNOTATION_DELIMITER, type TreeNode } from './tree';

export interface RenderOptions {
  /** Total line width, guide columns included. Ignored when wrap is false. */
  width?: number;
  wrap?: boolean;
}

export const DEFAULT_WIDTH = 80;

/**
 * Least room an annotation gets, however deep its node sits. Without a floor,
 * a node nested past the wrap width would shred its annotation into one
 * character per line, which is worse than simply running long -- so the width
 * is a target that deep nesting is allowed to overflow.
 */
export const MIN_ANNOTATION_ROOM = 16;

const BRANCH = '├── ';
const LAST_BRANCH = '└── ';
const GUIDE = '│   ';
const GAP = '    ';

/**
 * A node is a directory if it contains anything, or if it was written with a
 * trailing slash -- which is the only way to express an empty one.
 */
function isDirectory(node: TreeNode): boolean {
  return node.children.length > 0 || node.label.endsWith('/');
}

/** Directory labels always render with exactly one trailing slash. */
function labelOf(node: TreeNode): string {
  if (!isDirectory(node)) return node.label;
  return node.label.endsWith('/') ? node.label : `${node.label}/`;
}

/**
 * Directories first, files after, each group keeping the order it was written
 * in. Sorting the whole group alphabetically would fight the author, who often
 * has a reason for the order; hoisting directories is the part that makes a
 * tree scannable.
 */
function ordered(nodes: TreeNode[]): TreeNode[] {
  return [...nodes.filter(isDirectory), ...nodes.filter((n) => !isDirectory(n))];
}

/**
 * Greedy word wrap. Breaks on spaces, and only splits a word when that single
 * word cannot fit the available room on a line of its own.
 */
export function wrapText(text: string, width: number): string[] {
  const room = Math.max(1, width);
  const lines: string[] = [];
  let current = '';

  for (const word of text.split(/\s+/).filter(Boolean)) {
    if (!current) {
      current = word;
    } else if (current.length + 1 + word.length <= room) {
      current = `${current} ${word}`;
      continue;
    } else {
      lines.push(current);
      current = word;
    }

    while (current.length > room) {
      lines.push(current.slice(0, room));
      current = current.slice(room);
    }
  }

  if (current) lines.push(current);
  return lines.length ? lines : [''];
}

/**
 * Render a forest as a box-drawing tree.
 *
 * An annotation stays attached to its node's line and, when it does not fit,
 * continues as a hanging block: the continuation lines carry the ancestor
 * guides plus the node's own child-level guide, then pad out to the column
 * where the annotation text began. They never introduce a node marker, so the
 * annotation reads as one block rather than as further tree entries.
 */
export function renderTree(
  roots: TreeNode[],
  options: RenderOptions = {}
): string {
  const width = options.width ?? DEFAULT_WIDTH;
  const wrap = options.wrap ?? true;
  const out: string[] = [];

  const emit = (node: TreeNode, guides: string, marker: string, last: boolean) => {
    const prefix = guides + marker;
    const isRoot = marker === '';

    const label = labelOf(node);
    const childGuides = isRoot ? '' : guides + (last ? GAP : GUIDE);
    const children = ordered(node.children);

    if (node.annotation === undefined) {
      out.push(prefix + label);
    } else {
      const head = `${prefix}${label}${ANNOTATION_DELIMITER}`;
      const column = head.length;

      if (!wrap) {
        out.push(head + node.annotation);
      } else {
        const room = Math.max(MIN_ANNOTATION_ROOM, width - column);
        const chunks = wrapText(node.annotation, room);
        out.push(head + chunks[0]);

        if (chunks.length > 1) {
          // What the continuation rows have to keep drawing, so the tree stays
          // connected while the annotation runs on.
          //
          // A node with children owes a connector down to the first of them:
          // childGuides already carries the sibling guide, and one more bar
          // sits in the column its children's markers start at. Without it the
          // branch line stops dead and reappears a row later.
          //
          // A childless node only continues its own sibling guide -- a root has
          // none, and a last child has nothing below it to connect to.
          const stem = children.length
            ? childGuides + '│'
            : guides + (isRoot ? '' : last ? ' ' : '│');
          const continuation = stem + ' '.repeat(column - stem.length);
          for (const chunk of chunks.slice(1)) out.push(continuation + chunk);
        }
      }
    }

    children.forEach((child, i) => {
      const childLast = i === children.length - 1;
      emit(child, childGuides, childLast ? LAST_BRANCH : BRANCH, childLast);
    });
  };

  // Roots render bare -- no guides, no marker -- but order like any other group.
  for (const root of ordered(roots)) emit(root, '', '', true);

  return out.join('\n');
}
