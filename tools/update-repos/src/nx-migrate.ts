import * as p from '@clack/prompts';
import {
  existsSync,
  readFileSync,
  readdirSync,
  unlinkSync,
  writeFileSync,
} from 'node:fs';
import { join } from 'node:path';

import {
  type PackageManager,
  execQuiet,
  execSilent,
  execWithActivityTimeout,
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
  const cleaned = version.replace(/^[^0-9]*/, '');
  return parseInt(cleaned.split('.')[0], 10);
}

/**
 * Get the latest published version for a given Nx major via `npm view`.
 */
function getLatestForMajor(major: number): string | null {
  try {
    const raw = execSilent(
      `npm view "nx@^${major}.0.0" version --json`,
      process.cwd()
    );
    const parsed = JSON.parse(raw);
    if (typeof parsed === 'string') return parsed;
    if (Array.isArray(parsed) && parsed.length > 0)
      return parsed[parsed.length - 1];
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

/**
 * Count the number of migrations defined in a migrations.json file.
 */
function countMigrations(migrationsJsonPath: string): number {
  if (!existsSync(migrationsJsonPath)) return 0;
  try {
    const content = JSON.parse(readFileSync(migrationsJsonPath, 'utf-8'));
    if (content.migrations && typeof content.migrations === 'object') {
      return Object.keys(content.migrations).length;
    }
  } catch {
    // Corrupt file
  }
  return 0;
}

/**
 * Count commits between two refs.
 */
function countCommitsBetween(
  repoPath: string,
  fromRef: string,
  toRef: string
): number {
  try {
    const output = execSilent(
      `git rev-list --count ${fromRef}..${toRef}`,
      repoPath
    );
    return parseInt(output, 10) || 0;
  } catch {
    return 0;
  }
}

/**
 * Get the current HEAD sha.
 */
function getHeadSha(repoPath: string): string {
  return execSilent('git rev-parse HEAD', repoPath);
}

// --- AI triage for migration failures ---

type MigrationErrorAction = 'exclude-and-retry' | 'halt';

interface AiTriageResult {
  action: MigrationErrorAction;
  excludeMigrations?: string[];
  reason: string;
}

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
      ? {
          cmd: 'claude',
          args: ['-p', prompt, '--allowedTools', 'Bash,Read'],
        }
      : {
          cmd: 'codex',
          args: ['--approval-mode', 'full-auto', '-q', prompt],
        };

  const result = await execWithActivityTimeout(cmdArgs.cmd, cmdArgs.args, {
    cwd: repoPath,
    idleTimeoutMs: AI_IDLE_TIMEOUT_MS,
  });

  if (result.timedOut) {
    s.stop(`${agent} timed out`);
    return { action: 'halt', reason: 'AI agent timed out during triage' };
  }

  s.stop(`${agent} finished analysis`);

  try {
    const jsonMatch = result.stdout.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      if (parsed.action === 'exclude-and-retry' || parsed.action === 'halt') {
        return parsed as AiTriageResult;
      }
    }
  } catch {
    // Failed to parse
  }

  return { action: 'halt', reason: 'Could not parse AI triage response' };
}

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

// --- Run migrations with stats and recovery ---

interface MigrationRunStats {
  ok: boolean;
  totalMigrations: number;
  migrationsWithChanges: number;
}

async function runMigrationsWithRecovery(
  repoPath: string,
  pmx: string,
  aiAgent: string
): Promise<MigrationRunStats> {
  const migrationsJsonPath = join(repoPath, 'migrations.json');
  if (!existsSync(migrationsJsonPath)) {
    return { ok: true, totalMigrations: 0, migrationsWithChanges: 0 };
  }

  const totalMigrations = countMigrations(migrationsJsonPath);

  const maxRetries = 3;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    p.log.step(
      attempt === 0
        ? `Running ${totalMigrations} migrations...`
        : `Retrying migrations (attempt ${attempt + 1})...`
    );

    const beforeSha = getHeadSha(repoPath);

    const runResult = await execQuiet(
      pmx,
      [
        'nx',
        'migrate',
        '--run-migrations',
        '--create-commits',
        '--no-interactive',
      ],
      { cwd: repoPath }
    );

    const afterSha = getHeadSha(repoPath);
    const migrationsWithChanges = countCommitsBetween(
      repoPath,
      beforeSha,
      afterSha
    );

    if (runResult.exitCode === 0) {
      p.log.success(
        `Ran ${totalMigrations} migrations, ${migrationsWithChanges} made changes`
      );
      return { ok: true, totalMigrations, migrationsWithChanges };
    }

    const errorOutput = runResult.stdout + runResult.stderr;
    p.log.error('nx migrate --run-migrations failed');

    if (attempt >= maxRetries) {
      p.log.error(`Exhausted ${maxRetries} retries`);
      return { ok: false, totalMigrations, migrationsWithChanges };
    }

    const triage = await triageMigrationFailure(
      repoPath,
      errorOutput,
      migrationsJsonPath,
      aiAgent
    );

    p.log.info(`AI triage: ${triage.action} — ${triage.reason}`);

    if (triage.action === 'halt') {
      return { ok: false, totalMigrations, migrationsWithChanges };
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

  return { ok: false, totalMigrations: 0, migrationsWithChanges: 0 };
}

// --- AI migration files (tools/ai-migrations/*.md) ---

/**
 * Find and process AI migration markdown files that Nx migrations may have
 * generated (e.g. tools/ai-migrations/MIGRATE_VITEST_4.md).
 */
async function processAiMigrationFiles(
  repoPath: string,
  aiAgent: string
): Promise<void> {
  const aiMigrationsDir = join(repoPath, 'tools', 'ai-migrations');
  if (!existsSync(aiMigrationsDir)) return;

  let files: string[];
  try {
    files = readdirSync(aiMigrationsDir).filter((f) => f.endsWith('.md'));
  } catch {
    return;
  }

  if (files.length === 0) return;

  p.log.step(`Found ${files.length} AI migration file(s): ${files.join(', ')}`);

  if (aiAgent === 'false') {
    p.log.warn('AI agent disabled, skipping AI migration files');
    return;
  }

  const agent = aiAgent === 'codex' ? 'codex' : 'claude';

  for (const file of files) {
    const filePath = join(aiMigrationsDir, file);
    const content = readFileSync(filePath, 'utf-8');

    p.log.step(`Processing ${file}...`);

    const prompt = `You are performing an automated migration in this repository.
The following migration guide was generated by an Nx migration and describes changes you need to make:

---
${content}
---

Follow the instructions in this migration guide. Make all the changes described, then commit your work with a message like "chore: apply AI migration ${file}".

After completing the migration, delete the file at ${filePath} since it has been applied.`;

    const s = p.spinner();
    s.start(`${agent} is applying ${file}...`);

    const cmdArgs =
      agent === 'claude'
        ? {
            cmd: 'claude',
            args: [
              '-p',
              prompt,
              '--allowedTools',
              'Bash,Read,Edit,Write,Glob,Grep',
            ],
          }
        : {
            cmd: 'codex',
            args: ['--approval-mode', 'full-auto', '-q', prompt],
          };

    const result = await execWithActivityTimeout(cmdArgs.cmd, cmdArgs.args, {
      cwd: repoPath,
      idleTimeoutMs: AI_IDLE_TIMEOUT_MS,
    });

    if (result.timedOut) {
      s.stop(`${agent} timed out on ${file}`);
      p.log.warn(`Skipping ${file} — agent timed out`);
      continue;
    }

    if (result.exitCode === 0) {
      s.stop(`Applied ${file}`);
    } else {
      s.stop(`${agent} failed on ${file}`);
      p.log.warn(`Failed to apply ${file}, continuing`);
    }

    // Clean up the file if the agent didn't already
    if (existsSync(filePath)) {
      unlinkSync(filePath);
      try {
        execSilent(
          `git add -A && git commit -m "chore: remove applied AI migration ${file}"`,
          repoPath
        );
      } catch {
        // May already be committed by agent
      }
    }
  }

  // Clean up empty ai-migrations directory
  try {
    const remaining = readdirSync(aiMigrationsDir);
    if (remaining.length === 0) {
      execSilent(`rm -rf ${aiMigrationsDir}`, repoPath);
      try {
        execSilent(
          'git add -A && git commit -m "chore: remove empty ai-migrations directory"',
          repoPath
        );
      } catch {
        // Nothing to commit
      }
    }
  } catch {
    // Directory already gone
  }
}

// --- Main entry point ---

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

  p.log.info(
    `Migration path: v${currentMajor} → v${latestMajor} (latest: ${latest})`
  );

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
      currentMajor++;
      continue;
    }

    p.log.step(`Migrating to nx@${targetVersion}...`);

    // Run nx migrate <target>
    const migrateResult = await execQuiet(
      pmx,
      ['nx', 'migrate', targetVersion, '--no-interactive'],
      { cwd: repoPath, env: { ...process.env, CI: 'true' } }
    );

    if (migrateResult.exitCode !== 0) {
      p.log.error(`nx migrate ${targetVersion} failed`);

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
    }

    // Install updated deps
    const [installCmd, installArgs] = getInstallCommand(pm);
    p.log.step('Installing updated dependencies...');
    await execQuiet(installCmd, installArgs, { cwd: repoPath });

    // Run migrations with stats and recovery
    const stats = await runMigrationsWithRecovery(repoPath, pmx, aiAgent);

    if (!stats.ok) {
      p.log.error(
        `Migration to v${currentMajor} failed after recovery attempts`
      );
      return null;
    }

    // Clean up migrations.json
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

  // Process AI migration files generated by Nx migrations
  await processAiMigrationFiles(repoPath, aiAgent);

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
