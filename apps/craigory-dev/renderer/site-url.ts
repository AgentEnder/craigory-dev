/** Where the site is published. */
const SITE_ORIGIN = 'https://craigory.dev';

/**
 * The Base URL the site is served under: `/` in production, and `/pr/<n>/` on a
 * preview deploy, which `.github/workflows/pr.yml` passes to the build as
 * `PUBLIC_ENV__BASE_URL`.
 *
 * Read through vite's resolved value rather than that variable directly, so
 * there is one answer for the whole bundle. It ends in a slash because
 * `vite.config.ts` guarantees that when it sets `base` — vite itself does not.
 */
const BASE_URL = import.meta.env.BASE_URL || '/';

/**
 * Prefixes a site-root path with the Base URL.
 *
 * The leading slash has to come off first. `new URL('/blog/og.png', base)` looks
 * like it applies the base and does not — a root-absolute path resolves against
 * the origin alone, dropping the prefix — so every preview deploy used to
 * publish social tags pointing at production's URLs.
 */
export function applyBaseUrl(path: string): string {
  return `${BASE_URL}${path.replace(/^\/+/, '')}`;
}

/**
 * Turns a site-root path into the absolute URL that social metadata needs:
 * `og:image` and friends are fetched by crawlers with no page to resolve
 * against.
 */
export function absoluteSiteUrl(path: string): string {
  return new URL(applyBaseUrl(path), SITE_ORIGIN).href;
}

/**
 * The absolute URL of something vite has already based — a hashed asset import
 * carries the Base URL in the URL vite emits for it, so applying it a second
 * time would double the prefix.
 */
export function absoluteAssetUrl(url: string): string {
  return new URL(url, SITE_ORIGIN).href;
}
