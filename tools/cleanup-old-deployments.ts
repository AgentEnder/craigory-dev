import { execSync } from 'child_process';
import { existsSync, readdirSync } from 'fs';

import { Octokit } from '@octokit/rest';

const client = new Octokit({
  auth: process.env.GH_TOKEN,
});

async function updatePrComment(number: number) {
  const pr = await client.pulls
    .get({
      owner: 'agentender',
      repo: 'craigory-dev',
      pull_number: number,
    })
    .then((res) => res.data);
  const allComments = await client.rest.issues
    .listComments({
      issue_number: number,
      owner: 'agentender',
      repo: 'craigory-dev',
    })
    .then((res) => res.data);
  const comment = allComments.find((c) =>
    c.body?.toLowerCase().includes('preview deployment')
  );
  if (comment) {
    await client.rest.issues.updateComment({
      comment_id: comment.id,
      owner: 'agentender',
      repo: 'craigory-dev',
      body: `Preview deployment has been cleaned up. Push a new commit to re-deploy.`,
    });
  }
}

async function cleanupDeployment(pr: string) {
  console.log(`Deleting ${pr}`);
  execSync(`rm -rf pr/${pr}`);

  const prNumber = Number(pr);
  if (!Number.isNaN(prNumber)) {
    try {
      await updatePrComment(prNumber);
    } catch {
      console.log('Failed to update PR comment for PR #' + prNumber);
    }
  }
}

(async () => {
  const now = Date.now();
  // pr folder will not exist if all PRs have been cleaned up
  // on a previous run, so we exit early to avoid an ENOENT
  // when reading the directory.
  if (!existsSync('pr')) {
    return;
  }
  const deployments = readdirSync('pr');
  for (const folder of deployments) {
    const lastModified = new Date(
      Number(
        execSync(`git log -n 1 --pretty=format:%at pr/${folder}`)
          .toString()
          .trim()
      ) * 1000
    ).getTime();

    // Environment is older than 7 days
    if (
      (process.env.ALL && process.env.ALL !== 'false') ||
      now - lastModified > 1000 * 60 * 60 * 24 * 7
    ) {
      await cleanupDeployment(folder);
    }
  }
})();
