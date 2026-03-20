import { mkdtempSync, writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';

import { analyzePublishability, discoverWithWorkspaces, discoverPackages, resolveTagPattern } from './discovery.js';

describe('analyzePublishability', () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = mkdtempSync(join(tmpdir(), 'npm-tp-test-'));
  });

  afterEach(() => {
    rmSync(tempDir, { recursive: true, force: true });
  });

  function writePackageJson(content: Record<string, unknown>): string {
    const filePath = join(tempDir, 'package.json');
    writeFileSync(filePath, JSON.stringify(content));
    return filePath;
  }

  it('should detect private package as not publishable', () => {
    const filePath = writePackageJson({
      name: 'private-pkg',
      private: true,
    });

    const result = analyzePublishability(filePath);

    expect(result.isPublishable).toBe(false);
    expect(result.signals).toEqual(['is-private']);
  });

  it('should detect publishConfig.access as publishable', () => {
    const filePath = writePackageJson({
      name: 'public-pkg',
      publishConfig: { access: 'public' },
    });

    const result = analyzePublishability(filePath);

    expect(result.isPublishable).toBe(true);
    expect(result.signals).toContain('has-publish-config');
  });

  it('should detect main pointing to dist/ as compiled output', () => {
    const filePath = writePackageJson({
      name: 'compiled-pkg',
      main: 'dist/index.js',
    });

    const result = analyzePublishability(filePath);

    expect(result.isPublishable).toBe(true);
    expect(result.signals).toContain('has-compiled-output');
  });

  it('should detect main pointing to build/ as compiled output', () => {
    const filePath = writePackageJson({
      name: 'compiled-pkg',
      main: './build/index.js',
    });

    const result = analyzePublishability(filePath);

    expect(result.isPublishable).toBe(true);
    expect(result.signals).toContain('has-compiled-output');
  });

  it('should detect main pointing to lib/ as compiled output', () => {
    const filePath = writePackageJson({
      name: 'compiled-pkg',
      main: './lib/index.js',
    });

    const result = analyzePublishability(filePath);

    expect(result.isPublishable).toBe(true);
    expect(result.signals).toContain('has-compiled-output');
  });

  it('should detect compiled output in exports', () => {
    const filePath = writePackageJson({
      name: 'compiled-pkg',
      exports: {
        '.': {
          import: './dist/index.js',
          types: './dist/index.d.ts',
        },
      },
    });

    const result = analyzePublishability(filePath);

    expect(result.isPublishable).toBe(true);
    expect(result.signals).toContain('has-compiled-output');
  });

  it('should detect bin field', () => {
    const filePath = writePackageJson({
      name: 'cli-pkg',
      bin: { 'my-cli': './dist/cli.js' },
      main: './dist/index.js',
    });

    const result = analyzePublishability(filePath);

    expect(result.signals).toContain('has-bin');
    expect(result.signals).toContain('has-compiled-output');
    expect(result.isPublishable).toBe(true);
  });

  it('should detect main pointing to src/ as source', () => {
    const filePath = writePackageJson({
      name: 'source-pkg',
      main: 'src/index.ts',
    });

    const result = analyzePublishability(filePath);

    expect(result.isPublishable).toBe(false);
    expect(result.signals).toContain('points-to-source');
    expect(result.signals).not.toContain('has-compiled-output');
  });

  it('should detect both publishConfig and compiled output', () => {
    const filePath = writePackageJson({
      name: 'full-pkg',
      publishConfig: { access: 'public' },
      main: './dist/index.js',
    });

    const result = analyzePublishability(filePath);

    expect(result.isPublishable).toBe(true);
    expect(result.signals).toContain('has-publish-config');
    expect(result.signals).toContain('has-compiled-output');
  });

  it('should return not publishable with no signals', () => {
    const filePath = writePackageJson({
      name: 'bare-pkg',
    });

    const result = analyzePublishability(filePath);

    expect(result.isPublishable).toBe(false);
    expect(result.signals).toEqual([]);
  });
});

describe('discoverWithWorkspaces', () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = mkdtempSync(join(tmpdir(), 'npm-tp-workspace-'));
  });

  afterEach(() => {
    rmSync(tempDir, { recursive: true, force: true });
  });

  it('should discover packages from pnpm-workspace.yaml', () => {
    writeFileSync(
      join(tempDir, 'pnpm-workspace.yaml'),
      `packages:\n  - 'packages/*'\n`
    );
    writeFileSync(
      join(tempDir, 'package.json'),
      JSON.stringify({ name: 'root', private: true })
    );

    const pkgDir = join(tempDir, 'packages', 'my-lib');
    mkdirSync(pkgDir, { recursive: true });
    writeFileSync(
      join(pkgDir, 'package.json'),
      JSON.stringify({
        name: '@scope/my-lib',
        main: './dist/index.js',
        publishConfig: { access: 'public' },
      })
    );

    const result = discoverWithWorkspaces(tempDir);

    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('@scope/my-lib');
    expect(result[0].isPublishable).toBe(true);
    expect(result[0].signals).toContain('has-publish-config');
    expect(result[0].signals).toContain('has-compiled-output');
  });

  it('should discover packages from package.json workspaces array', () => {
    writeFileSync(
      join(tempDir, 'package.json'),
      JSON.stringify({
        name: 'root',
        private: true,
        workspaces: ['packages/*'],
      })
    );

    const pkgDir = join(tempDir, 'packages', 'my-tool');
    mkdirSync(pkgDir, { recursive: true });
    writeFileSync(
      join(pkgDir, 'package.json'),
      JSON.stringify({
        name: 'my-tool',
        main: './dist/index.js',
      })
    );

    const result = discoverWithWorkspaces(tempDir);

    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('my-tool');
    expect(result[0].isPublishable).toBe(true);
  });

  it('should discover packages from package.json workspaces.packages', () => {
    writeFileSync(
      join(tempDir, 'package.json'),
      JSON.stringify({
        name: 'root',
        private: true,
        workspaces: { packages: ['libs/*'] },
      })
    );

    const pkgDir = join(tempDir, 'libs', 'core');
    mkdirSync(pkgDir, { recursive: true });
    writeFileSync(
      join(pkgDir, 'package.json'),
      JSON.stringify({
        name: '@my/core',
        private: true,
      })
    );

    const result = discoverWithWorkspaces(tempDir);

    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('@my/core');
    expect(result[0].isPublishable).toBe(false);
    expect(result[0].signals).toContain('is-private');
  });

  it('should handle single-package repo with no workspaces', () => {
    writeFileSync(
      join(tempDir, 'package.json'),
      JSON.stringify({
        name: 'solo-pkg',
        main: './dist/index.js',
        publishConfig: { access: 'public' },
      })
    );

    const result = discoverWithWorkspaces(tempDir);

    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('solo-pkg');
    expect(result[0].isPublishable).toBe(true);
  });

  it('should skip directories without package.json', () => {
    writeFileSync(
      join(tempDir, 'package.json'),
      JSON.stringify({
        name: 'root',
        private: true,
        workspaces: ['packages/*'],
      })
    );

    // Directory with package.json
    const pkgDir = join(tempDir, 'packages', 'real');
    mkdirSync(pkgDir, { recursive: true });
    writeFileSync(
      join(pkgDir, 'package.json'),
      JSON.stringify({ name: 'real', main: './dist/index.js' })
    );

    // Directory without package.json
    const noPackageDir = join(tempDir, 'packages', 'empty');
    mkdirSync(noPackageDir, { recursive: true });

    const result = discoverWithWorkspaces(tempDir);

    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('real');
  });
});

describe('discoverPackages', () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = mkdtempSync(join(tmpdir(), 'npm-tp-discover-'));
  });

  afterEach(() => {
    rmSync(tempDir, { recursive: true, force: true });
  });

  it('should use workspace discovery when no nx.json exists', () => {
    writeFileSync(
      join(tempDir, 'package.json'),
      JSON.stringify({
        name: 'simple-pkg',
        main: './dist/index.js',
      })
    );

    const result = discoverPackages(tempDir);

    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('simple-pkg');
  });

  it('should fall back to workspace discovery when nx.json has no release.projects', () => {
    writeFileSync(join(tempDir, 'nx.json'), JSON.stringify({}));
    writeFileSync(
      join(tempDir, 'package.json'),
      JSON.stringify({
        name: 'nx-no-release',
        main: './dist/index.js',
      })
    );

    const result = discoverPackages(tempDir);

    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('nx-no-release');
  });
});

describe('resolveTagPattern', () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = mkdtempSync(join(tmpdir(), 'npm-tp-tag-'));
  });

  afterEach(() => {
    rmSync(tempDir, { recursive: true, force: true });
  });

  it('should return independent pattern when no nx.json exists', () => {
    expect(resolveTagPattern(tempDir)).toBe('{projectName}@{version}');
  });

  it('should read releaseTag.pattern from nx.json', () => {
    writeFileSync(
      join(tempDir, 'nx.json'),
      JSON.stringify({
        release: { releaseTag: { pattern: 'v{version}-{projectName}' } },
      })
    );

    expect(resolveTagPattern(tempDir)).toBe('v{version}-{projectName}');
  });

  it('should read deprecated releaseTagPattern from nx.json', () => {
    writeFileSync(
      join(tempDir, 'nx.json'),
      JSON.stringify({
        release: { releaseTagPattern: '{projectName}@v{version}' },
      })
    );

    expect(resolveTagPattern(tempDir)).toBe('{projectName}@v{version}');
  });

  it('should prefer releaseTag.pattern over releaseTagPattern', () => {
    writeFileSync(
      join(tempDir, 'nx.json'),
      JSON.stringify({
        release: {
          releaseTag: { pattern: 'new-{projectName}@{version}' },
          releaseTagPattern: 'old-{projectName}@{version}',
        },
      })
    );

    expect(resolveTagPattern(tempDir)).toBe('new-{projectName}@{version}');
  });

  it('should default to fixed pattern when projectsRelationship is fixed', () => {
    writeFileSync(
      join(tempDir, 'nx.json'),
      JSON.stringify({
        release: { projectsRelationship: 'fixed' },
      })
    );

    expect(resolveTagPattern(tempDir)).toBe('{version}');
  });

  it('should default to independent pattern when projectsRelationship is independent', () => {
    writeFileSync(
      join(tempDir, 'nx.json'),
      JSON.stringify({
        release: { projectsRelationship: 'independent' },
      })
    );

    expect(resolveTagPattern(tempDir)).toBe('{projectName}@{version}');
  });

  it('should default to fixed pattern when projectsRelationship is not set', () => {
    writeFileSync(
      join(tempDir, 'nx.json'),
      JSON.stringify({ release: {} })
    );

    expect(resolveTagPattern(tempDir)).toBe('{version}');
  });
});
