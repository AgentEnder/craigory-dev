import { execFileSync } from 'node:child_process';
import { homedir } from 'node:os';

export function assertPlatform(): void {
  if (process.platform === 'win32') {
    console.error(
      'claude-cleanup is not supported on Windows. It relies on Unix signals (kill -0, SIGTERM) for process management.'
    );
    process.exit(1);
  }
}

export function isProcessRunning(pid: number): boolean {
  try {
    process.kill(pid, 0);
  } catch {
    return false;
  }
  // Verify it's actually a Claude process (PID reuse protection)
  // Falls back to trusting kill-0 if ps is unavailable
  try {
    const comm = execFileSync('ps', ['-p', String(pid), '-o', 'comm='], {
      encoding: 'utf-8',
    }).trim();
    return comm.includes('claude');
  } catch {
    return true;
  }
}

export function killProcess(pid: number): boolean {
  try {
    process.kill(pid, 'SIGTERM');
    return true;
  } catch {
    return false;
  }
}

export function formatDuration(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days}d ${hours % 24}h`;
  }
  if (hours > 0) {
    return `${hours}h ${minutes % 60}m`;
  }
  return `${minutes}m`;
}

export function shortenPath(fullPath: string): string {
  const home = homedir();
  if (fullPath.startsWith(home)) {
    return '~' + fullPath.slice(home.length);
  }
  return fullPath;
}
