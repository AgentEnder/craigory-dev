# Digests Monorepo Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Create a new `digests` monorepo at `../digests` containing `pr-digest` (moved), `dependency-digest` (core CLI + formatter), and `@digests/plugin-npm` (npm ecosystem plugin).

**Architecture:** Plugin-based system where `dependency-digest` defines a `DependencyDigestPlugin` interface. Each ecosystem plugin (starting with npm) implements detect/parse/fetch. The core orchestrates discovery, delegates to plugins, and formats output as markdown or JSON. Shared GitHub utilities live in `@digests/github-utils`.

**Tech Stack:** TypeScript (NodeNext/ES2022), pnpm workspaces + Nx, Octokit for GitHub API, native `fetch()` for npm registry, cli-forge for CLI, vitest for testing, markdown-factory for markdown output.

---

### Task 1: Create monorepo scaffolding

**Files:**
- Create: `../digests/package.json`
- Create: `../digests/pnpm-workspace.yaml`
- Create: `../digests/nx.json`
- Create: `../digests/tsconfig.base.json`
- Create: `../digests/eslint.config.mjs`
- Create: `../digests/.gitignore`

**Step 1: Create directory and initialize git**

```bash
mkdir -p ../digests
cd ../digests
git init
```

**Step 2: Create root package.json**

```json
{
  "name": "@digests/source",
  "version": "0.0.0",
  "license": "MIT",
  "author": {
    "name": "Craigory Coppola",
    "url": "https://craigory.dev"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/AgentEnder/digests.git"
  },
  "bugs": {
    "url": "https://github.com/AgentEnder/digests/issues"
  },
  "scripts": {},
  "private": true,
  "devDependencies": {
    "@nx/eslint": "catalog:",
    "@nx/eslint-plugin": "catalog:",
    "@nx/js": "catalog:",
    "@types/node": "catalog:",
    "@typescript-eslint/eslint-plugin": "catalog:",
    "@typescript-eslint/parser": "catalog:",
    "eslint": "catalog:",
    "nx": "catalog:",
    "tsx": "catalog:",
    "typescript": "catalog:",
    "vitest": "catalog:",
    "@vitest/coverage-v8": "catalog:"
  },
  "packageManager": "pnpm@10.23.0"
}
```

**Step 3: Create pnpm-workspace.yaml**

```yaml
packages:
  - packages/*

catalog:
  '@nx/eslint': 22.5.0
  '@nx/eslint-plugin': 22.5.0
  '@nx/js': 22.5.0
  '@nx/workspace': 22.5.0
  '@types/node': 22.19.8
  '@typescript-eslint/eslint-plugin': ^8.24.0
  '@typescript-eslint/parser': ^8.24.0
  '@vitest/coverage-v8': ^1.0.4
  eslint: ^9.15.0
  nx: 22.5.0
  tslib: ^2.3.0
  tsx: ^4.7.0
  typescript: ^5.7.2
  vitest: ^1.3.1

onlyBuiltDependencies:
  - nx
```

**Step 4: Create nx.json**

```json
{
  "$schema": "./node_modules/nx/schemas/nx-schema.json",
  "namedInputs": {
    "default": ["{projectRoot}/**/*", "sharedGlobals"],
    "production": [
      "default",
      "!{projectRoot}/eslint.config.*",
      "!{projectRoot}/**/?(*.)+(spec|test).[jt]s?(x)?(.snap)",
      "!{projectRoot}/tsconfig.spec.json"
    ],
    "sharedGlobals": [
      "{workspaceRoot}/tsconfig.base.json"
    ]
  },
  "release": {
    "projects": ["packages/*"],
    "projectsRelationship": "independent",
    "version": {
      "preVersionCommand": "npx nx run-many -t build",
      "conventionalCommits": true
    },
    "changelog": {
      "projectChangelogs": {
        "createRelease": "github"
      }
    },
    "git": {
      "commitMessage": "chore(release): release {version} [skip ci]"
    }
  },
  "targetDefaults": {
    "test": {
      "cache": true,
      "inputs": ["default", "^production"]
    },
    "build": {
      "dependsOn": ["^build"],
      "cache": true,
      "inputs": ["default", "^default"],
      "outputs": ["{projectRoot}/dist"]
    }
  },
  "plugins": [
    {
      "plugin": "@nx/eslint/plugin",
      "options": {
        "targetName": "lint"
      }
    },
    {
      "plugin": "@nx/js/typescript",
      "options": {
        "typecheck": {
          "targetName": "typecheck"
        },
        "build": {
          "targetName": "build",
          "configName": "tsconfig.json"
        }
      }
    }
  ]
}
```

**Step 5: Create tsconfig.base.json**

```json
{
  "compileOnSave": false,
  "compilerOptions": {
    "rootDir": ".",
    "sourceMap": true,
    "declaration": true,
    "moduleResolution": "NodeNext",
    "module": "NodeNext",
    "target": "ES2022",
    "lib": ["ES2022"],
    "skipLibCheck": true,
    "skipDefaultLibCheck": true,
    "isolatedModules": true,
    "strict": true
  }
}
```

**Step 6: Create eslint.config.mjs**

```javascript
import eslintNxPlugin from '@nx/eslint-plugin';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';

export default [
  {
    ignores: [
      '**/node_modules/**',
      '**/.nx/**',
      '**/dist/**',
      '**/dist-spec/**',
      '**/vitest.config.ts',
    ],
  },
  {
    plugins: {
      '@nx': eslintNxPlugin,
    },
    rules: {
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          allow: [],
          depConstraints: [
            {
              sourceTag: '*',
              onlyDependOnLibsWithTags: ['*'],
            },
          ],
        },
      ],
    },
  },
  {
    files: ['**/*.ts', '**/*.mts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/no-empty-interface': 'error',
      '@typescript-eslint/no-inferrable-types': 'error',
      '@typescript-eslint/no-non-null-assertion': 'error',
      '@typescript-eslint/no-require-imports': 'error',
      '@typescript-eslint/adjacent-overload-signatures': 'error',
      'no-empty-function': 'off',
      '@typescript-eslint/no-empty-function': 'error',
    },
  },
  {
    files: ['**/*.js', '**/*.mjs'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
  },
];
```

**Step 7: Create .gitignore**

```
node_modules/
dist/
dist-spec/
.nx/
tmp/
*.tsbuildinfo
.env
.env.local
*.log
.DS_Store
.idea/
.vscode/
coverage/
```

**Step 8: Run pnpm install and initial commit**

```bash
cd ../digests
pnpm install
git add -A
git commit -m "chore: initialize digests monorepo"
```

---

### Task 2: Create @digests/github-utils package

**Files:**
- Create: `packages/github-utils/package.json`
- Create: `packages/github-utils/tsconfig.json`
- Create: `packages/github-utils/tsconfig.lib.json`
- Create: `packages/github-utils/tsconfig.spec.json`
- Create: `packages/github-utils/vitest.config.ts`
- Create: `packages/github-utils/src/index.ts`
- Create: `packages/github-utils/src/types.ts`
- Create: `packages/github-utils/src/token.ts`
- Create: `packages/github-utils/src/parse-url.ts`
- Create: `packages/github-utils/src/repo-info.ts`
- Create: `packages/github-utils/src/parse-url.spec.ts`

**Step 1: Create package.json**

```json
{
  "name": "@digests/github-utils",
  "version": "0.1.0",
  "description": "Shared GitHub utilities for digest packages",
  "author": {
    "name": "Craigory Coppola",
    "url": "https://craigory.dev"
  },
  "license": "MIT",
  "type": "module",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "publishConfig": {
    "access": "public"
  },
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js",
      "default": "./dist/index.js"
    }
  },
  "files": ["dist"],
  "scripts": {
    "build": "tsc -p tsconfig.lib.json",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "dependencies": {
    "@octokit/rest": "^21.0.1",
    "tslib": "catalog:"
  },
  "devDependencies": {
    "@types/node": "catalog:",
    "typescript": "catalog:",
    "vitest": "catalog:"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/AgentEnder/digests.git",
    "directory": "packages/github-utils"
  }
}
```

**Step 2: Create tsconfig files**

`tsconfig.json`:
```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "rootDir": "."
  },
  "references": [
    { "path": "tsconfig.lib.json" },
    { "path": "tsconfig.spec.json" }
  ],
  "files": []
}
```

`tsconfig.lib.json`:
```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src",
    "declaration": true,
    "declarationMap": true,
    "composite": true,
    "tsBuildInfoFile": "../../dist/github-utils.lib.tsbuildinfo"
  },
  "include": ["src/**/*.ts"],
  "exclude": ["src/**/*.spec.ts", "src/**/*.test.ts"]
}
```

`tsconfig.spec.json`:
```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "composite": true,
    "outDir": "./dist-spec",
    "tsBuildInfoFile": "../../dist/github-utils.spec.tsbuildinfo"
  },
  "include": ["src/**/*.ts"],
  "exclude": []
}
```

**Step 3: Create vitest.config.ts**

```typescript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
  },
});
```

**Step 4: Write the failing test for parseGitHubUrl**

`src/parse-url.spec.ts`:
```typescript
import { describe, it, expect } from 'vitest';
import { parseGitHubUrl } from './parse-url.js';

describe('parseGitHubUrl', () => {
  it('should parse owner/repo from GitHub repo URLs', () => {
    const result = parseGitHubUrl('https://github.com/facebook/react');
    expect(result).toEqual({ owner: 'facebook', repo: 'react' });
  });

  it('should handle .git suffix', () => {
    const result = parseGitHubUrl('https://github.com/facebook/react.git');
    expect(result).toEqual({ owner: 'facebook', repo: 'react' });
  });

  it('should parse git+https URLs (from npm registry)', () => {
    const result = parseGitHubUrl('git+https://github.com/facebook/react.git');
    expect(result).toEqual({ owner: 'facebook', repo: 'react' });
  });

  it('should parse SSH URLs', () => {
    const result = parseGitHubUrl('git@github.com:facebook/react.git');
    expect(result).toEqual({ owner: 'facebook', repo: 'react' });
  });

  it('should return null for non-GitHub URLs', () => {
    expect(parseGitHubUrl('https://gitlab.com/owner/repo')).toBeNull();
    expect(parseGitHubUrl('not-a-url')).toBeNull();
  });
});
```

**Step 5: Run test to verify it fails**

```bash
cd packages/github-utils
npx vitest run
```

Expected: FAIL — `parseGitHubUrl` not found

**Step 6: Implement source files**

`src/types.ts`:
```typescript
export interface GitHubRepoRef {
  owner: string;
  repo: string;
}

export interface GitRepoInfo {
  owner: string;
  repo: string;
  currentBranch: string;
}
```

`src/parse-url.ts`:
```typescript
import type { GitHubRepoRef } from './types.js';

export function parseGitHubUrl(url: string): GitHubRepoRef | null {
  const patterns = [
    /github\.com[/:]([^/]+)\/([^/.]+?)(?:\.git)?$/,
    /github\.com[/:]([^/]+)\/([^/.]+?)(?:\.git)?\/.*$/,
  ];

  const cleaned = url.replace(/^git\+/, '');

  for (const pattern of patterns) {
    const match = cleaned.match(pattern);
    if (match) {
      return { owner: match[1], repo: match[2] };
    }
  }

  return null;
}
```

`src/token.ts`:
```typescript
import { execSync } from 'child_process';

let cachedToken: string | undefined | null = null;

export async function getGitHubToken(
  providedToken?: string
): Promise<string | undefined> {
  if (providedToken) {
    return providedToken;
  }

  if (cachedToken !== null) {
    return cachedToken;
  }

  if (process.env['GH_TOKEN']) {
    cachedToken = process.env['GH_TOKEN'];
    return cachedToken;
  }

  if (process.env['GITHUB_TOKEN']) {
    cachedToken = process.env['GITHUB_TOKEN'];
    return cachedToken;
  }

  try {
    const token = execSync('gh auth token', {
      encoding: 'utf8',
      stdio: ['inherit', 'pipe', 'pipe'],
    }).trim();
    cachedToken = token;
    return token;
  } catch {
    cachedToken = undefined;
    return undefined;
  }
}
```

`src/repo-info.ts`:
```typescript
import { execSync } from 'child_process';
import type { GitRepoInfo } from './types.js';

export function getGitRepoInfo(): GitRepoInfo | null {
  try {
    const remoteUrl = execSync('git remote get-url origin', {
      encoding: 'utf8',
      stdio: ['inherit', 'pipe'],
    }).trim();

    const patterns = [
      /git@github\.com:([^/]+)\/([^/]+)\.git$/,
      /github\.com[/:]([^/]+)\/([^/]+?)(\.git)?$/,
    ];

    for (const pattern of patterns) {
      const match = remoteUrl.match(pattern);
      if (match) {
        const owner = match[1];
        const repo = match[2];
        const currentBranch = execSync('git branch --show-current', {
          encoding: 'utf8',
          stdio: ['inherit', 'pipe'],
        }).trim();
        return { owner, repo, currentBranch };
      }
    }

    return null;
  } catch {
    return null;
  }
}
```

`src/index.ts`:
```typescript
export { parseGitHubUrl } from './parse-url.js';
export { getGitHubToken } from './token.js';
export { getGitRepoInfo } from './repo-info.js';
export type { GitHubRepoRef, GitRepoInfo } from './types.js';
```

**Step 7: Run tests to verify they pass**

```bash
cd packages/github-utils
npx vitest run
```

Expected: PASS

**Step 8: Commit**

```bash
git add packages/github-utils
git commit -m "feat: add @digests/github-utils package"
```

---

### Task 3: Create dependency-digest core package — types and plugin interface

**Files:**
- Create: `packages/dependency-digest/package.json`
- Create: `packages/dependency-digest/tsconfig.json`
- Create: `packages/dependency-digest/tsconfig.lib.json`
- Create: `packages/dependency-digest/tsconfig.spec.json`
- Create: `packages/dependency-digest/vitest.config.ts`
- Create: `packages/dependency-digest/src/types.ts`
- Create: `packages/dependency-digest/src/index.ts`

**Step 1: Create package.json**

```json
{
  "name": "dependency-digest",
  "version": "0.1.0",
  "description": "Scan repository dependencies and generate health digests",
  "author": {
    "name": "Craigory Coppola",
    "url": "https://craigory.dev"
  },
  "license": "MIT",
  "type": "module",
  "bin": {
    "dependency-digest": "./dist/cli.js"
  },
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "publishConfig": {
    "access": "public"
  },
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js",
      "default": "./dist/index.js"
    }
  },
  "files": ["dist"],
  "scripts": {
    "build": "tsc -p tsconfig.lib.json",
    "test": "vitest run",
    "test:watch": "vitest",
    "cli": "node dist/cli.js"
  },
  "dependencies": {
    "@digests/github-utils": "workspace:*",
    "cli-forge": "^1.2.0",
    "markdown-factory": "^0.2.0",
    "tslib": "catalog:"
  },
  "devDependencies": {
    "@types/node": "catalog:",
    "typescript": "catalog:",
    "vitest": "catalog:"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/AgentEnder/digests.git",
    "directory": "packages/dependency-digest"
  }
}
```

**Step 2: Create tsconfig files** (same pattern as github-utils)

`tsconfig.json`:
```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "rootDir": "."
  },
  "references": [
    { "path": "tsconfig.lib.json" },
    { "path": "tsconfig.spec.json" }
  ],
  "files": []
}
```

`tsconfig.lib.json`:
```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src",
    "declaration": true,
    "declarationMap": true,
    "composite": true,
    "tsBuildInfoFile": "../../dist/dependency-digest.lib.tsbuildinfo"
  },
  "include": ["src/**/*.ts"],
  "exclude": ["src/**/*.spec.ts", "src/**/*.test.ts"]
}
```

`tsconfig.spec.json`:
```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "composite": true,
    "outDir": "./dist-spec",
    "tsBuildInfoFile": "../../dist/dependency-digest.spec.tsbuildinfo"
  },
  "include": ["src/**/*.ts"],
  "exclude": []
}
```

`vitest.config.ts`:
```typescript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
  },
});
```

**Step 3: Create types.ts — the plugin contract**

`src/types.ts`:
```typescript
export interface ManifestFile {
  /** Absolute path to the manifest file */
  path: string;
  /** e.g. "package.json", "pom.xml" */
  type: string;
}

export interface ParsedDependency {
  /** Package name as it appears in the manifest */
  name: string;
  /** Version range string from the manifest (e.g. "^19.0.0") */
  versionRange: string;
  /** Dependency group (e.g. "dependencies", "devDependencies") */
  group: string;
}

export interface Vulnerability {
  id: string;
  severity: 'critical' | 'high' | 'moderate' | 'low';
  title: string;
  url: string | null;
  vulnerableRange: string;
  patchedVersion: string | null;
}

export interface DependencyMetrics {
  name: string;
  ecosystem: string;
  currentVersion: string;
  latestVersion: string;
  repoUrl: string | null;
  lastMajorDate: string | null;
  lastPatchDate: string | null;
  lastCommitDate: string | null;
  lastIssueOpened: string | null;
  lastIssueClosed: string | null;
  lastPrOpened: string | null;
  lastPrClosed: string | null;
  openIssueCount: number;
  openPrCount: number;
  downloads: number | null;
  pinnedIssues: string[];
  vulnerabilities: Vulnerability[];
}

export interface DependencyDigestPlugin {
  /** Plugin name, e.g. "npm" */
  name: string;
  /** Ecosystem identifier, e.g. "npm", "maven", "nuget" */
  ecosystem: string;

  /** Detect manifest files for this ecosystem in the given directory */
  detect(dir: string): Promise<ManifestFile[]>;

  /** Parse dependency entries from a manifest file */
  parseDependencies(manifest: ManifestFile): Promise<ParsedDependency[]>;

  /** Fetch health metrics for a single dependency */
  fetchMetrics(
    dep: ParsedDependency,
    token?: string
  ): Promise<DependencyMetrics>;
}

export interface ManifestDigest {
  file: string;
  ecosystem: string;
  groups: Record<string, DependencyMetrics[]>;
}

export interface DigestOutput {
  scannedAt: string;
  manifests: ManifestDigest[];
}
```

**Step 4: Create index.ts barrel**

`src/index.ts`:
```typescript
export type {
  DependencyDigestPlugin,
  DependencyMetrics,
  DigestOutput,
  ManifestDigest,
  ManifestFile,
  ParsedDependency,
  Vulnerability,
} from './types.js';
```

**Step 5: Commit**

```bash
git add packages/dependency-digest
git commit -m "feat: add dependency-digest core types and plugin interface"
```

---

### Task 4: Create dependency-digest core — scanner and formatter

**Files:**
- Create: `packages/dependency-digest/src/scanner.ts`
- Create: `packages/dependency-digest/src/formatter.ts`
- Create: `packages/dependency-digest/src/formatter.spec.ts`

**Step 1: Write failing test for formatter**

`src/formatter.spec.ts`:
```typescript
import { describe, it, expect } from 'vitest';
import { formatDigestAsJson, formatDigestAsMarkdown } from './formatter.js';
import type { DigestOutput } from './types.js';

const sampleDigest: DigestOutput = {
  scannedAt: '2026-03-16T00:00:00.000Z',
  manifests: [
    {
      file: 'package.json',
      ecosystem: 'npm',
      groups: {
        dependencies: [
          {
            name: 'react',
            ecosystem: 'npm',
            currentVersion: '^19.0.0',
            latestVersion: '19.2.4',
            repoUrl: 'https://github.com/facebook/react',
            lastMajorDate: '2024-11-15T00:00:00.000Z',
            lastPatchDate: '2025-01-20T00:00:00.000Z',
            lastCommitDate: '2025-03-14T00:00:00.000Z',
            lastIssueOpened: '2025-03-15T00:00:00.000Z',
            lastIssueClosed: '2025-03-14T00:00:00.000Z',
            lastPrOpened: '2025-03-13T00:00:00.000Z',
            lastPrClosed: '2025-03-12T00:00:00.000Z',
            openIssueCount: 42,
            openPrCount: 8,
            downloads: 24100000,
            pinnedIssues: [],
            vulnerabilities: [],
          },
        ],
      },
    },
  ],
};

describe('formatDigestAsJson', () => {
  it('should return valid JSON string matching the digest structure', () => {
    const json = formatDigestAsJson(sampleDigest);
    const parsed = JSON.parse(json);
    expect(parsed.scannedAt).toBe('2026-03-16T00:00:00.000Z');
    expect(parsed.manifests).toHaveLength(1);
    expect(parsed.manifests[0].groups.dependencies[0].name).toBe('react');
  });
});

describe('formatDigestAsMarkdown', () => {
  it('should include the dependency name in the summary table', () => {
    const md = formatDigestAsMarkdown(sampleDigest);
    expect(md).toContain('react');
    expect(md).toContain('19.2.4');
    expect(md).toContain('package.json');
  });

  it('should include vulnerability warnings when present', () => {
    const digestWithCve: DigestOutput = {
      ...sampleDigest,
      manifests: [
        {
          ...sampleDigest.manifests[0],
          groups: {
            dependencies: [
              {
                ...sampleDigest.manifests[0].groups.dependencies[0],
                vulnerabilities: [
                  {
                    id: 'CVE-2024-0001',
                    severity: 'high',
                    title: 'XSS vulnerability',
                    url: 'https://example.com/advisory',
                    vulnerableRange: '<19.1.0',
                    patchedVersion: '19.1.0',
                  },
                ],
              },
            ],
          },
        },
      ],
    };
    const md = formatDigestAsMarkdown(digestWithCve);
    expect(md).toContain('CVE-2024-0001');
    expect(md).toContain('XSS vulnerability');
  });
});
```

**Step 2: Run test to verify it fails**

```bash
cd packages/dependency-digest
npx vitest run
```

Expected: FAIL — modules not found

**Step 3: Implement scanner.ts**

`src/scanner.ts`:
```typescript
import type {
  DependencyDigestPlugin,
  DependencyMetrics,
  DigestOutput,
  ManifestDigest,
  ParsedDependency,
} from './types.js';

interface ScanOptions {
  dir: string;
  plugins: DependencyDigestPlugin[];
  token?: string;
  concurrency?: number;
  excludePatterns?: string[];
}

async function fetchWithConcurrency(
  deps: ParsedDependency[],
  plugin: DependencyDigestPlugin,
  token: string | undefined,
  concurrency: number
): Promise<DependencyMetrics[]> {
  const results: DependencyMetrics[] = [];
  const queue = [...deps];

  const workers = Array.from(
    { length: Math.min(concurrency, queue.length) },
    async () => {
      while (queue.length > 0) {
        const dep = queue.shift();
        if (!dep) break;
        try {
          const metrics = await plugin.fetchMetrics(dep, token);
          results.push(metrics);
        } catch (err) {
          console.error(
            `Failed to fetch metrics for ${dep.name}:`,
            err
          );
        }
      }
    }
  );

  await Promise.all(workers);
  return results;
}

function matchesExclude(name: string, patterns: string[]): boolean {
  return patterns.some((pattern) => {
    if (pattern.endsWith('*')) {
      return name.startsWith(pattern.slice(0, -1));
    }
    return name === pattern;
  });
}

export async function scan(options: ScanOptions): Promise<DigestOutput> {
  const {
    dir,
    plugins,
    token,
    concurrency = 5,
    excludePatterns = [],
  } = options;

  const manifests: ManifestDigest[] = [];

  for (const plugin of plugins) {
    const manifestFiles = await plugin.detect(dir);

    for (const manifest of manifestFiles) {
      const allDeps = await plugin.parseDependencies(manifest);

      const filteredDeps = allDeps.filter(
        (d) => !matchesExclude(d.name, excludePatterns)
      );

      const groups = new Map<string, ParsedDependency[]>();
      for (const dep of filteredDeps) {
        const list = groups.get(dep.group) ?? [];
        list.push(dep);
        groups.set(dep.group, list);
      }

      const groupMetrics: Record<string, DependencyMetrics[]> = {};
      for (const [group, deps] of groups) {
        groupMetrics[group] = await fetchWithConcurrency(
          deps,
          plugin,
          token,
          concurrency
        );
      }

      manifests.push({
        file: manifest.path,
        ecosystem: plugin.ecosystem,
        groups: groupMetrics,
      });
    }
  }

  return {
    scannedAt: new Date().toISOString(),
    manifests,
  };
}
```

**Step 4: Implement formatter.ts**

`src/formatter.ts`:
```typescript
import {
  h1,
  h2,
  h3,
  h4,
  bold,
  link,
  unorderedList,
  codeBlock,
} from 'markdown-factory';
import type { DependencyMetrics, DigestOutput } from './types.js';

export function formatDigestAsJson(digest: DigestOutput): string {
  return JSON.stringify(digest, null, 2);
}

function formatDate(iso: string | null): string {
  if (!iso) return '—';
  return iso.substring(0, 10);
}

function formatDownloads(n: number | null): string {
  if (n === null) return '—';
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}

function summaryTable(deps: DependencyMetrics[]): string {
  const header =
    '| Package | Version | Latest | Last Major | Last Patch | Last Commit | Downloads/wk | CVEs |';
  const separator =
    '|---------|---------|--------|------------|------------|-------------|--------------|------|';
  const rows = deps.map((d) => {
    const cveCount = d.vulnerabilities.length;
    const cveCell = cveCount > 0 ? `${cveCount} ⚠️` : '0';
    return `| ${d.name} | ${d.currentVersion} | ${d.latestVersion} | ${formatDate(d.lastMajorDate)} | ${formatDate(d.lastPatchDate)} | ${formatDate(d.lastCommitDate)} | ${formatDownloads(d.downloads)} | ${cveCell} |`;
  });
  return [header, separator, ...rows].join('\n');
}

function detailSection(dep: DependencyMetrics): string {
  const hasNotableFindings =
    dep.vulnerabilities.length > 0 || dep.pinnedIssues.length > 0;

  if (!hasNotableFindings) return '';

  const parts: string[] = [];

  parts.push(h4(`${dep.name} — Details`));

  if (dep.repoUrl) {
    parts.push(`- ${bold('Repo')}: ${link(dep.repoUrl, dep.repoUrl)}`);
  }

  parts.push(
    `- ${bold('Last issue opened')}: ${formatDate(dep.lastIssueOpened)} | ${bold('Last closed')}: ${formatDate(dep.lastIssueClosed)}`
  );
  parts.push(
    `- ${bold('Last PR opened')}: ${formatDate(dep.lastPrOpened)} | ${bold('Last closed')}: ${formatDate(dep.lastPrClosed)}`
  );
  parts.push(
    `- ${bold('Open issues')}: ${dep.openIssueCount} | ${bold('Open PRs')}: ${dep.openPrCount}`
  );

  if (dep.vulnerabilities.length > 0) {
    parts.push(
      '',
      bold('Vulnerabilities'),
      ...dep.vulnerabilities.map((v) => {
        const urlPart = v.url ? ` — ${link(v.url, 'Advisory')}` : '';
        return `- **${v.id}** (${v.severity.toUpperCase()}): ${v.title}${urlPart}`;
      })
    );
  }

  if (dep.pinnedIssues.length > 0) {
    parts.push(
      '',
      bold('Pinned Issues'),
      ...dep.pinnedIssues.map((title) => `- ${title}`)
    );
  }

  return parts.join('\n');
}

export function formatDigestAsMarkdown(digest: DigestOutput): string {
  const sections: string[] = [h1('Dependency Digest')];

  for (const manifest of digest.manifests) {
    for (const [group, deps] of Object.entries(manifest.groups)) {
      sections.push(h2(`${manifest.file} (${group})`));
      sections.push(summaryTable(deps));

      const details = deps.map(detailSection).filter(Boolean);
      if (details.length > 0) {
        sections.push('', ...details);
      }
    }
  }

  return sections.join('\n\n');
}
```

**Step 5: Update index.ts**

`src/index.ts`:
```typescript
export type {
  DependencyDigestPlugin,
  DependencyMetrics,
  DigestOutput,
  ManifestDigest,
  ManifestFile,
  ParsedDependency,
  Vulnerability,
} from './types.js';
export { scan } from './scanner.js';
export { formatDigestAsJson, formatDigestAsMarkdown } from './formatter.js';
```

**Step 6: Run tests to verify they pass**

```bash
cd packages/dependency-digest
npx vitest run
```

Expected: PASS

**Step 7: Commit**

```bash
git add packages/dependency-digest
git commit -m "feat: add dependency-digest scanner and formatter"
```

---

### Task 5: Create dependency-digest CLI

**Files:**
- Create: `packages/dependency-digest/src/cli.ts`
- Modify: `packages/dependency-digest/src/index.ts` (add cli export)

**Step 1: Create cli.ts**

`src/cli.ts`:
```typescript
#!/usr/bin/env node

import { cli } from 'cli-forge';
import { mkdir, writeFile } from 'fs/promises';
import { dirname } from 'path';
import { resolve } from 'path';
import { getGitHubToken } from '@digests/github-utils';
import { scan } from './scanner.js';
import { formatDigestAsJson, formatDigestAsMarkdown } from './formatter.js';
import type { DependencyDigestPlugin } from './types.js';

const digestCLI = cli('dependency-digest', {
  description: 'Scan repository dependencies and generate a health digest',
  builder: (args) =>
    args
      .option('dir', {
        type: 'string',
        description: 'Directory to scan (default: cwd)',
        alias: ['d'],
      })
      .option('plugin', {
        type: 'array:string',
        description:
          'Plugin package names to use (default: auto-detect installed)',
        alias: ['p'],
      })
      .option('format', {
        type: 'string',
        description: 'Output format: markdown or json',
        default: 'markdown',
        alias: ['f'],
      })
      .option('output', {
        type: 'string',
        description: 'Output file path (default: stdout)',
        alias: ['o'],
      })
      .option('token', {
        type: 'string',
        description:
          'GitHub token (fallback: GH_TOKEN, GITHUB_TOKEN, gh auth token)',
      })
      .option('concurrency', {
        type: 'number',
        description: 'Max parallel fetches per plugin',
        default: 5,
      })
      .option('exclude', {
        type: 'array:string',
        description: 'Glob patterns for packages to skip (e.g. @types/*)',
      })
      .option('include-dev', {
        type: 'boolean',
        description: 'Include devDependencies',
        default: true,
      }),
  handler: async (args) => {
    const dir = resolve(args.dir ?? process.cwd());
    const token = await getGitHubToken(args.token);

    const pluginNames = args.plugin ?? ['@digests/plugin-npm'];
    const plugins: DependencyDigestPlugin[] = [];

    for (const name of pluginNames) {
      try {
        const mod = await import(name);
        const plugin: DependencyDigestPlugin =
          mod.default ?? mod.plugin ?? mod;
        plugins.push(plugin);
      } catch (err) {
        console.error(`Failed to load plugin "${name}": ${err}`);
        process.exit(1);
      }
    }

    const digest = await scan({
      dir,
      plugins,
      token,
      concurrency: args.concurrency,
      excludePatterns: args.exclude ?? [],
    });

    const output =
      args.format === 'json'
        ? formatDigestAsJson(digest)
        : formatDigestAsMarkdown(digest);

    if (args.output) {
      await mkdir(dirname(args.output), { recursive: true }).catch(
        () => undefined
      );
      await writeFile(args.output, output, 'utf-8');
      console.log(`Digest written to ${args.output}`);
    } else {
      console.log(output);
    }
  },
});

export default digestCLI;

digestCLI.forge();
```

**Step 2: Update index.ts to export cli**

Add to `src/index.ts`:
```typescript
export { default as cli } from './cli.js';
```

**Step 3: Commit**

```bash
git add packages/dependency-digest/src/cli.ts packages/dependency-digest/src/index.ts
git commit -m "feat: add dependency-digest CLI"
```

---

### Task 6: Create @digests/plugin-npm — detection and parsing

**Files:**
- Create: `packages/plugin-npm/package.json`
- Create: `packages/plugin-npm/tsconfig.json`
- Create: `packages/plugin-npm/tsconfig.lib.json`
- Create: `packages/plugin-npm/tsconfig.spec.json`
- Create: `packages/plugin-npm/vitest.config.ts`
- Create: `packages/plugin-npm/src/detect.ts`
- Create: `packages/plugin-npm/src/parser.ts`
- Create: `packages/plugin-npm/src/parser.spec.ts`
- Create: `packages/plugin-npm/src/index.ts`

**Step 1: Create package.json**

```json
{
  "name": "@digests/plugin-npm",
  "version": "0.1.0",
  "description": "npm/Node.js ecosystem plugin for dependency-digest",
  "author": {
    "name": "Craigory Coppola",
    "url": "https://craigory.dev"
  },
  "license": "MIT",
  "type": "module",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "publishConfig": {
    "access": "public"
  },
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js",
      "default": "./dist/index.js"
    }
  },
  "files": ["dist"],
  "scripts": {
    "build": "tsc -p tsconfig.lib.json",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "dependencies": {
    "dependency-digest": "workspace:*",
    "@digests/github-utils": "workspace:*",
    "@octokit/rest": "^21.0.1",
    "tslib": "catalog:"
  },
  "devDependencies": {
    "@types/node": "catalog:",
    "typescript": "catalog:",
    "vitest": "catalog:"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/AgentEnder/digests.git",
    "directory": "packages/plugin-npm"
  }
}
```

**Step 2: Create tsconfig files** (same pattern)

`tsconfig.json`:
```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "rootDir": "."
  },
  "references": [
    { "path": "tsconfig.lib.json" },
    { "path": "tsconfig.spec.json" }
  ],
  "files": []
}
```

`tsconfig.lib.json`:
```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src",
    "declaration": true,
    "declarationMap": true,
    "composite": true,
    "tsBuildInfoFile": "../../dist/plugin-npm.lib.tsbuildinfo"
  },
  "include": ["src/**/*.ts"],
  "exclude": ["src/**/*.spec.ts", "src/**/*.test.ts"]
}
```

`tsconfig.spec.json`:
```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "composite": true,
    "outDir": "./dist-spec",
    "tsBuildInfoFile": "../../dist/plugin-npm.spec.tsbuildinfo"
  },
  "include": ["src/**/*.ts"],
  "exclude": []
}
```

`vitest.config.ts`:
```typescript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
  },
});
```

**Step 3: Write failing test for parser**

`src/parser.spec.ts`:
```typescript
import { describe, it, expect } from 'vitest';
import { parsePackageJson } from './parser.js';

describe('parsePackageJson', () => {
  it('should parse dependencies from package.json content', () => {
    const content = JSON.stringify({
      dependencies: {
        react: '^19.0.0',
        express: '~4.18.0',
      },
      devDependencies: {
        typescript: '^5.7.2',
      },
    });

    const deps = parsePackageJson(content);

    expect(deps).toEqual([
      { name: 'react', versionRange: '^19.0.0', group: 'dependencies' },
      { name: 'express', versionRange: '~4.18.0', group: 'dependencies' },
      {
        name: 'typescript',
        versionRange: '^5.7.2',
        group: 'devDependencies',
      },
    ]);
  });

  it('should handle missing dependency fields', () => {
    const content = JSON.stringify({ name: 'empty-pkg' });
    const deps = parsePackageJson(content);
    expect(deps).toEqual([]);
  });

  it('should skip workspace: and link: protocols', () => {
    const content = JSON.stringify({
      dependencies: {
        'local-pkg': 'workspace:*',
        'linked-pkg': 'link:../other',
        react: '^19.0.0',
      },
    });
    const deps = parsePackageJson(content);
    expect(deps).toEqual([
      { name: 'react', versionRange: '^19.0.0', group: 'dependencies' },
    ]);
  });
});
```

**Step 4: Run test to verify it fails**

```bash
cd packages/plugin-npm
npx vitest run
```

Expected: FAIL

**Step 5: Implement detect.ts**

`src/detect.ts`:
```typescript
import { readdir } from 'fs/promises';
import { join } from 'path';
import type { ManifestFile } from 'dependency-digest';

export async function detectPackageJsonFiles(
  dir: string
): Promise<ManifestFile[]> {
  const manifests: ManifestFile[] = [];

  try {
    const entries = await readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.name === 'package.json' && entry.isFile()) {
        manifests.push({
          path: join(dir, entry.name),
          type: 'package.json',
        });
      }
    }
  } catch {
    // Directory not readable
  }

  return manifests;
}
```

**Step 6: Implement parser.ts**

`src/parser.ts`:
```typescript
import type { ParsedDependency } from 'dependency-digest';

const SKIP_PROTOCOLS = ['workspace:', 'link:', 'file:', 'portal:'];

export function parsePackageJson(content: string): ParsedDependency[] {
  const pkg = JSON.parse(content);
  const deps: ParsedDependency[] = [];

  for (const group of ['dependencies', 'devDependencies'] as const) {
    const entries = pkg[group];
    if (!entries || typeof entries !== 'object') continue;

    for (const [name, versionRange] of Object.entries(entries)) {
      if (typeof versionRange !== 'string') continue;
      if (SKIP_PROTOCOLS.some((p) => versionRange.startsWith(p))) continue;
      deps.push({ name, versionRange, group });
    }
  }

  return deps;
}
```

**Step 7: Run tests to verify they pass**

```bash
cd packages/plugin-npm
npx vitest run
```

Expected: PASS

**Step 8: Commit**

```bash
git add packages/plugin-npm
git commit -m "feat: add @digests/plugin-npm detection and parsing"
```

---

### Task 7: Create @digests/plugin-npm — metrics fetching

**Files:**
- Create: `packages/plugin-npm/src/npm-registry.ts`
- Create: `packages/plugin-npm/src/github-metrics.ts`
- Create: `packages/plugin-npm/src/metrics.ts`
- Modify: `packages/plugin-npm/src/index.ts` (wire up plugin export)

**Step 1: Implement npm-registry.ts** (fetches data from registry.npmjs.org)

`src/npm-registry.ts`:
```typescript
export interface NpmRegistryData {
  latestVersion: string;
  repoUrl: string | null;
  lastMajorDate: string | null;
  lastPatchDate: string | null;
  weeklyDownloads: number | null;
}

interface NpmPackageMetadata {
  'dist-tags'?: { latest?: string };
  repository?: { url?: string };
  time?: Record<string, string>;
}

function findLastMajorDate(
  time: Record<string, string>,
  latestVersion: string
): string | null {
  const versions = Object.keys(time).filter(
    (k) => k !== 'created' && k !== 'modified'
  );
  const majorVersions = versions.filter((v) => {
    const parts = v.split('.');
    return (
      parts.length >= 1 &&
      !v.includes('-') &&
      (parts[1] === '0' && parts[2] === '0')
    );
  });

  if (majorVersions.length === 0) return null;

  const sorted = majorVersions.sort(
    (a, b) =>
      new Date(time[b]).getTime() - new Date(time[a]).getTime()
  );
  return time[sorted[0]] ?? null;
}

function findLastPatchDate(
  time: Record<string, string>,
  latestVersion: string
): string | null {
  return time[latestVersion] ?? null;
}

function cleanRepoUrl(url: string | undefined): string | null {
  if (!url) return null;
  return url
    .replace(/^git\+/, '')
    .replace(/\.git$/, '')
    .replace(/^ssh:\/\/git@/, 'https://');
}

export async function fetchNpmRegistryData(
  packageName: string
): Promise<NpmRegistryData> {
  const url = `https://registry.npmjs.org/${encodeURIComponent(packageName)}`;
  const response = await fetch(url, {
    headers: { Accept: 'application/json' },
  });

  if (!response.ok) {
    return {
      latestVersion: 'unknown',
      repoUrl: null,
      lastMajorDate: null,
      lastPatchDate: null,
      weeklyDownloads: null,
    };
  }

  const data: NpmPackageMetadata = await response.json();
  const latestVersion = data['dist-tags']?.latest ?? 'unknown';
  const time = data.time ?? {};

  const downloadsUrl = `https://api.npmjs.org/downloads/point/last-week/${encodeURIComponent(packageName)}`;
  let weeklyDownloads: number | null = null;
  try {
    const dlResponse = await fetch(downloadsUrl);
    if (dlResponse.ok) {
      const dlData = await dlResponse.json();
      weeklyDownloads = (dlData as { downloads?: number }).downloads ?? null;
    }
  } catch {
    // Ignore download fetch errors
  }

  return {
    latestVersion,
    repoUrl: cleanRepoUrl(data.repository?.url),
    lastMajorDate: findLastMajorDate(time, latestVersion),
    lastPatchDate: findLastPatchDate(time, latestVersion),
    weeklyDownloads,
  };
}
```

**Step 2: Implement github-metrics.ts** (fetches repo data + CVEs from GitHub API)

`src/github-metrics.ts`:
```typescript
import { Octokit } from '@octokit/rest';
import { parseGitHubUrl } from '@digests/github-utils';
import type { Vulnerability } from 'dependency-digest';

export interface GitHubRepoMetrics {
  lastCommitDate: string | null;
  lastIssueOpened: string | null;
  lastIssueClosed: string | null;
  lastPrOpened: string | null;
  lastPrClosed: string | null;
  openIssueCount: number;
  openPrCount: number;
  pinnedIssues: string[];
  vulnerabilities: Vulnerability[];
}

const EMPTY_METRICS: GitHubRepoMetrics = {
  lastCommitDate: null,
  lastIssueOpened: null,
  lastIssueClosed: null,
  lastPrOpened: null,
  lastPrClosed: null,
  openIssueCount: 0,
  openPrCount: 0,
  pinnedIssues: [],
  vulnerabilities: [],
};

export async function fetchGitHubMetrics(
  repoUrl: string | null,
  packageName: string,
  token?: string
): Promise<GitHubRepoMetrics> {
  if (!repoUrl) return EMPTY_METRICS;

  const parsed = parseGitHubUrl(repoUrl);
  if (!parsed) return EMPTY_METRICS;

  const { owner, repo } = parsed;
  const octokit = new Octokit(token ? { auth: token } : undefined);

  try {
    const [
      repoData,
      latestIssuesOpen,
      latestIssuesClosed,
      latestPrsOpen,
      latestPrsClosed,
      advisories,
    ] = await Promise.all([
      octokit.rest.repos.get({ owner, repo }).catch(() => null),
      octokit.rest.issues
        .listForRepo({
          owner,
          repo,
          state: 'open',
          sort: 'created',
          direction: 'desc',
          per_page: 1,
        })
        .catch(() => null),
      octokit.rest.issues
        .listForRepo({
          owner,
          repo,
          state: 'closed',
          sort: 'updated',
          direction: 'desc',
          per_page: 1,
        })
        .catch(() => null),
      octokit.rest.pulls
        .list({
          owner,
          repo,
          state: 'open',
          sort: 'created',
          direction: 'desc',
          per_page: 1,
        })
        .catch(() => null),
      octokit.rest.pulls
        .list({
          owner,
          repo,
          state: 'closed',
          sort: 'updated',
          direction: 'desc',
          per_page: 1,
        })
        .catch(() => null),
      fetchAdvisories(octokit, packageName),
    ]);

    return {
      lastCommitDate: repoData?.data.pushed_at ?? null,
      lastIssueOpened:
        latestIssuesOpen?.data[0]?.created_at ?? null,
      lastIssueClosed:
        latestIssuesClosed?.data[0]?.closed_at ?? null,
      lastPrOpened: latestPrsOpen?.data[0]?.created_at ?? null,
      lastPrClosed: latestPrsClosed?.data[0]?.closed_at ?? null,
      openIssueCount: repoData?.data.open_issues_count ?? 0,
      openPrCount: latestPrsOpen?.data.length ?? 0,
      pinnedIssues: [],
      vulnerabilities: advisories,
    };
  } catch {
    return EMPTY_METRICS;
  }
}

async function fetchAdvisories(
  octokit: Octokit,
  packageName: string
): Promise<Vulnerability[]> {
  try {
    const response = await octokit.request('GET /advisories', {
      ecosystem: 'npm',
      affects: packageName,
      per_page: 10,
    });

    const advisories = response.data as Array<{
      ghsa_id: string;
      severity: string;
      summary: string;
      html_url: string;
      vulnerabilities: Array<{
        vulnerable_version_range: string;
        first_patched_version: { identifier: string } | null;
      }>;
    }>;

    return advisories.map((a) => ({
      id: a.ghsa_id,
      severity: mapSeverity(a.severity),
      title: a.summary,
      url: a.html_url,
      vulnerableRange:
        a.vulnerabilities[0]?.vulnerable_version_range ?? 'unknown',
      patchedVersion:
        a.vulnerabilities[0]?.first_patched_version?.identifier ?? null,
    }));
  } catch {
    return [];
  }
}

function mapSeverity(
  s: string
): 'critical' | 'high' | 'moderate' | 'low' {
  switch (s.toLowerCase()) {
    case 'critical':
      return 'critical';
    case 'high':
      return 'high';
    case 'moderate':
    case 'medium':
      return 'moderate';
    default:
      return 'low';
  }
}
```

**Step 3: Implement metrics.ts** (combines npm registry + GitHub data)

`src/metrics.ts`:
```typescript
import type { DependencyMetrics, ParsedDependency } from 'dependency-digest';
import { fetchNpmRegistryData } from './npm-registry.js';
import { fetchGitHubMetrics } from './github-metrics.js';

export async function fetchDependencyMetrics(
  dep: ParsedDependency,
  token?: string
): Promise<DependencyMetrics> {
  const npmData = await fetchNpmRegistryData(dep.name);
  const ghData = await fetchGitHubMetrics(
    npmData.repoUrl,
    dep.name,
    token
  );

  return {
    name: dep.name,
    ecosystem: 'npm',
    currentVersion: dep.versionRange,
    latestVersion: npmData.latestVersion,
    repoUrl: npmData.repoUrl,
    lastMajorDate: npmData.lastMajorDate,
    lastPatchDate: npmData.lastPatchDate,
    lastCommitDate: ghData.lastCommitDate,
    lastIssueOpened: ghData.lastIssueOpened,
    lastIssueClosed: ghData.lastIssueClosed,
    lastPrOpened: ghData.lastPrOpened,
    lastPrClosed: ghData.lastPrClosed,
    openIssueCount: ghData.openIssueCount,
    openPrCount: ghData.openPrCount,
    downloads: npmData.weeklyDownloads,
    pinnedIssues: ghData.pinnedIssues,
    vulnerabilities: ghData.vulnerabilities,
  };
}
```

**Step 4: Wire up the plugin export in index.ts**

`src/index.ts`:
```typescript
import { readFile } from 'fs/promises';
import type { DependencyDigestPlugin } from 'dependency-digest';
import { detectPackageJsonFiles } from './detect.js';
import { parsePackageJson } from './parser.js';
import { fetchDependencyMetrics } from './metrics.js';

const plugin: DependencyDigestPlugin = {
  name: 'npm',
  ecosystem: 'npm',

  detect: detectPackageJsonFiles,

  async parseDependencies(manifest) {
    const content = await readFile(manifest.path, 'utf-8');
    return parsePackageJson(content);
  },

  fetchMetrics: fetchDependencyMetrics,
};

export default plugin;
export { plugin };
```

**Step 5: Commit**

```bash
git add packages/plugin-npm/src
git commit -m "feat: add @digests/plugin-npm metrics fetching (npm registry + GitHub)"
```

---

### Task 8: Move pr-digest into the digests monorepo

**Files:**
- Copy: `craigory-dev/packages/pr-digest/` → `../digests/packages/pr-digest/`
- Modify: `packages/pr-digest/package.json` (update deps to use workspace refs)
- Modify: `packages/pr-digest/src/utils.ts` (remove functions moved to github-utils)
- Modify: `packages/pr-digest/src/index.ts` (re-export from github-utils)
- Modify: `packages/pr-digest/tsconfig.lib.json` (update tsBuildInfoFile path)

**Step 1: Copy the package**

```bash
cp -r ../craigory-dev/packages/pr-digest ../digests/packages/pr-digest
rm -rf ../digests/packages/pr-digest/dist
rm -rf ../digests/packages/pr-digest/dist-spec
rm -rf ../digests/packages/pr-digest/node_modules
```

**Step 2: Update package.json** to use workspace refs and catalog versions

In `packages/pr-digest/package.json`, update:
- Add `"@digests/github-utils": "workspace:*"` to dependencies
- Change devDependencies to use `catalog:` where applicable
- Add `markdown-factory` to direct dependencies (it was hoisted in craigory-dev)
- Update repository directory

**Step 3: Update utils.ts** — replace duplicated functions with re-exports from `@digests/github-utils`

Replace `getGitHubToken`, `getGitRepoInfo`, and `parseGitHubUrl` implementations with imports from `@digests/github-utils`. Keep `getPRFromBranch` and `validateOptions` as pr-digest-specific utilities.

**Step 4: Update tsconfig.lib.json** tsBuildInfoFile path

Change `"tsBuildInfoFile": "../../dist/tsc/pr-digest.lib.tsbuildinfo"` to `"../../dist/pr-digest.lib.tsbuildinfo"` (no `tsc/` subdirectory — matching the new repo convention).

**Step 5: Run tests**

```bash
cd packages/pr-digest
npx vitest run
```

Expected: PASS

**Step 6: Commit**

```bash
git add packages/pr-digest
git commit -m "feat: move pr-digest into digests monorepo"
```

---

### Task 9: Final integration — pnpm install, build, test, lint

**Step 1: Install all dependencies**

```bash
cd ../digests
pnpm install
```

**Step 2: Build all packages**

```bash
npx nx run-many -t build
```

Expected: All packages build successfully

**Step 3: Run all tests**

```bash
npx nx run-many -t test
```

Expected: All tests pass

**Step 4: Run lint**

```bash
npx nx run-many -t lint
```

Expected: No lint errors

**Step 5: Run typecheck**

```bash
npx nx run-many -t typecheck
```

Expected: No type errors

**Step 6: Commit any lockfile / generated changes**

```bash
git add -A
git commit -m "chore: install dependencies and verify build"
```

---

### Task 10: Smoke test — run the CLI against itself

**Step 1: Run dependency-digest against the digests repo**

```bash
cd ../digests
npx dependency-digest --format json --output test-output.json
```

Expected: Produces JSON file with metrics for the repo's own dependencies

**Step 2: Run markdown format**

```bash
npx dependency-digest --format markdown
```

Expected: Markdown table printed to stdout with dependency health data

**Step 3: Verify and clean up**

```bash
rm test-output.json
```

**Step 4: Final commit**

```bash
git add -A
git commit -m "chore: verify CLI smoke test passes"
```
