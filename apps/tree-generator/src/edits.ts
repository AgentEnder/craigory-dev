/** One level of nesting. Matches the indent the placeholder text uses. */
export const INDENT = '  ';

export interface Selection {
  value: string;
  start: number;
  end: number;
}

/** True when the line holds nothing but whitespace. */
const isBlank = (line: string) => line.trim() === '';

function outdentLine(line: string): string {
  if (line.startsWith(INDENT)) return line.slice(INDENT.length);
  if (line.startsWith('\t')) return line.slice(1);
  // Fall back to a single space so a half-indented line can still be walked
  // back rather than getting stuck.
  if (line.startsWith(' ')) return line.slice(1);
  return line;
}

/**
 * Indent or outdent every line the selection touches, returning the new value
 * and where the selection should sit afterwards.
 *
 * Indentation is structural in this tool -- it is what nests a node -- so Tab
 * shifts whole lines rather than inserting a character at the caret.
 */
/**
 * The span of whole lines a selection touches.
 *
 * A selection ending exactly at a line start stops at the line above, so
 * trailing past a newline does not silently drag in the line below.
 */
export function blockBounds(value: string, start: number, end: number) {
  const scanEnd =
    start !== end && end > 0 && value[end - 1] === '\n' ? end - 1 : end;
  const nextBreak = value.indexOf('\n', scanEnd);
  return {
    blockStart: value.lastIndexOf('\n', start - 1) + 1,
    blockEnd: nextBreak === -1 ? value.length : nextBreak,
  };
}

export function shiftIndent(
  { value, start, end }: Selection,
  outdent = false
): Selection {
  const collapsed = start === end;
  const { blockStart, blockEnd } = blockBounds(value, start, end);

  const lines = value.slice(blockStart, blockEnd).split('\n');

  let firstDelta = 0;
  let totalDelta = 0;

  const shifted = lines.map((line, i) => {
    // A caret parked on an empty line still needs to indent -- that is how you
    // start a nested node. Across a multi-line selection, leaving blank lines
    // alone avoids sprinkling trailing whitespace.
    if (isBlank(line) && !collapsed) return line;

    const next = outdent ? outdentLine(line) : INDENT + line;
    const delta = next.length - line.length;
    if (i === 0) firstDelta = delta;
    totalDelta += delta;
    return next;
  });

  return {
    value:
      value.slice(0, blockStart) + shifted.join('\n') + value.slice(blockEnd),
    // Keep the caret with its text. Clamped so outdenting cannot drag it back
    // past the start of its own line.
    start: Math.max(blockStart, start + firstDelta),
    end: Math.max(blockStart, end + totalDelta),
  };
}

/** Up or down, for the line operations below. */
export type Direction = -1 | 1;

/**
 * Swap the lines the selection touches with the line above or below, carrying
 * the selection along. A no-op at the ends of the document.
 */
export function moveLines(
  { value, start, end }: Selection,
  direction: Direction
): Selection {
  const { blockStart, blockEnd } = blockBounds(value, start, end);
  const block = value.slice(blockStart, blockEnd);
  const unchanged = { value, start, end };

  if (direction === -1) {
    if (blockStart === 0) return unchanged;
    const aboveStart = value.lastIndexOf('\n', blockStart - 2) + 1;
    const above = value.slice(aboveStart, blockStart - 1);
    const shift = -(above.length + 1);
    return {
      value:
        value.slice(0, aboveStart) +
        block +
        '\n' +
        above +
        value.slice(blockEnd),
      start: start + shift,
      end: end + shift,
    };
  }

  if (blockEnd >= value.length) return unchanged;
  const belowBreak = value.indexOf('\n', blockEnd + 1);
  const belowEnd = belowBreak === -1 ? value.length : belowBreak;
  const below = value.slice(blockEnd + 1, belowEnd);
  const shift = below.length + 1;
  return {
    value:
      value.slice(0, blockStart) +
      below +
      '\n' +
      block +
      value.slice(belowEnd),
    start: start + shift,
    end: end + shift,
  };
}

/**
 * Copy the lines the selection touches. The text produced is the same either
 * way; the direction decides which copy keeps the selection, so duplicating
 * down leaves you on the new lines and duplicating up leaves you on top.
 */
export function duplicateLines(
  { value, start, end }: Selection,
  direction: Direction
): Selection {
  const { blockStart, blockEnd } = blockBounds(value, start, end);
  const copy = value.slice(blockStart, blockEnd) + '\n';
  const next = value.slice(0, blockStart) + copy + value.slice(blockStart);

  return direction === 1
    ? { value: next, start: start + copy.length, end: end + copy.length }
    : // The original offsets now point at the upper copy.
      { value: next, start, end };
}
