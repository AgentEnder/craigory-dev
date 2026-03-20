import { execSync } from 'node:child_process';
import {
  readFileSync,
  existsSync,
  readdirSync,
  statSync,
} from 'node:fs';
import { join, resolve } from 'node:path';

import type { DiscoveredPackage, PublishabilitySignal } from './types.js';

const INDEPENDENT_TAG_PATTERN = '{projectName}@{version}';
const FIXED_TAG_PATTERN = '{version}';

export function resolveTagPattern(cwd: string): string {
  const nxJsonPath = join(cwd, 'nx.json');
  if (!existsSync(nxJsonPath)) {
    return INDEPENDENT_TAG_PATTERN;
  }

  try {
    const nxJson = JSON.parse(readFileSync(nxJsonPath, 'utf-8'));
    const release = nxJson?.release;
    if (!release) {
      return INDEPENDENT_TAG_PATTERN;
    }

    // Check releaseTag.pattern first, then deprecated releaseTagPattern
    const pattern =
      release.releaseTag?.pattern ?? release.releaseTagPattern;
    if (pattern) {
      return pattern;
    }

    // Fall back to default based on projectsRelationship
    const relationship = release.projectsRelationship ?? 'fixed';
    return relationship === 'independent'
      ? INDEPENDENT_TAG_PATTERN
      : FIXED_TAG_PATTERN;
  } catch {
    return INDEPENDENT_TAG_PATTERN;
  }
}

export function discoverPackages(cwd: string): DiscoveredPackage[] {
  const nxJsonPath = join(cwd, 'nx.json');
  if (existsSync(nxJsonPath)) {
    try {
      return discoverWithNx(cwd);
    } catch {
      // If Nx discovery fails, fall back to workspace discovery
    }
  }
  return discoverWithWorkspaces(cwd);
}

export function discoverWithNx(cwd: string): DiscoveredPackage[] {
  const nxJsonPath = join(cwd, 'nx.json');
  const nxJson = JSON.parse(readFileSync(nxJsonPath, 'utf-8'));

  const releaseProjects: string[] | undefined = nxJson?.release?.projects;
  if (!releaseProjects || releaseProjects.length === 0) {
    return discoverWithWorkspaces(cwd);
  }

  const nxBin = join(cwd, 'node_modules', '.bin', 'nx');
  if (!existsSync(nxBin)) {
    return discoverWithWorkspaces(cwd);
  }

  const patternsArg = releaseProjects.join(',');
  const showProjectsOutput = execSync(
    `${nxBin} show projects --json -p ${patternsArg}`,
    { cwd, encoding: 'utf-8' }
  );
  const projectNames: string[] = JSON.parse(showProjectsOutput);

  const packages: DiscoveredPackage[] = [];
  for (const name of projectNames) {
    try {
      const projectOutput = execSync(
        `${nxBin} show project ${name} --json`,
        { cwd, encoding: 'utf-8' }
      );
      const projectConfig = JSON.parse(projectOutput);
      const projectRoot = resolve(cwd, projectConfig.root);
      const packageJsonPath = join(projectRoot, 'package.json');

      if (!existsSync(packageJsonPath)) {
        continue;
      }

      const { isPublishable, signals } =
        analyzePublishability(packageJsonPath);
      const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));

      packages.push({
        name: packageJson.name ?? name,
        path: projectRoot,
        isPublishable,
        signals,
      });
    } catch {
      // Skip projects that can't be resolved
    }
  }

  return packages;
}

export function discoverWithWorkspaces(cwd: string): DiscoveredPackage[] {
  const globs = getWorkspaceGlobs(cwd);
  if (globs.length === 0) {
    // Single-package repo: check root package.json
    const rootPackageJsonPath = join(cwd, 'package.json');
    if (existsSync(rootPackageJsonPath)) {
      const { isPublishable, signals } =
        analyzePublishability(rootPackageJsonPath);
      const packageJson = JSON.parse(
        readFileSync(rootPackageJsonPath, 'utf-8')
      );
      return [
        {
          name: packageJson.name ?? 'unknown',
          path: cwd,
          isPublishable,
          signals,
        },
      ];
    }
    return [];
  }

  const packages: DiscoveredPackage[] = [];
  for (const glob of globs) {
    const dirs = resolveGlob(cwd, glob);
    for (const dir of dirs) {
      const packageJsonPath = join(dir, 'package.json');
      if (!existsSync(packageJsonPath)) {
        continue;
      }
      const { isPublishable, signals } =
        analyzePublishability(packageJsonPath);
      const packageJson = JSON.parse(
        readFileSync(packageJsonPath, 'utf-8')
      );
      packages.push({
        name: packageJson.name ?? 'unknown',
        path: dir,
        isPublishable,
        signals,
      });
    }
  }

  return packages;
}

export function analyzePublishability(packageJsonPath: string): {
  isPublishable: boolean;
  signals: PublishabilitySignal[];
} {
  const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
  const signals: PublishabilitySignal[] = [];

  if (packageJson.private === true) {
    signals.push('is-private');
    return { isPublishable: false, signals };
  }

  if (packageJson.publishConfig?.access) {
    signals.push('has-publish-config');
  }

  if (hasCompiledOutput(packageJson)) {
    signals.push('has-compiled-output');
  }

  if (packageJson.bin) {
    signals.push('has-bin');
  }

  if (pointsToSource(packageJson)) {
    signals.push('points-to-source');
  }

  const hasStrongSignal =
    signals.includes('has-publish-config') ||
    signals.includes('has-compiled-output');

  return { isPublishable: hasStrongSignal, signals };
}

function getWorkspaceGlobs(cwd: string): string[] {
  // Check pnpm-workspace.yaml first
  const pnpmWorkspacePath = join(cwd, 'pnpm-workspace.yaml');
  if (existsSync(pnpmWorkspacePath)) {
    const content = readFileSync(pnpmWorkspacePath, 'utf-8');
    return parsePnpmWorkspaceYaml(content);
  }

  // Check package.json workspaces
  const packageJsonPath = join(cwd, 'package.json');
  if (existsSync(packageJsonPath)) {
    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
    if (Array.isArray(packageJson.workspaces)) {
      return packageJson.workspaces;
    }
    if (Array.isArray(packageJson.workspaces?.packages)) {
      return packageJson.workspaces.packages;
    }
  }

  return [];
}

function parsePnpmWorkspaceYaml(content: string): string[] {
  const globs: string[] = [];
  const lines = content.split('\n');
  let inPackages = false;

  for (const line of lines) {
    if (/^packages\s*:/.test(line)) {
      inPackages = true;
      continue;
    }
    if (inPackages) {
      const match = line.match(/^\s+-\s+['"]?([^'"]+)['"]?\s*$/);
      if (match) {
        globs.push(match[1]);
      } else if (line.trim() !== '' && !line.startsWith(' ') && !line.startsWith('\t')) {
        // New top-level key, stop parsing
        break;
      }
    }
  }

  return globs;
}

function resolveGlob(cwd: string, pattern: string): string[] {
  // Handle simple glob patterns like "packages/*" or "apps/*"
  // Split on the first wildcard
  const parts = pattern.split('*');
  if (parts.length === 1) {
    // No wildcard — it's a direct path
    const fullPath = resolve(cwd, pattern);
    if (existsSync(fullPath) && statSync(fullPath).isDirectory()) {
      return [fullPath];
    }
    return [];
  }

  const baseDir = resolve(cwd, parts[0]);
  if (!existsSync(baseDir) || !statSync(baseDir).isDirectory()) {
    return [];
  }

  const entries = readdirSync(baseDir);
  const results: string[] = [];
  for (const entry of entries) {
    const fullPath = join(baseDir, entry);
    try {
      if (statSync(fullPath).isDirectory()) {
        results.push(fullPath);
      }
    } catch {
      // Skip entries that can't be stat'd
    }
  }

  return results;
}

function hasCompiledOutput(packageJson: Record<string, unknown>): boolean {
  const compiledDirPattern = /^\.?\/?(?:dist|build|lib)\//;

  if (
    typeof packageJson.main === 'string' &&
    compiledDirPattern.test(packageJson.main)
  ) {
    return true;
  }

  if (packageJson.exports) {
    return checkExportsForPattern(packageJson.exports, compiledDirPattern);
  }

  return false;
}

function pointsToSource(packageJson: Record<string, unknown>): boolean {
  const sourcePattern = /^\.?\/?src\//;

  if (
    typeof packageJson.main === 'string' &&
    sourcePattern.test(packageJson.main)
  ) {
    return true;
  }

  if (packageJson.exports) {
    return checkExportsForPattern(packageJson.exports, sourcePattern);
  }

  return false;
}

function checkExportsForPattern(
  exports: unknown,
  pattern: RegExp
): boolean {
  if (typeof exports === 'string') {
    return pattern.test(exports);
  }
  if (typeof exports === 'object' && exports !== null) {
    for (const value of Object.values(exports)) {
      if (checkExportsForPattern(value, pattern)) {
        return true;
      }
    }
  }
  return false;
}
