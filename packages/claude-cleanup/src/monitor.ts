import { cli } from 'cli-forge';
import {
  readFileSync,
  unlinkSync,
  statSync,
  openSync,
  closeSync,
  existsSync,
} from 'node:fs';
import { spawn } from 'node:child_process';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { MONITOR_PID_FILE, MONITOR_LOG_FILE } from './paths.js';
import { parseAge } from './parse-age.js';

function readPid(): number | null {
  try {
    const raw = readFileSync(MONITOR_PID_FILE, 'utf-8').trim();
    const pid = parseInt(raw, 10);
    return Number.isNaN(pid) ? null : pid;
  } catch {
    return null;
  }
}

function isMonitorRunning(pid: number): boolean {
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}

function cleanupStalePidFile(): void {
  try {
    unlinkSync(MONITOR_PID_FILE);
  } catch {
    // Already gone
  }
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
}

function waitForPidFileRemoval(timeoutMs = 5000): Promise<boolean> {
  const start = Date.now();
  return new Promise((resolve) => {
    const check = () => {
      if (!existsSync(MONITOR_PID_FILE)) {
        resolve(true);
        return;
      }
      if (Date.now() - start > timeoutMs) {
        resolve(false);
        return;
      }
      setTimeout(check, 100);
    };
    check();
  });
}

const __dirname = fileURLToPath(new URL('.', import.meta.url));

export const monitorCommand = cli('monitor', {
  description: 'Manage the background cleanup daemon',
  builder: (args) =>
    args
      .command('start', {
        description: 'Start the background monitor daemon',
        builder: (args) =>
          args
            .option('interval', {
              type: 'string',
              description: 'Check interval (e.g. 15m, 1h)',
              default: '15m',
            })
            .option('age', {
              type: 'string',
              description: 'Staleness threshold (e.g. 2h, 30m, 1d)',
              default: '2h',
            })
            .option('foreground', {
              type: 'boolean',
              alias: ['fg'],
              description: 'Run in foreground with inherited stdio (don\'t detach)',
              default: false,
            }),
        handler: (opts) => {
          const pid = readPid();
          if (pid !== null && isMonitorRunning(pid)) {
            console.log(`Monitor is already running (PID ${pid}).`);
            process.exit(1);
          }

          // Clean up stale PID file if present
          if (pid !== null) {
            cleanupStalePidFile();
          }

          const intervalMs = parseAge(opts.interval);
          const ageMs = parseAge(opts.age);

          const daemonPath = join(__dirname, 'daemon.js');
          const daemonArgs = [daemonPath, '--interval', String(intervalMs), '--age', String(ageMs)];

          if (opts.foreground) {
            const child = spawn(process.execPath, daemonArgs, {
              stdio: 'inherit',
            });

            child.on('close', (code) => {
              process.exit(code ?? 0);
            });
            return;
          }

          const logFd = openSync(MONITOR_LOG_FILE, 'a');

          const child = spawn(process.execPath, daemonArgs, {
            detached: true,
            stdio: ['ignore', logFd, logFd],
          });

          closeSync(logFd);

          child.unref();

          console.log(`Monitor started (PID ${child.pid}).`);
          console.log(`  Interval: ${opts.interval}`);
          console.log(`  Age threshold: ${opts.age}`);
          console.log(`  Log: ${MONITOR_LOG_FILE}`);
        },
      })
      .command('stop', {
        description: 'Stop the background monitor daemon',
        handler: async () => {
          const pid = readPid();
          if (pid === null) {
            console.log('Monitor is not running (no PID file).');
            return;
          }

          if (!isMonitorRunning(pid)) {
            cleanupStalePidFile();
            console.log('Monitor is not running (cleaned stale PID file).');
            return;
          }

          try {
            process.kill(pid, 'SIGTERM');
          } catch {
            cleanupStalePidFile();
            console.log('Monitor process already exited (cleaned stale PID file).');
            return;
          }
          console.log(`Sent SIGTERM to PID ${pid}. Waiting for shutdown...`);

          const removed = await waitForPidFileRemoval();
          if (removed) {
            console.log('Monitor stopped.');
          } else {
            console.log('Warning: PID file was not removed within 5s. The process may still be shutting down.');
          }
        },
      })
      .command('status', {
        description: 'Check if the monitor daemon is running',
        handler: () => {
          const pid = readPid();
          if (pid === null) {
            console.log('Monitor is not running.');
            return;
          }

          if (!isMonitorRunning(pid)) {
            cleanupStalePidFile();
            console.log('Monitor is not running (cleaned stale PID file).');
            return;
          }

          console.log(`Monitor is running (PID ${pid}).`);

          try {
            const stats = statSync(MONITOR_LOG_FILE);
            console.log(`  Log file: ${MONITOR_LOG_FILE} (${formatFileSize(stats.size)})`);
          } catch {
            console.log('  Log file: none');
          }
        },
      })
      .command('reset', {
        description: 'Stop the daemon and delete the log file',
        handler: async () => {
          // Stop if running
          const pid = readPid();
          if (pid !== null && isMonitorRunning(pid)) {
            try {
              process.kill(pid, 'SIGTERM');
            } catch {
              cleanupStalePidFile();
              console.log('Monitor process already exited (cleaned stale PID file).');
            }
            console.log(`Sent SIGTERM to PID ${pid}. Waiting for shutdown...`);
            const removed = await waitForPidFileRemoval();
            if (removed) {
              console.log('Monitor stopped.');
            } else {
              console.log('Warning: PID file not removed within 5s.');
            }
          } else if (pid !== null) {
            cleanupStalePidFile();
            console.log('Cleaned stale PID file.');
          }

          // Delete log file
          try {
            unlinkSync(MONITOR_LOG_FILE);
            console.log('Log file deleted.');
          } catch {
            console.log('No log file to delete.');
          }
        },
      })
      .demandCommand(),
});
