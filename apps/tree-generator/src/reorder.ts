import { INDENT } from './edits';
import { indentPrefix, indentWidth } from './tree';

/**
 * Moving a subtree by dragging it.
 *
 * All of it operates on the source text, not on the parsed forest, because the
 * source is what the user edits: round-tripping through `parseTree` would
 * quietly normalise annotations and ragged indentation that they meant to keep.
 */

/** One nesting level, in columns. */
export const INDENT_COLUMNS = INDENT.length;

export interface SourceLine {
  text: string;
  /** Leading whitespace measured in columns, tabs expanded. */
  indent: number;
  blank: boolean;
}

export function toLines(source: string): SourceLine[] {
  return source.split('\n').map((text) => ({
    text,
    indent: indentWidth(text),
    blank: text.trim() === '',
  }));
}

/**
 * The half-open span of lines a drag on `index` picks up: the line itself plus
 * everything nested under it.
 *
 * Blank lines inside the subtree travel with it -- they are the author's
 * spacing between groups of children. Blank lines *after* the last nested line
 * do not, because those separate the subtree from whatever follows and should
 * stay behind to keep doing that.
 */
export function blockRange(
  lines: SourceLine[],
  index: number
): { start: number; end: number } {
  const depth = lines[index].indent;
  let end = index + 1;

  for (let i = index + 1; i < lines.length; i++) {
    if (lines[i].blank) continue;
    if (lines[i].indent <= depth) break;
    // Everything skipped on the way here was blank and turned out to be
    // interior, so it is swept in along with this line.
    end = i + 1;
  }

  return { start: index, end };
}

/**
 * The indent columns a block may legally take when dropped into the gap before
 * `gap`, in ascending order. Always at least one entry.
 *
 * `lines` must already have the moving block removed, so the neighbours are the
 * ones the block will actually land between.
 *
 * The ceiling is one level below the line above -- deeper than that would name
 * a parent that is not there. The floor is the indent of the line below, which
 * is what stops a drop from silently adopting the next subtree as children of
 * something the user never dragged onto.
 */
export function indentOptionsAt(lines: SourceLine[], gap: number): number[] {
  let previous: SourceLine | undefined;
  for (let i = gap - 1; i >= 0; i--) {
    if (!lines[i].blank) {
      previous = lines[i];
      break;
    }
  }

  let next: SourceLine | undefined;
  for (let i = gap; i < lines.length; i++) {
    if (!lines[i].blank) {
      next = lines[i];
      break;
    }
  }

  const min = next ? next.indent : 0;
  const max = Math.max(min, previous ? previous.indent + INDENT_COLUMNS : 0);

  const options: number[] = [];
  for (let indent = min; indent < max; indent += INDENT_COLUMNS) {
    options.push(indent);
  }
  // Ragged source can leave the ceiling off the step grid, so it is appended
  // rather than stepped onto -- dropping at the deepest legal level has to stay
  // reachable however the file is indented.
  options.push(max);
  return options;
}

/**
 * The legal indent nearest a pointer sitting at `columns`. A pointer exactly
 * between two levels resolves to the shallower one -- an ambiguous sideways
 * drag should nest less, not more.
 */
export function nearestIndent(options: number[], columns: number): number {
  return options.reduce((best, option) =>
    Math.abs(option - columns) < Math.abs(best - columns) ? option : best
  );
}

/**
 * Which gap between lines a pointer at `y` is closest to, given each line's
 * laid-out box. Crossing a line's midpoint moves the target past it, so the
 * insertion point tracks the pointer the way it does in a file tree.
 */
export function gapFromY(
  rows: { top: number; height: number }[],
  y: number
): number {
  let gap = 0;
  while (gap < rows.length && y > rows[gap].top + rows[gap].height / 2) gap++;
  return gap;
}

/** Re-indent one line by `delta` columns, leaving a blank line blank. */
function reindent(line: SourceLine, delta: number): string {
  if (line.blank) return line.text;
  // Slice off exactly what indentWidth measured, rather than trimStart()ing:
  // that strips the whole Unicode whitespace set, so a line indented with
  // non-breaking spaces would lose characters on a move that asked for no
  // indent change at all.
  const body = line.text.slice(indentPrefix(line.text).length);
  return ' '.repeat(Math.max(0, line.indent + delta)) + body;
}

/**
 * Where a block spanning `[start, end)` actually lands when dropped into the
 * gap before `gap`, once the block itself is out of the list.
 *
 * A gap inside the block resolves to the block's own position: dragging
 * sideways without crossing another line is a reparent in place, not a move.
 */
export function dropTarget(start: number, end: number, gap: number): number {
  if (gap >= start && gap <= end) return start;
  return gap > end ? gap - (end - start) : gap;
}

export interface DropPlan {
  /** The span being dragged, in the displayed line list. */
  start: number;
  end: number;
  /** Index it will occupy once the block is lifted out. */
  target: number;
  /** Indents legal at that target, ascending. */
  options: number[];
}

/**
 * Everything the drag preview needs about a candidate drop: what is moving,
 * where it lands, and which indents are on offer there.
 */
export function planDrop(
  lines: SourceLine[],
  fromLine: number,
  gap: number
): DropPlan {
  const { start, end } = blockRange(lines, fromLine);
  const target = dropTarget(start, end, gap);
  const remaining = [...lines.slice(0, start), ...lines.slice(end)];
  return { start, end, target, options: indentOptionsAt(remaining, target) };
}

/**
 * Move the block containing `fromLine` into the gap before `gap`, re-indented
 * to `indent` columns. Returns null when the move is a no-op, so a click that
 * happens to travel a few pixels does not register as an edit.
 *
 * The moved block's own leading whitespace is rewritten as spaces. Only lines
 * that actually moved are touched, and the tool's other indent commands already
 * insert spaces, so this converges on one convention rather than mixing them.
 */
export function moveBlock(
  source: string,
  fromLine: number,
  gap: number,
  indent: number
): string | null {
  const lines = toLines(source);
  if (fromLine < 0 || fromLine >= lines.length || lines[fromLine].blank) {
    return null;
  }

  const { start, end } = blockRange(lines, fromLine);
  const target = dropTarget(start, end, gap);
  const delta = indent - lines[start].indent;

  const block = lines.slice(start, end).map((line) => reindent(line, delta));
  const remaining = [...lines.slice(0, start), ...lines.slice(end)].map(
    (line) => line.text
  );
  const next = [
    ...remaining.slice(0, target),
    ...block,
    ...remaining.slice(target),
  ].join('\n');

  return next === source ? null : next;
}
