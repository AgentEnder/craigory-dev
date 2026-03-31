#!/usr/bin/env node

import * as p from '@clack/prompts';
import { cli } from 'cli-forge';
import { homedir } from 'node:os';
import { join } from 'node:path';

import { cleanupRepos } from './cleanup.js';
import { detailView } from './display.js';
import { discoverRepos } from './discover.js';
import { logger } from './logger.js';
import { generateReport, type RepoResult } from './report.js';
import { loadState, selectRepos } from './select.js';
import { updateRepo } from './update.js';

function setupClack() {
  p.updateSettings({
    aliases: {
      k: 'up',
      j: 'down',
      h: 'left',
      l: 'right',
      '\x03': 'cancel',
    },
  });
}

const updateReposCLI = cli('update-repos', {
  description:
    'Discover repos, migrate Nx, fix npm audit, and open PRs across all repos in a directory',
  builder: (args) =>
    args
      .option('reposDir', {
        type: 'string',
        description: 'Base directory to scan for git repos',
        default: join(homedir(), 'repos'),
      })
      .command('update', {
        description: 'Update repos: migrate Nx, fix audit, open PRs',
        builder: (c) =>
          c
            .option('aiAgent', {
              type: 'string',
              description:
                'AI agent for audit fix: false, claude, or codex',
              default: 'claude',
            })
            .option('dryRun', {
              type: 'boolean',
              description:
                'Show what would happen without making changes',
              default: false,
            }),
        handler: async (opts) => {
          logger.open();
          detailView.install();
          setupClack();

          logger.info(
            `args: aiAgent=${opts.aiAgent} reposDir=${opts.reposDir} dryRun=${opts.dryRun}`
          );

          const results: RepoResult[] = [];
          let currentRepo = '';
          let state = loadState();
          let shuttingDown = false;

          const shutdown = (signal: string) => {
            if (shuttingDown) return;
            shuttingDown = true;

            logger.warn(
              `Received ${signal}, shutting down gracefully...`
            );
            detailView.stop();

            // Write directly to stderr to avoid clack spinner interference
            const write = (msg: string) => {
              process.stderr.write(`\n${msg}\n`);
              logger.info(msg);
            };

            // Mark the current repo as interrupted if it was in progress
            if (currentRepo) {
              const alreadyRecorded = results.some(
                (r) => r.name === currentRepo
              );
              if (!alreadyRecorded) {
                results.push({
                  name: currentRepo,
                  remoteUrl: '',
                  status: 'failure',
                  auditFixed: false,
                  error: `interrupted (${signal})`,
                });
              }
              write(`Was processing: ${currentRepo}`);
            }

            // Write partial report (even if empty — shows what was selected)
            try {
              const { markdownPath } = generateReport(
                results,
                state
              );
              write(`Partial report: ${markdownPath}`);
            } catch (e) {
              logger.error(
                `Failed to write partial report: ${e}`
              );
            }

            write(`Log file: ${logger.logPath}`);
            logger.close(signal);

            // Use setTimeout to let stdio flush before exiting
            setTimeout(() => process.exit(130), 50);
          };

          process.on('SIGINT', () => shutdown('SIGINT'));
          process.on('SIGTERM', () => shutdown('SIGTERM'));

          p.intro('update-repos');

          const s = p.spinner();
          s.start('Discovering repos...');
          const repos = discoverRepos(opts.reposDir);
          s.stop(`Found ${repos.length} unique repos`);
          logger.info(
            `Discovered ${repos.length} unique repos in ${opts.reposDir}`
          );

          if (repos.length === 0) {
            p.outro('No repos found.');
            logger.close('no repos found');
            return;
          }

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

          for (const repo of selected) {
            currentRepo = repo.name;
            logger.info(
              `--- Starting: ${repo.name} (${repo.remoteUrl}) ---`
            );
            p.log.step(`\n━━━ ${repo.name} ━━━`);

            const result = await updateRepo(repo, {
              aiAgent: opts.aiAgent,
              dryRun: opts.dryRun,
            });

            results.push(result);
            logger.info(
              `--- Finished: ${repo.name} → ${result.status}${result.error ? ` (${result.error})` : ''}${result.prUrl ? ` PR: ${result.prUrl}` : ''} ---`
            );
          }
          currentRepo = '';

          const { markdownPath } = generateReport(results, state);

          const succeeded = results.filter(
            (r) => r.status === 'success'
          ).length;
          const failed = results.filter(
            (r) => r.status === 'failure'
          ).length;
          const skipped = results.filter(
            (r) => r.status === 'skipped'
          ).length;

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
        alias: ['$0'],
      })
      .command('cleanup', {
        description:
          'Delete remote update branches (chore/update-*) with confirmation',
        builder: (c) => c,
        handler: async (opts) => {
          logger.open();
          detailView.install();
          setupClack();

          logger.info(`cleanup: reposDir=${opts.reposDir}`);

          process.on('SIGINT', () => {
            detailView.stop();
            process.stderr.write(`\nInterrupted! Log: ${logger.logPath}\n`);
            logger.close('SIGINT');
            setTimeout(() => process.exit(130), 50);
          });

          p.intro('update-repos cleanup');

          const s = p.spinner();
          s.start('Discovering repos...');
          const repos = discoverRepos(opts.reposDir);
          s.stop(`Found ${repos.length} unique repos`);
          logger.info(`Discovered ${repos.length} repos`);

          if (repos.length === 0) {
            p.outro('No repos found.');
            logger.close('no repos found');
            return;
          }

          const state = loadState();
          const selected = await selectRepos(repos, state);

          if (selected.length === 0) {
            p.outro('No repos selected.');
            logger.close('no repos selected');
            return;
          }

          logger.info(`Cleanup: ${selected.map((r) => r.name).join(', ')}`);
          const completed = await cleanupRepos(selected);

          if (completed) {
            logger.close('completed');
            p.outro('Cleanup complete!');
          } else {
            logger.close('cancelled');
          }
        },
      }),
});

export default updateReposCLI;

updateReposCLI.forge();
