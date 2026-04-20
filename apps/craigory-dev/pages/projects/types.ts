import type { Octokit } from '@octokit/rest';

export type ProjectData = GithubProjectData | LocalProjectData;

export type BaseProjectData = {
  repo: string;
  deployment?: string | null;
  documentationUrl?: string | null;
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
  role?: 'owner' | 'contributor';
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
  category?: string;
  /**
   * Marks this local project as the documentation site for another project.
   * The loader hoists its deployment URL onto the target project's
   * `documentationUrl` and drops the docs app from the public list.
   */
  documentationFor?: string;
};

export type RepoData = ProjectData;

export type GithubRepo = Awaited<
  ReturnType<Octokit['rest']['repos']['listForUser']>
>['data'][0];
