#!/usr/bin/env node

import { cli } from 'cli-forge';
import { execSync, spawnSync } from 'node:child_process';
import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import * as p from '@clack/prompts';

import { discoverPackages, resolveTagPattern } from './discovery.js';
import {
  checkNpmVersion,
  checkNpmLogin,
  promptOtp,
  packageExists,
  publishShellPackage,
  createVersionTag,
  formatTag,
  npmTrustSetup,
  npmTrustList,
  npmTrustRevoke,
} from './registry.js';

export function parseGitRemote(remoteUrl: string): string {
  const sshMatch = remoteUrl.match(/git@[^:]+:(.+?)(?:\.git)?$/);
  if (sshMatch) return sshMatch[1];

  const httpsMatch = remoteUrl.match(/https?:\/\/[^/]+\/(.+?)(?:\.git)?$/);
  if (httpsMatch) return httpsMatch[1];

  throw new Error(`Could not parse git remote URL: ${remoteUrl}`);
}

async function resolvePackages(opts: {
  packages?: string[];
}): Promise<string[]> {
  if (opts.packages && opts.packages.length > 0) {
    return opts.packages;
  }

  const discovered = discoverPackages(process.cwd());
  if (discovered.length === 0) {
    p.log.warn('No packages found in this workspace.');
    return [];
  }

  const selected = await p.multiselect({
    message: 'Select packages:',
    options: discovered.map((pkg) => ({
      value: pkg.name,
      label: pkg.name,
      hint: pkg.signals.join(', '),
    })),
    initialValues: discovered
      .filter((pkg) => pkg.isPublishable)
      .map((pkg) => pkg.name),
  });

  if (p.isCancel(selected)) {
    p.cancel('Cancelled');
    process.exit(0);
  }

  return selected as string[];
}

const npmTrustedPublishingCLI = cli('npm-trusted-publishing', {
  description:
    'Configure npm trusted publishing for GitHub Actions workflows',
  builder: (args) =>
    args
      .option('packages', {
        type: 'array',
        items: 'string',
        description: 'Explicit package names (skips interactive discovery)',
      })
      .option('workflow', {
        type: 'string',
        description: 'GitHub Actions workflow filename',
      })
      .option('environment', {
        type: 'string',
        description: 'GitHub Actions environment name (optional)',
      })
      .option('registry', {
        type: 'string',
        description: 'npm registry URL',
        default: 'https://registry.npmjs.org',
      })
      .command('setup', {
        description: 'Set up trusted publishing for selected packages',
        builder: (c) => c,
        handler: async (opts) => {
          checkNpmVersion();

          p.intro('npm trusted publishing setup');

          checkNpmLogin(opts.registry);

          const remoteUrl = execSync('git remote get-url origin', {
            encoding: 'utf-8',
          }).trim();
          const repository = parseGitRemote(remoteUrl);

          const packages = await resolvePackages(opts);
          if (packages.length === 0) {
            p.outro('No packages selected.');
            return;
          }

          let workflowFile: string;
          if (opts.workflow) {
            workflowFile = opts.workflow;
          } else {
            const workflowDir = join(process.cwd(), '.github', 'workflows');
            let workflowOptions: string[] = [];
            if (existsSync(workflowDir)) {
              workflowOptions = readdirSync(workflowDir).filter(
                (f) => f.endsWith('.yml') || f.endsWith('.yaml')
              );
            }

            const workflow = await p.select({
              message: 'Select the workflow file that publishes packages:',
              options: [
                ...workflowOptions.map((f) => ({ value: f, label: f })),
                { value: '__custom__', label: 'Enter custom filename...' },
              ],
              initialValue: workflowOptions.includes('publish.yml')
                ? 'publish.yml'
                : workflowOptions[0],
            });

            if (p.isCancel(workflow)) {
              p.cancel('Cancelled');
              process.exit(0);
            }

            workflowFile = workflow as string;
            if (workflowFile === '__custom__') {
              const customWorkflow = await p.text({
                message: 'Enter workflow filename:',
                placeholder: 'publish.yml',
                validate: (v) =>
                  !v ? 'Workflow filename is required' : undefined,
              });

              if (p.isCancel(customWorkflow)) {
                p.cancel('Cancelled');
                process.exit(0);
              }

              workflowFile = customWorkflow as string;
            }
          }

          let env: string | undefined;
          if (opts.environment) {
            env = opts.environment;
          } else {
            const useEnv = await p.confirm({
              message: 'Restrict to a specific GitHub Actions environment?',
              initialValue: false,
            });

            if (p.isCancel(useEnv)) {
              p.cancel('Cancelled');
              process.exit(0);
            }

            if (useEnv) {
              const environment = await p.text({
                message: 'GitHub Actions environment name:',
                placeholder: 'release',
                validate: (v) =>
                  !v ? 'Environment name is required' : undefined,
              });

              if (p.isCancel(environment)) {
                p.cancel('Cancelled');
                process.exit(0);
              }

              env = environment as string;
            }
          }

          const tagPattern = resolveTagPattern(process.cwd());

          let otp = await promptOtp();
          const failed: string[] = [];

          for (const pkgName of packages) {
            try {
              const s = p.spinner();
              s.start(`Checking ${pkgName} on registry...`);

              const exists = packageExists(pkgName, opts.registry);
              s.stop(`Checked ${pkgName}`);

              if (!exists) {
                const shouldPublish = await p.confirm({
                  message: `Package "${pkgName}" doesn't exist on npm. Publish a shell v0.0.0?`,
                });

                if (p.isCancel(shouldPublish) || !shouldPublish) {
                  p.log.warn(`Skipping ${pkgName}`);
                  continue;
                }

                const tag = formatTag(tagPattern, pkgName);
                p.log.step(`Publishing shell package for ${pkgName}...`);
                publishShellPackage(pkgName, otp, opts.registry);
                createVersionTag(pkgName, tagPattern);
                p.log.success(`Published shell package for ${pkgName} (tagged ${tag})`);
              }

              p.log.step(`Setting up trusted publishing for ${pkgName}...`);
              npmTrustSetup(pkgName, repository, workflowFile, otp, env);
              p.log.success(`Configured trusted publishing for ${pkgName}`);
            } catch (e) {
              const msg = e instanceof Error ? e.message : String(e);
              if (msg.includes('EOTP') || msg.includes('one-time pass')) {
                p.log.warn('OTP expired. Please enter a new one.');
                otp = await promptOtp();
                // Retry this package
                try {
                  p.log.step(`Retrying ${pkgName}...`);
                  npmTrustSetup(pkgName, repository, workflowFile, otp, env);
                  p.log.success(`Configured trusted publishing for ${pkgName}`);
                  continue;
                } catch (retryErr) {
                  const retryMsg = retryErr instanceof Error ? retryErr.message : String(retryErr);
                  p.log.error(`Failed for ${pkgName}: ${retryMsg}`);
                  failed.push(pkgName);
                }
              } else {
                p.log.error(`Failed for ${pkgName}: ${msg}`);
                failed.push(pkgName);
              }
            }
          }

          if (failed.length > 0) {
            p.outro(`Done with ${failed.length} failure(s): ${failed.join(', ')}`);
          } else {
            p.outro('Trusted publishing setup complete!');
          }
        },
        alias: ['$0'],
      })
      .command('list', {
        description: 'List trusted publishing configurations',
        builder: (c) => c,
        handler: async (opts) => {
          checkNpmVersion();

          p.intro('npm trusted publishing - list configurations');

          checkNpmLogin(opts.registry);

          const packages = await resolvePackages(opts);
          if (packages.length === 0) {
            p.outro('No packages selected.');
            return;
          }

          for (const pkg of packages) {
            p.log.info(`Trust configurations for ${pkg}:`);
            npmTrustList(pkg);
          }

          p.outro('Done.');
        },
      })
      .command('tag', {
        description:
          'Create v0.0.0 git tags for packages (for nx release compatibility)',
        builder: (c) =>
          c
            .option('push', {
              type: 'boolean',
              description: 'Push created tags to the remote after tagging',
              default: false,
            })
            .option('tagPattern', {
              type: 'string',
              description:
                'Tag pattern with {projectName} and {version} placeholders (auto-detected from nx.json)',
            }),
        handler: async (opts) => {
          p.intro('npm trusted publishing - create version tags');

          const tagPattern =
            opts.tagPattern ?? resolveTagPattern(process.cwd());
          p.log.info(`Using tag pattern: ${tagPattern}`);

          const packages = await resolvePackages(opts);
          if (packages.length === 0) {
            p.outro('No packages selected.');
            return;
          }

          const changed: string[] = [];
          const skipped: string[] = [];

          for (const pkg of packages) {
            const tag = formatTag(tagPattern, pkg);
            try {
              const result = createVersionTag(pkg, tagPattern);
              if (result === 'already-correct') {
                skipped.push(pkg);
                p.log.info(`Tag ${tag} already exists at root commit`);
              } else {
                changed.push(pkg);
                const verb = result === 'moved' ? 'Moved' : 'Created';
                p.log.success(`${verb} tag ${tag}`);
              }
            } catch (e) {
              const msg = e instanceof Error ? e.message : String(e);
              p.log.error(`Failed to tag ${pkg}: ${msg}`);
            }
          }

          if (changed.length > 0 && opts.push) {
            const tags = changed.map((pkg) => formatTag(tagPattern, pkg));
            const result = spawnSync(
              'git',
              ['push', '--force', 'origin', ...tags],
              { stdio: 'inherit' }
            );
            if (result.status !== 0) {
              p.log.error('Failed to push tags to remote.');
            } else {
              p.log.success(`Pushed ${tags.length} tag(s) to remote.`);
            }
          } else if (changed.length > 0) {
            p.log.info(
              `Run \`git push --tags\` to push the new tags to your remote.`
            );
          }

          p.outro(
            `Done. Updated ${changed.length} tag(s), ${skipped.length} already correct.`
          );
        },
      })
      .command('revoke', {
        description: 'Revoke a trusted publishing configuration',
        builder: (c) => c,
        handler: async (opts) => {
          checkNpmVersion();

          p.intro('npm trusted publishing - revoke configuration');

          checkNpmLogin(opts.registry);

          const packages = await resolvePackages(opts);
          if (packages.length === 0) {
            p.outro('No packages selected.');
            return;
          }

          const otp = await promptOtp();

          for (const pkg of packages) {
            const configId = await p.text({
              message: `Enter trust config ID to revoke for "${pkg}":`,
              validate: (v) => (!v ? 'Config ID is required' : undefined),
            });

            if (p.isCancel(configId)) {
              p.cancel('Cancelled');
              process.exit(0);
            }

            npmTrustRevoke(pkg, configId as string, otp);
            p.log.success(`Revoked config ${configId} for ${pkg}`);
          }

          p.outro('Done.');
        },
      }),
});

export default npmTrustedPublishingCLI;

npmTrustedPublishingCLI.forge();
