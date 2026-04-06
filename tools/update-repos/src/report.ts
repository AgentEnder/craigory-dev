import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  writeFileSync,
} from 'node:fs';
import { join, dirname } from 'node:path';
import { homedir } from 'node:os';
import { h1, h2, table, unorderedList } from 'markdown-factory';

import type { RepoState } from './select.js';
import { todayString } from './utils.js';

export const CONFIG_DIR = join(homedir(), '.config', 'update-repos');

export interface RepoResult {
  name: string;
  remoteUrl: string;
  status: 'success' | 'failure' | 'skipped';
  nxMigrated?: { oldVersion: string; newVersion: string } | null;
  auditFixed: boolean;
  prUrl?: string;
  /** URL the user can visit to manually create a PR (when gh pr create fails) */
  manualPrUrl?: string;
  error?: string;
}

type SuccessRow = {
  name: string;
  nxMigrated: string;
  auditFixed: string;
  pr: string;
};

/**
 * Generate markdown + HTML + JSON reports and update persisted state.
 */
export function generateReport(
  results: RepoResult[],
  state: RepoState
): { markdownPath: string; htmlPath: string; statePath: string } {
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
            pr: r.prUrl
              ? r.prUrl
              : r.manualPrUrl
              ? `[create PR](${r.manualPrUrl})`
              : '—',
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

  // Repos that pushed successfully but failed to create a PR
  const needsManualPr = results.filter(
    (r) => r.status === 'success' && !r.prUrl && r.manualPrUrl
  );
  if (needsManualPr.length > 0) {
    sections.push(
      h2(
        `Needs Manual PR (${needsManualPr.length})`,
        unorderedList(
          needsManualPr.map((r) => `[\`${r.name}\`](${r.manualPrUrl})`)
        )
      )
    );
  }

  if (failed.length > 0) {
    sections.push(
      h2(
        `Failures (${failed.length})`,
        unorderedList(
          failed.map((r) => `\`${r.name}\` — ${r.error ?? 'unknown error'}`)
        )
      )
    );
  }

  if (skipped.length > 0) {
    sections.push(
      h2(
        `Skipped (${skipped.length})`,
        unorderedList(
          skipped.map((r) => `\`${r.name}\` — ${r.error ?? 'skipped'}`)
        )
      )
    );
  }

  const markdown = h1(`Update Report — ${today}`, ...sections);

  const markdownPath = join(CONFIG_DIR, `report-${today}.md`);
  const statePath = join(CONFIG_DIR, 'state.json');

  writeFileSync(markdownPath, markdown);
  writeFileSync(statePath, JSON.stringify(state, null, 2));

  // Save full report data as JSON for later re-use (e.g. `view` command)
  const reportDataPath = join(CONFIG_DIR, `report-${today}.json`);
  const reportData = {
    date: today,
    results: results.map((r) => ({
      name: r.name,
      remoteUrl: r.remoteUrl,
      status: r.status,
      nxMigrated: r.nxMigrated ?? null,
      auditFixed: r.auditFixed,
      prUrl: r.prUrl,
      manualPrUrl: r.manualPrUrl,
      error: r.error,
    })),
    generatedAt: new Date().toISOString(),
  };
  writeFileSync(reportDataPath, JSON.stringify(reportData, null, 2));

  // Generate HTML report by injecting data into the pre-built React template
  const htmlPath = generateHtmlFromData(reportData, today);

  return { markdownPath, htmlPath, statePath };
}

function getTemplatePath(): string {
  return join(
    dirname(new URL(import.meta.url).pathname),
    '..',
    'report-viewer',
    'dist',
    'index.html'
  );
}

/**
 * Inject report data into the pre-built React template and write the HTML file.
 * Returns the output path (always set, even if writing failed).
 */
function generateHtmlFromData(
  reportData: { date: string; results: unknown[]; generatedAt: string },
  date: string
): string {
  const htmlPath = join(CONFIG_DIR, `report-${date}.html`);
  try {
    const template = readFileSync(getTemplatePath(), 'utf-8');
    const html = template.replace(
      '__REPORT_DATA__',
      JSON.stringify(reportData)
    );
    writeFileSync(htmlPath, html);
  } catch {
    // Template not built yet — skip HTML report silently
  }
  return htmlPath;
}

/**
 * Generate (or regenerate) an HTML report from an existing report JSON file.
 * If no date is given, uses the most recent report.
 */
export function generateHtmlFromExistingReport(date?: string): {
  htmlPath: string;
  date: string;
} {
  mkdirSync(CONFIG_DIR, { recursive: true });

  const resolvedDate = date ?? getAvailableReportDates()[0];
  if (!resolvedDate) {
    throw new Error(`No report JSON files found in ${CONFIG_DIR}`);
  }

  const jsonPath = join(CONFIG_DIR, `report-${resolvedDate}.json`);
  if (!existsSync(jsonPath)) {
    throw new Error(`Report not found: ${jsonPath}`);
  }

  const templatePath = getTemplatePath();
  if (!existsSync(templatePath)) {
    throw new Error(
      `Report viewer template not built. Run: nx run update-repos:build-report-viewer`
    );
  }

  const reportData = JSON.parse(readFileSync(jsonPath, 'utf-8'));
  const htmlPath = generateHtmlFromData(reportData, resolvedDate);
  return { htmlPath, date: resolvedDate };
}

/**
 * Return all available report dates, most recent first.
 */
export function getAvailableReportDates(): string[] {
  if (!existsSync(CONFIG_DIR)) return [];
  return readdirSync(CONFIG_DIR)
    .filter((f) => f.startsWith('report-') && f.endsWith('.json'))
    .sort()
    .reverse()
    .map((f) => f.replace('report-', '').replace('.json', ''));
}
