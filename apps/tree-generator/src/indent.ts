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
export function shiftIndent(
  { value, start, end }: Selection,
  outdent = false
): Selection {
  const collapsed = start === end;

  // A selection ending exactly at a line start stops at the previous line, so
  // trailing past a newline does not silently indent the line below.
  const scanEnd = !collapsed && end > 0 && value[end - 1] === '\n' ? end - 1 : end;

  const blockStart = value.lastIndexOf('\n', start - 1) + 1;
  const nextBreak = value.indexOf('\n', scanEnd);
  const blockEnd = nextBreak === -1 ? value.length : nextBreak;

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
