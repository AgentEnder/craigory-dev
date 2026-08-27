import { readFileSync } from 'node:fs';
import { argv } from 'node:process';
import { fileURLToPath } from 'node:url';
import { Octokit } from '@octokit/rest';
import { h1, link, table } from 'markdown-factory';

const github = new Octokit({
  auth: process.env.GH_TOKEN,
});

type TableData = {
  label: string;
  value: string;
};

/**
 * The `version-upload` record wrangler appends to `WRANGLER_OUTPUT_FILE_PATH`.
 * Only the fields we read are modelled; the record carries several more.
 */
type WranglerVersionUpload = {
  type: 'version-upload';
  /** Stable across pushes to a PR — `--preview-alias pr-<n>` drives it. */
  preview_alias_url?: string | null;
  /** Version-id-derived, so it changes on every upload. */
  preview_url?: string | null;
};

/**
 * The URL of the JustListen Worker version uploaded for this PR, or null when
 * there isn't one.
 *
 * Read back out of wrangler's own structured output rather than reconstructed
 * from the alias, because the URL embeds the account's workers.dev subdomain —
 * hardcoding that here would put an account detail in the repo and silently
 * produce dead links if it ever changed.
 *
 * Absent whenever the upload did not happen (no CLOUDFLARE_API_TOKEN, so
 * apps/justlisten/tools/deploy.mjs skipped) or Cloudflare returned no preview
 * URL because Preview URLs are disabled on the Worker.
 */
export function justListenPreviewUrl(): string | null {
  const path = process.env.WRANGLER_OUTPUT_FILE_PATH;
  if (!path) return null;

  let contents: string;
  try {
    contents = readFileSync(path, 'utf8');
  } catch {
    return null;
  }

  // NDJSON, appended to across every wrangler invocation in the job — so read
  // the last upload rather than the first.
  let url: string | null = null;
  for (const line of contents.split('\n')) {
    if (!line.trim()) continue;
    let record: WranglerVersionUpload;
    try {
      record = JSON.parse(line);
    } catch {
      continue;
    }
    if (record.type !== 'version-upload') continue;
    url = record.preview_alias_url ?? record.preview_url ?? url;
  }
  return url;
}

function buildRows(): TableData[] {
  const rows: TableData[] = [
    {
      label: 'Site',
      value: link(
        `https://preview.craigory.dev${process.env.PATH_PREFIX}`,
        `AgentEnder/craigory-dev#${process.env.PR_NUMBER}`
      ),
    },
  ];

  const justListen = justListenPreviewUrl();
  if (justListen) {
    rows.push({
      label: 'JustListen',
      value: link(justListen, `pr-${process.env.PR_NUMBER} preview version`),
    });
  }

  rows.push(
    { label: 'Commit', value: process.env.GITHUB_SHA ?? '❓' },
    { label: 'Deployed at', value: new Date().toISOString() }
  );

  return rows;
}

export function buildCommentBody(): string {
  return h1(
    'Preview Deployment',
    'Thanks for contributing to this PR 🎉',
    table<TableData>(buildRows(), [
      {
        label: '',
        field: 'label',
      },
      {
        label: '',
        field: 'value',
      },
    ])
  );
}

async function main(): Promise<void> {
  if (!process.env.PR_NUMBER) return;

  const commentBody = buildCommentBody();
  const comments = await github.rest.issues
    .listComments({
      issue_number: Number(process.env.PR_NUMBER),
      owner: 'agentender',
      repo: 'craigory-dev',
    })
    .then((res) => res.data);
  const comment = comments.find((c) =>
    c.body?.toLowerCase().includes('preview deployment')
  );

  if (!comment) {
    await github.rest.issues.createComment({
      issue_number: Number(process.env.PR_NUMBER),
      owner: 'agentender',
      repo: 'craigory-dev',
      body: commentBody,
    });
  } else {
    await github.rest.issues.updateComment({
      comment_id: comment.id,
      owner: 'agentender',
      repo: 'craigory-dev',
      body: commentBody,
    });
  }
}

// Only talks to GitHub when run as a script, so the builders above can be
// imported and exercised without posting anything.
if (argv[1] && fileURLToPath(import.meta.url) === argv[1]) {
  await main();
}
