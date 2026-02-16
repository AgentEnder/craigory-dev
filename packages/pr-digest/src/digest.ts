import { Octokit } from '@octokit/rest';
import { spawn } from 'child_process';
import {
  blockQuote,
  bold,
  codeBlock,
  h1,
  h2,
  h3,
  h4,
  link,
  unorderedList,
} from 'markdown-factory';
import type { PrInfo, TimelineEvent } from './types';

interface CheckRun {
  name: string;
  status:
    | 'queued'
    | 'in_progress'
    | 'completed'
    | 'waiting'
    | 'requested'
    | 'pending';
  conclusion:
    | 'success'
    | 'failure'
    | 'neutral'
    | 'cancelled'
    | 'timed_out'
    | 'action_required'
    | 'skipped'
    | null;
  startedAt: string;
  completedAt: string | null;
  htmlUrl: string;
  detailsUrl: string;
  logs: string[];
  aiSummary?: string;
}

interface DiffHunk {
  oldStart: number;
  oldCount: number;
  newStart: number;
  newCount: number;
  lines: string[];
  filePath: string;
}

function parseDiff(patchText: string): Map<string, DiffHunk[]> {
  const diffMap = new Map<string, DiffHunk[]>();
  const lines = patchText.split('\n');

  let currentFile: string | null = null;
  let currentHunk: DiffHunk | null = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    const fileMatch = line.match(/^\+\+\+ b\/(.+)$/);
    if (fileMatch) {
      currentFile = fileMatch[1];
      if (!diffMap.has(currentFile)) {
        diffMap.set(currentFile, []);
      }
      currentHunk = null;
      continue;
    }

    const hunkMatch = line.match(/^@@ -(\d+)(?:,(\d+))? \+(\d+)(?:,(\d+))? @@/);
    if (hunkMatch && currentFile) {
      currentHunk = {
        oldStart: parseInt(hunkMatch[1], 10),
        oldCount: hunkMatch[2] ? parseInt(hunkMatch[2], 10) : 1,
        newStart: parseInt(hunkMatch[3], 10),
        newCount: hunkMatch[4] ? parseInt(hunkMatch[4], 10) : 1,
        lines: [],
        filePath: currentFile,
      };
      const hunks = diffMap.get(currentFile);
      if (hunks) {
        hunks.push(currentHunk);
      }
      continue;
    }

    if (
      currentHunk &&
      (line.startsWith(' ') || line.startsWith('+') || line.startsWith('-'))
    ) {
      currentHunk.lines.push(line);
    }
  }

  return diffMap;
}

function findDiffForComment(
  diffMap: Map<string, DiffHunk[]>,
  comment: { path?: string; line?: number | null }
): string | null {
  if (!comment.path || comment.line === null || comment.line === undefined) {
    return null;
  }

  const hunks = diffMap.get(comment.path);
  if (!hunks) {
    return null;
  }

  for (const hunk of hunks) {
    if (
      comment.line >= hunk.newStart &&
      comment.line < hunk.newStart + hunk.newCount
    ) {
      const contextSize = 3;
      const lineIndex = comment.line - hunk.newStart;
      const startLine = Math.max(0, lineIndex - contextSize);
      const endLine = Math.min(hunk.lines.length, lineIndex + contextSize + 1);

      return `@@ -${hunk.oldStart},${hunk.oldCount} +${hunk.newStart},${
        hunk.newCount
      } @@\n${hunk.lines.slice(startLine, endLine).join('\n')}`;
    }
  }

  return null;
}

async function summarizeLogsWithAI(
  logs: string[],
  checkName: string,
  aiProvider: 'opencode' | 'claude' = 'opencode'
): Promise<string | null> {
  if (logs.length === 0) {
    return null;
  }

  const logContent = logs.join('\n');
  const prompt = `Summarize the following CI/CD check logs for "${checkName}".

IMPORTANT STRUCTURE GUIDELINES:
- Keep the summary concise (max 3-5 bullet points)
- Focus on the main issues or errors found
- Highlight what the check was testing
- If successful, briefly confirm what passed

CRITICAL - Nx Cloud Links:
- If you see ANY URLs containing "nx.app", "nx.app/cipes", or "nx.app/runs", these are Nx Cloud links
- These links can be fetched using Nx Cloud MCP/skills
- List them prominently if found

Logs to summarize:
\`\`\`
${logContent.slice(0, 10000)}
\`\`\``;

  return new Promise((resolve) => {
    const child = spawn('npx', [aiProvider, 'summarize'], {
      shell: true,
    });

    let stdout = '';
    let stderr = '';

    child.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    child.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    child.on('close', (code) => {
      if (code === 0 && stdout.trim()) {
        resolve(stdout.trim());
      } else {
        console.error(`Failed to summarize logs (code ${code}): ${stderr}`);
        resolve(null);
      }
    });

    child.stdin.write(prompt);
    child.stdin.end();

    setTimeout(() => {
      child.kill();
      resolve(null);
    }, 30000);
  });
}

async function fetchCheckRuns(
  owner: string,
  repo: string,
  headSha: string,
  octokit: Octokit,
  aiProvider: 'opencode' | 'claude' = 'opencode'
): Promise<CheckRun[]> {
  try {
    const { data: checkRunsData } = await octokit.rest.checks.listForRef({
      owner,
      repo,
      ref: headSha,
      per_page: 50,
    });

    const checkRunsWithLogs = await Promise.all(
      checkRunsData.check_runs.map(async (run) => {
        let logs: string[] = [];
        if ((run as any).logs_url) {
          try {
            const logsResponse = await octokit.request(
              'GET ' + (run as any).logs_url
            );
            if (typeof logsResponse.data === 'string') {
              logs = logsResponse.data
                .split('\n')
                .filter((line: string) => line.trim());
            }
          } catch {
            // Ignore log fetch errors
          }
        }

        return {
          name: run.name,
          status: run.status,
          conclusion: run.conclusion,
          startedAt: run.started_at,
          completedAt: run.completed_at,
          htmlUrl: run.html_url,
          detailsUrl: run.details_url,
          logs,
        };
      })
    );

    const checkRunsWithSummaries = await Promise.all(
      checkRunsWithLogs.map(async (checkRun) => {
        const hasNxCloudLinks = checkRun.logs.some((log) =>
          log.includes('nx.app')
        );

        if (!hasNxCloudLinks && checkRun.logs.length > 0) {
          const summary = await summarizeLogsWithAI(
            checkRun.logs,
            checkRun.name,
            aiProvider
          );
          return {
            ...checkRun,
            aiSummary: summary || undefined,
          };
        }

        return checkRun;
      })
    );

    return checkRunsWithSummaries;
  } catch (error) {
    console.error('Failed to fetch check runs:', error);
    return [];
  }
}

export async function fetchPrData(
  owner: string,
  repo: string,
  prNumber: number,
  token?: string,
  aiProvider: 'opencode' | 'claude' = 'opencode'
): Promise<{ pr: PrInfo; timeline: TimelineEvent[]; checkRuns: CheckRun[] }> {
  const octokit = new Octokit(token ? { auth: token } : undefined);

  const { data: pr } = await octokit.rest.pulls.get({
    owner,
    repo,
    pull_number: prNumber,
  });

  const patchResponse = await octokit.request('GET ' + pr.patch_url, {
    headers: { Accept: 'application/vnd.github.patch' },
  });
  const patchText = patchResponse.data as string;
  const diffMap = parseDiff(patchText);

  const [
    { data: commits },
    { data: issueComments },
    { data: reviews },
    { data: reviewComments },
    checkRuns,
  ] = await Promise.all([
    octokit.rest.pulls.listCommits({
      owner,
      repo,
      pull_number: prNumber,
      per_page: 100,
    }),
    octokit.rest.issues.listComments({ owner, repo, issue_number: prNumber }),
    octokit.rest.pulls.listReviews({ owner, repo, pull_number: prNumber }),
    octokit.rest.pulls.listReviewComments({
      owner,
      repo,
      pull_number: prNumber,
    }),
    fetchCheckRuns(owner, repo, pr.head.sha, octokit, aiProvider),
  ]);

  const timeline: TimelineEvent[] = [];

  for (const commit of commits) {
    timeline.push({
      type: 'push',
      sha: commit.sha.substring(0, 7),
      message: commit.commit.message.split('\n')[0],
      url: commit.html_url,
      createdAt:
        commit.commit.committer?.date ||
        commit.commit.author?.date ||
        new Date().toISOString(),
      author: commit.author ? { login: commit.author.login } : undefined,
    });
  }

  for (const comment of issueComments) {
    timeline.push({
      type: 'comment',
      id: comment.id.toString(),
      body: comment.body ?? '',
      author: comment.user?.login ?? 'unknown',
      createdAt: comment.created_at,
    });
  }

  const reviewCommentsByReviewId = new Map<string, typeof reviewComments>();
  for (const rc of reviewComments) {
    const reviewId = rc.pull_request_review_id?.toString() || 'general';
    const comments = reviewCommentsByReviewId.get(reviewId) || [];
    comments.push(rc);
    reviewCommentsByReviewId.set(reviewId, comments);
  }

  for (const review of reviews) {
    const reviewId = review.id.toString();
    const reviewRcs = reviewCommentsByReviewId.get(reviewId) || [];
    const topLevelReviewComments = reviewRcs.filter(
      (rc: any) => !rc.in_reply_to_id
    );

    const reviewEvent: TimelineEvent = {
      type: 'review',
      id: reviewId,
      author: review.user?.login ?? 'unknown',
      createdAt:
        review.submitted_at ||
        (review as any).created_at ||
        new Date().toISOString(),
      state:
        review.state === 'APPROVED' ||
        review.state === 'CHANGES_REQUESTED' ||
        review.state === 'DISMISSED'
          ? (review.state as 'APPROVED' | 'CHANGES_REQUESTED' | 'DISMISSED')
          : 'COMMENTED',
      body: review.body ?? undefined,
      comments: topLevelReviewComments.map((rc: any) => ({
        id: rc.id.toString(),
        body: rc.body ?? '',
        author: rc.user?.login ?? 'unknown',
        createdAt: (rc as any).created_at || new Date().toISOString(),
        path: rc.path,
        line: rc.line,
        startLine: rc.start_line,
        endLine: rc.line,
        diff: findDiffForComment(diffMap, { path: rc.path, line: rc.line }),
      })),
      replies: reviewRcs
        .filter((rc: any) => rc.in_reply_to_id)
        .map((rc: any) => ({
          id: rc.id.toString(),
          body: rc.body ?? '',
          author: rc.user?.login ?? 'unknown',
          createdAt: (rc as any).created_at || new Date().toISOString(),
        })),
    };
    timeline.push(reviewEvent);
  }

  const generalReviewComments = reviewCommentsByReviewId.get('general') || [];
  for (const rc of generalReviewComments) {
    if (!rc.in_reply_to_id) {
      const repliesForThisComment = generalReviewComments.filter(
        (r: any) => r.in_reply_to_id === rc.id
      );
      const reviewEvent: TimelineEvent = {
        type: 'review',
        id: rc.id.toString(),
        author: rc.user?.login ?? 'unknown',
        createdAt: new Date().toISOString(),
        state: 'COMMENTED',
        comments: [
          {
            id: rc.id.toString(),
            body: rc.body ?? '',
            author: rc.user?.login ?? 'unknown',
            createdAt: new Date().toISOString(),
            path: rc.path,
            line: rc.line,
            startLine: rc.start_line,
            endLine: rc.line,
            diff: findDiffForComment(diffMap, { path: rc.path, line: rc.line }),
          },
        ],
        replies: repliesForThisComment.map((r: any) => ({
          id: r.id.toString(),
          body: r.body ?? '',
          author: r.user?.login ?? 'unknown',
          createdAt: new Date().toISOString(),
        })),
      };
      timeline.push(reviewEvent);
    }
  }

  timeline.sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  const prInfo: PrInfo = {
    title: pr.title,
    number: pr.number,
    baseBranch: pr.base.ref,
    headBranch: pr.head.ref,
    description: pr.body ?? undefined,
    url: pr.html_url,
  };

  return { pr: prInfo, timeline, checkRuns };
}

export function formatDigest(
  pr: PrInfo,
  timeline: TimelineEvent[],
  checkRuns: CheckRun[] = []
): string {
  const reviewEvents = timeline.filter(
    (e): e is Extract<TimelineEvent, { type: 'review' }> => e.type === 'review'
  );

  const approvedCount = reviewEvents.filter(
    (r) => r.state === 'APPROVED'
  ).length;
  const changesRequestedCount = reviewEvents.filter(
    (r) => r.state === 'CHANGES_REQUESTED'
  ).length;
  const commentedCount = reviewEvents.filter(
    (r) => r.state === 'COMMENTED'
  ).length;
  const dismissedCount = reviewEvents.filter(
    (r) => r.state === 'DISMISSED'
  ).length;

  return h1(
    link(pr.url, `${pr.title} #${pr.number}`),
    h2('PR Information'),
    blockQuote(
      'This digest contains all information needed to address review comments and make requested changes.'
    ),
    unorderedList(
      `Base branch: \`${pr.baseBranch}\` (use for \`git diff ${pr.baseBranch}\`)`,
      `Head branch: \`${pr.headBranch}\``
    ),
    pr.description ? h2('Description', blockQuote(pr.description)) : '',
    h2('Timeline'),
    ...timeline.map((event) => formatTimelineEvent(event)),
    h2('Status Checks'),
    formatStatusChecks(checkRuns),
    h2('Summary'),
    h3('Review Statistics'),
    unorderedList(
      `Total reviews: ${reviewEvents.length}`,
      `Approved: ${approvedCount} ✓`,
      `Changes requested: ${changesRequestedCount}`,
      `Commented: ${commentedCount}`,
      `Dismissed: ${dismissedCount}`
    ),
    h3('Action Items'),
    formatActionItems(timeline),
    h3('Git Commands'),
    codeBlock(
      `# View changes in files with comments
git diff ${pr.baseBranch}

# View changes for a specific file
git diff ${pr.baseBranch} -- path/to/file.ts`,
      'bash'
    ),
    h2('DEVELOPER COMMENTS'),
    blockQuote(
      'The below comments were written by developer of this PR, and provide extra notes / relevant context to addressing PR review.'
    ),
    blockQuote('[...fill me in]')
  );
}

function formatTimelineEvent(event: TimelineEvent): string {
  if (event.type === 'push') {
    return h3(
      `PUSH ${event.sha}`,
      bold(event.message),
      link(event.url, 'View commit')
    );
  }

  if (event.type === 'comment') {
    return h3(`COMMENT ${event.author}`, blockQuote(event.body));
  }

  if (event.type === 'review') {
    const stateBadge =
      event.state === 'APPROVED'
        ? '✓ APPROVED'
        : event.state === 'CHANGES_REQUESTED'
        ? '❌ CHANGES REQUESTED'
        : event.state === 'DISMISSED'
        ? '⊗ DISMISSED'
        : '💬 COMMENTED';

    const commentsSection =
      event.comments.length > 0
        ? event.comments.map((c) => formatReviewComment(c)).join('\n\n')
        : '';

    const repliesSection =
      event.replies.length > 0
        ? '\n\n**Replies:**\n\n' +
          event.replies
            .map((r) => `> @${r.author}: ${blockQuote(r.body)}`)
            .join('\n\n')
        : '';

    return h3(
      `REVIEW ${stateBadge} by @${event.author}`,
      event.body ? blockQuote(event.body) : '',
      commentsSection,
      repliesSection
    );
  }

  return '';
}

function formatStatusChecks(checkRuns: CheckRun[]): string {
  if (checkRuns.length === 0) {
    return '*No status checks found.*';
  }

  const successful = checkRuns.filter((c) => c.conclusion === 'success');
  const failed = checkRuns.filter((c) => c.conclusion === 'failure');
  const pending = checkRuns.filter(
    (c) => c.status === 'in_progress' || c.status === 'queued'
  );
  const cancelled = checkRuns.filter((c) => c.conclusion === 'cancelled');

  if (successful.length === checkRuns.length) {
    return `✅ All ${checkRuns.length} status checks passed.`;
  }

  const sections = [];

  if (failed.length > 0) {
    sections.push(
      h3('Failed Checks', ...failed.map((c) => formatCheckRun(c, '❌')))
    );
  }

  if (pending.length > 0) {
    sections.push(
      h3('Pending Checks', ...pending.map((c) => formatCheckRun(c, '⏳')))
    );
  }

  if (cancelled.length > 0) {
    sections.push(
      h3('Cancelled Checks', ...cancelled.map((c) => formatCheckRun(c, '⊗')))
    );
  }

  if (successful.length > 0) {
    sections.push(
      h3('Passed Checks', ...successful.map((c) => formatCheckRun(c, '✅')))
    );
  }

  return sections.join('\n\n');
}

function formatCheckRun(checkRun: CheckRun, emoji: string): string {
  const nxCloudLinks = checkRun.logs.some((log) => log.includes('nx.app'));
  const statusIcon = emoji;
  const hasAiSummary =
    checkRun.aiSummary && checkRun.aiSummary.trim().length > 0;
  const aiSummaryText = hasAiSummary ? checkRun.aiSummary : '';

  return (
    `${statusIcon} **${checkRun.name}**\n\n` +
    (nxCloudLinks
      ? `> ⚠️ **Nx Cloud link detected** - This check can be fetched using Nx Cloud MCP/skills.\n\n`
      : '') +
    (hasAiSummary
      ? `> **AI Summary**:\n\n${blockQuote(aiSummaryText)}\n\n`
      : '') +
    (checkRun.htmlUrl ? link(checkRun.htmlUrl, 'View details') : '')
  );
}

function formatReviewComment(comment: {
  id: string;
  body: string;
  author: string;
  createdAt: string;
  path?: string;
  line?: number | null;
  startLine?: number | null;
  endLine?: number | null;
  diff?: string | null;
}): string {
  const location = comment.path
    ? `**${comment.path}**${comment.line ? `:${comment.line}` : ''}`
    : '';

  const diffSection = comment.diff
    ? `\n\n${codeBlock(comment.diff, 'diff')}`
    : '';

  return `@${comment.author} on ${location}:\n\n${blockQuote(
    comment.body
  )}${diffSection}`;
}

function formatActionItems(timeline: TimelineEvent[]): string {
  const changesRequested = timeline.filter(
    (e): e is Extract<TimelineEvent, { type: 'review' }> =>
      e.type === 'review' && e.state === 'CHANGES_REQUESTED'
  );
  const needsResponse = timeline.filter(
    (e): e is Extract<TimelineEvent, { type: 'review' }> =>
      e.type === 'review' && e.state === 'COMMENTED'
  );

  const items = [];

  if (changesRequested.length > 0) {
    items.push(
      h4(
        'Changes Requested',
        ...changesRequested.map(
          (r) => `- @${r.author}: ${r.body?.substring(0, 100) ?? ''}...`
        )
      )
    );
  }

  if (needsResponse.length > 0) {
    items.push(
      h4(
        'Pending Responses',
        ...needsResponse.map(
          (r) => `- @${r.author}: ${r.body?.substring(0, 100) ?? ''}...`
        )
      )
    );
  }

  if (items.length === 0) {
    items.push('No action items outstanding.');
  }

  return items.join('\n\n');
}
