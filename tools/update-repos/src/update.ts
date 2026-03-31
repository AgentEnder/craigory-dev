import { basename } from 'node:path';
import * as p from '@clack/prompts';

import type { DiscoveredRepo } from './discover.js';
import type { RepoResult } from './report.js';
import {
  detectPackageManager,
  execWithOutput,
  execSilent,
  getInstallCommand,
  isClean,
  isNodeProject,
  isNxWorkspace,
  updateBranchName,
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

  execSilent(
    `git worktree add ${worktreePath} ${repo.defaultBranch}`,
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
 * Update a single repo: audit fix + nx migrate + push + PR.
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

    // Fetch latest
    p.log.step('Fetching latest...');
    await execWithOutput('git', ['fetch', 'origin'], { cwd: workDir });

    // Create update branch
    const branch = updateBranchName();
    p.log.step(`Creating branch ${branch}...`);
    try {
      execSilent(
        `git checkout -B ${branch} origin/${repo.defaultBranch}`,
        workDir
      );
    } catch {
      execSilent(`git checkout -B ${branch}`, workDir);
    }

    // Detect package manager and install
    const pm = detectPackageManager(workDir);
    p.log.step(`Package manager: ${pm}`);

    const [installCmd, installArgs] = getInstallCommand(pm);
    p.log.step('Installing dependencies...');
    await execWithOutput(installCmd, installArgs, { cwd: workDir });

    // Audit fix
    p.log.step('Fixing audit vulnerabilities...');
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

    // Nx migrate (if applicable)
    if (isNxWorkspace(workDir)) {
      p.log.step('Running Nx migration...');
      result.nxMigrated = await runNxMigrate(workDir, pm);
    }

    // Check if we actually have any changes vs the default branch
    try {
      execSilent(
        `git diff --quiet origin/${repo.defaultBranch}...HEAD`,
        workDir
      );
      // No diff means no changes
      p.log.info('No changes to push');
      result.status = 'skipped';
      result.error = 'no changes needed';
      return result;
    } catch {
      // There are changes — continue to push
    }

    // Push and create PR
    p.log.step('Pushing...');
    const pushResult = await execWithOutput(
      'git',
      ['push', '--force-with-lease', 'origin', branch],
      { cwd: workDir }
    );

    if (pushResult.exitCode !== 0) {
      result.status = 'failure';
      result.error = 'push failed (no access?)';
      return result;
    }

    // Create or update PR
    p.log.step('Creating PR...');
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

    const prResult = await execWithOutput(
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
        // PR creation failed for another reason
      }
    } else {
      const urlMatch = prResult.stdout.match(
        /https:\/\/github\.com\/[^\s]+/
      );
      if (urlMatch) {
        result.prUrl = urlMatch[0];
      }
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
