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
      if (typeof data.pid !== 'number' || !data.sessionId) continue;
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
