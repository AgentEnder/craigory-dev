import { existsSync, readdirSync } from 'node:fs';
import * as p from '@clack/prompts';

import type { DiscoveredRepo } from './discover.js';
import { execSilent } from './utils.js';

const WORKTREE_DIR = '/tmp/upgrade-worktrees';

/**
 * Find remote branches matching our update branch pattern
 * (chore/update-YYYY-MM-DD.N) for a given repo.
 */
function findUpdateBranches(repoPath: string): string[] {
  try {
    const refs = execSilent(
      'git branch -r --list "origin/chore/update-*"',
      repoPath
    );
    return refs
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.startsWith('origin/chore/update-'))
      .map((l) => l.replace('origin/', ''));
  } catch {
    return [];
  }
}

/**
 * Find local branches matching our update branch pattern.
 */
function findLocalUpdateBranches(repoPath: string): string[] {
  try {
    const refs = execSilent(
      'git branch --list "chore/update-*"',
      repoPath
    );
    return refs
      .split('\n')
      .map((l) => l.trim().replace(/^\* /, ''))
      .filter((l) => l.startsWith('chore/update-'));
  } catch {
    return [];
  }
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
 * Cleans up: remote branches, local branches, and worktrees.
 */
export async function cleanupRepos(
  repos: DiscoveredRepo[]
): Promise<void> {
  let totalDeleted = 0;
  let totalSkipped = 0;

  // --- Worktree cleanup ---
  const worktrees = findWorktrees();
  if (worktrees.length > 0) {
    p.log.step(
      `\n━━━ Worktrees (${worktrees.length} found in ${WORKTREE_DIR}) ━━━`
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
            `Failed to remove ${wt}: ${e instanceof Error ? e.message : String(e)}`
          );
          totalSkipped++;
        }
      } else {
        p.log.info(`Skipped ${wt}`);
        totalSkipped++;
      }
    }
  }

  // --- Branch cleanup per repo ---
  for (const repo of repos) {
    // Fetch to make sure we see all remote branches
    try {
      execSilent('git fetch --prune origin', repo.path);
    } catch {
      p.log.warn(`Failed to fetch ${repo.name}, skipping`);
      continue;
    }

    const remoteBranches = findUpdateBranches(repo.path);
    const localBranches = findLocalUpdateBranches(repo.path);
    const allBranches = [
      ...remoteBranches.map((b) => ({ name: b, type: 'remote' as const })),
      ...localBranches.map((b) => ({ name: b, type: 'local' as const })),
    ];

    if (allBranches.length === 0) {
      continue;
    }

    p.log.step(
      `\n━━━ ${repo.name} (${allBranches.length} update branches) ━━━`
    );

    for (const branch of allBranches) {
      const cmd =
        branch.type === 'remote'
          ? `git push origin --delete ${branch.name}`
          : `git branch -D ${branch.name}`;
      const label =
        branch.type === 'remote'
          ? `origin/${branch.name}`
          : `${branch.name} (local)`;

      p.log.message(`  Branch: \x1b[1m${label}\x1b[0m`);
      p.log.message(`  \x1b[2m$ ${cmd}\x1b[0m`);

      const answer = await p.confirm({
        message: `Delete ${label}?`,
        initialValue: true,
      });

      if (p.isCancel(answer)) {
        p.cancel('Cleanup cancelled');
        p.log.info(
          `Deleted ${totalDeleted} item(s), skipped ${totalSkipped}`
        );
        return;
      }

      if (answer) {
        try {
          execSilent(cmd, repo.path);
          p.log.success(`Deleted ${label}`);
          totalDeleted++;
        } catch (e) {
          p.log.error(
            `Failed to delete ${label}: ${e instanceof Error ? e.message : String(e)}`
          );
          totalSkipped++;
        }
      } else {
        p.log.info(`Skipped ${label}`);
        totalSkipped++;
      }
    }
  }

  if (totalDeleted === 0 && totalSkipped === 0) {
    p.log.info('Nothing to clean up');
  } else {
    p.log.info(
      `Done: deleted ${totalDeleted} item(s), skipped ${totalSkipped}`
    );
  }
}
