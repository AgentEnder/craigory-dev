import { Octokit } from '@octokit/rest';
import { h1, link, table } from 'markdown-factory';

const github = new Octokit({
  auth: process.env.GH_TOKEN,
});

type TableData = {
  label: string;
  value: string;
};

const commentBody = h1(
  'Preview Deployment',
  'Thanks for contributing to this PR 🎉',
  table<TableData>(
    [
      {
        label: 'URL',
        value: link(
          `https://preview.craigory.dev${process.env.PATH_PREFIX}`,
          `AgentEnder/craigory-dev#${process.env.PR_NUMBER}`
        ),
      },
      { label: 'Commit', value: process.env.GITHUB_SHA ?? '❓' },
      { label: 'Deployed at', value: new Date().toISOString() },
    ],
    [
      {
        label: '',
        field: 'label',
      },
      {
        label: '',
        field: 'value',
      },
    ]
  )
);

(async () => {
  if (process.env.PR_NUMBER) {
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
})();
