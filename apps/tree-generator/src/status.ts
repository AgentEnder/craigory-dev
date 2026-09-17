/**
 * Marking a node as added, changed or deleted, so a tree can describe a change
 * rather than just a state.
 */

export type NodeStatus = 'added' | 'changed' | 'deleted';

const BY_MARKER: Record<string, NodeStatus> = {
  '+': 'added',
  '~': 'changed',
  '-': 'deleted',
};

const BY_STATUS: Record<NodeStatus, string> = {
  added: '+',
  changed: '~',
  deleted: '-',
};

/** Width of the rendered status column, marker plus its trailing space. */
export const GUTTER_WIDTH = 2;

/** What an unmarked line shows in the status column. */
export const BLANK_GUTTER = ' '.repeat(GUTTER_WIDTH);

/**
 * A status marker sitting anywhere in a line's leading whitespace, with at
 * least one space between it and the name.
 *
 * Both of these say the same thing, because the marker is not indentation and
 * neither is the space that separates it from the name:
 *
 *     src/
 *       + Button.tsx
 *
 *     src/
 *     +   Button.tsx
 *
 * The space is required. Without it a file honestly named `-legacy.ts` would
 * parse as a deletion, and `+` and `-` are both legal leading characters in a
 * filename. A name beginning `+ ` is not something anyone has.
 */
const LEADING_STATUS = /^([ \t]*)([+~-])[ \t]([ \t]*)(?=\S)/;

/**
 * Take a status marker out of a line, leaving the indentation behind.
 *
 * The marker and the one space after it are removed. Whatever whitespace sat
 * either side of them stays, so it is still the indentation that decides
 * parentage, and a line keeps the same depth whether the marker was written
 * before that indentation or inside it.
 */
export function extractStatus(line: string): {
  status?: NodeStatus;
  line: string;
} {
  const match = LEADING_STATUS.exec(line);
  if (!match) return { line };

  const [whole, before, marker, after] = match;
  return {
    status: BY_MARKER[marker],
    // The lookahead is not consumed, so slicing past the match lands exactly
    // on the first character of the name.
    line: before + after + line.slice(whole.length),
  };
}

/** The status column for a line, blank when the node carries no status. */
export function gutterFor(status: NodeStatus | undefined): string {
  return status ? `${BY_STATUS[status]} ` : BLANK_GUTTER;
}

/** How a status is written back into source, ready to precede a label. */
export function markerFor(status: NodeStatus): string {
  return `${BY_STATUS[status]} `;
}

/**
 * Whether a folder's own status applies to everything inside it.
 *
 * Deleting a folder deletes its contents, so `-` reaches all the way down and
 * overrides whatever a line beneath it says about itself. There is nothing
 * useful to say about a file inside a folder that is going away.
 *
 * Nothing else reaches downward. `+` in particular must not, because a folder
 * can acquire `+` by rolling up from one new file inside it, and if that then
 * rained back down it would mark every untouched sibling as new.
 */
export function coversContents(status: NodeStatus): boolean {
  return status === 'deleted';
}

/**
 * What a folder shows, given what its children came out as.
 *
 * A folder is new only when everything in it is new. One untouched file is
 * enough to make the folder merely changed, because the folder was already
 * there holding that file. Asking instead whether every *marked* child is new
 * would call a folder new on the strength of one added file, ignoring the
 * dozen beside it that nobody touched.
 *
 * A folder holding anything else that was touched has changed, and that
 * includes a folder that only lost a file. Deleting one file does not delete
 * the folder it was in, so `-` never travels upward as `-`.
 */
export function rollUp(
  children: readonly (NodeStatus | undefined)[]
): NodeStatus | undefined {
  if (!children.length) return undefined;
  if (children.every((status) => status === 'added')) return 'added';
  return children.some(Boolean) ? 'changed' : undefined;
}
