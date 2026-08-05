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

    if (node.annotation === undefined) {
      out.push(prefix + node.label);
    } else {
      const head = `${prefix}${node.label}${ANNOTATION_DELIMITER}`;
      const column = head.length;

      if (!wrap) {
        out.push(head + node.annotation);
      } else {
        const room = Math.max(MIN_ANNOTATION_ROOM, width - column);
        const chunks = wrapText(node.annotation, room);
        out.push(head + chunks[0]);

        if (chunks.length > 1) {
          // The node's own child-level guide: a root has none, and a last child
          // has nothing below it to connect to.
          const ownGuide = isRoot ? '' : last ? ' ' : '│';
          const continuation =
            guides + ownGuide + ' '.repeat(column - guides.length - ownGuide.length);
          for (const chunk of chunks.slice(1)) out.push(continuation + chunk);
        }
      }
    }

    const childGuides = isRoot ? '' : guides + (last ? GAP : GUIDE);
    node.children.forEach((child, i) => {
      const childLast = i === node.children.length - 1;
      emit(child, childGuides, childLast ? LAST_BRANCH : BRANCH, childLast);
    });
  };

  // Roots render bare -- no guides, no marker.
  for (const root of roots) emit(root, '', '', true);

  return out.join('\n');
}
