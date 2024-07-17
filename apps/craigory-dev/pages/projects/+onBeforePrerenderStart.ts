import { OnBeforePrerenderStartAsync } from 'vike/types';
import { Octokit } from '@octokit/rest';
import { GithubRepo, RepoData } from './types';
import { isBefore, subYears } from 'date-fns';

const client = new Octokit({
  auth: process.env.GITHUB_TOKEN ?? process.env.GH_TOKEN,
});

export const onBeforePrerenderStart = (async () => {
  return [
    {
      url: '/projects',
      pageContext: {
        data: {
          projects: await getAllRepos(),
        },
      },
    },
  ];
}) satisfies OnBeforePrerenderStartAsync;

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
  'project for',
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
    !isBefore(repo.updated_at!, subYears(new Date(), 5))
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
  for (const repo of ADDITIONAL_REPOS) {
    const githubRepo = await client.rest.repos.get({
      owner: repo.owner,
      repo: repo.name,
    });
    const data = await processRepo(githubRepo.data as GithubRepo);
    if (data) {
      repos.push(data);
    }
  }
  for await (const { data } of iterator) {
    for (const repo of data) {
      if (repo.fork) {
        continue;
      }
      const data = await processRepo(repo);
      if (data) {
        repos.push(data);
      }
    }
  }
  return repos;
}

async function processRepo(repo: GithubRepo): Promise<RepoData | undefined> {
  if (!repoFilter(repo)) {
    return;
  }

  const [readme, deployment, lastCommit] = await Promise.all([
    getReadme(repo),
    findRepositoryDeployment(repo),
    getLastCommit(repo),
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
  try {
    const lastCommit = await client.rest.repos.getCommit({
      owner: repo.owner.login,
      repo: repo.name,
      ref: repo.default_branch!,
    });
    return lastCommit.data?.commit.author?.date;
  } catch {
    return null;
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
