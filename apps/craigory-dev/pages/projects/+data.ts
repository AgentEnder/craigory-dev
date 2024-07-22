import { PageContext } from 'vike/types';
import { Octokit } from '@octokit/rest';
import { GithubRepo, RepoData } from './types';
import { isBefore, subYears } from 'date-fns';
import { basename, dirname, join } from 'path';
import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'fs';
import { fileURLToPath } from 'url';

const client = new Octokit({
  auth: process.env.GITHUB_TOKEN ?? process.env.GH_TOKEN,
});

let githubRequestCount = 0;
const originalRequest = client.request;
const patchedRequest: typeof client.request = ((
  ...args: Parameters<typeof client.request>
) => {
  githubRequestCount++;
  return originalRequest(...args);
}) as Partial<typeof client.request> as typeof client.request;

Object.assign(patchedRequest, originalRequest);

client.request = patchedRequest;

// ENTRY POINT FOR VIKE PRE-RENDERING
export const data = async (pageContext: PageContext) => {
  const workspaceRoot = findWorkspaceRoot(fileURLToPath(import.meta.url));
  const cachePath = join(workspaceRoot, 'tmp', 'github-projects-cache.json');
  try {
    mkdirSync(dirname(cachePath), { recursive: true });
  } catch {
    // ignore
  }
  const cacheData = existsSync(cachePath)
    ? JSON.parse(readFileSync(cachePath, 'utf-8'))
    : null;
  if (cacheData) {
    console.log('Reusing data from', cachePath);
    return cacheData;
  }
  const result = {
    projects: await getAllRepos(),
  };
  console.log('GitHub requests:', githubRequestCount);
  writeFileSync(cachePath, JSON.stringify(result, null, 2));
  return result;
};

const ADDITIONAL_REPOS = [
  {
    owner: 'nx-dotnet',
    name: 'nx-dotnet',
  },
];

const FORBIDDEN_WORDS = [
  // Example / Repro etc.
  'example',
  'demo',
  'sandbox',
  'starter',
  'test',
  'repro',
  'template',

  // Vendors
  'stackblitz',
  'open-sauced',
  /advent.?of.?code/,

  // Personal / schoolwork
  'course',
];

const FORBIDDEN_README_WORDS = ['subscribe to the nx youtube channel'];

const repoFilter = (repo: GithubRepo) => {
  const name = repo.name.toLowerCase();
  const description = repo.description?.toLowerCase() ?? '';

  return (
    !repo.archived &&
    !repo.fork &&
    !name.includes('demo') &&
    !FORBIDDEN_WORDS.some((word) =>
      typeof word === 'string'
        ? name.includes(word) || description.includes(word)
        : word.test(name) || word.test(description)
    ) &&
    !(
      repo.description &&
      repo.description.toLowerCase().includes('deployments of')
    ) &&
    !repo.private &&
    !(repo.updated_at && isBefore(repo.updated_at, subYears(new Date(), 5)))
  );
};

async function getAllRepos() {
  const iterator = await client.paginate.iterator(
    client.rest.repos.listForUser,
    {
      username: 'agentender',
      sort: 'updated',
      per_page: 100,
    }
  );
  const repos: RepoData[] = [];
  // ADDITIONAL_REPOS
  const chunks = ADDITIONAL_REPOS.reduce(
    (acc, repo) => {
      if (acc[acc.length - 1].length < 20) {
        acc[acc.length - 1].push(repo);
      } else {
        acc.push([repo]);
      }
      return acc;
    },
    [[]] as {
      owner: string;
      name: string;
    }[][]
  );
  for (const chunk of chunks) {
    const chunkData = await Promise.all(
      chunk.map(async (repo) => {
        const githubRepo = await client.rest.repos.get({
          owner: repo.owner,
          repo: repo.name,
        });
        return processRepo(githubRepo.data as GithubRepo);
      })
    );
    repos.push(...(chunkData.filter(Boolean) as RepoData[]));
  }
  // If not authenticated, we have extremely limited rate limits.
  // As such, we'll only fetch the additional repos to get a working
  // build.
  if (!(process.env.GH_TOKEN + process.env.GITHUB_TOKEN).length) {
    return {
      projects: repos,
    };
  }
  // MAIN REPOS
  for await (const { data } of iterator) {
    const chunk = await Promise.all(
      data.map((repo) => {
        if (repo.fork) {
          return Promise.resolve();
        }
        return processRepo(repo);
      })
    );
    repos.push(...(chunk.filter(Boolean) as RepoData[]));
  }
  return repos.sort((a, b) => {
    const starDifference = (b.stars ?? 0) - (a.stars ?? 0);
    if (starDifference !== 0) {
      return starDifference > 0 ? 1 : -1;
    }
    return isBefore(b.lastCommit ?? '', a.lastCommit ?? '') ? -1 : 1;
  });
}

async function processRepo(repo: GithubRepo): Promise<RepoData | undefined> {
  if (!repoFilter(repo)) {
    return;
  }

  const [readme, deployment, lastCommit, publishedPackages, languages] =
    await Promise.all([
      getReadme(repo),
      findRepositoryDeployment(repo),
      getLastCommit(repo),
      getPublishedPackages(repo),
      getLanguages(repo),
    ]);

  if (
    readme &&
    FORBIDDEN_README_WORDS.some((word) =>
      readme.toLowerCase().includes(word.toLowerCase())
    )
  ) {
    return;
  }

  return {
    data: repo,
    repo: repo.name,
    deployment,
    description: repo.description,
    url: repo.html_url,
    stars: repo.stargazers_count,
    lastCommit,
    readme,
    publishedPackages,
    languages,
  };
}

async function getReadme(repo: GithubRepo) {
  try {
    return repo.default_branch
      ? (
          await client.request(
            `GET https://raw.githubusercontent.com/${repo.owner.login}/${repo.name}/${repo.default_branch}/README.md`
          )
        ).data
      : null;
  } catch {
    return null;
  }
}

async function getLastCommit(repo: GithubRepo) {
  if (!repo.default_branch) {
    return null;
  }
  try {
    const lastCommit = await client.rest.repos.getCommit({
      owner: repo.owner.login,
      repo: repo.name,
      ref: repo.default_branch,
    });
    return lastCommit.data?.commit.author?.date;
  } catch {
    return null;
  }
}

const LANGUAGE_PERCENTAGE_THRESHOLD = 0.01;
async function getLanguages(repo: GithubRepo) {
  try {
    const languages = await client.rest.repos.listLanguages({
      owner: repo.owner.login,
      repo: repo.name,
    });
    let totalBytes = 0;
    const results: Record<string, number> = {};
    for (const lang in languages.data) {
      totalBytes += languages.data[lang];
    }
    for (const lang in languages.data) {
      const percentage = languages.data[lang] / totalBytes;
      if (percentage >= LANGUAGE_PERCENTAGE_THRESHOLD) {
        results[lang] = Math.round((languages.data[lang] * 100) / totalBytes);
      } else {
        // console.log(
        //   `Dropping ${lang} in ${repo.full_name} due to low percentage: ${percentage}`
        // );
      }
    }
    return results;
  } catch {
    return undefined;
  }
}

async function findRepositoryDeployment(repo: GithubRepo) {
  let url = repo.homepage;
  if (!url) {
    const deployments = await client.rest.repos.listDeployments({
      owner: repo.owner.login,
      repo: repo.name,
    });
    deploymentLoop: for (const deployment of deployments.data) {
      const status = await client.rest.repos.listDeploymentStatuses({
        owner: 'agentender',
        repo: repo.name,
        deployment_id: deployment.id,
      });
      for (const { state, environment_url, target_url } of status.data) {
        if (state === 'success') {
          url = environment_url ?? target_url;
          break deploymentLoop;
        }
      }
    }
  }
  if (!url) {
    return;
  }
  try {
    const response = await fetch(url);
    if (response.ok) {
      return url;
    }
  } catch {
    // inactive
  }
}

async function getPublishedPackages(repo: GithubRepo) {
  // find all package.json files in repo

  const packageJsonFiles: { name: string; private: boolean }[] = [];
  if (!repo.default_branch) {
    return {};
  }
  const allCheckedInFiles = await client.paginate.iterator(client.git.getTree, {
    owner: repo.owner.login,
    repo: repo.name,
    tree_sha: repo.default_branch,
    recursive: 'true',
  });

  for await (const chunk of allCheckedInFiles) {
    await Promise.all(
      chunk.data.tree.map(async (item) => {
        if (!item.type || !item.path || !item.url) {
          return;
        }
        if (item.type === 'blob' && basename(item.path) === 'package.json') {
          const fileContents = await client.request(item.url);
          const result = await fileContents.data;
          if (result.content) {
            const decodedContent = JSON.parse(
              Buffer.from(result.content, 'base64').toString('utf-8')
            );
            packageJsonFiles.push(decodedContent);
          } else {
            console.log('No content?', result);
          }
        }
      })
    );
  }

  const packages: Record<
    string,
    {
      downloads: number;
      registry: 'npm';
      url: string;
    }
  > = {};
  for (const packageJson of packageJsonFiles) {
    if (!packageJson.name || packageJson.private) {
      continue;
    }
    const weeklyDownloadsByVersion: {
      downloads: Record<string, number>;
    } = await fetch(
      `https://api.npmjs.org/versions/${encodeURIComponent(
        packageJson.name
      )}/last-week`
    ).then((res) => res.json());

    for (const [, downloads] of Object.entries(
      weeklyDownloadsByVersion.downloads
    )) {
      packages[packageJson.name] ??= {
        downloads: 0,
        registry: 'npm',
        url: `https://npmjs.com/${packageJson.name}`,
      };
      packages[packageJson.name].downloads += downloads;
    }
  }

  return packages;
  // get the contents of each package.json
}

function findWorkspaceRoot(startingDirectory: string) {
  let last = startingDirectory;
  let next = dirname(startingDirectory);
  while (last !== next) {
    const candidate = join(last, 'nx.json');
    if (existsSync(candidate)) {
      return last;
    }
    last = next;
    next = dirname(next);
  }
  throw new Error('Prerendering should happen inside the Nx workspace');
}
