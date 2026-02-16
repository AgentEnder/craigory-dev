#!/usr/bin/env node

import { cli } from 'cli-forge';
import { mkdir, writeFile } from 'fs/promises';
import { dirname } from 'path';
import { fetchPrData, formatDigest } from './digest.js';
import {
  getGitHubToken,
  getGitRepoInfo,
  getPRFromBranch,
  parseGitHubUrl,
} from './utils.js';

const prCLI = cli('pr-digest', {
  description: 'Generate a digest of a GitHub pull request',
  builder: (args) =>
    args
      .option('url', {
        type: 'string',
        description:
          'GitHub PR URL (e.g., https://github.com/owner/repo/pull/123)',
      })
      .option('owner', {
        type: 'string',
        description: 'Repository owner',
      })
      .option('repo', {
        type: 'string',
        description: 'Repository name',
      })
      .option('pr', {
        type: 'number',
        description: 'PR number',
      })
      .option('token', {
        type: 'string',
        description:
          'GitHub token (defaults to GH_TOKEN, GITHUB_TOKEN, or gh auth token)',
      })
      .option('output', {
        type: 'string',
        description: 'Output file path (defaults to stdout)',
      })
      .option('ai-provider', {
        type: 'string',
        description: 'AI provider for log summarization (opencode or claude)',
        default: 'opencode',
      })
      .group('PR Source', ['url', 'owner', 'repo', 'pr'])
      .examples(
        'pr-digest --url https://github.com/owner/repo/pull/123',
        'pr-digest (auto-detects from current repo)',
        'pr-digest --owner owner --repo repo --pr 123',
        'pr-digest --ai-provider claude --url https://github.com/owner/repo/pull/123'
      ),
  handler: async (args) => {
    let owner: string;
    let repo: string;
    let prNumber: number;

    if (args.url) {
      const parsed = parseGitHubUrl(args.url);
      if (!parsed) {
        console.error(`Invalid GitHub URL: ${args.url}`);
        process.exit(1);
      }
      owner = parsed.owner;
      repo = parsed.repo;
      prNumber = parsed.prNumber;
    } else {
      const gitInfo = getGitRepoInfo();
      if (!gitInfo) {
        console.error(
          'Error: Could not detect GitHub repository from current git repo. Provide --url, --owner, --repo, and --pr explicitly.'
        );
        process.exit(1);
      }

      owner = args.owner || gitInfo.owner;
      repo = args.repo || gitInfo.repo;
      prNumber =
        args.pr ||
        (await (async () => {
          if (gitInfo.currentBranch) {
            const prFromBranch = await getPRFromBranch(
              owner,
              repo,
              gitInfo.currentBranch
            );
            if (prFromBranch) {
              return prFromBranch;
            } else {
              console.error(
                'Error: Could not find a PR for the current branch. Provide --pr explicitly.'
              );
              process.exit(1);
            }
          } else {
            console.error(
              'Error: Either --url or --owner, --repo, and --pr must be provided'
            );
            process.exit(1);
          }
        })());
    }

    const token = await getGitHubToken(args.token);
    const { pr, timeline, checkRuns } = await fetchPrData(
      owner,
      repo,
      prNumber,
      token,
      args['ai-provider'] as 'opencode' | 'claude'
    );

    const digest = formatDigest(pr, timeline, checkRuns);

    if (args.output) {
      await mkdir(dirname(args.output), { recursive: true }).catch(
        () => undefined
      );
      await writeFile(args.output, digest, 'utf-8');
      console.log(`Digest written to ${args.output}`);
    } else {
      console.log(digest);
    }
  },
});

export default prCLI;

prCLI.forge();
