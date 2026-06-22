import * as p from '@clack/prompts';

import type { ResetMode } from './git.js';
import type { Plan } from './plan.js';

export interface PromptContext {
  /** Whether the repo currently has staged/unstaged changes to tracked files. */
  hasTrackedChanges: boolean;
}

/** Abort cleanly if the user cancels a prompt (Ctrl-C / Esc). */
function bail<T>(value: T | symbol): T {
  if (p.isCancel(value)) {
    p.cancel('Cancelled.');
    process.exit(0);
  }
  return value as T;
}

async function confirm(message: string, initialValue: boolean): Promise<boolean> {
  return bail(await p.confirm({ message, initialValue }));
}

/**
 * Run the cascading interactive flow, returning a fully-resolved {@link Plan}.
 * The reset question is only asked when there are tracked changes to discard.
 */
export async function promptForPlan(ctx: PromptContext): Promise<Plan> {
  let reset: ResetMode | null = null;
  if (ctx.hasTrackedChanges) {
    const choice = bail(
      await p.select<ResetMode | 'none'>({
        message: 'Reset changed (tracked) files?',
        options: [
          { value: 'none', label: 'No, leave my changes' },
          { value: 'worktree', label: 'Discard working-tree changes only' },
          { value: 'hard', label: 'Discard everything (hard reset)' },
        ],
        initialValue: 'none',
      })
    );
    reset = choice === 'none' ? null : choice;
  }

  const untracked = await confirm('Remove untracked files?', true);
  const ignored = await confirm('Remove ignored files?', false);

  let vendor = false;
  let env = false;
  if (ignored) {
    vendor = await confirm('Include vendor dirs (node_modules)?', false);
    env = await confirm('Include env files (*.env*)?', false);
  }

  return { reset, untracked, ignored, vendor, env };
}
