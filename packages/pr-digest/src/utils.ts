import { execSync } from 'child_process';
import { Octokit } from '@octokit/rest';
import type { PrDigestInput } from './types';

export interface GitRepoInfo {
  owner: string;
  repo: string;
  currentBranch: string;
}

export function getGitRepoInfo(): GitRepoInfo | null {
  try {
    const remoteUrl = execSync('git remote get-url origin', {
      encoding: 'utf8',
      stdio: ['inherit', 'pipe'],
    }).trim();

    const patterns = [
      /git@github\.com:([^/]+)\/([^/]+)\.git$/,
      /github\.com[/:]([^/]+)\/([^/]+?)(\.git)?$/,
    ];

    for (const pattern of patterns) {
      const match = remoteUrl.match(pattern);
      if (match) {
        const owner = match[1];
        const repo = match[2];

        const currentBranch = execSync('git branch --show-current', {
          encoding: 'utf8',
          stdio: ['inherit', 'pipe'],
        }).trim();

        return { owner, repo, currentBranch };
      }
    }

    return null;
  } catch (error) {
    console.error(`Failed to get git repo info: ${error}`);
    return null;
  }
}

let cachedToken: string | undefined | null = null;

export async function getGitHubToken(
  providedToken?: string
): Promise<string | undefined> {
  if (providedToken) {
    return providedToken;
  }

  if (cachedToken !== null) {
    return cachedToken;
  }

  if (process.env.GH_TOKEN) {
    cachedToken = process.env.GH_TOKEN;
    return cachedToken;
  }

  if (process.env.GITHUB_TOKEN) {
    cachedToken = process.env.GITHUB_TOKEN;
    return cachedToken;
  }

  try {
    const token = execSync('gh auth token', {
      encoding: 'utf8',
      stdio: ['inherit', 'pipe', 'pipe'],
    }).trim();
    cachedToken = token;
    return token;
  } catch {
    cachedToken = undefined;
    return undefined;
  }
}

export async function getPRFromBranch(
  owner: string,
  repo: string,
  branch: string,
  token?: string
): Promise<number | undefined> {
  const octokit = new Octokit(token ? { auth: token } : undefined);

  try {
    const { data: pulls } = await octokit.rest.pulls.list({
      owner,
      repo,
      head: `${owner}:${branch}`,
      state: 'open',
      per_page: 1,
    });

    if (pulls.length > 0) {
      return pulls[0].number;
    }
    return undefined;
  } catch (error) {
    console.error(`Failed to find PR for branch ${branch}: ${error}`);
    return undefined;
  }
}

export function parseGitHubUrl(
  url: string
): { owner: string; repo: string; prNumber: number } | null {
  const patterns = [
    /github\.com\/([^/]+)\/([^/]+)\/pull\/(\d+)/,
    /github\.com\/([^/]+)\/([^/]+)\/issues\/(\d+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return {
        owner: match[1],
        repo: match[2].replace(/\.git$/, ''),
        prNumber: parseInt(match[3], 10),
      };
    }
  }

  return null;
}

export function validateOptions(options: PrDigestInput): {
  valid: boolean;
  error?: string;
} {
  if (options.url) {
    const parsed = parseGitHubUrl(options.url);
    if (!parsed) {
      return {
        valid: false,
        error: `Invalid GitHub URL: ${options.url}`,
      };
    }
  }

  return { valid: true };
}
