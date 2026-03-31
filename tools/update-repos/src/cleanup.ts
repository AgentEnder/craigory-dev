import { existsSync, readdirSync } from 'node:fs';
import * as p from '@clack/prompts';

import type { DiscoveredRepo } from './discover.js';
import { logger } from './logger.js';
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
 * Get the main worktree path for a repo (the original clone location).
 */
function getMainWorktreePath(repoPath: string): string | null {
  try {
    const output = execSilent('git worktree list --porcelain', repoPath);
    // First worktree entry is always the main worktree
    for (const line of output.split('\n')) {
      if (line.startsWith('worktree ')) {
        return line.replace('worktree ', '');
      }
    }
  } catch {
    // Fallback
  }
  return null;
}

/**
 * Find any worktree that has `branch` checked out.
 * Returns { path, isMain } or null if none.
 */
function findWorktreeForBranch(
  repoPath: string,
  branch: string
): { path: string; isMain: boolean } | null {
  const mainPath = getMainWorktreePath(repoPath);
  try {
    const output = execSilent('git worktree list --porcelain', repoPath);
    let currentPath: string | null = null;
    for (const line of output.split('\n')) {
      if (line.startsWith('worktree ')) {
        currentPath = line.replace('worktree ', '');
      }
      if (line.startsWith('branch ') && currentPath) {
        const ref = line.replace('branch ', '');
        if (ref === `refs/heads/${branch}`) {
          return {
            path: currentPath,
            isMain: currentPath === mainPath,
          };
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
 * If the branch is checked out in a worktree:
 *   - Secondary worktree: remove the worktree first
 *   - Main worktree: switch it back to the default branch first
 */
function deleteBranch(
  repoPath: string,
  branch: string,
  defaultBranch: string
): { deleted: string[]; errors: string[] } {
  const deleted: string[] = [];
  const errors: string[] = [];

  logger.step(`Deleting branch: ${branch}`);

  // Handle worktree that has this branch checked out
  const wt = findWorktreeForBranch(repoPath, branch);
  if (wt) {
    if (wt.isMain) {
      // Main worktree — switch it to the default branch, don't remove it
      const cmd = `git checkout ${defaultBranch}`;
      logger.info(`Main worktree ${wt.path} has ${branch} checked out, switching: ${cmd}`);
      try {
        execSilent(cmd, wt.path);
        p.log.info(`Switched ${wt.path} to ${defaultBranch}`);
        logger.info(`Switched ${wt.path} to ${defaultBranch}`);
      } catch (e) {
        const msg = `Failed to switch ${wt.path} to ${defaultBranch}: ${e instanceof Error ? e.message : String(e)}`;
        errors.push(msg);
        logger.error(msg);
        return { deleted, errors };
      }
    } else {
      // Secondary worktree — remove it
      const cmd = `git worktree remove --force ${wt.path}`;
      logger.info(`Removing worktree: ${cmd}`);
      try {
        execSilent(cmd, repoPath);
        deleted.push(`worktree ${wt.path}`);
        logger.info(`Removed worktree ${wt.path}`);
      } catch (e) {
        const msg = `Failed to remove worktree ${wt.path}: ${e instanceof Error ? e.message : String(e)}`;
        errors.push(msg);
        logger.error(msg);
        return { deleted, errors };
      }
    }
  }

  if (hasRemoteBranch(repoPath, branch)) {
    const cmd = `git push origin --delete ${branch}`;
    logger.info(`Deleting remote: ${cmd}`);
    try {
      execSilent(cmd, repoPath);
      deleted.push(`origin/${branch}`);
      logger.info(`Deleted origin/${branch}`);
    } catch (e) {
      const msg = `Failed to delete origin/${branch}: ${e instanceof Error ? e.message : String(e)}`;
      errors.push(msg);
      logger.error(msg);
    }
  } else {
    logger.info(`No remote branch origin/${branch}`);
  }

  if (hasLocalBranch(repoPath, branch)) {
    const cmd = `git branch -D ${branch}`;
    logger.info(`Deleting local: ${cmd}`);
    try {
      execSilent(cmd, repoPath);
      deleted.push(branch);
      logger.info(`Deleted local ${branch}`);
    } catch (e) {
      const msg = `Failed to delete local ${branch}: ${e instanceof Error ? e.message : String(e)}`;
      errors.push(msg);
      logger.error(msg);
    }
  } else {
    logger.info(`No local branch ${branch}`);
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
 * Returns true if completed, false if cancelled by user.
 */
export async function cleanupRepos(
  repos: DiscoveredRepo[]
): Promise<boolean> {
  let totalDeleted = 0;
  let totalErrors = 0;

  // --- Worktree cleanup ---
  const worktrees = findWorktrees();
  logger.info(`Found ${worktrees.length} worktrees in ${WORKTREE_DIR}`);
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
        logger.info('Cleanup cancelled by user (worktree prompt)');
        p.cancel('Cleanup cancelled');
        return false;
      }

      if (answer) {
        logger.info(`Removing worktree: ${cmd}`);
        try {
          execSilent(cmd, '/tmp');
          p.log.success(`Removed ${wt}`);
          logger.info(`Removed worktree ${wt}`);
          totalDeleted++;
        } catch (e) {
          const msg = e instanceof Error ? e.message : String(e);
          p.log.error(`Failed: ${msg}`);
          logger.error(`Failed to remove ${wt}: ${msg}`);
          totalErrors++;
        }
      } else {
        logger.info(`Skipped worktree ${wt}`);
      }
    }
  }

  // --- Branch cleanup per repo ---
  for (const repo of repos) {
    logger.step(`--- Cleanup: ${repo.name} ---`);
    const fetchSpinner = p.spinner();
    fetchSpinner.start(`Fetching ${repo.name}...`);
    try {
      execSilent('git fetch --prune origin', repo.path);
      fetchSpinner.stop(`Fetched ${repo.name}`);
    } catch {
      fetchSpinner.stop(`Failed to fetch ${repo.name}`);
      logger.warn(`Failed to fetch ${repo.name}, skipping`);
      continue;
    }

    const branches = findUpdateBranches(repo.path);
    logger.info(`${repo.name}: found ${branches.length} update branches: ${branches.join(', ') || '(none)'}`);
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
      logger.info(`Cleanup cancelled by user (branch select for ${repo.name})`);
      p.cancel('Cleanup cancelled');
      return false;
    }

    const toDelete = selected as string[];
    const skippedBranches = branches.filter((b) => !toDelete.includes(b));
    logger.info(`${repo.name}: selected ${toDelete.length} for deletion: ${toDelete.join(', ')}`);
    if (skippedBranches.length > 0) {
      logger.info(`${repo.name}: skipped: ${skippedBranches.join(', ')}`);
    }

    for (const branch of toDelete) {
      const { deleted, errors } = deleteBranch(
        repo.path,
        branch,
        repo.defaultBranch
      );
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

  const summary = totalDeleted === 0 && totalErrors === 0
    ? 'Nothing to clean up'
    : `Done: deleted ${totalDeleted} item(s)${totalErrors > 0 ? `, ${totalErrors} error(s)` : ''}`;
  p.log.info(summary);
  logger.info(summary);

  return true;
}
