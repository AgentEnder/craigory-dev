#!/usr/bin/env node

import { cli } from 'cli-forge';
import { homedir } from 'node:os';
import { join } from 'node:path';

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
    // Will be filled in as we implement each module
    console.log('update-repos', args);
  },
});

export default updateReposCLI;

updateReposCLI.forge();
