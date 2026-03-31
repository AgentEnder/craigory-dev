import { basename } from 'node:path';
import * as p from '@clack/prompts';

import type { DiscoveredRepo } from './discover.js';
import type { RepoResult } from './report.js';
import {
  detectPackageManager,
  execQuiet,
  execSilent,
  getInstallCommand,
  isClean,
  isNodeProject,
  isNxWorkspace,
  nextUpdateBranchName,
} from './utils.js';
import { runNxMigrate } from './nx-migrate.js';
import { fixAudit } from './audit-fix.js';

interface UpdateOptions {
  aiAgent: string;
  dryRun: boolean;
}

/**
 * Prepare the working directory for a repo.
 * If clean, work in-place. Otherwise, create a worktree in /tmp.
 */
function prepareWorkDir(repo: DiscoveredRepo): {
  workDir: string;
  worktree: boolean;
} {
  if (isClean(repo.path)) {
    return { workDir: repo.path, worktree: false };
  }

  const worktreePath = `/tmp/upgrade-worktrees/${basename(repo.path)}`;
  p.log.warn(`Repo is dirty, creating worktree at ${worktreePath}`);

  try {
    execSilent(`git worktree remove --force ${worktreePath}`, repo.path);
  } catch {
    // Doesn't exist yet
  }

  // Use origin/<branch> to avoid "branch already checked out" errors —
  // the local branch name is in use by the main worktree, but the
  // remote tracking ref is always available as a detached HEAD target.
  execSilent(
    `git worktree add --detach ${worktreePath} origin/${repo.defaultBranch}`,
    repo.path
  );

  return { workDir: worktreePath, worktree: true };
}

/**
 * Clean up a worktree after update.
 */
function cleanupWorktree(repo: DiscoveredRepo, worktreePath: string): void {
  try {
    execSilent(`git worktree remove --force ${worktreePath}`, repo.path);
  } catch {
    p.log.warn(`Failed to clean up worktree at ${worktreePath}`);
  }
}

/**
 * Update a single repo: nx migrate first, then audit fix, then push + PR.
 * Nx migrate runs first because it changes dependency versions, and we want
 * the audit fix to run against the post-migration dependency state.
 */
export async function updateRepo(
  repo: DiscoveredRepo,
  options: UpdateOptions
): Promise<RepoResult> {
  const result: RepoResult = {
    name: repo.name,
    remoteUrl: repo.remoteUrl,
    status: 'skipped',
    auditFixed: false,
  };

  if (!isNodeProject(repo.path)) {
    result.error = 'not a Node.js project';
    return result;
  }

  const { workDir, worktree } = prepareWorkDir(repo);

  try {
    if (options.dryRun) {
      p.log.info(`[DRY RUN] Would update ${repo.name}`);
      result.status = 'skipped';
      result.error = 'dry run';
      return result;
    }

    // Setup phase: fetch, branch, install — single spinner
    const setupSpinner = p.spinner();
    setupSpinner.start('Fetching latest...');
    await execQuiet('git', ['fetch', 'origin'], { cwd: workDir });

    const branch = nextUpdateBranchName(workDir);
    setupSpinner.message(`Creating branch ${branch}...`);
    try {
      execSilent(
        `git checkout -B ${branch} origin/${repo.defaultBranch}`,
        workDir
      );
    } catch {
      execSilent(`git checkout -B ${branch}`, workDir);
    }

    const pm = detectPackageManager(workDir);
    setupSpinner.message(`Installing dependencies (${pm})...`);
    const [installCmd, installArgs] = getInstallCommand(pm);
    await execQuiet(installCmd, installArgs, { cwd: workDir });
    setupSpinner.stop(`Ready (${pm}, branch: ${branch})`);

    // Nx migrate first (if applicable) — changes dep versions
    if (isNxWorkspace(workDir)) {
      result.nxMigrated = await runNxMigrate(workDir, pm, options.aiAgent);
    }

    // Audit fix runs after Nx migrate so it sees post-migration deps
    result.auditFixed = await fixAudit(workDir, pm, options.aiAgent);
    if (result.auditFixed) {
      try {
        execSilent('git add -A', workDir);
        execSilent('git diff --cached --quiet', workDir);
      } catch {
        // There are staged changes — commit them
        execSilent(
          'git commit -m "fix: resolve npm audit vulnerabilities"',
          workDir
        );
      }
    }

    // Check if we actually have any changes vs the default branch
    try {
      execSilent(
        `git diff --quiet origin/${repo.defaultBranch}...HEAD`,
        workDir
      );
      p.log.info('No changes to push');
      result.status = 'skipped';
      result.error = 'no changes needed';
      return result;
    } catch {
      // There are changes — continue to push
    }

    // Push + PR phase — single spinner
    const prSpinner = p.spinner();
    prSpinner.start('Pushing...');
    const pushResult = await execQuiet(
      'git',
      ['push', '--force-with-lease', 'origin', branch],
      { cwd: workDir }
    );

    if (pushResult.exitCode !== 0) {
      prSpinner.stop('Push failed');
      result.status = 'failure';
      result.error = 'push failed (no access?)';
      return result;
    }

    prSpinner.message('Creating PR...');
    const prBody = [
      '## Automated Update',
      '',
      result.nxMigrated
        ? `- Nx migrated: ${result.nxMigrated.oldVersion} → ${result.nxMigrated.newVersion}`
        : '',
      result.auditFixed ? '- npm audit vulnerabilities fixed' : '',
    ]
      .filter(Boolean)
      .join('\n');

    const prResult = await execQuiet(
      'gh',
      [
        'pr',
        'create',
        '--title',
        `chore: automated dependency update ${new Date().toISOString().split('T')[0]}`,
        '--body',
        prBody,
        '--base',
        repo.defaultBranch,
        '--head',
        branch,
      ],
      { cwd: workDir }
    );

    if (prResult.exitCode !== 0) {
      // PR might already exist — try to get its URL
      try {
        const existingPr = execSilent(
          `gh pr view ${branch} --json url --jq .url`,
          workDir
        );
        result.prUrl = existingPr;
      } catch {
        // PR creation failed — build a manual create URL
        // Format: https://github.com/owner/repo/compare/base...head
        const compareUrl = `https://${repo.remoteUrl}/compare/${repo.defaultBranch}...${branch}?expand=1`;
        result.manualPrUrl = compareUrl;
        p.log.warn(
          `PR creation failed. Create manually: ${compareUrl}`
        );
      }
    } else {
      const urlMatch = prResult.stdout.match(
        /https:\/\/github\.com\/[^\s]+/
      );
      if (urlMatch) {
        result.prUrl = urlMatch[0];
      }
    }

    if (result.prUrl) {
      prSpinner.stop(`PR: ${result.prUrl}`);
    } else if (result.manualPrUrl) {
      prSpinner.stop('Pushed (PR creation failed — see link above)');
    } else {
      prSpinner.stop('Pushed');
    }
    result.status = 'success';
    p.log.success(`Updated ${repo.name}`);
  } catch (e) {
    result.status = 'failure';
    result.error = e instanceof Error ? e.message : String(e);
    p.log.error(`Failed to update ${repo.name}: ${result.error}`);
  } finally {
    if (worktree) {
      cleanupWorktree(repo, workDir);
    }
  }

  return result;
}
