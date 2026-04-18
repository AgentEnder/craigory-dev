import { Octokit } from '@octokit/rest';
import {
  GithubRepo,
  RepoData,
  LocalProjectData,
  LocalProjectMetadata,
  GithubProjectData,
} from '../../pages/projects/types';
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

// Some orgs (e.g. 'nrwl') block fine-grained PATs by policy — even for reads
// of public data. Since the data we're fetching is all public, fall back to
// an unauthenticated client for any owner that rejects our token.
const publicClient = new Octokit();
const authBlockedOwners = new Set<string>();

function ownerFromRequestOptions(
  options: Record<string, unknown> | undefined
): string | undefined {
  if (!options) return undefined;
  if (typeof options.owner === 'string') return options.owner;
  if (typeof options.username === 'string') return options.username;
  if (typeof options.org === 'string') return options.org;
  if (typeof options.url === 'string') {
    const match = options.url.match(/\/(?:repos|users|orgs)\/([^/]+)/);
    if (match) return match[1];
  }
  return undefined;
}

client.hook.wrap('request', async (request, options) => {
  const owner = ownerFromRequestOptions(
    options as unknown as Record<string, unknown>
  );
  if (owner && authBlockedOwners.has(owner)) {
    return publicClient.request(options);
  }
  try {
    return await request(options);
  } catch (err) {
    const message = (err as { message?: string })?.message ?? '';
    if (message.includes('organization forbids access via a fine-grained')) {
      if (owner) {
        authBlockedOwners.add(owner);
        console.warn(
          `'${owner}' rejects fine-grained PAT; falling back to unauthenticated API for this and future requests to that owner.`
        );
      }
      return publicClient.request(options);
    }
    throw err;
  }
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

// ============================================================================
// NPM Package Types and Functions
// ============================================================================

interface NpmPackageInfo {
  name: string;
  downloads: { weekly: number; monthly: number };
  homepage?: string;
  repository?: string;
  description?: string;
}

interface NpmSearchResult {
  objects: Array<{
    package: {
      name: string;
      links?: {
        homepage?: string;
        repository?: string;
      };
      description?: string;
    };
    downloads: {
      weekly: number;
      monthly: number;
    };
  }>;
  total: number;
}

/**
 * Fetches all npm packages where the user is listed as a maintainer.
 * This is much more efficient than traversing repos to find package.json files.
 */
async function getNpmPackagesByMaintainer(
  maintainer: string
): Promise<Map<string, NpmPackageInfo>> {
  const packages = new Map<string, NpmPackageInfo>();
  let from = 0;
  const size = 250; // Max allowed by npm API
  let hasMore = true;

  while (hasMore) {
    const response = await fetch(
      `https://registry.npmjs.org/-/v1/search?text=maintainer:${encodeURIComponent(maintainer)}&size=${size}&from=${from}`
    );

    if (!response.ok) {
      console.warn(`npm search failed: ${response.status}`);
      break;
    }

    const data: NpmSearchResult = await response.json();

    for (const obj of data.objects) {
      packages.set(obj.package.name, {
        name: obj.package.name,
        downloads: obj.downloads,
        homepage: obj.package.links?.homepage,
        repository: obj.package.links?.repository,
        description: obj.package.description,
      });
    }

    from += size;
    hasMore = from < data.total;
  }

  console.log(`Found ${packages.size} npm packages for maintainer:${maintainer}`);
  return packages;
}

// ============================================================================
// GitHub Code Search Functions
// ============================================================================

interface PackageJsonLocation {
  repoFullName: string;
  path: string;
  gitUrl: string;
}

interface PackageJsonManifest {
  name?: string;
  private?: boolean;
}

/**
 * GitHub's /search/code endpoint is sharded and eventually consistent — a
 * shard that's re-indexing can return 404 (or 5xx) for an otherwise valid
 * query. Retry with exponential backoff so a transient bad shard doesn't
 * fail the whole build.
 */
async function requestWithRetry<T>(
  fn: () => Promise<T>,
  attempts = 4
): Promise<T> {
  let lastErr: unknown;
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (err) {
      lastErr = err;
      const status = (err as { status?: number })?.status;
      const retryable = status === 404 || status === 502 || status === 503;
      if (!retryable || i === attempts - 1) throw err;
      const waitMs = 1000 * 2 ** i + Math.random() * 500;
      console.warn(
        `GitHub request returned ${status}; retrying in ${Math.round(waitMs)}ms (attempt ${i + 2}/${attempts})`
      );
      await new Promise((r) => setTimeout(r, waitMs));
    }
  }
  throw lastErr;
}

/**
 * Uses GitHub code search to find all package.json files across repos.
 * Much more efficient than traversing each repo's file tree.
 */
async function findPackageJsonFiles(
  searchQuery: string
): Promise<PackageJsonLocation[]> {
  const results: PackageJsonLocation[] = [];
  let page = 1;
  const perPage = 100;
  let hasMore = true;

  while (hasMore && page * perPage < 1000) {
    const response = await requestWithRetry(() =>
      client.request('GET /search/code', {
        q: `filename:package.json ${searchQuery}`,
        per_page: perPage,
        page,
      })
    );

    for (const item of response.data.items) {
      results.push({
        repoFullName: item.repository.full_name,
        path: item.path,
        gitUrl: item.git_url ?? '',
      });
    }

    hasMore = response.data.items.length === perPage;
    page++;
  }

  return results;
}

/**
 * Groups package.json locations by repository.
 */
function groupByRepo(
  locations: PackageJsonLocation[]
): Map<string, PackageJsonLocation[]> {
  const grouped = new Map<string, PackageJsonLocation[]>();

  for (const loc of locations) {
    const existing = grouped.get(loc.repoFullName) || [];
    existing.push(loc);
    grouped.set(loc.repoFullName, existing);
  }

  return grouped;
}

// Pre-fetched npm package data, populated at startup
let npmPackageCache: Map<string, NpmPackageInfo> = new Map();

/**
 * Initialize the npm package cache by fetching all packages for the maintainer.
 */
async function initNpmPackageCache(maintainer: string): Promise<void> {
  npmPackageCache = await getNpmPackagesByMaintainer(maintainer);
}

/**
 * Finds all package.json files across user's repos and additional repos.
 * Uses GitHub code search which is much more efficient than per-repo tree traversal.
 */
async function findAllPackageJsonLocations(): Promise<PackageJsonLocation[]> {
  const allLocations: PackageJsonLocation[] = [];

  // Search user's repos
  const userPackages = await findPackageJsonFiles('user:agentender');
  allLocations.push(...userPackages);

  // Search additional repos. Skip contributor repos — their packages
  // aren't ours to advertise, and for large repos (e.g. nrwl/nx) indexing
  // every package.json balloons memory during the SSG build.
  for (const repo of ADDITIONAL_REPOS) {
    if (repo.role === 'contributor') continue;
    const repoPackages = await findPackageJsonFiles(
      `repo:${repo.owner}/${repo.name}`
    );
    allLocations.push(...repoPackages);
  }

  console.log(`Found ${allLocations.length} package.json files via code search`);
  return allLocations;
}

type AdditionalRepo = {
  owner: string;
  name: string;
  role?: 'owner' | 'contributor';
};

const ADDITIONAL_REPOS: AdditionalRepo[] = [
  {
    owner: 'nx-dotnet',
    name: 'nx-dotnet',
  },
  {
    owner: 'nrwl',
    name: 'nx',
    role: 'contributor',
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
const NON_PUBLISHABLE_PACKAGE_PATH_SEGMENTS = new Set([
  '__tests__',
  'demo',
  'demos',
  'doc',
  'docs',
  'e2e',
  'example',
  'examples',
  'fixture',
  'fixtures',
  'playground',
  'sample',
  'samples',
  'sandbox',
  'template',
  'templates',
  'test',
  'tests',
]);
const FORBIDDEN_WORD_EXCEPTIONS = new Set(['agentender/functional-examples']);

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

/**
 * Normalizes git repository URLs to a common format for comparison.
 * Handles formats like:
 * - git+https://github.com/owner/repo.git
 * - https://github.com/owner/repo
 * - git://github.com/owner/repo.git
 */
function normalizeGitUrl(url: string): string {
  if (!url) return '';

  return url
    .toLowerCase()
    .replace(/^git\+/, '')
    .replace(/^git:\/\//, 'https://')
    .replace(/\.git$/, '')
    .replace(/\/$/, '');
}

function isLikelyPublishablePackagePath(path: string): boolean {
  const pathSegments = path.toLowerCase().split('/');
  return !pathSegments.some((segment) =>
    NON_PUBLISHABLE_PACKAGE_PATH_SEGMENTS.has(segment)
  );
}

const npmWeeklyDownloadsCache = new Map<string, number | null>();
async function getNpmWeeklyDownloads(packageName: string): Promise<number | null> {
  if (npmWeeklyDownloadsCache.has(packageName)) {
    return npmWeeklyDownloadsCache.get(packageName) ?? null;
  }

  try {
    const downloadsResponse = await fetch(
      `https://api.npmjs.org/versions/${encodeURIComponent(packageName)}/last-week`
    );
    if (downloadsResponse.status !== 200) {
      npmWeeklyDownloadsCache.set(packageName, null);
      return null;
    }

    const weeklyDownloadsByVersion: {
      downloads: Record<string, number>;
    } = await downloadsResponse.json();
    const totalDownloads = Object.values(
      weeklyDownloadsByVersion.downloads ?? {}
    ).reduce((acc, downloads) => acc + downloads, 0);

    npmWeeklyDownloadsCache.set(packageName, totalDownloads);
    return totalDownloads;
  } catch {
    npmWeeklyDownloadsCache.set(packageName, null);
    return null;
  }
}

const npmPublishStatusCache = new Map<string, boolean>();
async function isPublishedOnNpm(packageName: string): Promise<boolean> {
  if (npmPublishStatusCache.has(packageName)) {
    return npmPublishStatusCache.get(packageName) ?? true;
  }

  try {
    const response = await fetch(
      `https://registry.npmjs.org/${encodeURIComponent(packageName)}`
    );
    if (response.status === 404 || response.status === 405) {
      npmPublishStatusCache.set(packageName, false);
      return false;
    }

    if (!response.ok) {
      // Keep package data on transient registry errors to avoid dropping valid entries.
      return true;
    }

    npmPublishStatusCache.set(packageName, true);
    return true;
  } catch {
    // Keep package data when network checks fail.
    return true;
  }
}

async function normalizePublishedPackageEntries(
  projects: RepoData[]
): Promise<RepoData[]> {
  const projectNames = new Set(
    projects.map((project) => project.repo.toLowerCase())
  );
  const normalizedByProject = new Map<
    string,
    Array<[string, NonNullable<RepoData['publishedPackages']>[string]]>
  >();
  const packageOwners = new Map<
    string,
    [string, NonNullable<RepoData['publishedPackages']>[string]]
  >();

  await Promise.all(
    projects.map(async (project) => {
      if (!project.publishedPackages) {
        normalizedByProject.set(project.repo, []);
        return;
      }

      const normalizedEntries = (
        await Promise.all(
          Object.entries(project.publishedPackages).map(
            async ([packageName, packageInfo]) => {
              if (packageInfo.registry === 'npm') {
                const isPublished = await isPublishedOnNpm(packageName);
                if (!isPublished) {
                  return null;
                }
              }

              return [
                packageName,
                {
                  ...packageInfo,
                  url:
                    packageInfo.registry === 'npm'
                      ? `https://npmjs.com/package/${packageName}`
                      : packageInfo.url,
                },
              ] as [string, NonNullable<RepoData['publishedPackages']>[string]];
            }
          )
        )
      ).filter((entry): entry is [string, NonNullable<RepoData['publishedPackages']>[string]] =>
        entry !== null
      );

      normalizedByProject.set(project.repo, normalizedEntries);
      for (const [packageName, packageInfo] of normalizedEntries) {
        const normalizedPackageName = packageName.toLowerCase();
        const existing = packageOwners.get(normalizedPackageName);
        if (!existing || packageInfo.downloads > existing[1].downloads) {
          packageOwners.set(normalizedPackageName, [packageName, packageInfo]);
        }
      }
    })
  );

  return projects.map((project) => {
    const entries = normalizedByProject.get(project.repo) ?? [];
    const filteredEntries = entries.filter(([packageName]) => {
      const normalizedPackageName = packageName.toLowerCase();
      return (
        normalizedPackageName === project.repo.toLowerCase() ||
        !projectNames.has(normalizedPackageName)
      );
    });

    const ownerEntry = packageOwners.get(project.repo.toLowerCase());
    const ownPackageMissing = ownerEntry
      ? !filteredEntries.some(
          ([packageName]) => packageName.toLowerCase() === project.repo.toLowerCase()
        )
      : false;

    if (ownerEntry && ownPackageMissing) {
      filteredEntries.push(ownerEntry);
    }

    return {
      ...project,
      publishedPackages:
        filteredEntries.length > 0
          ? Object.fromEntries(filteredEntries)
          : undefined,
    };
  });
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
  const fullName = repo.full_name.toLowerCase();
  const isForbiddenWordException = FORBIDDEN_WORD_EXCEPTIONS.has(fullName);

  return (
    !repo.archived &&
    !repo.fork &&
    !name.includes('demo') &&
    (isForbiddenWordException ||
      !FORBIDDEN_WORDS.some((word) =>
        typeof word === 'string'
          ? name.includes(word) || description.includes(word)
          : word.test(name) || word.test(description)
      )) &&
    !(
      repo.description &&
      repo.description.toLowerCase().includes('deployments of')
    ) &&
    !repo.private &&
    !(repo.updated_at && isBefore(repo.updated_at, subYears(new Date(), 5)))
  );
};

async function getAllRepos(
  packageJsonsByRepo: Map<string, PackageJsonLocation[]>
): Promise<RepoData[]> {
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
    [[]] as AdditionalRepo[][]
  );
  for (const chunk of chunks) {
    const chunkData = await Promise.all(
      chunk.map(async (repo) => {
        const githubRepo = await client.rest.repos.get({
          owner: repo.owner,
          repo: repo.name,
        });
        const fullName = `${repo.owner}/${repo.name}`;
        const packageJsons = packageJsonsByRepo.get(fullName) || [];
        return processRepo(
          githubRepo.data as GithubRepo,
          packageJsons,
          repo.role ?? 'owner'
        );
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
        const fullName = repo.full_name;
        const packageJsons = packageJsonsByRepo.get(fullName) || [];
        return processRepo(repo, packageJsons);
      })
    );
    repos.push(...(chunk.filter(Boolean) as RepoData[]));
  }
  return repos;
}

async function processRepo(
  repo: GithubRepo,
  packageJsonLocations: PackageJsonLocation[],
  role: 'owner' | 'contributor' = 'owner'
): Promise<GithubProjectData | undefined> {
  if (!repoFilter(repo)) {
    return;
  }

  // Skip expensive API calls for repos with a homepage already set
  const shouldCheckDeployment = !repo.homepage;

  // Contributor repos are curated by hand, so we skip:
  //  - README: only used for auto-filtering owned repos, and big READMEs
  //    (e.g. nrwl/nx) bloat the SSG data payload.
  //  - publishedPackages: those aren't ours to list, and indexing every
  //    package.json in a large monorepo OOMs the build.
  const isContributor = role === 'contributor';

  const [readme, deployment, lastCommit, publishedPackages, languages] =
    await Promise.all([
      isContributor ? Promise.resolve(undefined) : getReadme(repo),
      shouldCheckDeployment
        ? findRepositoryDeployment(repo)
        : Promise.resolve(repo.homepage ?? undefined),
      getLastCommit(repo),
      isContributor
        ? Promise.resolve(undefined)
        : getPublishedPackages(repo, packageJsonLocations),
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
    role,
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
    // Only fetch the most recent 5 deployments to reduce API calls
    const deployments = await client.rest.repos.listDeployments({
      owner: repo.owner.login,
      repo: repo.name,
      per_page: 5,
    });

    // Process deployments in parallel instead of sequentially
    const statusPromises = deployments.data.map(async (deployment) => {
      try {
        const status = await client.rest.repos.listDeploymentStatuses({
          owner: 'agentender',
          repo: repo.name,
          deployment_id: deployment.id,
          per_page: 1, // Only get the latest status
        });
        const latestStatus = status.data[0];
        if (latestStatus && latestStatus.state === 'success') {
          return latestStatus.environment_url ?? latestStatus.target_url;
        }
      } catch {
        // Ignore errors for individual deployments
      }
      return null;
    });

    const results = await Promise.all(statusPromises);
    url = results.find((u) => u !== null) ?? undefined;
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

async function getPublishedPackages(
  repo: GithubRepo,
  packageJsonLocations: PackageJsonLocation[]
) {
  const packages: Record<
    string,
    {
      downloads: number;
      registry: 'npm';
      url: string;
    }
  > = {};

  if (!repo.default_branch) {
    return packages;
  }

  // Fetch package.json files to get candidate package names in this repository.
  const locationsToFetch = packageJsonLocations.filter(
    (loc) => loc.gitUrl && isLikelyPublishablePackagePath(loc.path)
  );
  const repoPackageNames = new Set<string>();

  // Batch fetch package.json files to get package names
  const BATCH_SIZE = 10;
  for (let i = 0; i < locationsToFetch.length; i += BATCH_SIZE) {
    const batch = locationsToFetch.slice(i, i + BATCH_SIZE);
    const results = await Promise.all(
      batch.map(async (loc) => {
        try {
          const fileContents = await client.request(loc.gitUrl);
          const result = fileContents.data as { content?: string };
          if (result.content) {
            const decodedContent = JSON.parse(
              Buffer.from(result.content, 'base64').toString('utf-8')
            ) as PackageJsonManifest;
            return decodedContent;
          }
        } catch {
          // Ignore fetch errors
        }
        return null;
      })
    );

    // Keep all non-private package names declared in this repo.
    for (const pkg of results) {
      if (!pkg || !pkg.name || pkg.private) continue;
      repoPackageNames.add(pkg.name);
    }
  }

  // First, check npm maintainer matches where the package repository points at this repo.
  // Require that it is also declared in this repo when we have package.json evidence.
  const normalizedRepoUrl = normalizeGitUrl(repo.html_url);
  const maintainerCandidates = Array.from(npmPackageCache.entries())
    .filter(([packageName, info]) => {
      const normalizedPackageRepoUrl = normalizeGitUrl(info.repository ?? '');
      if (!normalizedPackageRepoUrl || normalizedPackageRepoUrl !== normalizedRepoUrl) {
        return false;
      }
      if (repoPackageNames.size === 0) {
        return true;
      }
      return repoPackageNames.has(packageName);
    })
    .map(([packageName]) => packageName);

  const maintainerPackages = await Promise.all(
    maintainerCandidates.map(async (packageName) => {
      const downloads = await getNpmWeeklyDownloads(packageName);
      return downloads === null ? null : { packageName, downloads };
    })
  );

  for (const pkg of maintainerPackages) {
    if (!pkg) continue;
    packages[pkg.packageName] = {
      downloads: pkg.downloads,
      registry: 'npm',
      url: `https://npmjs.com/package/${pkg.packageName}`,
    };
  }

  // For any remaining package names discovered in package.json, verify npm publish status.
  const repoPackageCandidates = Array.from(repoPackageNames).filter(
    (packageName) => !packages[packageName]
  );
  const repoPackages = await Promise.all(
    repoPackageCandidates.map(async (packageName) => {
      const downloads = await getNpmWeeklyDownloads(packageName);
      return downloads === null ? null : { packageName, downloads };
    })
  );

  for (const pkg of repoPackages) {
    if (!pkg) continue;
    packages[pkg.packageName] = {
      downloads: pkg.downloads,
      registry: 'npm',
      url: `https://npmjs.com/package/${pkg.packageName}`,
    };
  }

  return packages;
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

async function getMonorepoPackages(
  workspaceRoot: string
): Promise<LocalProjectData[]> {
  const packagesDir = join(workspaceRoot, 'packages');
  const projects: LocalProjectData[] = [];

  if (!existsSync(packagesDir)) {
    return projects;
  }

  const packageDirs = readdirSync(packagesDir).filter((dir) => {
    const dirPath = join(packagesDir, dir);
    return (
      statSync(dirPath).isDirectory() &&
      existsSync(join(dirPath, 'package.json'))
    );
  });

  for (const pkgDir of packageDirs) {
    const projectPath = join(packagesDir, pkgDir);

    try {
      const packageJson = JSON.parse(
        readFileSync(join(projectPath, 'package.json'), 'utf-8')
      );

      // Skip private packages
      if (packageJson.private) {
        continue;
      }

      const packageName: string = packageJson.name ?? pkgDir;

      // Read optional project-metadata.json for featured/order overrides
      const metadataPath = join(projectPath, 'project-metadata.json');
      const metadataOverrides: Partial<LocalProjectMetadata> =
        existsSync(metadataPath)
          ? JSON.parse(readFileSync(metadataPath, 'utf-8'))
          : {};

      // Fetch npm weekly download stats
      const publishedPackages: Record<
        string,
        { downloads: number; registry: 'npm'; url: string }
      > = {};
      try {
        const downloadsResponse = await fetch(
          `https://api.npmjs.org/versions/${encodeURIComponent(packageName)}/last-week`
        );
        if (downloadsResponse.status === 200) {
          const weeklyDownloadsByVersion: {
            downloads: Record<string, number>;
          } = await downloadsResponse.json();
          let totalDownloads = 0;
          for (const downloads of Object.values(
            weeklyDownloadsByVersion.downloads
          )) {
            totalDownloads += downloads;
          }
          publishedPackages[packageName] = {
            downloads: totalDownloads,
            registry: 'npm',
            url: `https://npmjs.com/package/${packageName}`,
          };
        }
      } catch {
        // Package may not be published yet
      }

      // Language analysis via linguist-js
      const languages: Record<string, number> = {};
      try {
        const analysis = await linguist(projectPath, {
          keepVendored: false,
          quick: false,
        });

        let totalBytes = 0;
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
              if (languages[aliasedLang]) {
                languages[aliasedLang] += percentageValue;
              } else {
                languages[aliasedLang] = percentageValue;
              }
            }
          }
        }
      } catch (error) {
        console.warn(
          `Failed to analyze languages for package ${pkgDir}:`,
          error
        );
      }

      // Get last commit date
      const lastCommit = await getLastCommitDate(projectPath, workspaceRoot);

      // Read README if present
      let readme: string | null = null;
      const readmePath = join(projectPath, 'README.md');
      if (existsSync(readmePath)) {
        readme = readFileSync(readmePath, 'utf-8');
      }

      const metadata: LocalProjectMetadata = {
        name: metadataOverrides.name ?? packageName,
        description: metadataOverrides.description ?? packageJson.description,
        featured: metadataOverrides.featured,
        order: metadataOverrides.order,
      };

      projects.push({
        type: 'local',
        repo: packageName,
        projectPath,
        metadata,
        description: metadata.description,
        url: `https://github.com/AgentEnder/craigory-dev/tree/main/packages/${pkgDir}`,
        readme,
        languages,
        lastCommit: lastCommit?.toISOString(),
        stars: undefined,
        publishedPackages:
          Object.keys(publishedPackages).length > 0
            ? publishedPackages
            : undefined,
      });
    } catch (error) {
      console.warn(`Failed to process monorepo package ${pkgDir}:`, error);
    }
  }

  return projects;
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

      // Check if project has been built (try both locations).
      // Store only the relative path here — the baseUrl is applied in
      // loadAllProjects so that a cached value stays correct when the
      // PUBLIC_ENV__BASE_URL changes between builds (e.g. preview deploys).
      const monorepoDistPath = join(workspaceRoot, 'dist', 'apps', appDir);
      const projectDistPath = join(projectPath, 'dist', 'client');
      const deployment =
        existsSync(monorepoDistPath) || existsSync(projectDistPath)
          ? `/${appDir}`
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
        url: `https://github.com/AgentEnder/craigory-dev/tree/main/apps/${appDir}`,
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

// ============================================================================
// Main entry point - loads all project data
// ============================================================================

export async function loadAllProjects(): Promise<RepoData[]> {
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
    // Initialize npm package cache first - this gets all packages where user is maintainer
    // in a single API call, avoiding per-repo tree traversal
    await initNpmPackageCache('agentender');

    // Find all package.json files via GitHub code search (much faster than tree traversal)
    // This is used for packages where user might not be listed as npm maintainer
    const packageJsonLocations = await findAllPackageJsonLocations();
    const packageJsonsByRepo = groupByRepo(packageJsonLocations);

    githubProjects = await getAllRepos(packageJsonsByRepo);
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
    const [appProjects, packageProjects] = await Promise.all([
      getLocalProjects(workspaceRoot),
      getMonorepoPackages(workspaceRoot),
    ]);
    localProjects = [...appProjects, ...packageProjects];
    writeFileSync(localCachePath, JSON.stringify(localProjects, null, 2));
  }

  // Apply the current base URL to local project deployments. This is done
  // here (rather than at cache-write time) so that the cache — which may have
  // been produced by an earlier build with a different PUBLIC_ENV__BASE_URL —
  // always reflects the base URL of the current build. Without this, preview
  // deployments at /pr/<num> would link to /<appDir> and 404.
  const baseUrl = process.env.PUBLIC_ENV__BASE_URL || '';
  for (const project of localProjects) {
    if (project.deployment && project.projectPath) {
      project.deployment = `${baseUrl}/${basename(project.projectPath)}`;
    }
  }

  const mergedProjects = await normalizePublishedPackageEntries([
    ...githubProjects,
    ...localProjects,
  ]);

  console.log('GitHub requests:', githubRequestCount);

  return mergedProjects.sort((a, b) => {
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
  });
}
