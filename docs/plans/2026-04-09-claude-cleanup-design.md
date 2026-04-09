# claude-cleanup Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a small published CLI that inspects `~/.claude/sessions/`, identifies stale Claude sessions, and lets you interactively kill them.

**Architecture:** Read session JSON files from `~/.claude/sessions/`, check each PID against the OS process table, classify as stale (process dead or session idle 2h+), present a clack multiselect, then SIGTERM selected PIDs and remove their session files.

**Tech Stack:** TypeScript, cli-forge, @clack/prompts, node:fs, node:child_process, node:os

---

### Task 1: Scaffold the package

**Files:**
- Create: `packages/claude-cleanup/package.json`
- Create: `packages/claude-cleanup/tsconfig.json`
- Create: `packages/claude-cleanup/tsconfig.lib.json`
- Create: `packages/claude-cleanup/tsconfig.spec.json`
- Create: `packages/claude-cleanup/vitest.config.ts`
- Create: `packages/claude-cleanup/src/index.ts`
- Create: `packages/claude-cleanup/src/cli.ts`

**Step 1: Create package.json**

```json
{
  "name": "claude-cleanup",
  "version": "0.0.1",
  "author": {
    "name": "Craigory Coppola",
    "url": "https://craigory.dev"
  },
  "bugs": {
    "url": "https://github.com/AgentEnder/craigory-dev/issues"
  },
  "homepage": "https://craigory.dev",
  "repository": {
    "type": "git",
    "url": "https://github.com/AgentEnder/craigory-dev.git",
    "directory": "packages/claude-cleanup"
  },
  "publishConfig": {
    "access": "public"
  },
  "license": "MIT",
  "type": "module",
  "bin": {
    "claude-cleanup": "./dist/cli.js"
  },
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "types": "./dist/index.d.ts",
      "default": "./dist/index.js"
    }
  },
  "scripts": {
    "build": "tsc -p tsconfig.lib.json",
    "test": "vitest run",
    "test:watch": "vitest",
    "lint": "eslint .",
    "typecheck": "tsc -p tsconfig.json --noEmit",
    "cli": "node dist/cli.js"
  },
  "dependencies": {
    "@clack/prompts": "^0.10.0",
    "cli-forge": "^1.2.0",
    "tslib": "^2.5.0"
  },
  "devDependencies": {
    "@types/node": "22.18.1",
    "@typescript-eslint/eslint-plugin": "7.16.1",
    "@typescript-eslint/parser": "7.16.1",
    "@vitest/coverage-v8": "4.0.9",
    "eslint": "8.57.0",
    "tsx": "^4.21.0",
    "typescript": "5.9.2",
    "vitest": "4.0.9"
  },
  "files": [
    "dist",
    "README.md"
  ]
}
```

**Step 2: Create tsconfig files**

`tsconfig.json`:
```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src",
    "declaration": true,
    "declarationMap": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  },
  "files": [],
  "include": [],
  "references": [
    { "path": "./tsconfig.lib.json" },
    { "path": "./tsconfig.spec.json" }
  ]
}
```

`tsconfig.lib.json`:
```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src",
    "declaration": true,
    "declarationMap": true,
    "composite": true,
    "tsBuildInfoFile": "../../dist/tsc/claude-cleanup.lib.tsbuildinfo"
  },
  "include": ["src/**/*.ts"],
  "exclude": ["src/**/*.spec.ts", "src/**/*.test.ts"],
  "references": []
}
```

`tsconfig.spec.json`:
```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "composite": true,
    "outDir": "./dist-spec",
    "tsBuildInfoFile": "../../dist/tsc/claude-cleanup.spec.tsbuildinfo"
  },
  "include": ["src/**/*.ts"],
  "exclude": []
}
```

**Step 3: Create vitest.config.ts**

```typescript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
  },
});
```

**Step 4: Create stub entry files**

`src/index.ts`:
```typescript
export { discoverSessions, type SessionInfo } from './sessions.js';
```

`src/cli.ts`:
```typescript
#!/usr/bin/env node
// CLI entry — implemented in Task 4
```

**Step 5: Run pnpm install and verify build**

```bash
cd <repo-root>
pnpm install
cd packages/claude-cleanup
pnpm build
```

**Step 6: Commit**

```bash
git add packages/claude-cleanup/
git commit -m "feat(claude-cleanup): scaffold package"
```

---

### Task 2: Implement sessions module

**Files:**
- Create: `packages/claude-cleanup/src/sessions.ts`
- Create: `packages/claude-cleanup/src/sessions.spec.ts`

**Step 1: Write failing tests for session discovery**

`src/sessions.spec.ts`:
```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { discoverSessions, classifySessions, type SessionInfo } from './sessions.js';

// We'll test classifySessions with mock data since discoverSessions reads the filesystem
describe('classifySessions', () => {
  it('marks sessions with dead PIDs as dead', () => {
    const sessions: SessionInfo[] = [
      {
        pid: 99999,
        sessionId: 'abc-123',
        cwd: '/home/user/project',
        startedAt: Date.now(),
        kind: 'interactive',
        entrypoint: 'cli',
        filePath: '/tmp/sessions/99999.json',
        mtimeMs: Date.now(),
      },
    ];

    const isProcessRunning = (_pid: number) => false;
    const result = classifySessions(sessions, { isProcessRunning, maxAgeMs: 2 * 60 * 60 * 1000 });

    expect(result).toHaveLength(1);
    expect(result[0].status).toBe('dead');
  });

  it('marks sessions older than maxAge as stale', () => {
    const threeHoursAgo = Date.now() - 3 * 60 * 60 * 1000;
    const sessions: SessionInfo[] = [
      {
        pid: 12345,
        sessionId: 'abc-456',
        cwd: '/home/user/project',
        startedAt: threeHoursAgo,
        kind: 'interactive',
        entrypoint: 'cli',
        filePath: '/tmp/sessions/12345.json',
        mtimeMs: threeHoursAgo,
      },
    ];

    const isProcessRunning = (_pid: number) => true;
    const result = classifySessions(sessions, { isProcessRunning, maxAgeMs: 2 * 60 * 60 * 1000 });

    expect(result).toHaveLength(1);
    expect(result[0].status).toBe('stale');
  });

  it('marks recent sessions with live PIDs as active', () => {
    const sessions: SessionInfo[] = [
      {
        pid: 12345,
        sessionId: 'abc-789',
        cwd: '/home/user/project',
        startedAt: Date.now(),
        kind: 'interactive',
        entrypoint: 'cli',
        filePath: '/tmp/sessions/12345.json',
        mtimeMs: Date.now(),
      },
    ];

    const isProcessRunning = (_pid: number) => true;
    const result = classifySessions(sessions, { isProcessRunning, maxAgeMs: 2 * 60 * 60 * 1000 });

    expect(result).toHaveLength(1);
    expect(result[0].status).toBe('active');
  });
});
```

**Step 2: Run tests to verify they fail**

```bash
cd packages/claude-cleanup
pnpm test
```
Expected: FAIL — `sessions.js` doesn't exist yet.

**Step 3: Implement sessions module**

`src/sessions.ts`:
```typescript
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { homedir } from 'node:os';

export interface SessionInfo {
  pid: number;
  sessionId: string;
  cwd: string;
  startedAt: number;
  kind: string;
  entrypoint: string;
  filePath: string;
  mtimeMs: number;
}

export type SessionStatus = 'active' | 'stale' | 'dead';

export interface ClassifiedSession extends SessionInfo {
  status: SessionStatus;
  staleDurationMs: number;
}

export function discoverSessions(
  sessionsDir = join(homedir(), '.claude', 'sessions')
): SessionInfo[] {
  let files: string[];
  try {
    files = readdirSync(sessionsDir).filter((f) => f.endsWith('.json'));
  } catch {
    return [];
  }

  const sessions: SessionInfo[] = [];

  for (const file of files) {
    const filePath = join(sessionsDir, file);
    try {
      const raw = readFileSync(filePath, 'utf-8');
      const data = JSON.parse(raw);
      const stat = statSync(filePath);
      sessions.push({
        pid: data.pid,
        sessionId: data.sessionId,
        cwd: data.cwd,
        startedAt: data.startedAt,
        kind: data.kind,
        entrypoint: data.entrypoint,
        filePath,
        mtimeMs: stat.mtimeMs,
      });
    } catch {
      // Skip malformed session files
    }
  }

  return sessions;
}

export function classifySessions(
  sessions: SessionInfo[],
  opts: { isProcessRunning: (pid: number) => boolean; maxAgeMs: number }
): ClassifiedSession[] {
  const now = Date.now();
  return sessions.map((session) => {
    const alive = opts.isProcessRunning(session.pid);
    const age = now - session.mtimeMs;

    let status: SessionStatus;
    if (!alive) {
      status = 'dead';
    } else if (age >= opts.maxAgeMs) {
      status = 'stale';
    } else {
      status = 'active';
    }

    return { ...session, status, staleDurationMs: age };
  });
}
```

**Step 4: Run tests to verify they pass**

```bash
cd packages/claude-cleanup
pnpm test
```
Expected: PASS

**Step 5: Commit**

```bash
git add packages/claude-cleanup/src/sessions.ts packages/claude-cleanup/src/sessions.spec.ts
git commit -m "feat(claude-cleanup): add session discovery and classification"
```

---

### Task 3: Implement process utilities

**Files:**
- Create: `packages/claude-cleanup/src/process.ts`
- Create: `packages/claude-cleanup/src/process.spec.ts`

**Step 1: Write failing tests**

`src/process.spec.ts`:
```typescript
import { describe, it, expect } from 'vitest';
import { isProcessRunning, assertPlatform, formatDuration, shortenPath } from './process.js';

describe('isProcessRunning', () => {
  it('returns true for the current process', () => {
    expect(isProcessRunning(process.pid)).toBe(true);
  });

  it('returns false for a non-existent PID', () => {
    expect(isProcessRunning(999999999)).toBe(false);
  });
});

describe('assertPlatform', () => {
  it('does not throw on the current platform (darwin/linux)', () => {
    // This test runs on macOS/Linux CI
    expect(() => assertPlatform()).not.toThrow();
  });
});

describe('formatDuration', () => {
  it('formats hours and minutes', () => {
    const ms = 3 * 60 * 60 * 1000 + 12 * 60 * 1000;
    expect(formatDuration(ms)).toBe('3h 12m');
  });

  it('formats minutes only when under 1 hour', () => {
    const ms = 45 * 60 * 1000;
    expect(formatDuration(ms)).toBe('45m');
  });

  it('formats days', () => {
    const ms = 2 * 24 * 60 * 60 * 1000 + 5 * 60 * 60 * 1000;
    expect(formatDuration(ms)).toBe('2d 5h');
  });
});

describe('shortenPath', () => {
  it('replaces homedir with ~', () => {
    const home = process.env.HOME || '/home/user';
    expect(shortenPath(`${home}/projects/foo`)).toBe('~/projects/foo');
  });

  it('leaves non-home paths unchanged', () => {
    expect(shortenPath('/tmp/foo')).toBe('/tmp/foo');
  });
});
```

**Step 2: Run tests to verify they fail**

```bash
cd packages/claude-cleanup
pnpm test
```
Expected: FAIL — `process.js` doesn't exist.

**Step 3: Implement process module**

`src/process.ts`:
```typescript
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
    return true;
  } catch {
    return false;
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
```

**Step 4: Run tests to verify they pass**

```bash
cd packages/claude-cleanup
pnpm test
```
Expected: PASS

**Step 5: Commit**

```bash
git add packages/claude-cleanup/src/process.ts packages/claude-cleanup/src/process.spec.ts
git commit -m "feat(claude-cleanup): add process utilities"
```

---

### Task 4: Implement the CLI

**Files:**
- Modify: `packages/claude-cleanup/src/cli.ts`
- Modify: `packages/claude-cleanup/src/index.ts`

**Step 1: Implement CLI entry point**

`src/cli.ts`:
```typescript
#!/usr/bin/env node

import { cli } from 'cli-forge';
import * as p from '@clack/prompts';
import { unlinkSync } from 'node:fs';

import { discoverSessions, classifySessions } from './sessions.js';
import {
  assertPlatform,
  isProcessRunning,
  killProcess,
  formatDuration,
  shortenPath,
} from './process.js';

function parseAge(age: string): number {
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
      }),
  handler: async (opts) => {
    assertPlatform();

    const maxAgeMs = parseAge(opts.age);
    const sessions = discoverSessions();

    if (sessions.length === 0) {
      p.log.info('No Claude sessions found.');
      return;
    }

    const classified = classifySessions(sessions, {
      isProcessRunning,
      maxAgeMs,
    });

    const killable = classified.filter((s) => s.status !== 'active');

    if (killable.length === 0) {
      p.log.info(
        `All ${sessions.length} session(s) are active. Nothing to clean up.`
      );
      return;
    }

    p.intro('claude-cleanup');

    let toKill = killable;

    if (!opts.all) {
      const selected = await p.multiselect({
        message: `Found ${killable.length} stale session(s):`,
        options: killable.map((s) => {
          const label =
            s.status === 'dead'
              ? `[dead]         ${shortenPath(s.cwd)}`
              : `[stale ${formatDuration(s.staleDurationMs)}] ${shortenPath(s.cwd)}`;
          return {
            value: s.pid,
            label,
            hint: `PID: ${s.pid}`,
          };
        }),
        initialValues: killable.map((s) => s.pid),
      });

      if (p.isCancel(selected)) {
        p.cancel('Cancelled.');
        process.exit(0);
      }

      const selectedPids = new Set(selected as number[]);
      toKill = killable.filter((s) => selectedPids.has(s.pid));
    }

    let killed = 0;
    let cleaned = 0;

    for (const session of toKill) {
      if (session.status !== 'dead') {
        if (killProcess(session.pid)) {
          killed++;
        }
      }

      try {
        unlinkSync(session.filePath);
        cleaned++;
      } catch {
        // Session file may already be gone
      }
    }

    p.outro(
      `Done. Killed ${killed} process(es), removed ${cleaned} session file(s).`
    );
  },
});

export default claudeCleanupCLI;

claudeCleanupCLI.forge();
```

**Step 2: Update index.ts exports**

`src/index.ts`:
```typescript
export { discoverSessions, classifySessions, type SessionInfo, type ClassifiedSession } from './sessions.js';
export { isProcessRunning, killProcess, formatDuration, shortenPath, assertPlatform } from './process.js';
```

**Step 3: Build and verify**

```bash
cd packages/claude-cleanup
pnpm build
```
Expected: Clean compilation

**Step 4: Add tsconfig path alias in root tsconfig.base.json**

Add to `paths` in `tsconfig.base.json`:
```json
"@new-personal-monorepo/claude-cleanup": ["packages/claude-cleanup/src/index.ts"]
```

**Step 5: Run full test suite**

```bash
cd packages/claude-cleanup
pnpm test
```
Expected: All tests pass

**Step 6: Commit**

```bash
git add packages/claude-cleanup/src/cli.ts packages/claude-cleanup/src/index.ts tsconfig.base.json
git commit -m "feat(claude-cleanup): implement CLI with interactive session cleanup"
```

---

### Task 5: Install, build, smoke test

**Step 1: Run pnpm install from root**

```bash
cd <repo-root>
pnpm install
```

**Step 2: Build the package**

```bash
cd packages/claude-cleanup
pnpm build
```

**Step 3: Smoke test the CLI**

```bash
node packages/claude-cleanup/dist/cli.js --help
```
Expected: Shows usage with `--all` and `--age` options.

**Step 4: Verify typecheck**

```bash
cd packages/claude-cleanup
pnpm typecheck
```
Expected: No errors.

**Step 5: Commit any final adjustments**

Only if needed from smoke test fixes.
