import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { homedir } from 'node:os';
import * as p from '@clack/prompts';

import type { DiscoveredRepo } from './discover.js';

const CONFIG_DIR = join(homedir(), '.config', 'update-repos');
const STATE_FILE = join(CONFIG_DIR, 'state.json');

export interface RepoState {
  /** Normalized URL -> last known local path */
  discoveredRepos: Record<string, string>;
  /** Normalized URLs that were selected in the last run */
  selectedRepos: string[];
  /** Per-repo status from last run */
  repoResults: Record<
    string,
    {
      status: 'success' | 'failure' | 'skipped';
      prUrl?: string;
      error?: string;
      lastRun?: string;
    }
  >;
  /** ISO timestamp of last run */
  lastRun?: string;
}

export function loadState(): RepoState {
  if (existsSync(STATE_FILE)) {
    try {
      return JSON.parse(readFileSync(STATE_FILE, 'utf-8'));
    } catch {
      // Corrupt state file, start fresh
    }
  }
  return {
    discoveredRepos: {},
    selectedRepos: [],
    repoResults: {},
  };
}

export function saveState(state: RepoState): void {
  mkdirSync(CONFIG_DIR, { recursive: true });
  writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
}

/**
 * Present a clack multiselect for the user to choose which repos to update.
 * Pre-selects repos that were selected in the previous run.
 */
export async function selectRepos(
  repos: DiscoveredRepo[],
  state: RepoState
): Promise<DiscoveredRepo[]> {
  const previouslySelected = new Set(state.selectedRepos);

  const selected = await p.multiselect({
    message: `Select repos to update (${repos.length} found):`,
    options: repos.map((repo) => {
      const lastResult = state.repoResults[repo.remoteUrl];
      let hint = repo.remoteUrl;
      if (lastResult) {
        const icon =
          lastResult.status === 'success'
            ? '✅'
            : lastResult.status === 'failure'
              ? '❌'
              : '⏭️';
        hint = `${icon} ${hint}`;
        if (lastResult.lastRun) {
          hint += ` (last: ${lastResult.lastRun.split('T')[0]})`;
        }
      }
      return {
        value: repo.remoteUrl,
        label: repo.name,
        hint,
      };
    }),
    initialValues: repos
      .filter((r) => previouslySelected.has(r.remoteUrl))
      .map((r) => r.remoteUrl),
  });

  if (p.isCancel(selected)) {
    p.cancel('Cancelled');
    process.exit(0);
  }

  const selectedUrls = new Set(selected as string[]);

  // Update state with new discovery + selection
  for (const repo of repos) {
    state.discoveredRepos[repo.remoteUrl] = repo.path;
  }
  state.selectedRepos = [...selectedUrls];
  saveState(state);

  return repos.filter((r) => selectedUrls.has(r.remoteUrl));
}
