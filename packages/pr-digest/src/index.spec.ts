import { describe, it, expect } from 'vitest';
import { parseGitHubUrl } from './utils';

describe('parseGitHubUrl', () => {
  it('should parse GitHub PR URLs', () => {
    const result = parseGitHubUrl('https://github.com/owner/repo/pull/123');
    expect(result).toEqual({
      owner: 'owner',
      repo: 'repo',
      prNumber: 123,
    });
  });

  it('should parse GitHub issue URLs', () => {
    const result = parseGitHubUrl('https://github.com/owner/repo/issues/456');
    expect(result).toEqual({
      owner: 'owner',
      repo: 'repo',
      prNumber: 456,
    });
  });

  it('should handle .git suffix in repo name', () => {
    const result = parseGitHubUrl('https://github.com/owner/repo.git/pull/789');
    expect(result).toEqual({
      owner: 'owner',
      repo: 'repo',
      prNumber: 789,
    });
  });

  it('should return null for invalid URLs', () => {
    expect(
      parseGitHubUrl('https://example.com/owner/repo/pull/123')
    ).toBeNull();
    expect(parseGitHubUrl('not-a-url')).toBeNull();
  });
});
