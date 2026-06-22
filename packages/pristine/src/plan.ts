import { categorizeIgnored } from './categorize.js';
import type { ResetMode } from './git.js';

/** A fully-resolved description of what a single run will do. */
export interface Plan {
  /** Reset tracked files first, or `null` to leave them. */
  reset: ResetMode | null;
  /** Remove untracked files. */
  untracked: boolean;
  /** Remove ignored files. */
  ignored: boolean;
  /** Include vendor dirs (node_modules) within the ignored removal. */
  vendor: boolean;
  /** Include `*.env*` files within the ignored removal. */
  env: boolean;
}

/** Raw flag values as parsed by cli-forge (absent flags are `undefined`). */
export interface CliFlags {
  reset?: ResetMode;
  untracked?: boolean;
  ignored?: boolean;
  nodeModules?: boolean;
  env?: boolean;
}

/** The two enumerated path lists git produces. */
export interface Enumeration {
  untracked: string[];
  ignored: string[];
}

/**
 * Whether the user supplied any *action* flag. When true the run is
 * non-interactive and the plan comes straight from the flags; when false we
 * fall back to interactive prompts. Modifier flags (`--node-modules`, `--env`,
 * `--yes`, `--dry-run`) do not count as actions.
 */
export function hasActionFlags(flags: CliFlags): boolean {
  return (
    flags.reset !== undefined ||
    flags.untracked === true ||
    flags.ignored === true
  );
}

/** Build a {@link Plan} from raw flag values. */
export function planFromFlags(flags: CliFlags): Plan {
  return {
    reset: flags.reset ?? null,
    untracked: flags.untracked === true,
    ignored: flags.ignored === true,
    vendor: flags.nodeModules === true,
    env: flags.env === true,
  };
}

/**
 * Reconstruct the CLI flags that reproduce `plan` non-interactively. Used to
 * tell the user how to apply a dry run (`pristine <flags> --yes`). Works
 * regardless of whether the plan came from flags or interactive prompts.
 */
export function flagsForPlan(plan: Plan): string[] {
  const flags: string[] = [];
  if (plan.reset) {
    flags.push('--reset', plan.reset);
  }
  if (plan.untracked) {
    flags.push('--untracked');
  }
  if (plan.ignored) {
    flags.push('--ignored');
  }
  if (plan.vendor) {
    flags.push('--node-modules');
  }
  if (plan.env) {
    flags.push('--env');
  }
  return flags;
}

/**
 * Human-readable list of the actions a plan would take: the reset (if any),
 * then one `Remove <path>` line per target. Drives the dry-run report.
 *
 * Each removal renders as the command it represents: `rm -r <dir>/` for
 * directories, `rm <file>` for files. When `fileCount` is supplied, directory
 * targets are annotated with their recursive file count, e.g.
 * `rm -r node_modules/ (34201 files)`. Counting is the caller's concern (it is
 * filesystem I/O), keeping this function pure.
 */
export function describePlan(
  plan: Plan,
  targets: string[],
  fileCount?: (target: string) => number | undefined
): string[] {
  const lines: string[] = [];
  if (plan.reset) {
    lines.push(`Reset tracked files (${plan.reset})`);
  }

  const removals = targets.map((target) => {
    const isDir = target.endsWith('/');
    return {
      prefix: isDir ? `rm -r ${target}` : `rm ${target}`,
      count: isDir && fileCount ? fileCount(target) : undefined,
    };
  });

  // Pad the path column so the `(N files)` annotations line up.
  const column = Math.max(
    0,
    ...removals.filter((r) => r.count !== undefined).map((r) => r.prefix.length)
  );

  for (const { prefix, count } of removals) {
    if (count === undefined) {
      lines.push(prefix);
    } else {
      lines.push(
        `${prefix.padEnd(column)} (${count} file${count === 1 ? '' : 's'})`
      );
    }
  }
  return lines;
}

/**
 * Resolve a plan plus git's enumeration into the concrete list of paths to
 * remove. Reset is a git operation, not a removal, so it is not included here.
 * Ignored entries are filtered through the vendor/env carve-outs.
 */
export function selectTargets(plan: Plan, enumeration: Enumeration): string[] {
  const targets: string[] = [];
  if (plan.untracked) {
    targets.push(...enumeration.untracked);
  }
  if (plan.ignored) {
    const { vendor, env, other } = categorizeIgnored(enumeration.ignored);
    targets.push(...other);
    if (plan.vendor) {
      targets.push(...vendor);
    }
    if (plan.env) {
      targets.push(...env);
    }
  }
  return targets;
}
