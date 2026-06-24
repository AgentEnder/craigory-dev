#!/usr/bin/env node

import * as p from '@clack/prompts';
import { cli } from 'cli-forge';
import isMain from 'es-main';

import { resolve } from 'node:path';

import {
  enumerateIgnored,
  enumerateUntracked,
  hasTrackedChanges,
  isInsideWorkTree,
  reset as gitReset,
} from './git.js';
import {
  flagsForPlan,
  hasActionFlags,
  planFromFlags,
  selectTargets,
  type CliFlags,
  type Plan,
} from './plan.js';
import { promptForPlan } from './prompts.js';
import { countFiles, DEFAULT_CONCURRENCY, removeAll } from './remove.js';
import { renderTree } from './tree.js';

// Bump the libuv threadpool before any fs work so the fan-out `fs.rm` actually
// runs in parallel — the default of 4 threads would otherwise cap it.
process.env.UV_THREADPOOL_SIZE ||= String(DEFAULT_CONCURRENCY);

/** Flags accepted by {@link run}: plan actions plus run modifiers. */
export interface RunFlags extends CliFlags {
  yes?: boolean;
  dryRun?: boolean;
  cwd?: string;
}

function enumerate(plan: Plan, cwd: string): string[] {
  return selectTargets(plan, {
    untracked: plan.untracked ? enumerateUntracked(cwd) : [],
    ignored: plan.ignored ? enumerateIgnored(cwd) : [],
  });
}

/**
 * Machine-readable dry run: target paths to **stdout**, one per line, and
 * nothing else — ready to pipe into `xargs`, `fzf`, etc. Human-facing context
 * goes to stderr. Always non-interactive (the plan comes from flags only).
 */
function emitDryRun(plan: Plan, cwd: string, flags: RunFlags): void {
  const targets = enumerate(plan, cwd);

  if (targets.length > 0) {
    process.stdout.write(targets.join('\n') + '\n');
  }

  if (plan.reset) {
    process.stderr.write(`reset ${plan.reset}: tracked files\n`);
  }
  if (targets.length === 0 && !plan.reset) {
    process.stderr.write(
      'pristine: nothing selected (pass --untracked, --ignored, and/or --reset)\n'
    );
    return;
  }
  const rerun = ['pristine', ...flagsForPlan(plan)];
  if (flags.cwd) {
    rerun.push('--cwd', flags.cwd);
  }
  rerun.push('--yes');
  process.stderr.write(
    `${targets.length} path(s); apply with: ${rerun.join(' ')}\n`
  );
}

/** Render the human preview of what will be removed, as a tree with file counts. */
async function showPreview(
  plan: Plan,
  targets: string[],
  cwd: string
): Promise<void> {
  const counts = new Map<string, number>();
  await Promise.all(
    targets
      .filter((target) => target.endsWith('/'))
      .map(async (target) => {
        counts.set(target, await countFiles(resolve(cwd, target)));
      })
  );
  const tree = renderTree(targets, (target) => counts.get(target));
  const lines = plan.reset
    ? [`Reset tracked files (${plan.reset})`, ...tree]
    : tree;
  p.note(lines.join('\n'), 'Would remove');
}

/**
 * Execute one run: resolve a plan (from flags or interactive prompts),
 * enumerate targets, confirm, then reset tracked files and fan-out remove.
 */
export async function run(flags: RunFlags): Promise<void> {
  const cwd = resolve(flags.cwd ?? process.cwd());

  if (!isInsideWorkTree(cwd)) {
    process.stderr.write(`pristine: not inside a git work tree: ${cwd}\n`);
    process.exitCode = 1;
    return;
  }

  // --dry-run is always non-interactive and writes a clean path list to stdout.
  if (flags.dryRun) {
    emitDryRun(planFromFlags(flags), cwd, flags);
    return;
  }

  p.intro('pristine');

  const plan = hasActionFlags(flags)
    ? planFromFlags(flags)
    : await promptForPlan({ hasTrackedChanges: hasTrackedChanges(cwd) });

  const targets = enumerate(plan, cwd);

  if (!plan.reset && targets.length === 0) {
    p.outro('Nothing to do.');
    return;
  }

  if (!flags.yes) {
    await showPreview(plan, targets, cwd);
    const proceed = await p.confirm({ message: 'Proceed?', initialValue: false });
    if (p.isCancel(proceed) || !proceed) {
      p.cancel('Aborted.');
      return;
    }
  }

  if (plan.reset) {
    gitReset(cwd, plan.reset);
    p.log.success(`Reset tracked files (${plan.reset}).`);
  }

  if (targets.length > 0) {
    const spinner = p.spinner();
    spinner.start('Removing…');
    const result = await removeAll(targets, {
      cwd,
      onProgress: (done, total) => spinner.message(`Removing… ${done}/${total}`),
    });
    if (result.failures.length > 0) {
      spinner.stop(`Removed ${result.removed}, ${result.failures.length} failed.`);
      for (const failure of result.failures) {
        p.log.error(`${failure.path}: ${failure.error.message}`);
      }
      process.exitCode = 1;
    } else {
      spinner.stop(`Removed ${result.removed} item(s).`);
    }
  }

  p.outro('Done.');
}

const pristineCLI = cli('pristine', {
  description: 'Fast, git-aware replacement for `git clean -fdx`.',
  builder: (args) =>
    args
      .option('reset', {
        type: 'string',
        choices: ['hard', 'worktree'],
        description: 'Discard changes to tracked files first (hard | worktree)',
      })
      .option('untracked', {
        type: 'boolean',
        description: 'Remove untracked files',
      })
      .option('ignored', {
        type: 'boolean',
        description: 'Remove ignored files',
      })
      .option('nodeModules', {
        type: 'boolean',
        description: 'Include vendor dirs (node_modules) within ignored removal',
      })
      .option('env', {
        type: 'boolean',
        description: 'Include *.env* files within ignored removal',
      })
      .option('yes', {
        type: 'boolean',
        alias: ['y'],
        description: 'Skip the final confirmation',
      })
      .option('dryRun', {
        type: 'boolean',
        description:
          'Print the paths that would be removed to stdout (one per line); never prompts',
      })
      .option('cwd', {
        type: 'string',
        description: 'Directory to operate on (default: current directory)',
      }),
  handler: async (opts) => {
    await run(opts as RunFlags);
  },
}).strict();

export default pristineCLI;

if (isMain(import.meta)) {
  pristineCLI.forge();
}
