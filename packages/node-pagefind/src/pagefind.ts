import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync,
} from 'fs';
import { mkdir, writeFile } from 'fs/promises';
import { tmpdir } from 'os';
import { dirname, join, resolve } from 'path';

import type {
  PagefindClientOptions,
  PagefindFilterMap,
  PagefindModule,
  PagefindSearchOptions,
  PagefindSearchResponse,
} from './types.js';

// Shim window and location for basePath resolution
global.window ??= undefined;
global.document ??= undefined;

const CACHE_ROOT = join(tmpdir(), 'node-pagefind');
const KNOWN_VERSIONS_PATH = join(CACHE_ROOT, 'known-versions.json');

/** Files that belong in the version cache (pagefind runtime, shared across sites) */
const VERSION_CACHE_PATTERNS = [/^pagefind\.js$/, /\.pagefind$/, /\.wasm$/];

type KnownVersions = Record<string, string>;

interface PagefindEntry {
  version: string;
  languages: Record<
    string,
    { hash: string; wasm: string; page_count: number }
  >;
}

function readKnownVersions(): KnownVersions {
  if (!existsSync(KNOWN_VERSIONS_PATH)) {
    return {};
  }
  return JSON.parse(readFileSync(KNOWN_VERSIONS_PATH, 'utf-8'));
}

function writeKnownVersions(versions: KnownVersions): void {
  if (!existsSync(CACHE_ROOT)) {
    mkdirSync(CACHE_ROOT, { recursive: true });
  }
  writeFileSync(KNOWN_VERSIONS_PATH, JSON.stringify(versions, null, 2));
}

/**
 * Derive a filesystem-safe directory name from a URL.
 * e.g. "https://nx.dev/docs/pagefind" → "nx.dev_docs"
 */
function dataSourceKey(pagefindPath: string): string {
  try {
    const url = new URL(pagefindPath);
    // Strip the trailing /pagefind from the path
    const basePath = url.pathname.replace(/\/pagefind\/?$/, '');
    const key = url.hostname + basePath.replace(/\//g, '_');
    return key || url.hostname;
  } catch {
    // Fallback for non-URL paths
    return pagefindPath.replace(/[^a-zA-Z0-9.-]/g, '_');
  }
}

function isVersionLevelFile(filename: string): boolean {
  return VERSION_CACHE_PATTERNS.some((p) => p.test(filename));
}

/**
 * Fetch pagefind-entry.json to get version without downloading the full JS bundle.
 */
async function fetchEntryJson(pagefindPath: string): Promise<PagefindEntry> {
  const url = `${pagefindPath}/pagefind-entry.json`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(
      `Failed to fetch pagefind-entry.json: ${response.status}`
    );
  }
  return response.json() as Promise<PagefindEntry>;
}

/**
 * Install a fetch interceptor that caches pagefind requests to two directories:
 * - versionCacheDir: for pagefind.js and WASM (shared across data sources)
 * - dataSourceCacheDir: for index fragments and metadata (site-specific)
 *
 * Returns a cleanup function to restore the original fetch.
 */
function installCachingFetch(
  pagefindBaseUrl: string,
  versionCacheDir: string,
  dataSourceCacheDir: string,
  verbose = false
): () => void {
  const originalFetch = globalThis.fetch;

  globalThis.fetch = async (
    input: string | URL | Request,
    init?: RequestInit
  ): Promise<Response> => {
    const url =
      typeof input === 'string'
        ? input
        : input instanceof URL
          ? input.toString()
          : input.url;

    // Only intercept requests to the pagefind base URL
    if (!url.startsWith(pagefindBaseUrl)) {
      return originalFetch(input, init);
    }

    // Derive a local filename from the URL path relative to pagefind base
    const relativePath = url.slice(pagefindBaseUrl.length).replace(/^\//, '');
    const cleanPath = relativePath.split('?')[0];

    // Route to the appropriate cache directory
    const cacheDir = isVersionLevelFile(cleanPath)
      ? versionCacheDir
      : dataSourceCacheDir;
    const cachedFile = join(cacheDir, cleanPath);

    // Serve from cache if available
    if (existsSync(cachedFile)) {
      const buffer = readFileSync(cachedFile);
      if (verbose) {
        console.error(`[fetch] CACHE HIT  ${cleanPath} (${buffer.length} bytes)`);
      }
      return new Response(buffer, {
        status: 200,
        headers: { 'content-type': 'application/octet-stream' },
      });
    }

    // Fetch from remote
    if (verbose) {
      console.error(`[fetch] GET        ${url}`);
    }
    const response = await originalFetch(input, init);
    if (verbose) {
      console.error(
        `[fetch] ${response.ok ? 'OK' : 'FAIL'}        ${url} → ${response.status}`
      );
    }
    if (response.ok) {
      const buffer = Buffer.from(await response.clone().arrayBuffer());
      // Write to cache asynchronously — don't block the response
      mkdir(dirname(cachedFile), { recursive: true }).then(() =>
        writeFile(cachedFile, buffer).then(() => {
          if (verbose) {
            console.error(
              `[fetch] CACHED     ${cleanPath} (${buffer.length} bytes)`
            );
          }
        })
      );
    }

    return response;
  };

  return () => {
    globalThis.fetch = originalFetch;
  };
}

export class PagefindClient {
  private localPath: string | null;
  private baseUrl: string;
  private pagefindPath: string;
  private cachePath: string | null;
  private verbose: boolean;
  private skipCache: boolean;
  private initialized = false;
  private pagefindModule: PagefindModule | null = null;
  private removeFetchInterceptor: (() => void) | null = null;

  constructor(options: PagefindClientOptions = {}) {
    this.localPath = options.localPath
      ? this.resolveLocalPath(options.localPath)
      : null;
    this.baseUrl = options.baseUrl;
    this.verbose = options.verbose ?? false;
    this.skipCache = options.skipCache ?? false;

    if (!this.localPath && !this.baseUrl) {
      throw new Error('Either localPath or baseUrl must be provided');
    }

    this.pagefindPath = this.localPath
      ? this.localPath
      : `${this.baseUrl.replace(/\/$/, '')}/pagefind`;
    this.cachePath = options.cachePath ?? null;
  }

  private resolveLocalPath(inputPath: string): string {
    const resolved = resolve(inputPath);

    if (existsSync(join(resolved, 'pagefind.js'))) {
      return resolved;
    }

    const withSubdir = join(resolved, 'pagefind');
    if (existsSync(join(withSubdir, 'pagefind.js'))) {
      return withSubdir;
    }

    throw new Error(
      `Could not find pagefind.js in "${resolved}" or "${withSubdir}"`
    );
  }

  async init(language = 'en'): Promise<this> {
    if (this.initialized) {
      return this;
    }

    const loaded = await this.loadPagefind(this.skipCache);
    this.pagefindModule = loaded.pagefindModule;

    // Install fetch interceptor for remote sources so pagefind's internal
    // fetches (WASM, metadata, index fragments) are cached transparently.
    if (!this.skipCache && !this.localPath && loaded.versionCacheDir) {
      this.removeFetchInterceptor = installCachingFetch(
        this.pagefindPath,
        loaded.versionCacheDir,
        loaded.dataSourceCacheDir!,
        this.verbose
      );
    }

    this.pagefindModule.options({
      basePath: this.pagefindPath,
      baseUrl: this.localPath ? `file://${this.localPath}` : this.baseUrl,
    });

    try {
      await this.pagefindModule.init(language);
    } catch (err) {
      // Version mismatch — invalidate cache and retry once
      if (!this.localPath) {
        this.cleanup();
        this.invalidateDataSourceCache();
        const reloaded = await this.loadPagefind(true);
        this.pagefindModule = reloaded.pagefindModule;
        if (!this.skipCache && reloaded.versionCacheDir) {
          this.removeFetchInterceptor = installCachingFetch(
            this.pagefindPath,
            reloaded.versionCacheDir,
            reloaded.dataSourceCacheDir!,
            this.verbose
          );
        }
        this.pagefindModule.options({
          basePath: this.pagefindPath,
          baseUrl: this.baseUrl,
        });
        await this.pagefindModule.init(language);
      } else {
        throw err;
      }
    }

    this.initialized = true;
    return this;
  }

  /**
   * Remove the fetch interceptor. Call this when you're done using the client
   * to restore the original global fetch.
   */
  cleanup(): void {
    if (this.removeFetchInterceptor) {
      this.removeFetchInterceptor();
      this.removeFetchInterceptor = null;
    }
  }

  /** Invalidate only the data-source-specific cache (index fragments). */
  private invalidateDataSourceCache(): void {
    if (this.cachePath) {
      const cacheDir = resolve(this.cachePath);
      if (existsSync(cacheDir)) {
        rmSync(cacheDir, { recursive: true, force: true });
      }
      return;
    }

    const dsKey = dataSourceKey(this.pagefindPath);
    const dsDir = join(CACHE_ROOT, dsKey);
    if (existsSync(dsDir)) {
      rmSync(dsDir, { recursive: true, force: true });
    }
  }

  private async loadPagefind(skipCache = false): Promise<{
    pagefindModule: PagefindModule;
    versionCacheDir: string | null;
    dataSourceCacheDir: string | null;
  }> {
    if (this.localPath) {
      const localFile = join(this.localPath, 'pagefind.js');
      const fileUrl = `file://localhost${localFile}`;
      return {
        pagefindModule: (await import(fileUrl)) as PagefindModule,
        versionCacheDir: null,
        dataSourceCacheDir: null,
      };
    }

    if (this.cachePath) {
      return this.loadWithCustomCache(skipCache);
    }

    return this.loadWithVersionCache(skipCache);
  }

  private async loadWithCustomCache(skipCache: boolean): Promise<{
    pagefindModule: PagefindModule;
    versionCacheDir: string;
    dataSourceCacheDir: string;
  }> {
    // Custom cache: everything goes in one dir (no version separation)
    const cacheDir = resolve(this.cachePath!);
    const cachedJs = join(cacheDir, 'pagefind.js');

    if (!skipCache && existsSync(cachedJs)) {
      const fileUrl = `file://localhost${cachedJs}`;
      return {
        pagefindModule: (await import(fileUrl)) as PagefindModule,
        versionCacheDir: cacheDir,
        dataSourceCacheDir: cacheDir,
      };
    }

    const content = await this.downloadText(
      `${this.pagefindPath}/pagefind.js`
    );
    if (!existsSync(cacheDir)) {
      mkdirSync(cacheDir, { recursive: true });
    }
    writeFileSync(cachedJs, content);

    const fileUrl = `file://localhost${cachedJs}`;
    return {
      pagefindModule: (await import(fileUrl)) as PagefindModule,
      versionCacheDir: cacheDir,
      dataSourceCacheDir: cacheDir,
    };
  }

  private async loadWithVersionCache(skipCache: boolean): Promise<{
    pagefindModule: PagefindModule;
    versionCacheDir: string;
    dataSourceCacheDir: string;
  }> {
    const dataSource = this.pagefindPath;
    const dsKey = dataSourceKey(dataSource);
    const dsDir = join(CACHE_ROOT, dsKey);

    // Check known versions map for a cached copy
    if (!skipCache) {
      const versions = readKnownVersions();
      const knownVersion = versions[dataSource];
      if (knownVersion) {
        const versionDir = join(CACHE_ROOT, knownVersion);
        const cachedJs = join(versionDir, 'pagefind.js');
        if (existsSync(cachedJs)) {
          // Check if entry.json has changed (content update without version bump)
          const cachedEntryPath = join(dsDir, 'pagefind-entry.json');
          if (existsSync(cachedEntryPath)) {
            try {
              if (this.verbose) {
                console.error(
                  `[fetch] GET        ${dataSource}/pagefind-entry.json`
                );
              }
              const remoteEntry = await fetchEntryJson(dataSource);
              const cachedEntry: PagefindEntry = JSON.parse(
                readFileSync(cachedEntryPath, 'utf-8')
              );
              if (
                JSON.stringify(remoteEntry) !== JSON.stringify(cachedEntry)
              ) {
                // Content changed — invalidate data source cache, update entry
                if (existsSync(dsDir)) {
                  rmSync(dsDir, { recursive: true, force: true });
                }
                mkdirSync(dsDir, { recursive: true });
                writeFileSync(
                  cachedEntryPath,
                  JSON.stringify(remoteEntry, null, 2)
                );

                // If version also changed, need new pagefind.js
                if (remoteEntry.version !== knownVersion) {
                  return this.downloadAndCacheVersion(
                    dataSource,
                    remoteEntry,
                    dsDir
                  );
                }
              }
            } catch {
              // If we can't fetch entry.json, use stale cache
            }
          }

          const fileUrl = `file://localhost${cachedJs}`;
          return {
            pagefindModule: (await import(fileUrl)) as PagefindModule,
            versionCacheDir: versionDir,
            dataSourceCacheDir: dsDir,
          };
        }
      }
    }

    // No cache — fetch entry.json for version, then download pagefind.js
    if (this.verbose) {
      console.error(
        `[fetch] GET        ${dataSource}/pagefind-entry.json`
      );
    }
    const entry = await fetchEntryJson(dataSource);
    return this.downloadAndCacheVersion(dataSource, entry, dsDir);
  }

  private async downloadAndCacheVersion(
    dataSource: string,
    entry: PagefindEntry,
    dsDir: string
  ): Promise<{
    pagefindModule: PagefindModule;
    versionCacheDir: string;
    dataSourceCacheDir: string;
  }> {
    const version = entry.version;
    const versionDir = join(CACHE_ROOT, version);
    const cachedJs = join(versionDir, 'pagefind.js');

    // Download pagefind.js if not already cached for this version
    if (!existsSync(cachedJs)) {
      const content = await this.downloadText(
        `${this.pagefindPath}/pagefind.js`
      );
      if (!existsSync(versionDir)) {
        mkdirSync(versionDir, { recursive: true });
      }
      writeFileSync(cachedJs, content);
    }

    // Save entry.json in the data source dir
    if (!existsSync(dsDir)) {
      mkdirSync(dsDir, { recursive: true });
    }
    writeFileSync(
      join(dsDir, 'pagefind-entry.json'),
      JSON.stringify(entry, null, 2)
    );

    // Update known versions map
    const versions = readKnownVersions();
    versions[dataSource] = version;
    writeKnownVersions(versions);

    const fileUrl = `file://localhost${cachedJs}`;
    return {
      pagefindModule: (await import(fileUrl)) as PagefindModule,
      versionCacheDir: versionDir,
      dataSourceCacheDir: dsDir,
    };
  }

  private async downloadText(url: string): Promise<string> {
    if (this.verbose) {
      console.error(`[fetch] GET        ${url}`);
    }
    const response = await fetch(url);
    if (this.verbose) {
      console.error(
        `[fetch] ${response.ok ? 'OK' : 'FAIL'}        ${url} → ${response.status}`
      );
    }
    if (!response.ok) {
      throw new Error(`Failed to download ${url}: ${response.status}`);
    }
    return response.text();
  }

  async search(
    query: string,
    options: PagefindSearchOptions = {}
  ): Promise<PagefindSearchResponse> {
    if (!this.initialized) {
      await this.init(options.language);
    }

    return this.pagefindModule!.search(query, {
      filters: options.filters,
    });
  }

  async filters(): Promise<PagefindFilterMap> {
    if (!this.initialized) {
      await this.init();
    }

    return this.pagefindModule!.filters();
  }

  getInfo(): { baseUrl: string; pagefindPath: string; initialized: boolean } {
    return {
      baseUrl: this.baseUrl,
      pagefindPath: this.pagefindPath,
      initialized: this.initialized,
    };
  }
}

export interface CacheFileInfo {
  name: string;
  size: number;
}

export interface VersionCacheInfo {
  version: string;
  path: string;
  files: CacheFileInfo[];
  totalSize: number;
  dataSources: string[];
}

export interface DataSourceCacheInfo {
  key: string;
  path: string;
  entry: PagefindEntry | null;
  files: CacheFileInfo[];
  totalSize: number;
  mappedVersion: string | null;
}

export interface CacheInspection {
  cacheRoot: string;
  versions: VersionCacheInfo[];
  dataSources: DataSourceCacheInfo[];
  knownVersions: KnownVersions;
  totalSize: number;
}

function listFiles(dir: string): CacheFileInfo[] {
  if (!existsSync(dir)) return [];
  const files: CacheFileInfo[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.isFile()) {
      const fullPath = join(dir, entry.name);
      files.push({ name: entry.name, size: statSync(fullPath).size });
    } else if (entry.isDirectory()) {
      for (const sub of listFiles(join(dir, entry.name))) {
        files.push({ name: `${entry.name}/${sub.name}`, size: sub.size });
      }
    }
  }
  return files;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Inspect the global pagefind cache and return structured information
 * about all cached versions and data sources.
 */
export function inspectCache(): CacheInspection {
  const knownVersions = readKnownVersions();

  // Build reverse map: version → data sources that use it
  const versionToSources: Record<string, string[]> = {};
  for (const [source, version] of Object.entries(knownVersions)) {
    (versionToSources[version] ??= []).push(source);
  }

  const versions: VersionCacheInfo[] = [];
  const dataSources: DataSourceCacheInfo[] = [];

  if (!existsSync(CACHE_ROOT)) {
    return {
      cacheRoot: CACHE_ROOT,
      versions: [],
      dataSources: [],
      knownVersions,
      totalSize: 0,
    };
  }

  // Identify version dirs (semver-like names) vs data source dirs
  const semverPattern = /^\d+\.\d+\.\d+/;
  for (const entry of readdirSync(CACHE_ROOT, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;

    const dirPath = join(CACHE_ROOT, entry.name);

    if (semverPattern.test(entry.name)) {
      // Version cache directory
      const files = listFiles(dirPath);
      const totalSize = files.reduce((sum, f) => sum + f.size, 0);
      versions.push({
        version: entry.name,
        path: dirPath,
        files,
        totalSize,
        dataSources: versionToSources[entry.name] ?? [],
      });
    } else {
      // Data source cache directory
      const files = listFiles(dirPath);
      const totalSize = files.reduce((sum, f) => sum + f.size, 0);
      const entryJsonPath = join(dirPath, 'pagefind-entry.json');
      let parsedEntry: PagefindEntry | null = null;
      if (existsSync(entryJsonPath)) {
        try {
          parsedEntry = JSON.parse(readFileSync(entryJsonPath, 'utf-8'));
        } catch {
          // corrupted entry.json
        }
      }

      // Find which version this data source maps to
      const mappedSource = Object.entries(knownVersions).find(
        ([src]) => dataSourceKey(src) === entry.name
      );

      dataSources.push({
        key: entry.name,
        path: dirPath,
        entry: parsedEntry,
        files,
        totalSize,
        mappedVersion: mappedSource?.[1] ?? null,
      });
    }
  }

  const totalSize =
    versions.reduce((sum, v) => sum + v.totalSize, 0) +
    dataSources.reduce((sum, d) => sum + d.totalSize, 0);

  return {
    cacheRoot: CACHE_ROOT,
    versions,
    dataSources,
    knownVersions,
    totalSize,
  };
}

/**
 * Print a human-readable summary of the cache to stdout.
 */
export function printCacheInspection(): CacheInspection {
  const info = inspectCache();

  console.log(`Cache root: ${info.cacheRoot}`);
  console.log(`Total size: ${formatBytes(info.totalSize)}`);
  console.log();

  if (info.versions.length === 0 && info.dataSources.length === 0) {
    console.log('Cache is empty.');
    return info;
  }

  // Version caches
  if (info.versions.length > 0) {
    console.log('Version caches (shared runtime):');
    for (const v of info.versions) {
      console.log(`  ${v.version}/ (${formatBytes(v.totalSize)})`);
      for (const f of v.files) {
        console.log(`    ${f.name} (${formatBytes(f.size)})`);
      }
      if (v.dataSources.length > 0) {
        console.log(`    Used by: ${v.dataSources.join(', ')}`);
      }
    }
    console.log();
  }

  // Data source caches
  if (info.dataSources.length > 0) {
    console.log('Data source caches (site-specific indices):');
    for (const ds of info.dataSources) {
      const versionLabel = ds.mappedVersion
        ? ` → v${ds.mappedVersion}`
        : '';
      console.log(`  ${ds.key}/${versionLabel} (${formatBytes(ds.totalSize)})`);
      if (ds.entry) {
        const langs = Object.entries(ds.entry.languages)
          .map(
            ([lang, info]) =>
              `${lang} (${info.page_count} pages, hash: ${info.hash})`
          )
          .join(', ');
        console.log(`    Languages: ${langs}`);
      }
      console.log(`    Files: ${ds.files.length}`);
      for (const f of ds.files) {
        console.log(`      ${f.name} (${formatBytes(f.size)})`);
      }
    }
    console.log();
  }

  return info;
}

export function createPagefindClient(options: {
  path?: string;
  url?: string;
  cachePath?: string;
  verbose?: boolean;
  skipCache?: boolean;
}): PagefindClient {
  if (options.path) {
    return new PagefindClient({
      localPath: options.path,
      verbose: options.verbose,
      skipCache: options.skipCache,
    });
  }
  return new PagefindClient({
    baseUrl: options.url,
    cachePath: options.cachePath,
    verbose: options.verbose,
    skipCache: options.skipCache,
  });
}
