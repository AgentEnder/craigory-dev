import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const WORKSPACE_ROOT = resolve(
  dirname(fileURLToPath(import.meta.url)),
  '../../../..'
);
const GITHUB_CACHE_PATH = `${WORKSPACE_ROOT}/tmp/github-projects-cache.json`;
const LOCAL_CACHE_PATH = `${WORKSPACE_ROOT}/tmp/local-projects-cache.json`;

function createOctokitMock() {
  const request = vi.fn(async () => ({ data: {} }));
  return class OctokitMock {
    request = request;
    rest = {
      repos: {
        get: vi.fn(),
        listForUser: vi.fn(),
        getCommit: vi.fn(),
        listLanguages: vi.fn(),
        listDeployments: vi.fn(),
        listDeploymentStatuses: vi.fn(),
      },
    };
    paginate = {
      iterator: vi.fn(),
    };
  };
}

type TestProject = {
  type: 'github' | 'local';
  repo: string;
  url: string;
  publishedPackages?: Record<
    string,
    {
      downloads: number;
      registry: 'npm';
      url: string;
    }
  >;
};

async function loadDataWithCache({
  githubProjects,
  localProjects,
  fetchMock,
}: {
  githubProjects: TestProject[];
  localProjects: TestProject[];
  fetchMock: (url: string) => Promise<{ status: number; ok: boolean }>;
}) {
  vi.resetModules();
  vi.doUnmock('fs');
  vi.doUnmock('@octokit/rest');
  vi.doUnmock('linguist-js');
  vi.doUnmock('child_process');

  const fileContents = new Map<string, string>([
    [GITHUB_CACHE_PATH, JSON.stringify(githubProjects)],
    [LOCAL_CACHE_PATH, JSON.stringify(localProjects)],
  ]);

  const fsMock = {
    existsSync: (path: string) =>
      path === GITHUB_CACHE_PATH ||
      path === LOCAL_CACHE_PATH ||
      path === `${WORKSPACE_ROOT}/nx.json`,
    readFileSync: (path: string) => fileContents.get(path) ?? '',
    writeFileSync: (path: string, data: string) => {
      fileContents.set(path, data);
    },
    mkdirSync: vi.fn(),
    readdirSync: vi.fn(() => []),
    statSync: vi.fn(() => ({ isDirectory: () => false })),
  };

  vi.doMock('fs', () => ({
    ...fsMock,
    default: fsMock,
  }));

  vi.doMock('@octokit/rest', () => ({
    Octokit: createOctokitMock(),
    default: {
      Octokit: createOctokitMock(),
    },
  }));

  vi.doMock('linguist-js', () => ({
    default: vi.fn(),
  }));

  vi.doMock('child_process', () => ({
    execSync: vi.fn(),
    default: {
      execSync: vi.fn(),
    },
  }));

  vi.stubGlobal(
    'fetch',
    vi.fn(async (input: string | URL) => {
      const url = input.toString();
      const response = await fetchMock(url);
      return response as Response;
    })
  );

  const mod = await import('../../src/data/projects');
  return { projects: await mod.loadAllProjects() };
}

describe('projects +data', () => {
  const originalGhToken = process.env.GH_TOKEN;
  const originalGithubToken = process.env.GITHUB_TOKEN;
  const githubProjectsFixture: TestProject[] = [
    {
      type: 'github',
      repo: 'craigory-dev',
      url: 'https://github.com/AgentEnder/craigory-dev',
      publishedPackages: {
        'pr-digest': {
          downloads: 10,
          registry: 'npm',
          url: 'https://npmjs.com/pr-digest',
        },
        'node-pagefind': {
          downloads: 20,
          registry: 'npm',
          url: 'https://npmjs.com/node-pagefind',
        },
        'another-package': {
          downloads: 30,
          registry: 'npm',
          url: 'https://npmjs.com/another-package',
        },
      },
    },
    {
      type: 'github',
      repo: 'cli-forge',
      url: 'https://github.com/AgentEnder/cli-forge',
      publishedPackages: {
        'some-package': {
          downloads: 0,
          registry: 'npm',
          url: 'https://npmjs.com/some-package',
        },
        'cli-forge': {
          downloads: 100,
          registry: 'npm',
          url: 'https://npmjs.com/cli-forge',
        },
      },
    },
  ];
  const localProjectsFixture: TestProject[] = [
    {
      type: 'local',
      repo: 'pr-digest',
      url: 'https://github.com/AgentEnder/craigory-dev/tree/main/packages/pr-digest',
    },
    {
      type: 'local',
      repo: 'node-pagefind',
      url: 'https://github.com/AgentEnder/craigory-dev/tree/main/packages/node-pagefind',
    },
  ];
  const npmFetchMock = async (url: string) => {
    if (/registry\.npmjs\.org\/some-package\/?$/.test(url)) {
      return { status: 404, ok: false };
    }
    return { status: 200, ok: true };
  };

  beforeEach(() => {
    process.env.GH_TOKEN = '';
    process.env.GITHUB_TOKEN = '';
  });

  afterEach(() => {
    process.env.GH_TOKEN = originalGhToken;
    process.env.GITHUB_TOKEN = originalGithubToken;
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  it('dedupes published packages when package has its own project entry', async () => {
    const result = (await loadDataWithCache({
      githubProjects: githubProjectsFixture,
      localProjects: localProjectsFixture,
      fetchMock: npmFetchMock,
    })) as { projects: TestProject[] };

    const monorepoProject = result.projects.find((p) => p.repo === 'craigory-dev');
    expect(Object.keys(monorepoProject?.publishedPackages ?? {})).toEqual([
      'another-package',
    ]);
    expect(monorepoProject?.publishedPackages?.['another-package']?.url).toBe(
      'https://npmjs.com/package/another-package'
    );

    const prDigest = result.projects.find((p) => p.repo === 'pr-digest');
    const nodePagefind = result.projects.find((p) => p.repo === 'node-pagefind');
    expect(Object.keys(prDigest?.publishedPackages ?? {})).toEqual(['pr-digest']);
    expect(Object.keys(nodePagefind?.publishedPackages ?? {})).toEqual([
      'node-pagefind',
    ]);
  });

  it('drops stale npm packages that are not published', async () => {
    const result = (await loadDataWithCache({
      githubProjects: githubProjectsFixture,
      localProjects: localProjectsFixture,
      fetchMock: npmFetchMock,
    })) as { projects: TestProject[] };

    const cliForge = result.projects.find((p) => p.repo === 'cli-forge');
    expect(result.projects.map((p) => p.repo)).toContain('cli-forge');
    expect(Object.keys(cliForge?.publishedPackages ?? {})).toEqual(['cli-forge']);
    expect(cliForge?.publishedPackages?.['cli-forge']?.url).toBe(
      'https://npmjs.com/package/cli-forge'
    );
  });
});
