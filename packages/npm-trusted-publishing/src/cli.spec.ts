import { describe, it, expect } from 'vitest';

import { parseGitRemote } from './cli.js';

describe('parseGitRemote', () => {
  it('parses SSH remote URL', () => {
    expect(parseGitRemote('git@github.com:AgentEnder/craigory-dev.git')).toBe(
      'AgentEnder/craigory-dev'
    );
  });

  it('parses SSH remote URL without .git suffix', () => {
    expect(parseGitRemote('git@github.com:owner/repo')).toBe('owner/repo');
  });

  it('parses HTTPS remote URL', () => {
    expect(
      parseGitRemote('https://github.com/AgentEnder/craigory-dev.git')
    ).toBe('AgentEnder/craigory-dev');
  });

  it('parses HTTPS remote URL without .git suffix', () => {
    expect(parseGitRemote('https://github.com/owner/repo')).toBe('owner/repo');
  });

  it('throws on unrecognized format', () => {
    expect(() => parseGitRemote('not-a-url')).toThrow(
      'Could not parse git remote URL'
    );
  });
});
