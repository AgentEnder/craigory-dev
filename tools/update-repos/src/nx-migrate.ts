import { existsSync, readFileSync, writeFileSync, unlinkSync } from 'node:fs';
import { join } from 'node:path';
import * as p from '@clack/prompts';

import {
  type PackageManager,
  execQuiet,
  execWithActivityTimeout,
  execSilent,
  getInstallCommand,
} from './utils.js';

/** Idle timeout for AI agent during migration error recovery. */
const AI_IDLE_TIMEOUT_MS = 3 * 60 * 1000;

/**
 * Get the current Nx version from node_modules or package.json.
 */
function getNxVersion(repoPath: string): string | null {
  try {
    const pkgPath = join(repoPath, 'node_modules', 'nx', 'package.json');
    if (existsSync(pkgPath)) {
      return JSON.parse(readFileSync(pkgPath, 'utf-8')).version;
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
 * Parse a semver string and return the major version number.
 */
function parseMajor(version: string): number {
  // Handle ranges like "^22.5.0" or "~22.5.0"
  const cleaned = version.replace(/^[^0-9]*/, '');
  return parseInt(cleaned.split('.')[0], 10);
}

/**
 * Get the latest published version for a given Nx major via `npm view`.
 * Uses semver range `^major.0.0` and picks the highest version.
 * Returns null if no version exists for that major.
 */
function getLatestForMajor(major: number): string | null {
  try {
    const raw = execSilent(
      `npm view "nx@^${major}.0.0" version --json`,
      process.cwd()
    );
    const parsed = JSON.parse(raw);
    // npm returns a string for a single match, or an array for multiple
    if (typeof parsed === 'string') return parsed;
    if (Array.isArray(parsed) && parsed.length > 0) return parsed[parsed.length - 1];
    return null;
  } catch {
    return null;
  }
}

/**
 * Get the absolute latest Nx version published on npm.
 */
function getLatestNxVersion(): string | null {
  try {
    return execSilent('npm view nx version', process.cwd()) || null;
  } catch {
    return null;
  }
}

/**
 * Get the runner prefix for nx commands based on package manager.
 */
function getPmx(pm: PackageManager): string {
  switch (pm) {
    case 'pnpm':
      return 'pnpm';
    case 'yarn':
      return 'yarn';
    case 'bun':
      return 'bunx';
    case 'npm':
      return 'npx';
  }
}

type MigrationErrorAction = 'exclude-and-retry' | 'halt';

interface AiTriageResult {
  action: MigrationErrorAction;
  /** Migration names to exclude from migrations.json (if action is 'exclude-and-retry') */
  excludeMigrations?: string[];
  reason: string;
}

/**
 * Ask an AI agent to triage a migration failure.
 * The agent decides whether to exclude specific migrations and retry, or halt.
 */
async function triageMigrationFailure(
  repoPath: string,
  errorOutput: string,
  migrationsJsonPath: string,
  aiAgent: string
): Promise<AiTriageResult> {
  if (aiAgent === 'false') {
    return { action: 'halt', reason: 'AI agent disabled, cannot triage' };
  }

  const migrationsContent = existsSync(migrationsJsonPath)
    ? readFileSync(migrationsJsonPath, 'utf-8')
    : '{}';

  const prompt = `You are triaging a failed Nx migration. Analyze the error and respond with ONLY a JSON object (no markdown, no explanation outside the JSON).

The error output from \`nx migrate --run-migrations\`:

\`\`\`
${errorOutput}
\`\`\`

The current migrations.json:

\`\`\`json
${migrationsContent}
\`\`\`

Determine the correct action:

1. If specific migration(s) failed but others can proceed: respond with:
   {"action": "exclude-and-retry", "excludeMigrations": ["migration-name-1"], "reason": "brief explanation"}

2. If the failure is fundamental and the repo cannot be migrated: respond with:
   {"action": "halt", "reason": "brief explanation of why migration cannot proceed"}

The migration names are the keys in the "migrations" object in migrations.json.
Respond with ONLY the JSON object.`;

  const agent = aiAgent === 'codex' ? 'codex' : 'claude';
  const s = p.spinner();
  s.start(`${agent} is analyzing migration failure...`);

  const cmdArgs =
    agent === 'claude'
      ? { cmd: 'claude', args: ['-p', prompt, '--allowedTools', 'Bash,Read'] }
      : { cmd: 'codex', args: ['--approval-mode', 'full-auto', '-q', prompt] };

  const result = await execWithActivityTimeout(cmdArgs.cmd, cmdArgs.args, {
    cwd: repoPath,
    idleTimeoutMs: AI_IDLE_TIMEOUT_MS,
  });

  if (result.timedOut) {
    s.stop(`${agent} timed out`);
    return { action: 'halt', reason: 'AI agent timed out during triage' };
  }

  s.stop(`${agent} finished analysis`);

  // Parse the AI response — look for JSON in the output
  try {
    const jsonMatch = result.stdout.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      if (
        parsed.action === 'exclude-and-retry' ||
        parsed.action === 'halt'
      ) {
        return parsed as AiTriageResult;
      }
    }
  } catch {
    // Failed to parse AI response
  }

  return {
    action: 'halt',
    reason: 'Could not parse AI triage response',
  };
}

/**
 * Remove specific migrations from migrations.json by key.
 */
function excludeMigrationsFromJson(
  migrationsJsonPath: string,
  toExclude: string[]
): void {
  const content = JSON.parse(readFileSync(migrationsJsonPath, 'utf-8'));
  const excludeSet = new Set(toExclude);
  if (content.migrations && typeof content.migrations === 'object') {
    for (const key of Object.keys(content.migrations)) {
      if (excludeSet.has(key)) {
        delete content.migrations[key];
      }
    }
  }
  writeFileSync(migrationsJsonPath, JSON.stringify(content, null, 2));
}

/**
 * Run `nx migrate --run-migrations` with AI-assisted error recovery.
 * Returns true if migrations ran successfully (possibly after excluding some),
 * or false if the repo should be halted.
 */
async function runMigrationsWithRecovery(
  repoPath: string,
  pmx: string,
  aiAgent: string
): Promise<boolean> {
  const migrationsJsonPath = join(repoPath, 'migrations.json');
  if (!existsSync(migrationsJsonPath)) {
    return true; // No migrations to run
  }

  const maxRetries = 3;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    p.log.step(
      attempt === 0
        ? 'Running migrations...'
        : `Retrying migrations (attempt ${attempt + 1})...`
    );

    const runResult = await execQuiet(
      pmx,
      ['nx', 'migrate', '--run-migrations', '--create-commits', '--no-interactive'],
      { cwd: repoPath }
    );

    if (runResult.exitCode === 0) {
      return true;
    }

    const errorOutput = runResult.stdout + runResult.stderr;
    p.log.error('nx migrate --run-migrations failed');

    if (attempt >= maxRetries) {
      p.log.error(`Exhausted ${maxRetries} retries`);
      return false;
    }

    // Ask AI to triage
    const triage = await triageMigrationFailure(
      repoPath,
      errorOutput,
      migrationsJsonPath,
      aiAgent
    );

    p.log.info(`AI triage: ${triage.action} — ${triage.reason}`);

    if (triage.action === 'halt') {
      return false;
    }

    if (
      triage.action === 'exclude-and-retry' &&
      triage.excludeMigrations?.length
    ) {
      p.log.warn(
        `Excluding migrations: ${triage.excludeMigrations.join(', ')}`
      );
      excludeMigrationsFromJson(migrationsJsonPath, triage.excludeMigrations);
    }
  }

  return false;
}

/**
 * Run Nx migration on a repo, stepping through one major version at a time.
 *
 * e.g. 20.0.0 → latest v20 → latest v21 → latest v22 (== latest) → stop.
 *
 * Returns the old and new Nx versions, or null if migration failed.
 */
export async function runNxMigrate(
  repoPath: string,
  pm: PackageManager,
  aiAgent: string
): Promise<{ oldVersion: string; newVersion: string } | null> {
  const oldVersion = getNxVersion(repoPath) ?? 'unknown';
  p.log.step(`Current Nx version: ${oldVersion}`);

  if (oldVersion === 'unknown') {
    p.log.error('Cannot determine current Nx version');
    return null;
  }

  const latest = getLatestNxVersion();
  if (!latest) {
    p.log.error('Cannot determine latest Nx version from npm');
    return null;
  }

  const pmx = getPmx(pm);
  let currentMajor = parseMajor(oldVersion);
  const latestMajor = parseMajor(latest);

  p.log.info(`Migration path: v${currentMajor} → v${latestMajor} (latest: ${latest})`);

  // Step through each major version
  while (currentMajor <= latestMajor) {
    const targetVersion = getLatestForMajor(currentMajor);
    if (!targetVersion) {
      p.log.warn(`No published version for nx@${currentMajor}, skipping`);
      currentMajor++;
      continue;
    }

    const installedVersion = getNxVersion(repoPath);
    if (installedVersion === targetVersion) {
      // Already at the latest for this major, move to next
      currentMajor++;
      continue;
    }

    p.log.step(`Migrating to nx@${targetVersion}...`);

    // Run nx migrate <target>
    const migrateResult = await execQuiet(
      pmx,
      ['nx', 'migrate', targetVersion, '--no-interactive'],
      { cwd: repoPath }
    );

    if (migrateResult.exitCode !== 0) {
      p.log.error(`nx migrate ${targetVersion} failed`);

      // Ask AI to triage the migrate command failure
      const errorOutput = migrateResult.stdout + migrateResult.stderr;
      const triage = await triageMigrationFailure(
        repoPath,
        errorOutput,
        join(repoPath, 'migrations.json'),
        aiAgent
      );

      p.log.info(`AI triage: ${triage.action} — ${triage.reason}`);
      if (triage.action === 'halt') {
        return null;
      }
      // If exclude-and-retry, we continue — migrations will be handled below
    }

    // Install updated deps
    const [installCmd, installArgs] = getInstallCommand(pm);
    p.log.step('Installing updated dependencies...');
    await execQuiet(installCmd, installArgs, { cwd: repoPath });

    // Run migrations with recovery
    const migrationsOk = await runMigrationsWithRecovery(
      repoPath,
      pmx,
      aiAgent
    );

    if (!migrationsOk) {
      p.log.error(`Migration to v${currentMajor} failed after recovery attempts`);
      return null;
    }

    // Clean up migrations.json if it still exists
    const migrationsJsonPath = join(repoPath, 'migrations.json');
    if (existsSync(migrationsJsonPath)) {
      unlinkSync(migrationsJsonPath);
      try {
        execSilent(
          'git add migrations.json && git commit -m "chore: remove migrations.json"',
          repoPath
        );
      } catch {
        // May not be tracked
      }
    }

    currentMajor++;
  }

  // Run post-nx-update script if it exists
  try {
    const pkg = JSON.parse(
      readFileSync(join(repoPath, 'package.json'), 'utf-8')
    );
    if (pkg.scripts?.['post-nx-update']) {
      p.log.step('Running post-nx-update script...');
      await execQuiet(pm, ['run', 'post-nx-update'], { cwd: repoPath });
      execSilent(
        'git add -A && git commit -m "chore: run post-nx-update"',
        repoPath
      );
    }
  } catch (e) {
    p.log.warn(
      `post-nx-update failed: ${e instanceof Error ? e.message : String(e)}`
    );
  }

  // Reset Nx cache
  try {
    await execQuiet(pmx, ['nx', 'reset'], { cwd: repoPath });
  } catch {
    // Non-critical
  }

  const newVersion = getNxVersion(repoPath) ?? 'unknown';
  p.log.success(`Nx migrated: ${oldVersion} → ${newVersion}`);

  return { oldVersion, newVersion };
}
