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
  describePlan,
  flagsForPlan,
  hasActionFlags,
  planFromFlags,
  selectTargets,
  type CliFlags,
  type Plan,
} from './plan.js';
import { promptForPlan } from './prompts.js';
import { countFiles, DEFAULT_CONCURRENCY, removeAll } from './remove.js';

// Bump the libuv threadpool before any fs work so the fan-out `fs.rm` actually
// runs in parallel — the default of 4 threads would otherwise cap it.
process.env.UV_THREADPOOL_SIZE ||= String(DEFAULT_CONCURRENCY);

/** Flags accepted by {@link run}: plan actions plus run modifiers. */
export interface RunFlags extends CliFlags {
  yes?: boolean;
  dryRun?: boolean;
  cwd?: string;
}

function summarize(plan: Plan, targetCount: number): void {
  const lines = [`reset:     ${plan.reset ?? 'no'}`];
  if (plan.ignored) {
    const carve = [
      plan.vendor ? 'node_modules incl.' : 'node_modules excl.',
      plan.env ? '*.env* incl.' : '*.env* excl.',
    ].join(', ');
    lines.push(`ignored:   yes (${carve})`);
  }
  lines.push(`to remove: ${targetCount} entr${targetCount === 1 ? 'y' : 'ies'}`);
  p.note(lines.join('\n'), 'Plan');
}

/** List the actions a dry run would take, then how to apply them for real. */
async function reportDryRun(
  plan: Plan,
  targets: string[],
  cwd: string,
  flags: RunFlags
): Promise<void> {
  // Annotate directory entries with their recursive file count.
  const counts = new Map<string, number>();
  await Promise.all(
    targets
      .filter((target) => target.endsWith('/'))
      .map(async (target) => {
        counts.set(target, await countFiles(resolve(cwd, target)));
      })
  );
  const lines = describePlan(plan, targets, (target) => counts.get(target));
  p.note(lines.join('\n'), 'Dry run — would run');

  const rerun = ['pristine', ...flagsForPlan(plan)];
  if (flags.cwd) {
    rerun.push('--cwd', flags.cwd);
  }
  rerun.push('--yes');
  p.outro(`No changes made. Re-run to apply:\n  ${rerun.join(' ')}`);
}

/**
 * Execute one run: resolve a plan (from flags or interactive prompts),
 * enumerate targets, confirm, then reset tracked files and fan-out remove.
 */
export async function run(flags: RunFlags): Promise<void> {
  const cwd = resolve(flags.cwd ?? process.cwd());

  if (!isInsideWorkTree(cwd)) {
    p.log.error(`Not inside a git work tree: ${cwd}`);
    process.exitCode = 1;
    return;
  }

  p.intro('pristine');

  const plan = hasActionFlags(flags)
    ? planFromFlags(flags)
    : await promptForPlan({ hasTrackedChanges: hasTrackedChanges(cwd) });

  const enumeration = {
    untracked: plan.untracked ? enumerateUntracked(cwd) : [],
    ignored: plan.ignored ? enumerateIgnored(cwd) : [],
  };
  const targets = selectTargets(plan, enumeration);

  summarize(plan, targets.length);

  if (!plan.reset && targets.length === 0) {
    p.outro('Nothing to do.');
    return;
  }

  if (flags.dryRun) {
    await reportDryRun(plan, targets, cwd, flags);
    return;
  }

  if (!flags.yes) {
    const choice = await p.select<'apply' | 'dry' | 'cancel'>({
      message: 'Apply these changes?',
      options: [
        { value: 'apply', label: 'Yes, apply them' },
        { value: 'dry', label: 'Dry run — list what would happen' },
        { value: 'cancel', label: 'No, cancel' },
      ],
      initialValue: 'cancel',
    });
    if (p.isCancel(choice) || choice === 'cancel') {
      p.cancel('Aborted.');
      return;
    }
    if (choice === 'dry') {
      await reportDryRun(plan, targets, cwd, flags);
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
        description: 'Show the plan without removing anything',
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
