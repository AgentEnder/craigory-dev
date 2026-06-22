/**
 * The result of partitioning git's ignored-entry list into the buckets the
 * removal plan reasons about.
 */
export interface CategorizedIgnored {
  /** Entries under a `node_modules` directory. */
  vendor: string[];
  /** Files matching the `*.env*` glob. */
  env: string[];
  /** Everything else (e.g. `dist/`, `.cache/`, coverage output). */
  other: string[];
}

function isVendor(entry: string): boolean {
  return entry.split('/').includes('node_modules');
}

function isEnv(entry: string): boolean {
  const basename = entry.replace(/\/+$/, '').split('/').pop() ?? '';
  return basename.includes('.env');
}

/**
 * Partition git's ignored entries into vendor / env / other.
 *
 * `vendor` takes precedence over `env`: an env file that lives under
 * `node_modules` is treated as vendor so the vendor toggle governs it.
 * Reasons only about the entries git returns — never re-walks the tree.
 */
export function categorizeIgnored(entries: string[]): CategorizedIgnored {
  const result: CategorizedIgnored = { vendor: [], env: [], other: [] };
  for (const entry of entries) {
    if (isVendor(entry)) {
      result.vendor.push(entry);
    } else if (isEnv(entry)) {
      result.env.push(entry);
    } else {
      result.other.push(entry);
    }
  }
  return result;
}
