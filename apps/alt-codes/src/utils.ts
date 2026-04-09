/**
 * Prepend the Vite base URL to an app-relative path.
 *
 * The base is configured in vite.config.ts as `(PUBLIC_ENV__BASE_URL ?? '') + '/alt-codes/'`.
 * All internal <a href> values must go through this so the site works when deployed
 * under a sub-path (e.g. https://craigory.dev/alt-codes/symbol/2190-leftwards-arrow).
 *
 * Usage:  href={withBase('/symbol/2190-leftwards-arrow')}
 */
export function withBase(path: string): string {
  // import.meta.env.BASE_URL always ends with '/'; path always starts with '/'
  return import.meta.env.BASE_URL.replace(/\/$/, '') + path;
}
