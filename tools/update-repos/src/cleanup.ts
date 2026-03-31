import { existsSync, readdirSync } from 'node:fs';
import * as p from '@clack/prompts';

import type { DiscoveredRepo } from './discover.js';
import { execSilent } from './utils.js';

const WORKTREE_DIR = '/tmp/upgrade-worktrees';

/**
 * Find all update branches (remote and local) for a repo.
 * Returns deduplicated branch names — deletion handles both
 * remote and local in lockstep.
 */
function findUpdateBranches(repoPath: string): string[] {
  const branches = new Set<string>();

  try {
    const remote = execSilent(
      'git branch -r --list "origin/chore/update-*"',
      repoPath
    );
    for (const line of remote.split('\n')) {
      const trimmed = line.trim();
      if (trimmed.startsWith('origin/chore/update-')) {
        branches.add(trimmed.replace('origin/', ''));
      }
    }
  } catch {
    // No remote branches
  }

  try {
    const local = execSilent(
      'git branch --list "chore/update-*"',
      repoPath
    );
    for (const line of local.split('\n')) {
      const trimmed = line.trim().replace(/^\* /, '');
      if (trimmed.startsWith('chore/update-')) {
        branches.add(trimmed);
      }
    }
  } catch {
    // No local branches
  }

  return [...branches].sort();
}

/**
 * Check if a remote branch exists.
 */
function hasRemoteBranch(repoPath: string, branch: string): boolean {
  try {
    execSilent(
      `git rev-parse --verify origin/${branch}`,
      repoPath
    );
    return true;
  } catch {
    return false;
  }
}

/**
 * Check if a local branch exists.
 */
function hasLocalBranch(repoPath: string, branch: string): boolean {
  try {
    execSilent(`git rev-parse --verify ${branch}`, repoPath);
    return true;
  } catch {
    return false;
  }
}

/**
 * Find any worktree that has `branch` checked out.
 * Returns the worktree path, or null if none.
 */
function findWorktreeForBranch(
  repoPath: string,
  branch: string
): string | null {
  try {
    const output = execSilent('git worktree list --porcelain', repoPath);
    let currentPath: string | null = null;
    for (const line of output.split('\n')) {
      if (line.startsWith('worktree ')) {
        currentPath = line.replace('worktree ', '');
      }
      if (line.startsWith('branch ') && currentPath) {
        const ref = line.replace('branch ', '');
        // ref is like refs/heads/chore/update-2026-03-31
        if (ref === `refs/heads/${branch}`) {
          return currentPath;
        }
      }
    }
  } catch {
    // git worktree list failed
  }
  return null;
}

/**
 * Delete a branch both locally and on the remote.
 * If the branch is checked out in a worktree, removes that worktree first.
 */
function deleteBranch(
  repoPath: string,
  branch: string
): { deleted: string[]; errors: string[] } {
  const deleted: string[] = [];
  const errors: string[] = [];

  // Remove any worktree holding this branch before deleting it
  const wtPath = findWorktreeForBranch(repoPath, branch);
  if (wtPath) {
    try {
      execSilent(`git worktree remove --force ${wtPath}`, repoPath);
      deleted.push(`worktree ${wtPath}`);
    } catch (e) {
      errors.push(
        `Failed to remove worktree ${wtPath}: ${e instanceof Error ? e.message : String(e)}`
      );
      // Don't attempt branch deletion — it will fail
      return { deleted, errors };
    }
  }

  if (hasRemoteBranch(repoPath, branch)) {
    try {
      execSilent(`git push origin --delete ${branch}`, repoPath);
      deleted.push(`origin/${branch}`);
    } catch (e) {
      errors.push(
        `Failed to delete origin/${branch}: ${e instanceof Error ? e.message : String(e)}`
      );
    }
  }

  if (hasLocalBranch(repoPath, branch)) {
    try {
      execSilent(`git branch -D ${branch}`, repoPath);
      deleted.push(branch);
    } catch (e) {
      errors.push(
        `Failed to delete local ${branch}: ${e instanceof Error ? e.message : String(e)}`
      );
    }
  }

  return { deleted, errors };
}

/**
 * Find worktrees created by our tool in /tmp/upgrade-worktrees/.
 */
function findWorktrees(): string[] {
  if (!existsSync(WORKTREE_DIR)) return [];
  try {
    return readdirSync(WORKTREE_DIR)
      .map((name) => `${WORKTREE_DIR}/${name}`)
      .filter((path) => existsSync(`${path}/.git`));
  } catch {
    return [];
  }
}

/**
 * Run the cleanup flow for a set of repos.
 * Cleans up: worktrees, then update branches (remote + local in lockstep).
 */
export async function cleanupRepos(
  repos: DiscoveredRepo[]
): Promise<void> {
  let totalDeleted = 0;
  let totalErrors = 0;

  // --- Worktree cleanup ---
  const worktrees = findWorktrees();
  if (worktrees.length > 0) {
    p.log.step(
      `\n━━━ Worktrees (${worktrees.length} in ${WORKTREE_DIR}) ━━━`
    );

    for (const wt of worktrees) {
      const cmd = `rm -rf ${wt}`;
      p.log.message(`  Worktree: \x1b[1m${wt}\x1b[0m`);
      p.log.message(`  \x1b[2m$ ${cmd}\x1b[0m`);

      const answer = await p.confirm({
        message: `Remove worktree ${wt}?`,
        initialValue: true,
      });

      if (p.isCancel(answer)) {
        p.cancel('Cleanup cancelled');
        return;
      }

      if (answer) {
        try {
          execSilent(cmd, '/tmp');
          p.log.success(`Removed ${wt}`);
          totalDeleted++;
        } catch (e) {
          p.log.error(
            `Failed: ${e instanceof Error ? e.message : String(e)}`
          );
          totalErrors++;
        }
      }
    }
  }

  // --- Branch cleanup per repo ---
  for (const repo of repos) {
    const fetchSpinner = p.spinner();
    fetchSpinner.start(`Fetching ${repo.name}...`);
    try {
      execSilent('git fetch --prune origin', repo.path);
      fetchSpinner.stop(`Fetched ${repo.name}`);
    } catch {
      fetchSpinner.stop(`Failed to fetch ${repo.name}`);
      continue;
    }

    const branches = findUpdateBranches(repo.path);
    if (branches.length === 0) {
      continue;
    }

    p.log.step(
      `\n━━━ ${repo.name} (${branches.length} update branches) ━━━`
    );

    // Show commands that will run for context
    for (const branch of branches) {
      p.log.message(
        `  \x1b[2m$ git push origin --delete ${branch}\x1b[0m`
      );
      p.log.message(
        `  \x1b[2m$ git branch -D ${branch}\x1b[0m`
      );
    }

    const selected = await p.multiselect({
      message: `Select branches to delete (remote + local):`,
      options: branches.map((b) => ({
        value: b,
        label: b,
      })),
      initialValues: branches,
    });

    if (p.isCancel(selected)) {
      p.cancel('Cleanup cancelled');
      p.log.info(
        `Deleted ${totalDeleted} item(s), ${totalErrors} error(s)`
      );
      return;
    }

    const toDelete = selected as string[];

    for (const branch of toDelete) {
      const { deleted, errors } = deleteBranch(repo.path, branch);
      for (const d of deleted) {
        p.log.success(`Deleted ${d}`);
        totalDeleted++;
      }
      for (const e of errors) {
        p.log.error(e);
        totalErrors++;
      }
    }

    const skipped = branches.length - toDelete.length;
    if (skipped > 0) {
      p.log.info(`Skipped ${skipped} branch(es)`);
    }
  }

  if (totalDeleted === 0 && totalErrors === 0) {
    p.log.info('Nothing to clean up');
  } else {
    p.log.info(
      `Done: deleted ${totalDeleted} item(s)${totalErrors > 0 ? `, ${totalErrors} error(s)` : ''}`
    );
  }
}
