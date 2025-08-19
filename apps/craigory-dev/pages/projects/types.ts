import type { Octokit } from '@octokit/rest';

export type ProjectData = GithubProjectData | LocalProjectData;

export type BaseProjectData = {
  repo: string;
  deployment?: string | null;
  description?: string | null;
  url: string;
  lastCommit?: string | null;
  stars?: number;
  readme?: string | null;
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

export type GithubProjectData = BaseProjectData & {
  type: 'github';
  data: GithubRepo;
};

export type LocalProjectData = BaseProjectData & {
  type: 'local';
  projectPath: string;
  metadata: LocalProjectMetadata;
};

export type LocalProjectMetadata = {
  name: string;
  description?: string;
  technologies?: string[];
  featured?: boolean;
  order?: number;
};

export type RepoData = ProjectData;

export type GithubRepo = Awaited<
  ReturnType<Octokit['rest']['repos']['listForUser']>
>['data'][0];
