import { indentWidth } from './tree';
import { extractStatus } from './status';

/** One level of nesting. Matches the indent the placeholder text uses. */
export const INDENT = '  ';

export interface Selection {
  value: string;
  start: number;
  end: number;
}

/** True when the line holds nothing but whitespace. */
const isBlank = (line: string) => line.trim() === '';

/**
 * A status marker written at the very front of a line, which Tab has to step
 * over. Indenting in front of it would leave the marker buried in the
 * indentation, and outdenting would find the marker instead of a space and
 * quietly do nothing.
 */
const FRONT_MARKER = /^[+~-][ \t]/;

function splitFrontMarker(line: string): { head: string; rest: string } {
  const head = FRONT_MARKER.exec(line)?.[0] ?? '';
  return { head, rest: line.slice(head.length) };
}

function outdentBody(body: string): string {
  if (body.startsWith(INDENT)) return body.slice(INDENT.length);
  if (body.startsWith('\t')) return body.slice(1);
  // Fall back to a single space so a half-indented line can still be walked
  // back rather than getting stuck.
  if (body.startsWith(' ')) return body.slice(1);
  return body;
}

function outdentLine(line: string): string {
  const { head, rest } = splitFrontMarker(line);
  return head + outdentBody(rest);
}

function indentLine(line: string): string {
  const { head, rest } = splitFrontMarker(line);
  return head + INDENT + rest;
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

    const next = outdent ? outdentLine(line) : indentLine(line);
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
 * the selection along.
 *
 * Returns null at the ends of the document, where there is nothing to swap
 * with. That has to be a distinct signal rather than "the text came back
 * unchanged": swapping two identical lines produces identical text, and
 * treating that as a no-op would strand the caret and stop it walking further.
 */
export function moveLines(
  { value, start, end }: Selection,
  direction: Direction
): Selection | null {
  const { blockStart, blockEnd } = blockBounds(value, start, end);
  const block = value.slice(blockStart, blockEnd);

  if (direction === -1) {
    if (blockStart === 0) return null;
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

  if (blockEnd >= value.length) return null;
  const belowBreak = value.indexOf('\n', blockEnd + 1);
  const belowEnd = belowBreak === -1 ? value.length : belowBreak;
  const below = value.slice(blockEnd + 1, belowEnd);
  const shift = below.length + 1;
  return {
    value:
      value.slice(0, blockStart) + below + '\n' + block + value.slice(belowEnd),
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

/**
 * Typing `/` at the end of a name closes that node and opens its first child.
 *
 * Building a tree is mostly directory, child, directory, child, and the slash
 * is already being typed to say "this one is a directory". Doing the newline
 * and the indent off the back of it removes the other two keystrokes.
 *
 * Returns null when the keystroke should be left to type itself, which is most
 * of the time. The guards matter more than the insertion does, because this
 * fires in the middle of typing and a false positive breaks a line in half:
 *
 * - a selection would be replaced rather than extended, so it is left alone
 * - the caret has to be at the end of its line, or the rest of the line would
 *   be pushed onto the new one
 * - a line with nothing on it yet has no name to close
 * - a line already ending in `/` is already a directory, which also means a
 *   second slash can still be typed literally
 * - past the annotation delimiter the text is prose, and a path inside it is
 *   just a path
 */
export function openChild(
  { value, start, end }: Selection,
  delimiter: string
): Selection | null {
  if (start !== end) return null;

  const nextBreak = value.indexOf('\n', start);
  const atLineEnd =
    nextBreak === -1 ? start === value.length : nextBreak === start;
  if (!atLineEnd) return null;

  const lineStart = value.lastIndexOf('\n', start - 1) + 1;
  const line = value.slice(lineStart, start);
  if (!line.trim() || line.endsWith('/') || line.includes(delimiter)) {
    return null;
  }

  // Measured past any status marker, so `+ components/` opens its child at the
  // depth the tree will actually read it at rather than at the margin.
  const indent = indentWidth(extractStatus(line).line) + INDENT.length;
  const insert = `/\n${' '.repeat(indent)}`;
  const caret = start + insert.length;

  return {
    value: value.slice(0, start) + insert + value.slice(start),
    start: caret,
    end: caret,
  };
}
