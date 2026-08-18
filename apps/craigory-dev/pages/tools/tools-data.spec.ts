import { describe, expect, it } from 'vitest';
import type { PageContext } from 'vike/types';
import type { RepoData } from '../projects/types';

import { data } from './+data';

/**
 * The showcase draws from two different places, and the split is the point:
 * a project living in this repo declares `category: 'tool'` in its own
 * `project-metadata.json`, while one that has moved out to its own repo has no
 * metadata here to declare anything. The allowlist in `+data.ts` is what keeps
 * the second kind on the page — see the alt-codes extraction, which is exactly
 * that transition.
 */
function toolsFor(projects: RepoData[]): RepoData[] {
  return data({
    globalContext: { projects },
  } as unknown as PageContext).tools;
}

function githubProject(repo: string, deployment?: string): RepoData {
  return {
    type: 'github',
    repo,
    url: `https://github.com/AgentEnder/${repo}`,
    deployment,
    data: {},
  } as unknown as RepoData;
}

function localProject(repo: string, category?: string): RepoData {
  return {
    type: 'local',
    repo,
    url: `https://github.com/AgentEnder/${repo}`,
    projectPath: `apps/${repo}`,
    metadata: { name: repo, category },
  } as unknown as RepoData;
}

describe('tools page data', () => {
  it('includes local projects that declare themselves tools', () => {
    const tools = toolsFor([
      localProject('qr-generator', 'tool'),
      localProject('some-demo', 'demo'),
    ]);

    expect(tools.map((t) => t.repo)).toEqual(['qr-generator']);
  });

  it('includes the externally hosted tools by repo name', () => {
    const tools = toolsFor([
      githubProject('npm-burst'),
      githubProject('alt-codes'),
      githubProject('unrelated-repo'),
    ]);

    expect(tools.map((t) => t.repo)).toEqual(['npm-burst', 'alt-codes']);
  });

  it('leaves an external tool url alone when no override is configured', () => {
    // alt-codes is listed without a `deployment`, so its Launch link comes
    // straight from the repo homepage and must reach the app in one hop rather
    // than through the craigory.dev/alt-codes/* redirect.
    const [altCodes] = toolsFor([
      githubProject('alt-codes', 'https://alt-codes.craigory.dev'),
    ]);

    expect(altCodes.deployment).toBe('https://alt-codes.craigory.dev');
  });
});
