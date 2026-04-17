# Claude Cleanup Monitor Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a `monitor` subcommand to claude-cleanup that backgrounds a daemon to periodically kill stale Claude sessions.

**Architecture:** The `monitor` subcommand manages a detached daemon process (`daemon.ts`) via PID file. The daemon runs a setInterval loop reusing existing `discoverSessions`/`classifySessions`/`killProcess`. The CLI spawns the daemon with stdout/stderr piped to a log file via `createWriteStream`.

**Tech Stack:** Node.js, cli-forge (arg parsing), existing session/process utilities.

---

### Task 1: Extract `parseAge` to a shared module

`parseAge` currently lives as a private function in `cli.ts`. Both `cli.ts` and `monitor.ts` will need it.

**Files:**
- Create: `packages/claude-cleanup/src/parse-age.ts`
- Create: `packages/claude-cleanup/src/parse-age.spec.ts`
- Modify: `packages/claude-cleanup/src/cli.ts:31-44` (remove `parseAge`, add import)

**Step 1: Write the test file**

```typescript
// src/parse-age.spec.ts
import { describe, it, expect } from 'vitest';
import { parseAge } from './parse-age.js';

describe('parseAge', () => {
  it('parses minutes', () => {
    expect(parseAge('30m')).toBe(30 * 60 * 1000);
  });

  it('parses hours', () => {
    expect(parseAge('2h')).toBe(2 * 60 * 60 * 1000);
  });

  it('parses days', () => {
    expect(parseAge('1d')).toBe(24 * 60 * 60 * 1000);
  });

  it('throws on invalid format', () => {
    expect(() => parseAge('abc')).toThrow('Invalid age format');
    expect(() => parseAge('10x')).toThrow('Invalid age format');
    expect(() => parseAge('')).toThrow('Invalid age format');
  });
});
```

**Step 2: Run test to verify it fails**

Run: `cd packages/claude-cleanup && npx vitest run src/parse-age.spec.ts`
Expected: FAIL — module not found

**Step 3: Create `parse-age.ts` and update `cli.ts`**

```typescript
// src/parse-age.ts
export function parseAge(age: string): number {
  const match = age.match(/^(\d+)(h|m|d)$/);
  if (!match) {
    throw new Error(`Invalid age format: "${age}". Use e.g. 2h, 30m, 1d`);
  }
  const value = parseInt(match[1], 10);
  const unit = match[2];
  const multipliers: Record<string, number> = {
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
  };
  return value * multipliers[unit];
}
```

In `cli.ts`:
- Remove lines 31-44 (the `parseAge` function)
- Add import: `import { parseAge } from './parse-age.js';`

**Step 4: Run tests to verify everything passes**

Run: `cd packages/claude-cleanup && npx vitest run`
Expected: All tests pass (new parse-age tests + existing tests)

**Step 5: Commit**

```bash
git add packages/claude-cleanup/src/parse-age.ts packages/claude-cleanup/src/parse-age.spec.ts packages/claude-cleanup/src/cli.ts
git commit -m "refactor(claude-cleanup): extract parseAge to shared module"
```

---

### Task 2: Create `paths.ts` with shared constants

**Files:**
- Create: `packages/claude-cleanup/src/paths.ts`

**Step 1: Create the file**

```typescript
// src/paths.ts
import { join } from 'node:path';
import { homedir } from 'node:os';

const CLAUDE_DIR = join(homedir(), '.claude');

export const MONITOR_PID_FILE = join(CLAUDE_DIR, 'claude-cleanup-monitor.pid');
export const MONITOR_LOG_FILE = join(CLAUDE_DIR, 'claude-cleanup-monitor.log');
```

No test needed — these are just constants.

**Step 2: Commit**

```bash
git add packages/claude-cleanup/src/paths.ts
git commit -m "feat(claude-cleanup): add shared path constants for monitor"
```

---

### Task 3: Create `daemon.ts`

The daemon is a standalone cli-forge CLI that runs a cleanup loop on an interval. It writes its PID to disk on startup and cleans it up on exit.

**Files:**
- Create: `packages/claude-cleanup/src/daemon.ts`

**Step 1: Write the daemon**

```typescript
// src/daemon.ts
import { cli } from 'cli-forge';
import { writeFileSync, unlinkSync } from 'node:fs';

import { discoverSessions, classifySessions } from './sessions.js';
import { isProcessRunning, killProcess, formatDuration, shortenPath } from './process.js';
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
      log(`[dead] PID ${session.pid} — ${shortenPath(session.cwd)}`);
      continue;
    }
    if (killProcess(session.pid)) {
      killed++;
      log(`[killed] PID ${session.pid} — stale ${formatDuration(session.staleDurationMs)} — ${shortenPath(session.cwd)}`);
    }
  }

  log(`Cycle complete. Killed ${killed}, skipped ${killable.length - killed} dead.`);
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

    // Log startup header
    log('═══════════════════════════════════════════════');
    log('claude-cleanup monitor started');
    log(`  PID:      ${process.pid}`);
    log(`  Interval: ${formatDuration(opts.interval)}`);
    log(`  Age:      ${formatDuration(opts.age)}`);
    log('═══════════════════════════════════════════════');

    // Run immediately, then on interval
    runCleanupCycle(opts.age);
    const timer = setInterval(() => runCleanupCycle(opts.age), opts.interval);

    // Graceful shutdown
    process.on('SIGTERM', () => {
      log('Received SIGTERM, shutting down...');
      clearInterval(timer);
      cleanupPidFile();
      process.exit(0);
    });

    process.on('beforeExit', () => {
      cleanupPidFile();
    });
  },
});

daemonCLI.forge();
```

**Step 2: Verify it compiles**

Run: `cd packages/claude-cleanup && npx tsc -p tsconfig.lib.json --noEmit`
Expected: No errors

**Step 3: Commit**

```bash
git add packages/claude-cleanup/src/daemon.ts
git commit -m "feat(claude-cleanup): add background daemon for monitor mode"
```

---

### Task 4: Create `monitor.ts` with start/stop/status/reset subcommands

**Files:**
- Create: `packages/claude-cleanup/src/monitor.ts`

**Step 1: Write the monitor subcommand**

```typescript
// src/monitor.ts
import { cli } from 'cli-forge';
import {
  readFileSync,
  unlinkSync,
  statSync,
  createWriteStream,
  existsSync,
} from 'node:fs';
import { spawn } from 'node:child_process';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { MONITOR_PID_FILE, MONITOR_LOG_FILE } from './paths.js';
import { parseAge } from './parse-age.js';
import { formatDuration } from './process.js';

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

          const logStream = createWriteStream(MONITOR_LOG_FILE, { flags: 'a' });
          const daemonPath = join(__dirname, 'daemon.js');

          const child = spawn(
            process.execPath,
            [daemonPath, '--interval', String(intervalMs), '--age', String(ageMs)],
            {
              detached: true,
              stdio: ['ignore', logStream, logStream],
            },
          );

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

          process.kill(pid, 'SIGTERM');
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
            process.kill(pid, 'SIGTERM');
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
```

**Step 2: Verify it compiles**

Run: `cd packages/claude-cleanup && npx tsc -p tsconfig.lib.json --noEmit`
Expected: No errors

**Step 3: Commit**

```bash
git add packages/claude-cleanup/src/monitor.ts
git commit -m "feat(claude-cleanup): add monitor subcommand with start/stop/status/reset"
```

---

### Task 5: Wire `monitor` subcommand into root CLI

**Files:**
- Modify: `packages/claude-cleanup/src/cli.ts:1-231`

**Step 1: Update `cli.ts`**

Add the import at the top with other imports:

```typescript
import { monitorCommand } from './monitor.js';
```

Register the subcommand on the CLI. Change the `claudeCleanupCLI` definition (around line 120) to chain `.commands(monitorCommand)`:

```typescript
const claudeCleanupCLI = cli('claude-cleanup', {
  description: 'Find and kill stale Claude Code sessions',
  builder: (args) =>
    args
      .option('all', {
        type: 'boolean',
        description: 'Kill all stale sessions without prompting',
        default: false,
      })
      .option('age', {
        type: 'string',
        description: 'Staleness threshold (e.g. 2h, 30m, 1d)',
        default: '2h',
      })
      .option('clearCache', {
        type: 'boolean',
        description: 'Clear the summary cache and re-summarize all sessions',
        default: false,
      }),
  handler: async (opts) => {
    // ... existing handler unchanged ...
  },
}).commands(monitorCommand);
```

**Step 2: Verify it compiles and existing tests pass**

Run: `cd packages/claude-cleanup && npx tsc -p tsconfig.lib.json --noEmit && npx vitest run`
Expected: No compile errors, all tests pass

**Step 3: Commit**

```bash
git add packages/claude-cleanup/src/cli.ts
git commit -m "feat(claude-cleanup): wire monitor subcommand into root CLI"
```

---

### Task 6: Build and manual smoke test

**Step 1: Build the project**

Run: `cd packages/claude-cleanup && npm run build`
Expected: Clean build, no errors

**Step 2: Verify help output shows monitor subcommand**

Run: `cd packages/claude-cleanup && node dist/cli.js --help`
Expected: Output includes `monitor` in the commands list

Run: `cd packages/claude-cleanup && node dist/cli.js monitor --help`
Expected: Output shows `start`, `stop`, `status`, `reset` subcommands

**Step 3: Test monitor lifecycle**

```bash
# Start the monitor
node dist/cli.js monitor start --interval 1m --age 2h

# Check status
node dist/cli.js monitor status

# Check log file was created and has the header
cat ~/.claude/claude-cleanup-monitor.log

# Stop it
node dist/cli.js monitor stop

# Verify PID file is gone
ls ~/.claude/claude-cleanup-monitor.pid  # should not exist

# Test reset
node dist/cli.js monitor start --interval 1m --age 2h
node dist/cli.js monitor reset
ls ~/.claude/claude-cleanup-monitor.log  # should not exist
```

**Step 4: Verify root command still works**

Run: `cd packages/claude-cleanup && node dist/cli.js`
Expected: Existing interactive cleanup behavior works as before

**Step 5: Commit any fixes if needed**

---

### Task 7: Update exports in `index.ts`

**Files:**
- Modify: `packages/claude-cleanup/src/index.ts`

**Step 1: Add new exports**

```typescript
export { discoverSessions, classifySessions, getConversationFilePath, encodeCwd, type SessionInfo, type ClassifiedSession, type SessionStatus } from './sessions.js';
export { isProcessRunning, killProcess, formatDuration, shortenPath, assertPlatform } from './process.js';
export { parseAge } from './parse-age.js';
export { MONITOR_PID_FILE, MONITOR_LOG_FILE } from './paths.js';
```

**Step 2: Commit**

```bash
git add packages/claude-cleanup/src/index.ts
git commit -m "feat(claude-cleanup): export parseAge and monitor paths from public API"
```
