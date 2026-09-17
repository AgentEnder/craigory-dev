/**
 * The token that separates a node's label from its annotation.
 *
 * Stored as the bare token rather than as the string that appears in the text,
 * because the padding around it is not decoration. ` -- ` is what keeps
 * `nx build --verbose` reading as a label instead of an empty label annotated
 * `verbose`, and every other token needs the same guard. Deriving the padding
 * means a setting can never be saved without it.
 */

export const DEFAULT_TOKEN = '--';

/** Offered in the picker. Anything else is typed by hand. */
export const PRESET_TOKENS = ['--', '#'] as const;

/**
 * How a token appears in the text, which is the token with one space either
 * side.
 *
 * An empty token falls back to the default. The custom field is empty for as
 * long as it takes to type into, and rendering nothing sensible in the meantime
 * would make the output flicker between two shapes.
 */
export function delimiterFor(token: string): string {
  return ` ${token.trim() || DEFAULT_TOKEN} `;
}

/**
 * Rewrite every annotation in `source` from one token to another.
 *
 * Changing the setting without this would leave the text saying `--` while the
 * parser looked for `#`, so every annotation in the document would silently
 * become part of its label. Switching back puts it all where it was.
 *
 * Only the first delimiter on a line is touched, matching the parser, which
 * treats everything after the first one as annotation text.
 */
export function changeDelimiter(
  source: string,
  from: string,
  to: string
): string {
  const before = delimiterFor(from);
  const after = delimiterFor(to);
  if (before === after) return source;

  return source
    .split('\n')
    .map((line) => {
      const at = line.indexOf(before);
      if (at === -1) return line;
      return line.slice(0, at) + after + line.slice(at + before.length);
    })
    .join('\n');
}
