import { rm } from 'node:fs/promises';
import { cpus } from 'node:os';
import { resolve, sep } from 'node:path';

/** Oversubscribe: `fs.rm` is I/O-bound (unlink/rmdir wait), so more in-flight
 * syscalls than cores means more overlap, not contention. */
export const DEFAULT_CONCURRENCY = Math.max(4, cpus().length * 4);

export interface RemoveOptions {
  /** Root the targets are resolved against; nothing outside it is removed. */
  cwd: string;
  /** Max in-flight `fs.rm` calls. Defaults to {@link DEFAULT_CONCURRENCY}. */
  concurrency?: number;
  /** Invoked after each target settles, with cumulative progress. */
  onProgress?: (done: number, total: number) => void;
}

export interface RemoveFailure {
  path: string;
  error: Error;
}

export interface RemoveResult {
  removed: number;
  failures: RemoveFailure[];
}

/** True when `target` resolves strictly inside `root` (never `root` itself). */
function isWithin(root: string, target: string): boolean {
  const resolvedRoot = resolve(root);
  const resolvedTarget = resolve(resolvedRoot, target);
  const prefix = resolvedRoot.endsWith(sep) ? resolvedRoot : resolvedRoot + sep;
  return resolvedTarget.startsWith(prefix);
}

/** Run `mapper` over `items` with a bounded number of concurrent workers. */
async function pMap<T>(
  items: T[],
  concurrency: number,
  mapper: (item: T) => Promise<void>
): Promise<void> {
  let cursor = 0;
  const workerCount = Math.max(1, Math.min(concurrency, items.length));
  const workers = Array.from({ length: workerCount }, async () => {
    while (cursor < items.length) {
      const index = cursor++;
      await mapper(items[index]);
    }
  });
  await Promise.all(workers);
}

/**
 * Delete `targets` (paths relative to `cwd`) by fanning out `fs.rm` across a
 * bounded worker pool. `force: true` makes already-gone paths a no-op; any
 * path escaping `cwd` is refused and recorded as a failure. Failures never
 * abort the batch.
 */
export async function removeAll(
  targets: string[],
  options: RemoveOptions
): Promise<RemoveResult> {
  const { cwd, concurrency = DEFAULT_CONCURRENCY, onProgress } = options;
  const root = resolve(cwd);
  const total = targets.length;
  const failures: RemoveFailure[] = [];
  let done = 0;
  let removed = 0;

  await pMap(targets, concurrency, async (target) => {
    try {
      if (!isWithin(root, target)) {
        throw new Error(`Refusing to remove path outside of ${root}: ${target}`);
      }
      await rm(resolve(root, target), { recursive: true, force: true });
      removed++;
    } catch (error) {
      failures.push({ path: target, error: error as Error });
    } finally {
      onProgress?.(++done, total);
    }
  });

  return { removed, failures };
}
