#!/usr/bin/env node

import { cli } from 'cli-forge';
import * as p from '@clack/prompts';
import { unlinkSync } from 'node:fs';
import { execFile } from 'node:child_process';

import {
  discoverSessions,
  classifySessions,
  getConversationFilePath,
  type ClassifiedSession,
} from './sessions.js';
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

function summarizeSession(session: ClassifiedSession): Promise<string> {
  const conversationFile = getConversationFilePath(session.cwd, session.sessionId);
  return new Promise((resolve) => {
    execFile('tail', ['-50', conversationFile], (err, stdout) => {
      if (err || !stdout.trim()) {
        resolve('');
        return;
      }
      const claude = execFile(
        'claude',
        ['--model', 'haiku', '-p', 'Summarize what this Claude Code session is about in one brief sentence (under 15 words). Just output the sentence, nothing else.'],
        { timeout: 15000 },
        (err, stdout) => {
          resolve(err ? '' : stdout.trim());
        }
      );
      claude.stdin?.write(stdout);
      claude.stdin?.end();
    });
  });
}

async function summarizeSessions(
  sessions: ClassifiedSession[]
): Promise<Map<string, string>> {
  const summaries = new Map<string, string>();
  const results = await Promise.all(
    sessions.map(async (s) => {
      const summary = await summarizeSession(s);
      return [s.sessionId, summary] as const;
    })
  );
  for (const [id, summary] of results) {
    if (summary) summaries.set(id, summary);
  }
  return summaries;
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

    // Sort oldest → newest by mtime
    classified.sort((a, b) => a.lastActivityMs - b.lastActivityMs);

    const killable = classified.filter((s) => s.status !== 'active');

    if (killable.length === 0) {
      p.log.info(
        `All ${sessions.length} session(s) are active. Nothing to clean up.`
      );
      return;
    }

    p.intro('claude-cleanup');

    const spinner = p.spinner();
    spinner.start('Summarizing sessions...');
    const summaries = await summarizeSessions(classified);
    spinner.stop(`Summarized ${summaries.size} session(s).`);

    let toKill = killable;

    if (!opts.all) {
      const selected = await p.multiselect({
        message: `${classified.length} session(s) (${killable.length} stale):`,
        options: classified.map((s) => {
          let status: string;
          if (s.status === 'dead') {
            status = '[dead]';
          } else if (s.status === 'stale') {
            status = `[stale ${formatDuration(s.staleDurationMs)}]`;
          } else {
            status = `[active ${formatDuration(s.staleDurationMs)} ago]`;
          }
          const summary = summaries.get(s.sessionId);
          const desc = summary
            ? `${shortenPath(s.cwd)} — ${summary}`
            : shortenPath(s.cwd);
          return {
            value: s.sessionId,
            label: `${status} ${desc}`,
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
      toKill = classified.filter((s) => selectedIds.has(s.sessionId));
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
