import { readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { execSync } from 'node:child_process';

export interface DiscoveredRepo {
  /** Absolute path to the repo root */
  path: string;
  /** Display name (derived from relative path) */
  name: string;
  /** Normalized remote URL for deduplication */
  remoteUrl: string;
  /** Raw remote URL as returned by git */
  rawRemoteUrl: string;
  /** Default branch (main or master) */
  defaultBranch: string;
}

/**
 * Normalize a git remote URL so SSH and HTTPS variants resolve to the same key.
 * e.g. git@github.com:foo/bar.git -> github.com/foo/bar
 *      https://github.com/foo/bar.git -> github.com/foo/bar
 */
export function normalizeRemoteUrl(url: string): string {
  const normalized = url.trim();

  // SSH: git@github.com:foo/bar.git -> github.com/foo/bar
  const sshMatch = normalized.match(/^git@([^:]+):(.+?)(?:\.git)?$/);
  if (sshMatch) {
    return `${sshMatch[1]}/${sshMatch[2]}`;
  }

  // HTTPS: https://github.com/foo/bar.git -> github.com/foo/bar
  const httpsMatch = normalized.match(
    /^https?:\/\/([^/]+)\/(.+?)(?:\.git)?$/
  );
  if (httpsMatch) {
    return `${httpsMatch[1]}/${httpsMatch[2]}`;
  }

  return normalized;
}

/**
 * Detect the default branch for a repo (main or master).
 */
function detectDefaultBranch(repoPath: string): string {
  try {
    const result = execSync(
      'git symbolic-ref refs/remotes/origin/HEAD 2>/dev/null || echo refs/remotes/origin/main',
      { cwd: repoPath, encoding: 'utf-8' }
    ).trim();
    return result.replace('refs/remotes/origin/', '');
  } catch {
    return 'main';
  }
}

/**
 * Recursively find all git repos under `rootDir` by looking for `.git` directories.
 * Deduplicates by normalized remote URL, keeping the first path found.
 */
export function discoverRepos(rootDir: string): DiscoveredRepo[] {
  const repos: DiscoveredRepo[] = [];
  const seenUrls = new Set<string>();

  function walk(dir: string): void {
    let entries: string[];
    try {
      entries = readdirSync(dir);
    } catch {
      return; // Permission denied, etc.
    }

    if (entries.includes('.git')) {
      // This is a git repo root — don't recurse deeper
      try {
        const rawUrl = execSync('git remote get-url origin', {
          cwd: dir,
          encoding: 'utf-8',
          stdio: ['pipe', 'pipe', 'pipe'],
        }).trim();

        const normalized = normalizeRemoteUrl(rawUrl);

        if (!seenUrls.has(normalized)) {
          seenUrls.add(normalized);
          repos.push({
            path: dir,
            name: dir.replace(rootDir + '/', ''),
            remoteUrl: normalized,
            rawRemoteUrl: rawUrl,
            defaultBranch: detectDefaultBranch(dir),
          });
        }
      } catch {
        // No remote — skip
      }
      return;
    }

    for (const entry of entries) {
      if (
        entry === 'node_modules' ||
        entry === '.git' ||
        entry === 'dist'
      ) {
        continue;
      }
      const fullPath = join(dir, entry);
      try {
        if (statSync(fullPath).isDirectory()) {
          walk(fullPath);
        }
      } catch {
        // Permission denied, broken symlink, etc.
      }
    }
  }

  walk(rootDir);
  return repos;
}
