#!/usr/bin/env node

import * as p from '@clack/prompts';
import { cli } from 'cli-forge';
import { homedir } from 'node:os';
import { join } from 'node:path';

import { detailView } from './display.js';
import { discoverRepos } from './discover.js';
import { logger } from './logger.js';
import { generateReport, type RepoResult } from './report.js';
import { loadState, selectRepos } from './select.js';
import { updateRepo } from './update.js';

const updateReposCLI = cli('update-repos', {
  description:
    'Discover repos, migrate Nx, fix npm audit, and open PRs across all repos in a directory',
  builder: (args) =>
    args
      .option('aiAgent', {
        type: 'string',
        description: 'AI agent for audit fix: false, claude, or codex',
        default: 'claude',
      })
      .option('reposDir', {
        type: 'string',
        description: 'Base directory to scan for git repos',
        default: join(homedir(), 'repos'),
      })
      .option('dryRun', {
        type: 'boolean',
        description: 'Show what would happen without making changes',
        default: false,
      }),
  handler: async (args) => {
    // Initialize logger and stdin proxy before anything else
    logger.open();
    detailView.install();

    logger.info(`args: aiAgent=${args.aiAgent} reposDir=${args.reposDir} dryRun=${args.dryRun}`);

    // Track state for graceful shutdown
    const results: RepoResult[] = [];
    let currentRepo = '';
    let state = loadState();
    let shuttingDown = false;

    // Graceful shutdown handler
    const shutdown = (signal: string) => {
      if (shuttingDown) return;
      shuttingDown = true;

      logger.warn(`Received ${signal}, shutting down gracefully...`);

      // Leave alt screen if active
      detailView.stop();

      // Generate partial report if we have any results
      if (results.length > 0) {
        try {
          const { markdownPath } = generateReport(results, state);
          logger.info(`Partial report written to ${markdownPath}`);
          p.log.warn(`\nInterrupted! Partial report: ${markdownPath}`);
        } catch (e) {
          logger.error(`Failed to write partial report: ${e}`);
        }
      }

      if (currentRepo) {
        p.log.warn(`Was processing: ${currentRepo}`);
        logger.info(`Interrupted while processing: ${currentRepo}`);
      }

      p.log.info(`Log file: ${logger.logPath}`);
      logger.close(signal);

      process.exit(130);
    };

    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));

    p.updateSettings({
      aliases: {
        k: 'up',
        j: 'down',
        h: 'left',
        l: 'right',
        '\x03': 'cancel',
      },
    });
    p.intro('update-repos');

    // 1. Discover repos
    const s = p.spinner();
    s.start('Discovering repos...');
    const repos = discoverRepos(args.reposDir);
    s.stop(`Found ${repos.length} unique repos`);
    logger.info(`Discovered ${repos.length} unique repos in ${args.reposDir}`);

    if (repos.length === 0) {
      p.outro('No repos found.');
      logger.close('no repos found');
      return;
    }

    // 2. Select repos
    state = loadState();
    const selected = await selectRepos(repos, state);

    if (selected.length === 0) {
      p.outro('No repos selected.');
      logger.close('no repos selected');
      return;
    }

    logger.info(
      `Selected ${selected.length} repos: ${selected.map((r) => r.name).join(', ')}`
    );

    p.log.info(`Updating ${selected.length} repo(s)...`);
    if (process.stdin.isTTY) {
      p.log.message(
        '\x1b[2mpress Space/Enter/Esc during commands to view full output\x1b[0m'
      );
    }

    // 3. Update each repo sequentially
    for (const repo of selected) {
      currentRepo = repo.name;
      logger.info(`--- Starting: ${repo.name} (${repo.remoteUrl}) ---`);
      p.log.step(`\n━━━ ${repo.name} ━━━`);

      const result = await updateRepo(repo, {
        aiAgent: args.aiAgent,
        dryRun: args.dryRun,
      });

      results.push(result);
      logger.info(
        `--- Finished: ${repo.name} → ${result.status}${result.error ? ` (${result.error})` : ''}${result.prUrl ? ` PR: ${result.prUrl}` : ''} ---`
      );
    }
    currentRepo = '';

    // 4. Generate report
    const { markdownPath } = generateReport(results, state);

    // 5. Summary
    const succeeded = results.filter((r) => r.status === 'success').length;
    const failed = results.filter((r) => r.status === 'failure').length;
    const skipped = results.filter((r) => r.status === 'skipped').length;

    p.log.info(
      `Results: ${succeeded} success, ${failed} failed, ${skipped} skipped`
    );
    p.log.info(`Report: ${markdownPath}`);
    p.log.info(`Log: ${logger.logPath}`);

    logger.info(
      `Final: ${succeeded} success, ${failed} failed, ${skipped} skipped`
    );
    logger.close('completed');

    p.outro('Done!');
  },
});

export default updateReposCLI;

updateReposCLI.forge();
