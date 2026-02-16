import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'fs';
import { tmpdir } from 'os';
import { join, resolve } from 'path';

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

type KnownVersions = Record<string, string>;

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

function extractVersion(jsContent: string): string {
  // Pagefind embeds: const pagefind_version="X.Y.Z";
  const match = jsContent.match(/pagefind_version\s*=\s*"([^"]+)"/);
  if (!match) {
    throw new Error(
      'Could not extract pagefind version from downloaded pagefind.js'
    );
  }
  return match[1];
}

function getCachedPagefindPath(version: string): string {
  return join(CACHE_ROOT, version, 'pagefind.js');
}

export class PagefindClient {
  private localPath: string | null;
  private baseUrl: string;
  private pagefindPath: string;
  private cachePath: string | null;
  private initialized = false;
  private pagefindModule: PagefindModule | null = null;

  constructor(options: PagefindClientOptions = {}) {
    this.localPath = options.localPath
      ? this.resolveLocalPath(options.localPath)
      : null;
    this.baseUrl = options.baseUrl;

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

    this.pagefindModule = await this.loadPagefind();
    this.pagefindModule.options({
      basePath: this.pagefindPath,
      baseUrl: this.localPath ? `file://${this.localPath}` : this.baseUrl,
    });

    try {
      await this.pagefindModule.init(language);
    } catch (err) {
      // Version mismatch — invalidate cache and retry once
      if (!this.localPath) {
        this.invalidateCache();
        this.pagefindModule = await this.loadPagefind(true);
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

  private invalidateCache(): void {
    const versions = readKnownVersions();
    const dataSource = this.pagefindPath;
    const oldVersion = versions[dataSource];

    if (oldVersion) {
      const oldCacheDir = join(CACHE_ROOT, oldVersion);
      if (existsSync(oldCacheDir)) {
        rmSync(oldCacheDir, { recursive: true, force: true });
      }
      delete versions[dataSource];
      writeKnownVersions(versions);
    }
  }

  private async loadPagefind(skipCache = false): Promise<PagefindModule> {
    if (this.localPath) {
      const localFile = join(this.localPath, 'pagefind.js');
      const fileUrl = `file://localhost${localFile}`;
      return (await import(fileUrl)) as PagefindModule;
    }

    const pagefindUrl = `${this.pagefindPath}/pagefind.js`;

    // Custom cache path: simple download-to-path, no version management
    if (this.cachePath) {
      return this.loadWithCustomCache(pagefindUrl, skipCache);
    }

    // Default: version-keyed cache in /tmp/node-pagefind/
    return this.loadWithVersionCache(pagefindUrl, skipCache);
  }

  private async loadWithCustomCache(
    pagefindUrl: string,
    skipCache: boolean
  ): Promise<PagefindModule> {
    const cacheDir = resolve(this.cachePath!);
    const cachedFile = join(cacheDir, 'pagefind.js');

    if (!skipCache && existsSync(cachedFile)) {
      const fileUrl = `file://localhost${cachedFile}`;
      return (await import(fileUrl)) as PagefindModule;
    }

    const content = await this.downloadPagefind(pagefindUrl);
    if (!existsSync(cacheDir)) {
      mkdirSync(cacheDir, { recursive: true });
    }
    writeFileSync(cachedFile, content);

    const fileUrl = `file://localhost${cachedFile}`;
    return (await import(fileUrl)) as PagefindModule;
  }

  private async loadWithVersionCache(
    pagefindUrl: string,
    skipCache: boolean
  ): Promise<PagefindModule> {
    // Check known versions map for a cached copy
    const dataSource = this.pagefindPath;
    if (!skipCache) {
      const versions = readKnownVersions();
      const knownVersion = versions[dataSource];
      if (knownVersion) {
        const cachedFile = getCachedPagefindPath(knownVersion);
        if (existsSync(cachedFile)) {
          const fileUrl = `file://localhost${cachedFile}`;
          return (await import(fileUrl)) as PagefindModule;
        }
      }
    }

    const content = await this.downloadPagefind(pagefindUrl);
    const version = extractVersion(content);

    // Store in version-keyed cache directory
    const versionDir = join(CACHE_ROOT, version);
    if (!existsSync(versionDir)) {
      mkdirSync(versionDir, { recursive: true });
    }
    writeFileSync(join(versionDir, 'pagefind.js'), content);

    // Update known versions map
    const versions = readKnownVersions();
    versions[dataSource] = version;
    writeKnownVersions(versions);

    const fileUrl = `file://localhost${join(versionDir, 'pagefind.js')}`;
    return (await import(fileUrl)) as PagefindModule;
  }

  private async downloadPagefind(pagefindUrl: string): Promise<string> {
    const response = await fetch(pagefindUrl);
    if (!response.ok) {
      throw new Error(`Failed to download Pagefind: ${response.status}`);
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

export function createPagefindClient(options: {
  path?: string;
  url?: string;
  cachePath?: string;
}): PagefindClient {
  if (options.path) {
    return new PagefindClient({ localPath: options.path });
  }
  return new PagefindClient({
    baseUrl: options.url,
    cachePath: options.cachePath,
  });
}
