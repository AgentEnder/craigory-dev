import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import * as p from '@clack/prompts';

import { type PackageManager, execWithOutput, execSilent } from './utils.js';

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

/**
 * Run Nx migration on a repo.
 * Returns the old and new Nx versions, or null if migration was skipped/failed.
 */
export async function runNxMigrate(
  repoPath: string,
  pm: PackageManager
): Promise<{ oldVersion: string; newVersion: string } | null> {
  const oldVersion = getNxVersion(repoPath) ?? 'unknown';
  p.log.step(`Current Nx version: ${oldVersion}`);

  const pmx = getPmx(pm);

  // Run nx migrate latest
  p.log.step('Running nx migrate latest...');
  const migrateResult = await execWithOutput(
    pmx,
    ['nx', 'migrate', 'latest'],
    { cwd: repoPath }
  );

  if (migrateResult.exitCode !== 0) {
    p.log.error('nx migrate latest failed');
    return null;
  }

  // Install updated deps after migration updated package.json
  const installArgs =
    pm === 'pnpm'
      ? ['install', '--no-frozen-lockfile']
      : pm === 'yarn'
        ? ['install', '--no-immutable']
        : ['install'];

  p.log.step('Installing updated dependencies...');
  await execWithOutput(pm, installArgs, { cwd: repoPath });

  // Run migrations if migrations.json was created
  const migrationsJson = join(repoPath, 'migrations.json');
  if (existsSync(migrationsJson)) {
    p.log.step('Running migrations...');
    await execWithOutput(
      pmx,
      ['nx', 'migrate', '--run-migrations', '--create-commits'],
      { cwd: repoPath }
    );
  }

  // Run post-nx-update script if it exists
  try {
    const pkg = JSON.parse(
      readFileSync(join(repoPath, 'package.json'), 'utf-8')
    );
    if (pkg.scripts?.['post-nx-update']) {
      p.log.step('Running post-nx-update script...');
      await execWithOutput(pm, ['run', 'post-nx-update'], { cwd: repoPath });
      execSilent(
        'git add -A && git commit -m "chore: run post-nx-update"',
        repoPath
      );
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
