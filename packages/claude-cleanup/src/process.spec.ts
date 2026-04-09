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
