import { execSync, spawn } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

import { detailView } from './display.js';
import { logger } from './logger.js';

export type PackageManager = 'npm' | 'yarn' | 'pnpm' | 'bun';

/**
 * Run a command with real-time stdout/stderr output.
 * Returns the exit code and captured output.
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

    proc.stdout.on('data', (data: Buffer) => {
      stdout += data.toString();
      process.stdout.write(data);
    });

    proc.stderr.on('data', (data: Buffer) => {
      stderr += data.toString();
      process.stderr.write(data);
    });

    proc.on('close', (code) => {
      resolve({ exitCode: code ?? 1, stdout, stderr });
    });
  });
}

/**
 * Run a command silently, capturing all output. The user can press
 * Enter to toggle a full-output detail view in the terminal's
 * alternate screen buffer.
 *
 * If the command fails (non-zero exit) and `dumpOnFailure` is true
 * (the default), dump the captured output to stderr.
 */
export function execQuiet(
  command: string,
  args: string[],
  options: {
    cwd: string;
    env?: NodeJS.ProcessEnv;
    dumpOnFailure?: boolean;
    /** Label shown in the detail view header. Defaults to the command. */
    label?: string;
  }
): Promise<{ exitCode: number; stdout: string; stderr: string }> {
  const dumpOnFailure = options.dumpOnFailure ?? true;
  const label = options.label ?? `${command} ${args.join(' ')}`;

  logger.step(`exec: ${label}`);

  return new Promise((resolve) => {
    detailView.start(label);

    const proc = spawn(command, args, {
      cwd: options.cwd,
      env: options.env ?? process.env,
      stdio: ['pipe', 'pipe', 'pipe'],
    });

    let stdout = '';
    let stderr = '';

    proc.stdout.on('data', (data: Buffer) => {
      const str = data.toString();
      stdout += str;
      detailView.write(str);
    });

    proc.stderr.on('data', (data: Buffer) => {
      const str = data.toString();
      stderr += str;
      detailView.write(str);
    });

    proc.on('close', (code) => {
      detailView.stop();
      const exitCode = code ?? 1;
      logger.output(label, stdout, stderr);
      if (exitCode !== 0) {
        logger.error(`${label} exited with code ${exitCode}`);
        if (dumpOnFailure) {
          if (stdout) process.stderr.write(stdout);
          if (stderr) process.stderr.write(stderr);
        }
      }
      resolve({ exitCode, stdout, stderr });
    });
  });
}

/**
 * Run a command and kill it if no stdout/stderr output is received
 * within `idleTimeoutMs`. Output is buffered into the detail view
 * for interactive viewing. The onData callback receives raw chunks
 * for caller-specific processing (e.g. spinner updates).
 */
export function execWithActivityTimeout(
  command: string,
  args: string[],
  options: {
    cwd: string;
    env?: NodeJS.ProcessEnv;
    idleTimeoutMs: number;
    label?: string;
    onData?: (chunk: string) => void;
  }
): Promise<{
  exitCode: number;
  stdout: string;
  stderr: string;
  timedOut: boolean;
}> {
  const label = options.label ?? `${command} ${args[0] ?? ''}`;
  logger.step(`exec (timeout ${options.idleTimeoutMs / 1000}s): ${label}`);

  return new Promise((resolve) => {
    detailView.start(label);

    const proc = spawn(command, args, {
      cwd: options.cwd,
      env: options.env ?? process.env,
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    let stdout = '';
    let stderr = '';
    let timedOut = false;

    let timer = setTimeout(() => {
      timedOut = true;
      proc.kill('SIGTERM');
    }, options.idleTimeoutMs);

    function resetTimer() {
      clearTimeout(timer);
      timer = setTimeout(() => {
        timedOut = true;
        proc.kill('SIGTERM');
      }, options.idleTimeoutMs);
    }

    proc.stdout.on('data', (data: Buffer) => {
      const str = data.toString();
      stdout += str;
      detailView.write(str);
      options.onData?.(str);
      resetTimer();
    });

    proc.stderr.on('data', (data: Buffer) => {
      const str = data.toString();
      stderr += str;
      detailView.write(str);
      options.onData?.(str);
      resetTimer();
    });

    proc.on('close', (code) => {
      clearTimeout(timer);
      detailView.stop();
      const exitCode = code ?? 1;
      logger.output(label, stdout, stderr);
      if (timedOut) {
        logger.error(`${label} timed out after ${options.idleTimeoutMs / 1000}s of silence`);
      } else if (exitCode !== 0) {
        logger.error(`${label} exited with code ${exitCode}`);
        if (stdout) process.stderr.write(stdout);
        if (stderr) process.stderr.write(stderr);
      }
      resolve({ exitCode, stdout, stderr, timedOut });
    });
  });
}

/**
 * Run a command silently and return stdout.
 */
export function execSilent(command: string, cwd: string): string {
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
  if (
    existsSync(join(repoPath, 'bun.lockb')) ||
    existsSync(join(repoPath, 'bun.lock'))
  )
    return 'bun';
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
 * Get the audit command for a package manager (with --json flag).
 * Returns null for package managers that don't support audit.
 */
export function getAuditCommand(
  pm: PackageManager,
  json = false
): [string, string[]] | null {
  const jsonFlag = json ? ['--json'] : [];
  switch (pm) {
    case 'pnpm':
      return ['pnpm', ['audit', ...jsonFlag]];
    case 'yarn':
      return ['yarn', ['npm', 'audit', ...jsonFlag]];
    case 'bun':
      // Bun does not have an audit command
      return null;
    case 'npm':
      return ['npm', ['audit', ...jsonFlag]];
  }
}

/**
 * Get the audit fix command for a package manager (non-AI path).
 * Returns null for package managers that don't support audit fix.
 */
export function getAuditFixCommand(
  pm: PackageManager
): [string, string[]] | null {
  switch (pm) {
    case 'pnpm':
      return ['pnpm', ['audit', '--fix']];
    case 'yarn':
      // Yarn Berry doesn't have audit fix — needs manual intervention
      return null;
    case 'bun':
      return null;
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
      readFileSync(join(repoPath, 'package.json'), 'utf-8')
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
 * Determine the next available calver branch name for a repo.
 * Checks both local and remote branches matching chore/update-YYYY-MM-DD.*
 * and picks the next available number.
 */
export function nextUpdateBranchName(repoPath: string): string {
  const today = todayString();
  const prefix = `chore/update-${today}.`;
  let maxN = 0;

  // Check both local and remote branches in a single call
  try {
    const refs = execSilent(`git branch -a --list "*${prefix}*"`, repoPath);
    for (const line of refs.split('\n')) {
      const match = line.trim().match(/\.(\d+)$/);
      if (match) {
        maxN = Math.max(maxN, parseInt(match[1], 10));
      }
    }
  } catch {
    // No matching branches or git error — start at 1
  }

  return `${prefix}${maxN + 1}`;
}
