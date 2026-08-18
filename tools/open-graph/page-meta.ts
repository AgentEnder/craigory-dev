/**
 * Reading the site's own built HTML back out.
 *
 * Both the generator and the preview sheet need to know what a page declares
 * about itself, and the built `index.html` is the only place that knows: the
 * title and description come from vike settings that are resolved per route at
 * prerender time, not from anything importable.
 */

import { readdirSync } from 'node:fs';
import { join } from 'node:path';

/** The host every card of ours is published under, preview deploys included. */
const SITE_HOST = 'craigory.dev';

/**
 * Undoes the escaping applied when the page was serialized.
 *
 * Numeric entities are handled generically rather than by listing the common
 * ones: vike emits an apostrophe as `&#039;`, so a decode that only knew the
 * hex form `&#x27;` put a literal `&#039;` into card titles — the escape leaked
 * all the way onto the rendered image.
 *
 * `&amp;` is decoded last so that an escaped entity in the source (`&amp;#039;`)
 * survives as text instead of being decoded twice.
 */
export function decodeHtml(value: string): string {
  return value
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(parseInt(dec, 10)))
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Pulls one head meta value out of a built page. Handles `property=` (Open
 * Graph) and `name=` (Twitter) in either attribute order, because vike-react
 * and this site's own `Head.tsx` emit both shapes.
 */
export function readMeta(html: string, key: string): string | undefined {
  const pattern = new RegExp(
    `<meta[^>]*(?:property|name)="${key}"[^>]*content="([^"]*)"` +
      `|<meta[^>]*content="([^"]*)"[^>]*(?:property|name)="${key}"`,
    'i'
  );
  const match = html.match(pattern);
  const value = match?.[1] ?? match?.[2];
  return value ? decodeHtml(value) : undefined;
}

/**
 * True when an `og:image` is one of ours to generate — our host, and an
 * `og.png` of the shape the site's `+image.ts` files ask for. A post that ships
 * its own artwork points somewhere else and is deliberately excluded.
 */
export function declaresGeneratedCard(
  image: string | undefined
): image is string {
  if (!image) return false;
  try {
    const url = new URL(image);
    return url.host === SITE_HOST && url.pathname.endsWith('/og.png');
  } catch {
    return false;
  }
}

/**
 * Where the site is published, matching `renderer/site-url.ts`: production at
 * the root, and preview deploys under the path prefix the build is given as
 * `PUBLIC_ENV__BASE_URL`.
 *
 * Normalized to end in a slash the way vite normalizes its own `base`, and for
 * the same reason: `new URL('json-viewer/', 'https://craigory.dev/pr/9')`
 * replaces the prefix's last segment instead of extending it, so a base without
 * the slash silently published preview tags pointing at production.
 */
export const SITE_BASE = new URL(
  (process.env.PUBLIC_ENV__BASE_URL ?? '/').replace(/\/*$/, '/'),
  `https://${SITE_HOST}`
);

/**
 * The file under the build output that a declared card URL points at.
 *
 * A card usually sits beside the page declaring it, but it need not: every page
 * of the blog index's pagination declares the one `/blog/og.png` rather than a
 * card apiece. So the declaration is what locates the file — a page's own
 * directory is only a guess, and the wrong one for a shared card.
 */
export function cardOutputPath(clientDir: string, image: string): string {
  const { pathname } = new URL(image);
  const base = SITE_BASE.pathname;
  return join(
    clientDir,
    pathname.startsWith(base) ? pathname.slice(base.length) : pathname
  );
}

/**
 * Every `index.html` under the build output. This includes the sibling apps
 * `copy-local-projects.cjs` drops in, so callers must filter on what a page
 * declares rather than assuming everything here is ours.
 */
export function findPageFiles(root: string): string[] {
  return readdirSync(root, { recursive: true, encoding: 'utf-8' })
    .filter((entry) => entry.endsWith('index.html'))
    .map((entry) => join(root, entry));
}
