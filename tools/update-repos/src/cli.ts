#!/usr/bin/env node

import * as p from '@clack/prompts';
import { cli } from 'cli-forge';
import { homedir } from 'node:os';
import { join } from 'node:path';

import { detailView } from './display.js';
import { discoverRepos } from './discover.js';
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
    // Install stdin proxy before any clack prompts.
    // This replaces process.stdin with a PassThrough so we can
    // intercept spacebar for the detail view toggle.
    detailView.install();

    p.updateSettings({
      aliases: { k: 'up', j: 'down', h: 'left', l: 'right', '\x03': 'cancel' },
    });
    p.intro('update-repos');

    // 1. Discover repos
    const s = p.spinner();
    s.start('Discovering repos...');
    const repos = discoverRepos(args.reposDir);
    s.stop(`Found ${repos.length} unique repos`);

    if (repos.length === 0) {
      p.outro('No repos found.');
      return;
    }

    // 2. Select repos
    const state = loadState();
    const selected = await selectRepos(repos, state);

    if (selected.length === 0) {
      p.outro('No repos selected.');
      return;
    }

    p.log.info(`Updating ${selected.length} repo(s)...`);
    if (process.stdin.isTTY) {
      p.log.message(
        '\x1b[2mpress Space/Enter/Esc during commands to view full output\x1b[0m'
      );
    }

    // 3. Update each repo sequentially
    const results: RepoResult[] = [];
    for (const repo of selected) {
      p.log.step(`\n━━━ ${repo.name} ━━━`);
      const result = await updateRepo(repo, {
        aiAgent: args.aiAgent,
        dryRun: args.dryRun,
      });
      results.push(result);
    }

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

    p.outro('Done!');
  },
});

export default updateReposCLI;

updateReposCLI.forge();
