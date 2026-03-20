import { execSync, spawnSync, type SpawnSyncOptions } from 'node:child_process';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import * as p from '@clack/prompts';

const MIN_NPM_VERSION = '11.10.0';

export function checkNpmVersion(): void {
  let version: string;
  try {
    version = execSync('npm --version', { encoding: 'utf-8' }).trim();
  } catch {
    throw new Error(
      'Could not determine npm version. Ensure npm is installed and on your PATH.'
    );
  }

  if (!isVersionAtLeast(version, MIN_NPM_VERSION)) {
    throw new Error(
      `npm >= ${MIN_NPM_VERSION} is required for trusted publishing (found ${version}). ` +
        `Run \`npm install -g npm@latest\` to update.`
    );
  }
}

export function checkNpmLogin(registry?: string): void {
  const args = ['whoami'];
  if (registry) {
    args.push('--registry', registry);
  }
  const result = spawnSync('npm', args, {
    encoding: 'utf-8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  if (result.status !== 0) {
    throw new Error(
      'You are not logged in to npm. Run `npm login` first, then re-run this command.'
    );
  }

  p.log.info(`Logged in to npm as ${result.stdout.trim()}`);
}

export async function promptOtp(): Promise<string> {
  const otp = await p.text({
    message: 'Enter your npm one-time password (OTP):',
    validate: (v) => (!v ? 'OTP is required' : undefined),
  });

  if (p.isCancel(otp)) {
    p.cancel('Cancelled');
    process.exit(0);
  }

  return otp as string;
}

function spawnNpmWithOtp(
  args: string[],
  otp: string,
  options?: SpawnSyncOptions
) {
  return spawnSync('npm', args, {
    ...options,
    env: {
      ...process.env,
      npm_config_otp: otp,
    },
  });
}

export function packageExists(
  name: string,
  registry?: string
): boolean {
  const args = ['view', name, 'version'];
  if (registry) {
    args.push('--registry', registry);
  }
  const result = spawnSync('npm', args, {
    encoding: 'utf-8',
    stdio: ['ignore', 'pipe', 'ignore'],
  });
  return result.status === 0;
}

export function publishShellPackage(
  name: string,
  otp: string,
  registry?: string
): void {
  const tmpDir = mkdtempSync(join(tmpdir(), 'npm-trusted-publishing-'));
  try {
    const shellPackageJson = {
      name,
      version: '0.0.0',
      description: `Shell package for ${name}`,
      publishConfig: {
        access: 'public',
      },
    };
    writeFileSync(
      join(tmpDir, 'package.json'),
      JSON.stringify(shellPackageJson, null, 2)
    );

    const args = ['publish'];
    if (registry) {
      args.push('--registry', registry);
    }
    const result = spawnNpmWithOtp(args, otp, {
      cwd: tmpDir,
      stdio: ['inherit', 'inherit', 'pipe'],
      encoding: 'utf-8',
    });
    if (result.status !== 0) {
      const stderr = (result as { stderr?: string }).stderr ?? '';
      if (stderr.includes('previously published versions')) {
        return;
      }
      throw new Error(`Failed to publish shell package for ${name}`);
    }
  } finally {
    rmSync(tmpDir, { recursive: true, force: true });
  }
}

export function npmTrustSetup(
  pkg: string,
  repository: string,
  workflow: string,
  otp: string,
  environment?: string
): void {
  const args = [
    'trust',
    'github',
    pkg,
    '--file',
    workflow,
    '--repository',
    repository,
    '--yes',
  ];
  if (environment) {
    args.push('--environment', environment);
  }

  const result = spawnNpmWithOtp(args, otp, { stdio: 'inherit' });
  if (result.status !== 0) {
    throw new Error(`Failed to configure trusted publishing for ${pkg}`);
  }
}

export function npmTrustList(pkg: string): void {
  spawnSync('npm', ['trust', 'list', pkg], {
    stdio: 'inherit',
  });
}

export function npmTrustRevoke(
  pkg: string,
  configId: string,
  otp: string
): void {
  const result = spawnNpmWithOtp(
    ['trust', 'revoke', pkg, '--id', configId, '--yes'],
    otp,
    { stdio: 'inherit' }
  );
  if (result.status !== 0) {
    throw new Error(
      `Failed to revoke trust config ${configId} for ${pkg}`
    );
  }
}

export function formatTag(pattern: string, packageName: string): string {
  return pattern
    .replace('{projectName}', packageName)
    .replace('{version}', '0.0.0');
}

export function createVersionTag(
  packageName: string,
  tagPattern: string
): 'created' | 'moved' | 'already-correct' {
  const tag = formatTag(tagPattern, packageName);

  const firstCommit = spawnSync(
    'git',
    ['rev-list', '--max-parents=0', 'HEAD'],
    { encoding: 'utf-8', stdio: ['ignore', 'pipe', 'pipe'] }
  );
  if (firstCommit.status !== 0 || !firstCommit.stdout.trim()) {
    throw new Error('Failed to determine the first commit in the repository');
  }
  // rev-list may return multiple root commits; use the earliest (last line)
  const roots = firstCommit.stdout.trim().split('\n');
  const rootCommit = roots[roots.length - 1];

  // Check if tag already exists and points to the correct commit
  const existingRef = spawnSync(
    'git',
    ['rev-parse', '--verify', `refs/tags/${tag}`],
    { encoding: 'utf-8', stdio: ['ignore', 'pipe', 'pipe'] }
  );

  if (existingRef.status === 0 && existingRef.stdout.trim() === rootCommit) {
    return 'already-correct';
  }

  // Use -f to move the tag if it already exists but points to the wrong commit
  const force = existingRef.status === 0;
  const args = force
    ? ['tag', '-f', tag, rootCommit]
    : ['tag', tag, rootCommit];

  const result = spawnSync('git', args, {
    encoding: 'utf-8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  if (result.status !== 0) {
    throw new Error(`Failed to create git tag ${tag}: ${result.stderr}`);
  }

  return force ? 'moved' : 'created';
}

export function isVersionAtLeast(current: string, minimum: string): boolean {
  const currentParts = current.split('.').map(Number);
  const minimumParts = minimum.split('.').map(Number);

  for (let i = 0; i < 3; i++) {
    const c = currentParts[i] ?? 0;
    const m = minimumParts[i] ?? 0;
    if (c > m) return true;
    if (c < m) return false;
  }
  return true;
}
