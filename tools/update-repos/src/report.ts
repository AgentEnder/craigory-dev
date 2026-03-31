import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { homedir } from 'node:os';
import { h1, h2, table, unorderedList } from 'markdown-factory';

import type { RepoState } from './select.js';
import { todayString } from './utils.js';

const CONFIG_DIR = join(homedir(), '.config', 'update-repos');

export interface RepoResult {
  name: string;
  remoteUrl: string;
  status: 'success' | 'failure' | 'skipped';
  nxMigrated?: { oldVersion: string; newVersion: string } | null;
  auditFixed: boolean;
  prUrl?: string;
  error?: string;
}

type SuccessRow = {
  name: string;
  nxMigrated: string;
  auditFixed: string;
  pr: string;
};

/**
 * Generate markdown + JSON reports and update persisted state.
 */
export function generateReport(
  results: RepoResult[],
  state: RepoState
): { markdownPath: string; statePath: string } {
  mkdirSync(CONFIG_DIR, { recursive: true });
  const today = todayString();

  // Update state with results
  state.lastRun = new Date().toISOString();
  for (const result of results) {
    state.repoResults[result.remoteUrl] = {
      status: result.status,
      prUrl: result.prUrl,
      error: result.error,
      lastRun: state.lastRun,
    };
  }

  // Generate markdown report
  const successful = results.filter((r) => r.status === 'success');
  const failed = results.filter((r) => r.status === 'failure');
  const skipped = results.filter((r) => r.status === 'skipped');

  const sections: string[] = [];

  if (successful.length > 0) {
    sections.push(
      h2(
        `Successful Updates (${successful.length})`,
        table<SuccessRow>(
          successful.map((r) => ({
            name: r.name,
            nxMigrated: r.nxMigrated
              ? `${r.nxMigrated.oldVersion} → ${r.nxMigrated.newVersion}`
              : '—',
            auditFixed: r.auditFixed ? 'Yes' : 'No',
            pr: r.prUrl ?? '—',
          })),
          [
            { label: 'Repo', field: 'name' },
            { label: 'Nx Migrated', field: 'nxMigrated' },
            { label: 'Audit Fixed', field: 'auditFixed' },
            { label: 'PR', field: 'pr' },
          ]
        )
      )
    );
  }

  if (failed.length > 0) {
    sections.push(
      h2(
        `Failures (${failed.length})`,
        unorderedList(
          failed.map(
            (r) => `\`${r.name}\` — ${r.error ?? 'unknown error'}`
          )
        )
      )
    );
  }

  if (skipped.length > 0) {
    sections.push(
      h2(
        `Skipped (${skipped.length})`,
        unorderedList(
          skipped.map(
            (r) => `\`${r.name}\` — ${r.error ?? 'skipped'}`
          )
        )
      )
    );
  }

  const markdown = h1(`Update Report — ${today}`, ...sections);

  const markdownPath = join(CONFIG_DIR, `report-${today}.md`);
  const statePath = join(CONFIG_DIR, 'state.json');

  writeFileSync(markdownPath, markdown);
  writeFileSync(statePath, JSON.stringify(state, null, 2));

  return { markdownPath, statePath };
}
