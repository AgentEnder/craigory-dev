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
            value: s.sessionId,
            label,
            hint: `PID: ${s.pid}`,
          };
        }),
        initialValues: killable.map((s) => s.sessionId),
      });

      if (p.isCancel(selected)) {
        p.cancel('Cancelled.');
        process.exit(0);
      }

      const selectedIds = new Set(selected as string[]);
      toKill = killable.filter((s) => selectedIds.has(s.sessionId));
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
