# Web Dev Tools Showcase Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a dedicated `/tools` page showcasing web-based development tools, powered by shared project data hoisted to Vike's global context.

**Architecture:** Extract the data pipeline from `pages/projects/+data.ts` into a shared module. Use Vike's `onCreateGlobalContext` hook to load project data once, then let both `/projects` and `/tools` read from `globalContext.projects`. The tools page filters for projects with `category: "tool"` metadata or matching a hardcoded external tools identifier list.

**Tech Stack:** Vike 0.4.239, React 19, TypeScript, SCSS modules

---

### Task 1: Add `category` field to project metadata type and files

**Files:**
- Modify: `apps/craigory-dev/pages/projects/types.ts:35-41`
- Modify: `apps/qr-generator/project-metadata.json`
- Modify: `apps/json-viewer/project-metadata.json`
- Modify: `apps/pr-digest/project-metadata.json`
- Create: `apps/gh-graphql/project-metadata.json`

**Step 1: Extend `LocalProjectMetadata` type**

In `apps/craigory-dev/pages/projects/types.ts`, add `category` to the type:

```typescript
export type LocalProjectMetadata = {
  name: string;
  description?: string;
  technologies?: string[];
  featured?: boolean;
  order?: number;
  category?: string;
};
```

**Step 2: Add `category: "tool"` to each tool's metadata**

`apps/qr-generator/project-metadata.json`:
```json
{
  "name": "QR Code Generator",
  "description": "A simple and elegant QR code generator built with Vite, TypeScript, and Tailwind CSS. Enter any text and instantly generate a downloadable QR code.",
  "technologies": ["TypeScript", "HTML", "CSS"],
  "category": "tool"
}
```

`apps/json-viewer/project-metadata.json`:
```json
{
  "name": "JSON Viewer",
  "description": "A client-side JSON viewer and transformer. Explore JSON with collapsible trees, filter properties visually, and transform data using TypeScript or jq queries with full intellisense support.",
  "technologies": ["TypeScript", "HTML", "CSS"],
  "category": "tool"
}
```

`apps/pr-digest/project-metadata.json`:
```json
{
  "name": "PR Digest",
  "description": "Generate comprehensive digests of GitHub pull requests. Enter a PR URL and get a formatted summary optimized for AI agent handoffs, with full timeline context, review comments, and CI status.",
  "technologies": ["TypeScript", "HTML", "CSS"],
  "category": "tool"
}
```

`apps/gh-graphql/project-metadata.json` (new file):
```json
{
  "name": "GitHub GraphQL Playground",
  "description": "Interactive GraphQL IDE for exploring GitHub's API. Authenticate with a personal access token, write queries with full schema autocomplete, and monitor your rate limit in real time.",
  "technologies": ["TypeScript", "HTML", "CSS"],
  "category": "tool"
}
```

**Step 3: Commit**

```bash
git add apps/craigory-dev/pages/projects/types.ts apps/qr-generator/project-metadata.json apps/json-viewer/project-metadata.json apps/pr-digest/project-metadata.json apps/gh-graphql/project-metadata.json
git commit -m "feat: add category field to project metadata for tool classification"
```

---

### Task 2: Extract shared data pipeline from projects page

The current `pages/projects/+data.ts` is a 1259-line file with all data fetching logic. We need to extract the reusable parts into a shared module so both the global context hook and the projects page can use them.

**Files:**
- Create: `apps/craigory-dev/src/data/projects.ts`
- Modify: `apps/craigory-dev/pages/projects/+data.ts`

**Step 1: Create the shared data module**

Create `apps/craigory-dev/src/data/projects.ts`. Move ALL functions and constants from `pages/projects/+data.ts` into this file, EXCEPT the `data` export (lines 213-308). Export a single function:

```typescript
import { RepoData } from '../../pages/projects/types';

// ... all moved functions and constants stay here as-is ...

export async function loadAllProjects(): Promise<RepoData[]> {
  // This is the body of the old `data` export, but returns just the array
  // instead of `{ projects: [...] }`
  const workspaceRoot = findWorkspaceRoot(fileURLToPath(import.meta.url));
  const githubCachePath = join(workspaceRoot, 'tmp', 'github-projects-cache.json');
  const localCachePath = join(workspaceRoot, 'tmp', 'local-projects-cache.json');

  try {
    mkdirSync(dirname(githubCachePath), { recursive: true });
  } catch {
    // ignore
  }

  let githubProjects: RepoData[] = [];
  const githubCacheData = existsSync(githubCachePath)
    ? JSON.parse(readFileSync(githubCachePath, 'utf-8'))
    : null;
  if (githubCacheData) {
    console.log('Reusing GitHub data from', githubCachePath);
    githubProjects = githubCacheData;
  } else {
    await initNpmPackageCache('agentender');
    const packageJsonLocations = await findAllPackageJsonLocations();
    const packageJsonsByRepo = groupByRepo(packageJsonLocations);
    githubProjects = await getAllRepos(packageJsonsByRepo);
    writeFileSync(githubCachePath, JSON.stringify(githubProjects, null, 2));
  }

  let localProjects: LocalProjectData[] = [];
  const localCacheData = existsSync(localCachePath)
    ? JSON.parse(readFileSync(localCachePath, 'utf-8'))
    : null;
  if (localCacheData) {
    console.log('Reusing local projects data from', localCachePath);
    localProjects = localCacheData;
  } else {
    const [appProjects, packageProjects] = await Promise.all([
      getLocalProjects(workspaceRoot),
      getMonorepoPackages(workspaceRoot),
    ]);
    localProjects = [...appProjects, ...packageProjects];
    writeFileSync(localCachePath, JSON.stringify(localProjects, null, 2));
  }

  const mergedProjects = await normalizePublishedPackageEntries([
    ...githubProjects,
    ...localProjects,
  ]);

  return mergedProjects.sort((a, b) => {
    if ('metadata' in a && a.metadata.featured && !('metadata' in b && b.metadata.featured)) return -1;
    if ('metadata' in b && b.metadata.featured && !('metadata' in a && a.metadata.featured)) return 1;
    if ('metadata' in a && 'metadata' in b) {
      const orderA = a.metadata.order ?? 999;
      const orderB = b.metadata.order ?? 999;
      if (orderA !== orderB) return orderA - orderB;
    }
    const dateA = a.lastCommit ? new Date(a.lastCommit).getTime() : 0;
    const dateB = b.lastCommit ? new Date(b.lastCommit).getTime() : 0;
    if (dateA !== dateB) return dateB - dateA;
    return a.repo.localeCompare(b.repo);
  });
}
```

**Step 2: Simplify `pages/projects/+data.ts`**

Replace the entire file with a thin wrapper that reads from global context:

```typescript
import { PageContext } from 'vike/types';

export const data = async (pageContext: PageContext) => {
  const projects = (pageContext as any).globalContext.projects;
  return { projects };
};
```

Note: We use `(pageContext as any).globalContext` temporarily until we set up the Vike type declarations in Task 3. This avoids a circular dependency between tasks.

**Step 3: Verify the build still works**

Run: `cd apps/craigory-dev && npx vike prerender 2>&1 | head -30` or `pnpm nx build craigory-dev`

If the build fails, check import paths — the extracted module is at `../../src/data/projects` relative to the old location.

**Step 4: Commit**

```bash
git add apps/craigory-dev/src/data/projects.ts apps/craigory-dev/pages/projects/+data.ts
git commit -m "refactor: extract project data pipeline into shared module"
```

---

### Task 3: Set up Vike global context with project data

**Files:**
- Create: `apps/craigory-dev/pages/+onCreateGlobalContext.server.ts`
- Create: `apps/craigory-dev/src/types/vike.d.ts`
- Modify: `apps/craigory-dev/tsconfig.json` (if needed to include the .d.ts)
- Modify: `apps/craigory-dev/pages/projects/+data.ts` (remove `as any` cast)

**Step 1: Create Vike type declarations**

Create `apps/craigory-dev/src/types/vike.d.ts`:

```typescript
import { RepoData } from '../../pages/projects/types';

declare global {
  namespace Vike {
    interface GlobalContext {
      projects: RepoData[];
    }
  }
}
```

**Step 2: Create the global context hook**

Create `apps/craigory-dev/pages/+onCreateGlobalContext.server.ts`:

```typescript
import { loadAllProjects } from '../src/data/projects';

export async function onCreateGlobalContext(globalContext: Vike.GlobalContext) {
  globalContext.projects = await loadAllProjects();
}
```

**Step 3: Update `pages/projects/+data.ts` with proper types**

Now that the type declarations exist, clean up the data hook:

```typescript
import { PageContext } from 'vike/types';

export const data = (pageContext: PageContext) => {
  return { projects: pageContext.globalContext.projects };
};
```

**Step 4: Verify the build works**

Run: `pnpm nx build craigory-dev` (or the project's build command)

The projects page should render identically to before — same data, just loaded via global context instead of directly in the data hook.

**Step 5: Commit**

```bash
git add apps/craigory-dev/src/types/vike.d.ts apps/craigory-dev/pages/+onCreateGlobalContext.server.ts apps/craigory-dev/pages/projects/+data.ts
git commit -m "feat: hoist project data to Vike global context"
```

---

### Task 4: Create the `/tools` page data hook

**Files:**
- Create: `apps/craigory-dev/pages/tools/+data.ts`
- Create: `apps/craigory-dev/pages/tools/+config.ts`

**Step 1: Create the tools data hook**

Create `apps/craigory-dev/pages/tools/+data.ts`:

```typescript
import { PageContext } from 'vike/types';
import { RepoData } from '../projects/types';

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
```

**Step 2: Create the page config**

Create `apps/craigory-dev/pages/tools/+config.ts`:

```typescript
export default {
  desc: 'Web development tools by Craigory Coppola (AgentEnder)',
};
```

**Step 3: Commit**

```bash
git add apps/craigory-dev/pages/tools/+data.ts apps/craigory-dev/pages/tools/+config.ts
git commit -m "feat: add tools page data hook with external tools support"
```

---

### Task 5: Create the `/tools` page UI

**Files:**
- Create: `apps/craigory-dev/pages/tools/+Page.tsx`
- Create: `apps/craigory-dev/pages/tools/styles.scss`

**Step 1: Create the page component**

Create `apps/craigory-dev/pages/tools/+Page.tsx`:

```tsx
import { useData } from 'vike-react/useData';
import { RepoData } from '../projects/types';
import { FaExternalLinkAlt } from 'react-icons/fa';
import './styles.scss';

export function Page() {
  const { tools } = useData<{ tools: RepoData[] }>();

  return (
    <>
      <h1>Web Dev Tools</h1>
      <p className="tools-intro">
        Interactive tools for web development — built with TypeScript and React.
      </p>
      <div className="tools-grid">
        {tools.map((tool) => (
          <ToolCard key={tool.repo} tool={tool} />
        ))}
      </div>
    </>
  );
}

function ToolCard({ tool }: { tool: RepoData }) {
  const name =
    'metadata' in tool && tool.metadata.name ? tool.metadata.name : tool.repo;
  const technologies =
    'metadata' in tool && tool.metadata.technologies
      ? tool.metadata.technologies
      : tool.languages
        ? Object.keys(tool.languages)
        : [];

  return (
    <article className="tool-card">
      <h2 className="tool-card-name">{name}</h2>
      {tool.description && (
        <p className="tool-card-description">{tool.description}</p>
      )}
      {technologies.length > 0 && (
        <div className="tool-card-tags">
          {technologies.map((tech) => (
            <span key={tech} className="tool-card-tag">
              {tech}
            </span>
          ))}
        </div>
      )}
      <div className="tool-card-actions">
        {tool.deployment && (
          <a
            href={tool.deployment}
            className="tool-card-launch"
            target="_blank"
            rel="noreferrer"
          >
            Launch
            <FaExternalLinkAlt />
          </a>
        )}
        <a
          href={tool.url}
          className="tool-card-source"
          target="_blank"
          rel="noreferrer"
        >
          Source
        </a>
      </div>
    </article>
  );
}
```

**Step 2: Create the styles**

Create `apps/craigory-dev/pages/tools/styles.scss`:

```scss
.tools-intro {
  color: #555;
  margin-bottom: 2rem;
  max-width: 45rem;
}

.tools-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  max-width: 45rem;

  @media screen and (max-width: 600px) {
    grid-template-columns: 1fr;
  }
}

.tool-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  transition: box-shadow 0.2s ease;

  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
}

.tool-card-name {
  margin: 0;
  font-size: 1.25rem;
}

.tool-card-description {
  margin: 0;
  color: #444;
  font-size: 0.9rem;
  line-height: 1.5;
  flex: 1;
}

.tool-card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tool-card-tag {
  background: #f0f0f0;
  color: #555;
  padding: 0.2rem 0.6rem;
  border-radius: 4px;
  font-size: 0.8rem;
}

.tool-card-actions {
  display: flex;
  gap: 0.75rem;
  align-items: center;
  margin-top: 0.5rem;
}

.tool-card-launch {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  background: #333;
  color: #fff;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  text-decoration: none;
  font-size: 0.9rem;
  transition: background 0.2s ease;

  &:hover {
    background: #555;
  }

  svg {
    font-size: 0.75rem;
  }
}

.tool-card-source {
  color: #666;
  font-size: 0.85rem;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
}
```

**Step 3: Verify the page renders**

Run `pnpm nx build craigory-dev` and check for errors. If the build succeeds, the page should be pre-rendered at `/tools`.

**Step 4: Commit**

```bash
git add apps/craigory-dev/pages/tools/+Page.tsx apps/craigory-dev/pages/tools/styles.scss
git commit -m "feat: add tools showcase page with card grid UI"
```

---

### Task 6: Add navigation links

**Files:**
- Modify: `apps/craigory-dev/renderer/PageShell.tsx:14-23`
- Modify: `apps/craigory-dev/renderer/MobileNav.tsx:157-169`

**Step 1: Add "Tools" to desktop sidebar**

In `apps/craigory-dev/renderer/PageShell.tsx`, add the Tools link after Projects (around line 18):

```tsx
<Link className="navitem" href="/projects">
  Projects
</Link>
<Link className="navitem" href="/tools">
  Tools
</Link>
```

**Step 2: Add "Tools" to mobile drawer**

In `apps/craigory-dev/renderer/MobileNav.tsx`, add the Tools link after Projects in the drawer nav (around line 160):

```tsx
<Link className="mobile-navitem" href="/projects">
  Projects
</Link>
<Link className="mobile-navitem" href="/tools">
  Tools
</Link>
```

**Step 3: Verify navigation works**

Run `pnpm nx build craigory-dev` and confirm the tools link appears in both desktop and mobile nav.

**Step 4: Commit**

```bash
git add apps/craigory-dev/renderer/PageShell.tsx apps/craigory-dev/renderer/MobileNav.tsx
git commit -m "feat: add Tools link to site navigation"
```

---

### Task 7: Final build verification

**Step 1: Full build**

Run: `pnpm nx build craigory-dev`

Verify:
- Build completes without errors
- `/tools` page is pre-rendered
- `/projects` page still works (data comes from global context now)
- Navigation shows "Tools" link

**Step 2: Spot-check output**

Look at the build output to confirm the tools page was generated:

```bash
ls dist/apps/craigory-dev/client/tools/
```

Should contain `index.html` and assets.

**Step 3: Commit any fixes if needed**

If there were any issues, fix and commit them here.
