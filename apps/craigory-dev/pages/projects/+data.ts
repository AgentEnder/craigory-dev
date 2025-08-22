import { PageContext } from 'vike/types';
import { Octokit } from '@octokit/rest';
import {
  GithubRepo,
  RepoData,
  LocalProjectData,
  LocalProjectMetadata,
  GithubProjectData,
} from './types';
import { isBefore, subYears } from 'date-fns';
import { basename, dirname, join } from 'path';
import {
  existsSync,
  readFileSync,
  writeFileSync,
  mkdirSync,
  readdirSync,
  statSync,
} from 'fs';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import linguist from 'linguist-js';

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
export const data = async (_pageContext: PageContext) => {
  const workspaceRoot = findWorkspaceRoot(fileURLToPath(import.meta.url));
  const githubCachePath = join(
    workspaceRoot,
    'tmp',
    'github-projects-cache.json'
  );
  const localCachePath = join(
    workspaceRoot,
    'tmp',
    'local-projects-cache.json'
  );

  try {
    mkdirSync(dirname(githubCachePath), { recursive: true });
  } catch {
    // ignore
  }

  // Check for cached GitHub projects
  let githubProjects: RepoData[] = [];
  const githubCacheData = existsSync(githubCachePath)
    ? JSON.parse(readFileSync(githubCachePath, 'utf-8'))
    : null;
  if (githubCacheData) {
    console.log('Reusing GitHub data from', githubCachePath);
    githubProjects = githubCacheData;
  } else {
    githubProjects = await getAllRepos();
    writeFileSync(githubCachePath, JSON.stringify(githubProjects, null, 2));
  }

  // Check for cached local projects
  let localProjects: LocalProjectData[] = [];
  const localCacheData = existsSync(localCachePath)
    ? JSON.parse(readFileSync(localCachePath, 'utf-8'))
    : null;
  if (localCacheData) {
    // if (false) {
    console.log('Reusing local projects data from', localCachePath);
    localProjects = localCacheData;
  } else {
    localProjects = await getLocalProjects(workspaceRoot);
    writeFileSync(localCachePath, JSON.stringify(localProjects, null, 2));
  }

  const result = {
    projects: [...githubProjects, ...localProjects].sort((a, b) => {
      // Sort by featured first, then by custom order, then by last commit date, then by name
      if (
        'metadata' in a &&
        a.metadata.featured &&
        !('metadata' in b && b.metadata.featured)
      )
        return -1;
      if (
        'metadata' in b &&
        b.metadata.featured &&
        !('metadata' in a && a.metadata.featured)
      )
        return 1;
      if ('metadata' in a && 'metadata' in b) {
        const orderA = a.metadata.order ?? 999;
        const orderB = b.metadata.order ?? 999;
        if (orderA !== orderB) return orderA - orderB;
      }

      // Sort by last commit date (most recent first)
      const dateA = a.lastCommit ? new Date(a.lastCommit).getTime() : 0;
      const dateB = b.lastCommit ? new Date(b.lastCommit).getTime() : 0;
      if (dateA !== dateB) return dateB - dateA; // Most recent first

      return a.repo.localeCompare(b.repo);
    }),
  };
  console.log('GitHub requests:', githubRequestCount);
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

// We don't want to show JSON as a technology, it's more of a data format.
const FORBIDDEN_TECHNOLOGIES = ['JSON', 'SVG'];
const ALIAS_TECHNOLOGIES = {
  TSX: 'TypeScript',
};

function applyTechnologyAlias(technology: string): string {
  return (
    ALIAS_TECHNOLOGIES[technology as keyof typeof ALIAS_TECHNOLOGIES] ??
    technology
  );
}

async function getLastCommitDate(
  projectPath: string,
  workspaceRoot: string
): Promise<Date | null> {
  try {
    // Use %ct to get Unix timestamp - more reliable across platforms
    const result = execSync('git log -1 --format=%ct -- ' + projectPath, {
      cwd: workspaceRoot,
      encoding: 'utf8',
      timeout: 5000, // 5 second timeout
    });

    const trimmed = result.trim();
    if (!trimmed.length) {
      return null;
    }
    
    const timestamp = parseInt(trimmed, 10);
    if (isNaN(timestamp)) {
      console.warn('Invalid timestamp from git:', trimmed);
      return null;
    }
    
    const date = new Date(timestamp * 1000);
    console.log('Last commit timestamp:', timestamp);
    console.log('Last commit date:', date.toISOString());
    return date;
  } catch (error) {
    console.log('ERROR:', error);
    // If git command fails, return null (could be no commits, not a git repo, etc.)
    return null;
  }
}

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

async function getAllRepos(): Promise<RepoData[]> {
  const iterator = client.paginate.iterator(client.rest.repos.listForUser, {
    username: 'agentender',
    sort: 'updated',
    per_page: 100,
  });
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
  if (!(process.env.GH_TOKEN ?? '').length) {
    return repos;
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
  return repos;
}

async function processRepo(
  repo: GithubRepo
): Promise<GithubProjectData | undefined> {
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
    type: 'github',
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
      if (
        FORBIDDEN_TECHNOLOGIES.some(
          (tech) => tech.toLowerCase() === lang.toLowerCase()
        )
      ) {
        continue;
      }
      totalBytes += languages.data[lang];
    }
    for (const lang in languages.data) {
      if (
        FORBIDDEN_TECHNOLOGIES.some(
          (tech) => tech.toLowerCase() === lang.toLowerCase()
        )
      ) {
        continue;
      }
      const percentage = languages.data[lang] / totalBytes;
      if (percentage >= LANGUAGE_PERCENTAGE_THRESHOLD) {
        const aliasedLang = applyTechnologyAlias(lang);
        const percentageValue = Math.round(
          (languages.data[lang] * 100) / totalBytes
        );

        // If we already have this aliased language, combine the percentages
        if (results[aliasedLang]) {
          results[aliasedLang] += percentageValue;
        } else {
          results[aliasedLang] = percentageValue;
        }
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
  const allCheckedInFiles = client.paginate.iterator(client.git.getTree, {
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

    packages[packageJson.name] ??= {
      downloads: 0,
      registry: 'npm',
      url: `https://npmjs.com/${packageJson.name}`,
    };

    // check that the package was published
    try {
      const response = await fetch(
        `https://registry.npmjs.org/${encodeURIComponent(packageJson.name)}`
      );
      if (response.status === 404 || response.status === 405) {
        throw new Error('Package not found');
      }
    } catch {
      delete packages[packageJson.name];
      continue;
    }

    const response = await fetch(
      `https://api.npmjs.org/versions/${encodeURIComponent(
        packageJson.name
      )}/last-week`
    );

    // Indicates that the package was not published.
    if (response.status !== 200) {
      delete packages[packageJson.name];
      continue;
    }

    const weeklyDownloadsByVersion: {
      downloads: Record<string, number>;
      error?: string;
      statusCode?: number;
    } = await response.json();

    for (const [, downloads] of Object.entries(
      weeklyDownloadsByVersion.downloads
    )) {
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

async function getLocalProjects(
  workspaceRoot: string
): Promise<LocalProjectData[]> {
  const appsDir = join(workspaceRoot, 'apps');
  const projects: LocalProjectData[] = [];

  if (!existsSync(appsDir)) {
    return projects;
  }

  // Get all directories in apps/
  const appDirs = readdirSync(appsDir).filter((dir) => {
    const dirPath = join(appsDir, dir);
    return statSync(dirPath).isDirectory();
  });

  for (const appDir of appDirs) {
    const projectPath = join(appsDir, appDir);
    const metadataPath = join(projectPath, 'project-metadata.json');

    // Skip if no metadata file exists
    if (!existsSync(metadataPath)) {
      continue;
    }

    try {
      const metadata: LocalProjectMetadata = JSON.parse(
        readFileSync(metadataPath, 'utf-8')
      );

      // Check if project has been built (try both locations)
      const monorepoDistPath = join(workspaceRoot, 'dist', 'apps', appDir);
      const projectDistPath = join(projectPath, 'dist', 'client');
      const deployment =
        existsSync(monorepoDistPath) || existsSync(projectDistPath)
          ? `/projects/${appDir}`
          : undefined;

      // Get README if exists
      let readme: string | null = null;
      const readmePath = join(projectPath, 'README.md');
      if (existsSync(readmePath)) {
        readme = readFileSync(readmePath, 'utf-8');
      }

      // Get last commit date for the project
      const lastCommit = await getLastCommitDate(projectPath, workspaceRoot);

      // Use linguist-js to analyze the project's actual language distribution
      const languages: Record<string, number> = {};
      try {
        const analysis = await linguist(projectPath, {
          keepVendored: false,
          quick: false,
        });

        // Convert linguist results to percentage format similar to GitHub API
        // First, calculate total bytes excluding forbidden technologies
        let totalBytes = 0;
        for (const [lang, data] of Object.entries(analysis.languages.results)) {
          if (
            FORBIDDEN_TECHNOLOGIES.some(
              (tech) => tech.toLowerCase() === lang.toLowerCase()
            )
          ) {
            continue;
          }
          totalBytes += data.bytes;
        }

        if (totalBytes > 0) {
          for (const [lang, data] of Object.entries(
            analysis.languages.results
          )) {
            if (
              FORBIDDEN_TECHNOLOGIES.some(
                (tech) => tech.toLowerCase() === lang.toLowerCase()
              )
            ) {
              continue;
            }
            const percentage = data.bytes / totalBytes;
            if (percentage >= LANGUAGE_PERCENTAGE_THRESHOLD) {
              const aliasedLang = applyTechnologyAlias(lang);
              const percentageValue = Math.round(percentage * 100);

              // If we already have this aliased language, combine the percentages
              if (languages[aliasedLang]) {
                languages[aliasedLang] += percentageValue;
              } else {
                languages[aliasedLang] = percentageValue;
              }
            }
          }
        }
      } catch (error) {
        console.warn(`Failed to analyze languages for ${appDir}:`, error);
        // Fall back to metadata technologies if linguist fails
        if (metadata.technologies && metadata.technologies.length > 0) {
          const techCount = metadata.technologies.length;
          metadata.technologies.forEach((tech) => {
            const aliasedTech = applyTechnologyAlias(tech);
            const percentageValue = Math.round(100 / techCount);

            // If we already have this aliased technology, combine the percentages
            if (languages[aliasedTech]) {
              languages[aliasedTech] += percentageValue;
            } else {
              languages[aliasedTech] = percentageValue;
            }
          });
        }
      }

      const project: LocalProjectData = {
        type: 'local',
        repo: metadata.name || appDir,
        projectPath: projectPath,
        metadata,
        description: metadata.description,
        url: `/projects/${appDir}`,
        deployment,
        readme,
        languages,
        lastCommit: lastCommit?.toISOString(),
        stars: undefined,
        publishedPackages: undefined,
      };

      projects.push(project);
    } catch (error) {
      console.warn(`Failed to process local project ${appDir}:`, error);
    }
  }

  return projects;
}
