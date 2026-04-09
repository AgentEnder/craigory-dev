import type { PageContext } from 'vike/types';
import type { RepoData } from '../projects/types';

/**
 * External tools that live outside this repo but should appear in the tools showcase.
 * Identified by repo name — matched against projects already in globalContext.
 * Optional `deployment` overrides the URL shown to the user.
 */
const EXTERNAL_TOOLS: { repo: string; deployment?: string }[] = [
  // Example: { repo: 'some-external-tool', deployment: 'https://tool.example.com' },
];

const externalToolRepos = new Set(EXTERNAL_TOOLS.map((t) => t.repo));
const externalToolDeployments = new Map(
  EXTERNAL_TOOLS.filter((t) => t.deployment).map((t) => [t.repo, t.deployment!])
);

export const data = (pageContext: PageContext) => {
  const allProjects = pageContext.globalContext.projects;

  const tools: RepoData[] = allProjects
    .filter((p) => {
      // Local tools: have category === 'tool' in metadata
      if ('metadata' in p && p.metadata.category === 'tool') return true;
      // External tools: match by repo name
      if (externalToolRepos.has(p.repo)) return true;
      return false;
    })
    .map((p) => {
      // Apply deployment URL overrides for external tools
      const deploymentOverride = externalToolDeployments.get(p.repo);
      if (deploymentOverride) {
        return { ...p, deployment: deploymentOverride };
      }
      return p;
    });

  return { tools };
};
