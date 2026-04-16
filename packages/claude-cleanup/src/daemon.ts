import { cli } from 'cli-forge';
import { writeFileSync, unlinkSync } from 'node:fs';

import { discoverSessions, classifySessions } from './sessions.js';
import {
  isProcessRunning,
  killProcess,
  formatDuration,
  shortenPath,
} from './process.js';
import { MONITOR_PID_FILE } from './paths.js';

function log(message: string): void {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${message}`);
}

function runCleanupCycle(maxAgeMs: number): void {
  const sessions = discoverSessions();

  if (sessions.length === 0) {
    log('No sessions found.');
    return;
  }

  const classified = classifySessions(sessions, { isProcessRunning, maxAgeMs });
  const killable = classified.filter((s) => s.status !== 'active');

  if (killable.length === 0) {
    log(`All ${sessions.length} session(s) active. Nothing to clean.`);
    return;
  }

  let killed = 0;
  for (const session of killable) {
    if (session.status === 'dead') {
      log(
        `[dead] PID ${session.pid} — ${shortenPath(session.cwd)}`
      );
      continue;
    }
    if (killProcess(session.pid)) {
      killed++;
      log(
        `[killed] PID ${session.pid} — stale ${formatDuration(session.staleDurationMs)} — ${shortenPath(session.cwd)}`
      );
    }
  }

  log(
    `Cycle complete. Killed ${killed}, skipped ${killable.length - killed} dead.`
  );
}

function cleanupPidFile(): void {
  try {
    unlinkSync(MONITOR_PID_FILE);
  } catch {
    // Already gone — fine
  }
}

const daemonCLI = cli('claude-cleanup-daemon', {
  description: 'Background daemon for claude-cleanup monitor',
  builder: (args) =>
    args
      .option('interval', {
        type: 'number',
        description: 'Check interval in milliseconds',
        required: true,
      })
      .option('age', {
        type: 'number',
        description: 'Staleness threshold in milliseconds',
        required: true,
      }),
  handler: (opts) => {
    // Write PID file
    writeFileSync(MONITOR_PID_FILE, String(process.pid));

    // Register cleanup early so SIGTERM during init still removes PID file
    let timer: ReturnType<typeof setInterval> | undefined;

    process.on('SIGTERM', () => {
      log('Received SIGTERM, shutting down...');
      if (timer) clearInterval(timer);
      cleanupPidFile();
      process.exit(0);
    });

    process.on('beforeExit', () => {
      cleanupPidFile();
    });

    // Log startup header
    log('═══════════════════════════════════════════════');
    log('claude-cleanup monitor started');
    log(`  PID:      ${process.pid}`);
    log(`  Interval: ${formatDuration(opts.interval)}`);
    log(`  Age:      ${formatDuration(opts.age)}`);
    log('═══════════════════════════════════════════════');

    // Run immediately, then on interval
    runCleanupCycle(opts.age);
    timer = setInterval(() => runCleanupCycle(opts.age), opts.interval);
  },
});

daemonCLI.forge();
