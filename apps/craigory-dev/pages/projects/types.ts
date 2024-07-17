import type { Octokit } from '@octokit/rest';

export type RepoData = {
  repo: string;
  deployment?: string | null;
  description?: string | null;
  url: string;
  lastCommit?: string | null;
  stars?: number;
  readme?: string | null;
  data: GithubRepo;
  publishedPackages?: Record<
    string,
    {
      downloads: number;
      registry: 'npm';
      url: string;
    }
  >;
  languages?: Record<string, number>;
};

export type GithubRepo = Awaited<
  ReturnType<Octokit['rest']['repos']['listForUser']>
>['data'][0];
