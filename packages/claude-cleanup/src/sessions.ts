import { readdirSync, readFileSync, statSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
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
  lastActivityMs: number;
}

export type SessionStatus = 'active' | 'stale' | 'dead';

export interface ClassifiedSession extends SessionInfo {
  status: SessionStatus;
  staleDurationMs: number;
}

export function encodeCwd(cwd: string): string {
  return cwd.replace(/\//g, '-').replace(/\./g, '-');
}

function getLastActivityMs(
  cwd: string,
  sessionId: string,
  claudeDir: string,
): number {
  const conversationFile = join(
    claudeDir, 'projects', encodeCwd(cwd), `${sessionId}.jsonl`
  );
  try {
    const lines = execFileSync('tail', ['-20', conversationFile], {
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'ignore'],
    }).trim().split('\n').reverse();
    for (const line of lines) {
      try {
        const entry = JSON.parse(line);
        if (entry.timestamp) {
          return new Date(entry.timestamp).getTime();
        }
      } catch {
        // skip malformed lines
      }
    }
    // No timestamp in last 20 lines — fall back to file mtime
    return statSync(conversationFile).mtimeMs;
  } catch {
    console.warn(`Warning: could not read conversation log: ${conversationFile}`);
  }
  // No conversation file at all — use current time so it shows as active
  return Date.now();
}

export function getConversationFilePath(
  cwd: string,
  sessionId: string,
  claudeDir = join(homedir(), '.claude')
): string {
  return join(claudeDir, 'projects', encodeCwd(cwd), `${sessionId}.jsonl`);
}

export function discoverSessions(
  sessionsDir = join(homedir(), '.claude', 'sessions')
): SessionInfo[] {
  const claudeDir = join(sessionsDir, '..');
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
      if (typeof data.pid !== 'number' || !data.sessionId) continue;
      if (data.kind !== 'interactive') continue;
      const lastActivityMs = getLastActivityMs(data.cwd, data.sessionId, claudeDir);
      sessions.push({
        pid: data.pid,
        sessionId: data.sessionId,
        cwd: data.cwd,
        startedAt: data.startedAt,
        kind: data.kind,
        entrypoint: data.entrypoint,
        filePath,
        lastActivityMs,
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
    const age = now - session.lastActivityMs;

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
