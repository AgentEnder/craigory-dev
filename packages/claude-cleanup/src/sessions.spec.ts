import { describe, it, expect } from 'vitest';
import { classifySessions, type SessionInfo } from './sessions.js';

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
