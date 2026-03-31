# Update Repos Tool — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build an interactive CLI tool that discovers git repos in `~/repos`, lets the user select which to update, then opens PRs to migrate Nx and fix npm audit vulnerabilities using AI-assisted dependency resolution.

**Architecture:** A cli-forge CLI in `tools/update-repos/` with modular files for discovery, selection, update orchestration, audit fixing (with optional AI agent), Nx migration, and reporting. State persisted to `~/.config/update-repos/state.json`. Reports generated via markdown-factory.

**Tech Stack:** TypeScript, cli-forge, @clack/prompts, markdown-factory, tsx, gh CLI

---

### Task 1: Scaffold CLI entry point and project config

**Files:**
- Create: `tools/update-repos/src/cli.ts`
- Create: `tools/update-repos/project.json`

**Step 1: Create `tools/update-repos/project.json`**

```json
{
  "name": "update-repos",
  "targets": {
    "update-repos": {
      "executor": "nx:run-commands",
      "options": {
        "command": "tsx tools/update-repos/src/cli.ts"
      }
    }
  }
}
```

**Step 2: Create `tools/update-repos/src/cli.ts`**

```typescript
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
```

**Step 3: Verify it runs**

Run: `npx tsx tools/update-repos/src/cli.ts --help`
Expected: CLI help output showing the three options

**Step 4: Commit**

```bash
git add tools/update-repos/
git commit -m "feat(update-repos): scaffold CLI entry point and project config"
```

---

### Task 2: Implement repo discovery

**Files:**
- Create: `tools/update-repos/src/discover.ts`

**Step 1: Create `tools/update-repos/src/discover.ts`**

This module recursively walks a directory looking for `.git` folders, extracts remote URLs, and deduplicates by normalized URL.

```typescript
import { readdirSync, statSync, existsSync } from 'node:fs';
import { join, basename } from 'node:path';
import { execSync } from 'node:child_process';

export interface DiscoveredRepo {
  /** Absolute path to the repo root */
  path: string;
  /** Display name (derived from path) */
  name: string;
  /** Normalized remote URL for deduplication */
  remoteUrl: string;
  /** Raw remote URL as returned by git */
  rawRemoteUrl: string;
  /** Default branch (main or master) */
  defaultBranch: string;
}

/**
 * Normalize a git remote URL so SSH and HTTPS variants resolve to the same key.
 * e.g. git@github.com:foo/bar.git -> github.com/foo/bar
 *      https://github.com/foo/bar.git -> github.com/foo/bar
 */
export function normalizeRemoteUrl(url: string): string {
  let normalized = url.trim();

  // SSH: git@github.com:foo/bar.git -> github.com/foo/bar
  const sshMatch = normalized.match(/^git@([^:]+):(.+?)(?:\.git)?$/);
  if (sshMatch) {
    return `${sshMatch[1]}/${sshMatch[2]}`;
  }

  // HTTPS: https://github.com/foo/bar.git -> github.com/foo/bar
  const httpsMatch = normalized.match(
    /^https?:\/\/([^/]+)\/(.+?)(?:\.git)?$/
  );
  if (httpsMatch) {
    return `${httpsMatch[1]}/${httpsMatch[2]}`;
  }

  return normalized;
}

/**
 * Detect the default branch for a repo (main or master).
 */
function detectDefaultBranch(repoPath: string): string {
  try {
    const result = execSync(
      'git symbolic-ref refs/remotes/origin/HEAD 2>/dev/null || echo refs/remotes/origin/main',
      { cwd: repoPath, encoding: 'utf-8' }
    ).trim();
    return result.replace('refs/remotes/origin/', '');
  } catch {
    return 'main';
  }
}

/**
 * Recursively find all git repos under `rootDir` by looking for `.git` directories.
 * Deduplicates by normalized remote URL, keeping the first path found.
 */
export function discoverRepos(rootDir: string): DiscoveredRepo[] {
  const repos: DiscoveredRepo[] = [];
  const seenUrls = new Set<string>();

  function walk(dir: string): void {
    let entries: string[];
    try {
      entries = readdirSync(dir);
    } catch {
      return; // Permission denied, etc.
    }

    if (entries.includes('.git')) {
      // This is a git repo root — don't recurse deeper
      try {
        const rawUrl = execSync('git remote get-url origin', {
          cwd: dir,
          encoding: 'utf-8',
          stdio: ['pipe', 'pipe', 'pipe'],
        }).trim();

        const normalized = normalizeRemoteUrl(rawUrl);

        if (!seenUrls.has(normalized)) {
          seenUrls.add(normalized);
          repos.push({
            path: dir,
            name: dir.replace(rootDir + '/', ''),
            remoteUrl: normalized,
            rawRemoteUrl: rawUrl,
            defaultBranch: detectDefaultBranch(dir),
          });
        }
      } catch {
        // No remote — skip
      }
      return;
    }

    for (const entry of entries) {
      if (entry === 'node_modules' || entry === '.git' || entry === 'dist') {
        continue;
      }
      const fullPath = join(dir, entry);
      try {
        if (statSync(fullPath).isDirectory()) {
          walk(fullPath);
        }
      } catch {
        // Permission denied, broken symlink, etc.
      }
    }
  }

  walk(rootDir);
  return repos;
}
```

**Step 2: Verify discovery works**

Run: `npx tsx -e "import { discoverRepos } from './tools/update-repos/src/discover.js'; console.log(JSON.stringify(discoverRepos(require('os').homedir() + '/repos').slice(0, 3), null, 2))"`
Expected: JSON array with repo objects containing path, name, remoteUrl, etc.

**Step 3: Commit**

```bash
git add tools/update-repos/src/discover.ts
git commit -m "feat(update-repos): implement recursive repo discovery with URL deduplication"
```

---

### Task 3: Implement selection with config persistence

**Files:**
- Create: `tools/update-repos/src/select.ts`

**Step 1: Create `tools/update-repos/src/select.ts`**

```typescript
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
```

**Step 2: Commit**

```bash
git add tools/update-repos/src/select.ts
git commit -m "feat(update-repos): implement interactive repo selection with state persistence"
```

---

### Task 4: Implement shared utilities

**Files:**
- Create: `tools/update-repos/src/utils.ts`

**Step 1: Create `tools/update-repos/src/utils.ts`**

```typescript
import { spawn, execSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

export type PackageManager = 'npm' | 'yarn' | 'pnpm' | 'bun';

/**
 * Run a command with real-time stdout/stderr output.
 * Returns the exit code.
 */
export function execWithOutput(
  command: string,
  args: string[],
  options: { cwd: string; env?: NodeJS.ProcessEnv }
): Promise<{ exitCode: number; stdout: string; stderr: string }> {
  return new Promise((resolve) => {
    const proc = spawn(command, args, {
      cwd: options.cwd,
      env: options.env ?? process.env,
      stdio: ['inherit', 'pipe', 'pipe'],
    });

    let stdout = '';
    let stderr = '';

    proc.stdout.on('data', (data) => {
      stdout += data.toString();
      process.stdout.write(data);
    });

    proc.stderr.on('data', (data) => {
      stderr += data.toString();
      process.stderr.write(data);
    });

    proc.on('close', (code) => {
      resolve({ exitCode: code ?? 1, stdout, stderr });
    });
  });
}

/**
 * Run a command silently and return stdout.
 */
export function execSilent(
  command: string,
  cwd: string
): string {
  return execSync(command, {
    cwd,
    encoding: 'utf-8',
    stdio: ['pipe', 'pipe', 'pipe'],
  }).trim();
}

/**
 * Detect the package manager for a repo by checking lockfiles.
 */
export function detectPackageManager(repoPath: string): PackageManager {
  if (existsSync(join(repoPath, 'pnpm-lock.yaml'))) return 'pnpm';
  if (existsSync(join(repoPath, 'yarn.lock'))) return 'yarn';
  if (existsSync(join(repoPath, 'bun.lockb')) || existsSync(join(repoPath, 'bun.lock'))) return 'bun';
  if (existsSync(join(repoPath, 'package-lock.json'))) return 'npm';
  return 'npm';
}

/**
 * Get the install command for a package manager.
 */
export function getInstallCommand(pm: PackageManager): [string, string[]] {
  switch (pm) {
    case 'pnpm':
      return ['pnpm', ['install', '--no-frozen-lockfile']];
    case 'yarn':
      return ['yarn', ['install', '--no-immutable']];
    case 'bun':
      return ['bun', ['install', '--no-frozen-lockfile']];
    case 'npm':
      return ['npm', ['install']];
  }
}

/**
 * Get the audit command for a package manager.
 */
export function getAuditCommand(pm: PackageManager): [string, string[]] {
  switch (pm) {
    case 'pnpm':
      return ['pnpm', ['audit']];
    case 'yarn':
      return ['yarn', ['npm', 'audit']];
    case 'bun':
      return ['bun', ['audit']]; // bun doesn't have audit yet, but placeholder
    case 'npm':
      return ['npm', ['audit']];
  }
}

/**
 * Get the audit fix command for a package manager (non-AI path).
 */
export function getAuditFixCommand(pm: PackageManager): [string, string[]] {
  switch (pm) {
    case 'pnpm':
      return ['pnpm', ['audit', '--fix']];
    case 'yarn':
      return ['yarn', ['npm', 'audit', '--fix']]; // yarn berry
    case 'bun':
      return ['bun', ['audit', '--fix']];
    case 'npm':
      return ['npm', ['audit', 'fix']];
  }
}

/**
 * Check if a repo is an Nx workspace.
 */
export function isNxWorkspace(repoPath: string): boolean {
  if (existsSync(join(repoPath, 'nx.json'))) return true;
  try {
    const pkg = JSON.parse(
      execSilent(`cat package.json`, repoPath)
    );
    return !!(pkg.devDependencies?.nx || pkg.dependencies?.nx);
  } catch {
    return false;
  }
}

/**
 * Check if a repo has a package.json (is a Node.js project).
 */
export function isNodeProject(repoPath: string): boolean {
  return existsSync(join(repoPath, 'package.json'));
}

/**
 * Check if a repo's working tree is clean.
 */
export function isClean(repoPath: string): boolean {
  const status = execSilent('git status --porcelain', repoPath);
  return status.length === 0;
}

/**
 * Get today's date as YYYY-MM-DD.
 */
export function todayString(): string {
  return new Date().toISOString().split('T')[0];
}

/**
 * Branch name for today's update.
 */
export function updateBranchName(): string {
  return `chore/update-${todayString()}`;
}
```

**Step 2: Commit**

```bash
git add tools/update-repos/src/utils.ts
git commit -m "feat(update-repos): add shared utilities for exec, package manager detection, etc."
```

---

### Task 5: Implement Nx migration

**Files:**
- Create: `tools/update-repos/src/nx-migrate.ts`

**Step 1: Create `tools/update-repos/src/nx-migrate.ts`**

```typescript
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import * as p from '@clack/prompts';

import {
  type PackageManager,
  execWithOutput,
  execSilent,
} from './utils.js';

/**
 * Get the current Nx version from node_modules or package.json.
 */
function getNxVersion(repoPath: string): string | null {
  try {
    const pkgPath = join(repoPath, 'node_modules', 'nx', 'package.json');
    if (existsSync(pkgPath)) {
      const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));
      return pkg.version;
    }
    const rootPkg = JSON.parse(
      readFileSync(join(repoPath, 'package.json'), 'utf-8')
    );
    return rootPkg.devDependencies?.nx ?? rootPkg.dependencies?.nx ?? null;
  } catch {
    return null;
  }
}

/**
 * Run Nx migration on a repo.
 * Returns the old and new Nx versions, or null if migration was skipped.
 */
export async function runNxMigrate(
  repoPath: string,
  pm: PackageManager
): Promise<{ oldVersion: string; newVersion: string } | null> {
  const oldVersion = getNxVersion(repoPath) ?? 'unknown';
  p.log.step(`Current Nx version: ${oldVersion}`);

  // Run nx migrate latest
  const pmx = pm === 'pnpm' ? 'pnpm' : pm === 'yarn' ? 'yarn' : pm === 'bun' ? 'bunx' : 'npx';
  const migrateArgs =
    pmx === 'pnpm'
      ? ['nx', 'migrate', 'latest']
      : pmx === 'yarn'
        ? ['nx', 'migrate', 'latest']
        : pmx === 'bunx'
          ? ['nx', 'migrate', 'latest']
          : ['nx', 'migrate', 'latest'];

  p.log.step('Running nx migrate latest...');
  const migrateResult = await execWithOutput(pmx, migrateArgs, {
    cwd: repoPath,
  });

  if (migrateResult.exitCode !== 0) {
    p.log.error('nx migrate latest failed');
    return null;
  }

  // Install updated deps after migration updated package.json
  const installCmd = pm === 'pnpm' ? 'pnpm' : pm === 'yarn' ? 'yarn' : pm === 'bun' ? 'bun' : 'npm';
  const installArgs = pm === 'pnpm' ? ['install', '--no-frozen-lockfile'] : pm === 'yarn' ? ['install', '--no-immutable'] : ['install'];

  p.log.step('Installing updated dependencies...');
  await execWithOutput(installCmd, installArgs, { cwd: repoPath });

  // Run migrations if migrations.json was created
  const migrationsJson = join(repoPath, 'migrations.json');
  if (existsSync(migrationsJson)) {
    p.log.step('Running migrations...');
    await execWithOutput(pmx, ['nx', 'migrate', '--run-migrations', '--create-commits'], {
      cwd: repoPath,
    });
  }

  // Run post-nx-update script if it exists
  try {
    const pkg = JSON.parse(
      readFileSync(join(repoPath, 'package.json'), 'utf-8')
    );
    if (pkg.scripts?.['post-nx-update']) {
      p.log.step('Running post-nx-update script...');
      await execWithOutput(pm, ['run', 'post-nx-update'], { cwd: repoPath });
      execSilent('git add -A && git commit -m "chore: run post-nx-update"', repoPath);
    }
  } catch {
    // No post-update script or it failed — continue
  }

  // Reset Nx cache
  try {
    await execWithOutput(pmx, ['nx', 'reset'], { cwd: repoPath });
  } catch {
    // Non-critical
  }

  const newVersion = getNxVersion(repoPath) ?? 'unknown';
  p.log.success(`Nx migrated: ${oldVersion} → ${newVersion}`);

  return { oldVersion, newVersion };
}
```

**Step 2: Commit**

```bash
git add tools/update-repos/src/nx-migrate.ts
git commit -m "feat(update-repos): implement Nx migration logic"
```

---

### Task 6: Implement AI-driven audit fix

**Files:**
- Create: `tools/update-repos/src/audit-fix.ts`

**Step 1: Create `tools/update-repos/src/audit-fix.ts`**

```typescript
import * as p from '@clack/prompts';

import {
  type PackageManager,
  execWithOutput,
  getAuditCommand,
  getAuditFixCommand,
} from './utils.js';

const AI_AUDIT_PROMPT = `You are fixing npm audit vulnerabilities in this repository.

Rules:
1. PREFER upgrading/updating packages to compatible versions over adding resolutions or overrides
2. If a peer dependency indicates a newer major version is needed (e.g., "requires vite 8"), upgrade that package rather than overriding the peer dep
3. Run install and verify the audit output is cleaner after your changes
4. Do NOT add "resolutions", "overrides", or "pnpm.overrides" unless there is absolutely no other option
5. Commit your changes when done

The goal is to fix vulnerabilities AND keep dependencies up to date.`;

/**
 * Fix npm audit vulnerabilities, optionally using an AI agent.
 * Returns true if any changes were made.
 */
export async function fixAudit(
  repoPath: string,
  pm: PackageManager,
  aiAgent: string
): Promise<boolean> {
  // First, capture current audit output
  const [auditCmd, auditArgs] = getAuditCommand(pm);
  p.log.step('Running audit...');
  const auditResult = await execWithOutput(auditCmd, auditArgs, {
    cwd: repoPath,
  });

  const auditOutput = auditResult.stdout + auditResult.stderr;

  // If audit is clean, nothing to do
  if (auditResult.exitCode === 0) {
    p.log.success('No audit vulnerabilities found');
    return false;
  }

  if (aiAgent === 'false') {
    // Non-AI path: just run audit fix
    p.log.step('Running audit fix...');
    const [fixCmd, fixArgs] = getAuditFixCommand(pm);
    const fixResult = await execWithOutput(fixCmd, fixArgs, { cwd: repoPath });
    return fixResult.exitCode === 0;
  }

  // AI-driven path
  const agent = aiAgent === 'codex' ? 'codex' : 'claude';
  p.log.step(`Spawning ${agent} to fix audit vulnerabilities...`);

  const prompt = `${AI_AUDIT_PROMPT}

Here is the current audit output:

\`\`\`
${auditOutput}
\`\`\`

Fix these vulnerabilities now.`;

  if (agent === 'claude') {
    const result = await execWithOutput(
      'claude',
      ['-p', prompt, '--allowedTools', 'Bash,Read,Edit,Write'],
      { cwd: repoPath }
    );
    return result.exitCode === 0;
  } else {
    const result = await execWithOutput(
      'codex',
      ['--approval-mode', 'full-auto', '-q', prompt],
      { cwd: repoPath }
    );
    return result.exitCode === 0;
  }
}
```

**Step 2: Commit**

```bash
git add tools/update-repos/src/audit-fix.ts
git commit -m "feat(update-repos): implement AI-driven audit fix with claude/codex support"
```

---

### Task 7: Implement report generation

**Files:**
- Create: `tools/update-repos/src/report.ts`

**Step 1: Create `tools/update-repos/src/report.ts`**

```typescript
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

  type SuccessRow = {
    name: string;
    nxMigrated: string;
    auditFixed: string;
    pr: string;
  };

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
          failed.map((r) => `\`${r.name}\` — ${r.error ?? 'unknown error'}`)
        )
      )
    );
  }

  if (skipped.length > 0) {
    sections.push(
      h2(
        `Skipped (${skipped.length})`,
        unorderedList(skipped.map((r) => `\`${r.name}\` — ${r.error ?? 'skipped'}`))
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
```

**Step 2: Commit**

```bash
git add tools/update-repos/src/report.ts
git commit -m "feat(update-repos): implement markdown + JSON report generation"
```

---

### Task 8: Implement update orchestrator

**Files:**
- Create: `tools/update-repos/src/update.ts`

**Step 1: Create `tools/update-repos/src/update.ts`**

```typescript
import { existsSync } from 'node:fs';
import { join, basename } from 'node:path';
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
 * If the repo is clean, work in-place. Otherwise, create a worktree.
 */
function prepareWorkDir(repo: DiscoveredRepo): {
  workDir: string;
  worktree: boolean;
} {
  if (isClean(repo.path)) {
    return { workDir: repo.path, worktree: false };
  }

  // Create worktree in /tmp
  const worktreePath = join('/tmp/upgrade-worktrees', basename(repo.path));
  p.log.warn(`Repo is dirty, creating worktree at ${worktreePath}`);

  try {
    // Remove existing worktree if present
    execSilent(`git worktree remove --force ${worktreePath}`, repo.path);
  } catch {
    // Doesn't exist yet — fine
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
      execSilent(`git checkout -B ${branch} origin/${repo.defaultBranch}`, workDir);
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
      execSilent(`git diff --quiet origin/${repo.defaultBranch}...HEAD`, workDir);
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
      ['push', '-f', 'origin', branch],
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
      // Extract PR URL from output
      const urlMatch = prResult.stdout.match(/https:\/\/github\.com\/[^\s]+/);
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
```

**Step 2: Commit**

```bash
git add tools/update-repos/src/update.ts
git commit -m "feat(update-repos): implement update orchestrator with worktree support"
```

---

### Task 9: Wire everything together in the CLI handler

**Files:**
- Modify: `tools/update-repos/src/cli.ts`

**Step 1: Update `tools/update-repos/src/cli.ts` to wire all modules together**

Replace the handler with the full flow:

```typescript
#!/usr/bin/env node

import { cli } from 'cli-forge';
import { homedir } from 'node:os';
import { join } from 'node:path';
import * as p from '@clack/prompts';

import { discoverRepos } from './discover.js';
import { loadState, selectRepos } from './select.js';
import { updateRepo } from './update.js';
import { generateReport, type RepoResult } from './report.js';

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

    p.log.info(`Results: ${succeeded} success, ${failed} failed, ${skipped} skipped`);
    p.log.info(`Report: ${markdownPath}`);

    p.outro('Done!');
  },
});

export default updateReposCLI;

updateReposCLI.forge();
```

**Step 2: Verify the full CLI runs**

Run: `npx tsx tools/update-repos/src/cli.ts --help`
Expected: Help output with all options

Run: `npx tsx tools/update-repos/src/cli.ts --dry-run`
Expected: Discovers repos, shows multiselect, then dry-run output for each

**Step 3: Commit**

```bash
git add tools/update-repos/src/cli.ts
git commit -m "feat(update-repos): wire up full CLI flow"
```

---

### Task 10: End-to-end smoke test

**Step 1: Run the tool with `--dry-run` to verify the full pipeline**

Run: `npx tsx tools/update-repos/src/cli.ts --dry-run --repos-dir ~/repos`
Expected:
- Spinner while discovering repos
- Multiselect with discovered repos
- Dry run output for each selected repo
- Report generated at `~/.config/update-repos/report-YYYY-MM-DD.md`

**Step 2: Verify state persistence**

Run: `cat ~/.config/update-repos/state.json`
Expected: JSON with discoveredRepos, selectedRepos, etc.

**Step 3: Run again to verify pre-selection**

Run: `npx tsx tools/update-repos/src/cli.ts --dry-run`
Expected: Previously selected repos are pre-checked in multiselect

**Step 4: Final commit if any fixes were needed**

```bash
git add -A
git commit -m "fix(update-repos): address smoke test issues"
```
