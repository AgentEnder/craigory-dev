# npm-trusted-publishing CLI Package — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** A CLI tool that discovers publishable packages in a monorepo and orchestrates `npm trust` to configure trusted publishing for each.

**Architecture:** Thin orchestration layer over `npm trust` CLI (npm >= 11.10.0). Package discovery via Nx or workspace resolution with publishability heuristics. Interactive selection via @clack/prompts. All npm operations use `stdio: 'inherit'` so users interact with npm directly for auth/OTP.

**Tech Stack:** TypeScript, cli-forge, @clack/prompts, child_process (execSync/spawnSync)

---

### Task 1: Scaffold Package

**Files:**
- Create: `packages/npm-trusted-publishing/package.json`
- Create: `packages/npm-trusted-publishing/tsconfig.json`
- Create: `packages/npm-trusted-publishing/tsconfig.lib.json`
- Create: `packages/npm-trusted-publishing/tsconfig.spec.json`
- Create: `packages/npm-trusted-publishing/vitest.config.ts`
- Modify: `tsconfig.base.json` (add path alias)

**Step 1: Create package.json**

```json
{
  "name": "npm-trusted-publishing",
  "version": "0.0.1",
  "author": {
    "name": "Craigory Coppola",
    "url": "https://craigory.dev"
  },
  "bugs": {
    "url": "https://github.com/AgentEnder/craigory-dev/issues"
  },
  "homepage": "https://craigory.dev",
  "repository": {
    "type": "git",
    "url": "https://github.com/AgentEnder/craigory-dev.git",
    "directory": "packages/npm-trusted-publishing"
  },
  "publishConfig": {
    "access": "public"
  },
  "license": "MIT",
  "type": "module",
  "bin": {
    "npm-trusted-publishing": "./dist/cli.js"
  },
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "types": "./dist/index.d.ts",
      "default": "./dist/index.js"
    }
  },
  "scripts": {
    "build": "tsc -p tsconfig.lib.json",
    "test": "vitest run",
    "test:watch": "vitest",
    "lint": "eslint .",
    "typecheck": "tsc -p tsconfig.json --noEmit",
    "cli": "node dist/cli.js"
  },
  "dependencies": {
    "@clack/prompts": "^0.10.0",
    "cli-forge": "^1.2.0",
    "tslib": "^2.5.0"
  },
  "devDependencies": {
    "@types/node": "22.18.1",
    "@typescript-eslint/eslint-plugin": "7.16.1",
    "@typescript-eslint/parser": "7.16.1",
    "@vitest/coverage-v8": "4.0.9",
    "eslint": "8.57.0",
    "tsx": "^4.21.0",
    "typescript": "5.9.2",
    "vitest": "4.0.9"
  },
  "files": [
    "dist",
    "README.md"
  ]
}
```

**Step 2: Create tsconfig files** (mirror node-pagefind exactly, changing tsBuildInfo names)

**Step 3: Create vitest.config.ts** (identical to node-pagefind)

**Step 4: Add path alias to tsconfig.base.json:**
```json
"@new-personal-monorepo/npm-trusted-publishing": ["packages/npm-trusted-publishing/src/index.ts"]
```

**Step 5: Run `pnpm install`**

**Step 6: Verify build works with empty src/index.ts**

---

### Task 2: Types

**Files:**
- Create: `packages/npm-trusted-publishing/src/types.ts`

**Step 1: Write types**

```typescript
export interface TrustConfig {
  type: 'github';
  claims: {
    repository: string;
    workflow_ref: { file: string };
    environment?: string;
  };
}

export interface DiscoveredPackage {
  name: string;
  path: string;
  isPublishable: boolean;
  signals: PublishabilitySignal[];
}

export type PublishabilitySignal =
  | 'has-publish-config'
  | 'has-compiled-output'
  | 'has-bin'
  | 'points-to-source'
  | 'is-private';

export interface SetupOptions {
  packages?: string[];
  workflow?: string;
  environment?: string;
  registry?: string;
  dryRun?: boolean;
}
```

---

### Task 3: Discovery Module

**Files:**
- Create: `packages/npm-trusted-publishing/src/discovery.ts`
- Create: `packages/npm-trusted-publishing/src/discovery.spec.ts`

Implements the package discovery cascade:

1. **Nx detection:** Check if `nx.json` exists. If so, read `release.projects` globs. Run `nx show projects --json` filtered to those globs. Parse results.
2. **Workspace fallback:** Read `pnpm-workspace.yaml`, `package.json` workspaces, or `yarn` workspaces. Glob-resolve to package.json paths.
3. **Heuristics:** For each candidate, read package.json and classify:
   - Exclude if `private: true`
   - Strong: `publishConfig.access` set
   - Strong: `main`/`exports` point to compiled output (`dist/`, `build/`, `lib/`)
   - Moderate: `bin` field present
   - Negative: `main`/`exports` point to source (`src/`)

**Key functions:**
- `discoverPackages(cwd: string): Promise<DiscoveredPackage[]>`
- `discoverWithNx(cwd: string, releaseProjects: string[]): DiscoveredPackage[]`
- `discoverWithWorkspaces(cwd: string): DiscoveredPackage[]`
- `analyzePublishability(packageJsonPath: string): { isPublishable: boolean; signals: PublishabilitySignal[] }`

---

### Task 4: Registry Module

**Files:**
- Create: `packages/npm-trusted-publishing/src/registry.ts`

**Key functions:**
- `checkNpmVersion(): void` — Run `npm --version`, parse semver, error if < 11.10.0
- `packageExists(name: string, registry?: string): boolean` — `npm view <name> version`, returns false on error
- `publishShellPackage(name: string, registry?: string): void` — Create temp dir, write minimal package.json (name, version 0.0.0, publishConfig), run `npm publish` with `stdio: 'inherit'`
- `npmTrustSetup(pkg: string, repository: string, workflow: string, environment?: string): void` — `npm trust github setup --package <pkg> ...` with `stdio: 'inherit'`
- `npmTrustList(pkg: string): void` — `npm trust list --package <pkg>` with `stdio: 'inherit'`
- `npmTrustRevoke(pkg: string, configId: string): void` — `npm trust revoke --package <pkg> --id <id>` with `stdio: 'inherit'`

---

### Task 5: CLI Module

**Files:**
- Create: `packages/npm-trusted-publishing/src/cli.ts`

**Subcommands:**

**`setup` (default/$0):**
1. `checkNpmVersion()`
2. Detect git remote → derive `owner/repo`
3. Discover packages (or use `--packages`)
4. If no `--packages`, show clack multiselect (publishable packages pre-selected)
5. Prompt for workflow file if not `--workflow` (scan `.github/workflows/`, default `publish.yml`)
6. Prompt for environment if not `--environment` (optional, can skip)
7. For each selected package:
   a. Check registry existence
   b. If not exists → confirm + `publishShellPackage()`
   c. `npmTrustSetup()`
8. Summary

**`list`:**
1. `checkNpmVersion()`
2. Discover or use `--packages`
3. For each: `npmTrustList()`

**`revoke`:**
1. `checkNpmVersion()`
2. Discover or use `--packages`
3. For each: prompt for config ID or list first
4. `npmTrustRevoke()`

---

### Task 6: Index + Exports

**Files:**
- Create: `packages/npm-trusted-publishing/src/index.ts`

Export public API: `discoverPackages`, types, `cli`, `sdk`.

---

### Task 7: Build + Verify

**Steps:**
1. `pnpm run build` in package
2. `pnpm run typecheck` in package
3. `pnpm run lint` in package
4. Verify CLI runs: `node dist/cli.js --help`
