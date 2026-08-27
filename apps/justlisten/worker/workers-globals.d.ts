/**
 * `caches.default` is a Workers-only addition to the standard CacheStorage.
 *
 * Declared here rather than by pulling @cloudflare/workers-types in ambiently:
 * this project typechecks pages and worker code together, and the Workers
 * ambient environment conflicts with the DOM lib the React components need.
 */
export {};

declare global {
  interface CacheStorage {
    readonly default: Cache;
  }
}
