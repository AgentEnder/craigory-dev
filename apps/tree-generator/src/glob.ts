/**
 * Path globbing, for choosing what an import keeps.
 *
 * Small on purpose. A repository tree is a list of slash-separated paths and
 * the patterns people reach for are directory names and extensions, so this
 * covers `*`, `**` and `?` and nothing else.
 */

/** Split a field of patterns typed by hand. Commas or spaces, either way. */
export function parsePatterns(text: string): string[] {
  return text
    .split(/[\s,]+/)
    .map((pattern) => pattern.replace(/\/+$/, ''))
    .filter(Boolean);
}

/**
 * Compile one glob to an anchored regular expression.
 *
 * Scanned a character at a time rather than run through a chain of string
 * replaces. A chain corrupts itself: the pass that turns `*` into `[^/]*` also
 * rewrites the `.*` that an earlier pass had just produced for `**`.
 */
function toRegExp(pattern: string): RegExp {
  let body = '';

  for (let i = 0; i < pattern.length; i++) {
    const char = pattern[i];

    if (char === '*') {
      if (pattern[i + 1] === '*') {
        if (pattern[i + 2] === '/') {
          // Any number of leading segments, including none, so `**/*.md` also
          // matches a file sitting at the top level.
          body += '(?:[^/]*/)*';
          i += 2;
        } else {
          body += '.*';
          i += 1;
        }
      } else {
        // A single star stops at a separator.
        body += '[^/]*';
      }
      continue;
    }

    if (char === '?') {
      body += '[^/]';
      continue;
    }

    body += char.replace(/[.+^${}()|[\]\\]/, '\\$&');
  }

  return new RegExp(`^${body}$`);
}

/**
 * Build a predicate over paths from a list of patterns.
 *
 * Compiled once rather than per path, because this runs over every entry in a
 * repository and a big one has a few thousand.
 *
 * A pattern matches a path when it matches the path itself or any directory
 * above it, which is what makes `.github` mean the folder and everything in
 * it. Writing out `.github/**` as well would be the alternative, and nobody
 * does.
 */
export function compilePatterns(patterns: string[]): (path: string) => boolean {
  if (!patterns.length) return () => false;
  const matchers = patterns.map(toRegExp);

  return (path) => {
    const segments = path.split('/');
    for (let depth = segments.length; depth > 0; depth--) {
      const prefix = segments.slice(0, depth).join('/');
      if (matchers.some((matcher) => matcher.test(prefix))) return true;
    }
    return false;
  };
}

/** One path against one pattern. */
export function matchesGlob(path: string, pattern: string): boolean {
  return compilePatterns([pattern])(path);
}
