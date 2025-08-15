layout: true
name: base

background-size: contain

<div style="position: absolute; left: 20px; right: auto;" class="remark-slide-number">
    <span style="display: block">KCDC 2025</span>
    
    August 15, 2025
</div>

<div style="position: absolute; bottom: 20px; right: 20px;">
    <img src="/assets/kcdc-2025/KCDC QR Code - Webinar.png" style="width: 80px; height: auto; opacity: 0.8;"/>
</div>

---

template: base

# Smooth Scaling, Happy Coding:

### Navigating Monorepo Adoption with Nx

### Craigory Coppola

<p>Slides: https://craigory.dev/presentations/view/kcdc-2025-monorepo-nx</p>

---

# Introduction

- Craigory Coppola
- Previously full stack developer, with a focus on Angular and .NET
- Core team member working on Nx, a task orchestrator used to speed up workspaces via caching and parallelization

<div style="display: flex">
    <img style="max-width: 30%" src="/assets/that-conf-wi-2023/nrwl-logo.svg" alt="Nrwl Logo"></img>
    <img style="max-width: 30%" src="/assets/nx-logo-white.svg" alt="Nx Logo"></img>
</div>

???

- Nx helps speed up development by caching and parallelizing tasks
- Initially heavy focus on monorepo tooling, but has since expanded to support single repos as well
- Clients with 1k+ projects in a single workspace
- Value is based on speeding up development, so we have to be very careful about any overhead our tool adds

---

# A Story of Growth

- Your team starts with a single repository
- Everything is simple and straightforward
- Life is good

--

- Then you build another app
- And another service
- And another library

--

- Suddenly you have 10 repositories
- Or 20
- Or 50

---

template: base
class: title-image-slide

# The Multi-Repo Reality

<img src="/assets/kcdc-2025/multi-repo-chaos.svg"></img>

???

- Each repo has its own tooling
- Each repo has its own CI/CD
- Each repo has its own dependencies
- Each repo has its own versioning

---

# The Pain Points Start

- "Which version of the shared library are we using?"
- "I need to update 5 repos to ship this feature"
- "The build broke in production but works locally"
- "Why does this repo use Jest and that one uses Mocha?"

---

# The Pain Points Multiply

- Inconsistent tooling across repositories
- Dependency version conflicts
- Code duplication (how many `formatDate` functions?)
- Coordinating releases becomes a full-time job
- "Works on my machine" becomes the team motto

???

- Different linting rules
- Different build processes
- Different testing frameworks
- Different deployment strategies

---

# Enter the Monorepo

A monorepo is a single repository containing multiple projects.

--

But it's not a monolith!

--

- Projects remain independent
- Clear boundaries between code
- Shared tooling and configuration
- Single source of truth

---

# Monorepo ≠ Monolith

<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem;">
<div>
<h3>Monolith</h3>
<ul>
<li>Single deployable unit</li>
<li>Tightly coupled code</li>
<li>Changes affect everything</li>
<li>Single runtime</li>
</ul>
</div>
<div>
<h3>Monorepo</h3>
<ul>
<li>Multiple deployable units</li>
<li>Loosely coupled projects</li>
<li>Changes are isolated</li>
<li>Independent runtimes</li>
</ul>
</div>
</div>

---

# The Journey Begins

So you decide to adopt a monorepo strategy.

--

"How hard could it be?"

--

(Narrator: It was harder than expected)

---

# Challenge #1: The Migration

- Moving existing code into the monorepo
- Preserving git history
- Updating CI/CD pipelines
- Fixing import paths
- Dealing with conflicting dependencies

???

- git subtree or git filter-branch
- Updating all the relative imports
- Reconciling different versions of the same dependency
- Updating documentation

---

template: base
class: two-column-slide

# Challenge #2: The Structure

<div class="slide-content">
<div>
<img src="/assets/kcdc-2025/monorepo-structure.svg"></img>
</div>
<div>
<h3>Where does everything go?</h3>
<ul>
<li>Applications vs libraries</li>
<li>Shared code organization</li>
<li>Configuration placement</li>
<li>Tooling structure</li>
</ul>
</div>
</div>

---

# Challenge #3: Developer Experience

- "Why does everything take so long to build?"
- "I changed one line and 50 tests are running"
- "My IDE is crying"
- "Git operations are slow"

---

# Challenge #4: CI/CD Complexity

Without the right tooling:

- Every change triggers all builds
- Every change runs all tests
- Pipeline duration: ∞
- Cloud bill: 📈

---

# This is Where Nx Comes In

Nx is a build system with built-in monorepo support.

Key features:

- Intelligent task orchestration
- Computation caching
- Distributed task execution
- Affected commands
- Module boundaries

---

template: base
class: title-image-slide

# The Magic of Affected Commands

<img src="/assets/kcdc-2025/nx-affected.svg"></img>

---

template: base
class: title-image-slide

# Computation Caching

<img src="/assets/kcdc-2025/cache-comparison.svg"></img>

???

- Inputs include source files, dependencies, environment variables
- Cache can be local or distributed
- Massive time savings for developers
- Remote cache means team shares build artifacts

---

# Distributed Task Execution

Instead of one machine doing everything:

```plaintext
main ──> agent-1: build app-1, app-2
     ├─> agent-2: build app-3, lib-1
     ├─> agent-3: test lib-2, lib-3
     └─> agent-4: lint everything else
```

Parallel execution across multiple agents.

---

# Module Boundaries

Enforce architectural decisions with code:

```typescript
// libs/feature-a can't import from libs/feature-b
// apps/admin can only import from libs/admin/*
// libs/ui/* can't import from libs/data-access/*
```

Nx enforces these rules at build time.

---

# Real-World Example: E-commerce Platform

Before monorepo:

- 12 repositories
- 6 different Node versions
- 3 different build tools
- Releases took 2 days of coordination

???

- Customer portal, admin panel, mobile app, multiple microservices
- Each team had their own preferences
- Integration nightmares

---

template: base
class: title-image-slide

# Real-World Example: The Migration

<img src="/assets/kcdc-2025/migration-journey.svg"></img>

---

# Real-World Example: The Results

After monorepo with Nx:

- Build times: 45 min → 8 min (with caching)
- Test runs: 30 min → 5 min (affected only)
- Releases: 2 days → 2 hours
- Developer happiness: 📈

---

# Setting Up Nx in Your Monorepo

```bash
npx create-nx-workspace@latest myorg
```

Or add to existing monorepo:

```bash
npx nx@latest init
```

---

# Project Configuration

```json
// apps/frontend/project.json
{
  "name": "frontend",
  "targets": {
    "build": {
      "executor": "@nx/webpack:webpack",
      "options": {
        "outputPath": "dist/apps/frontend"
      }
    },
    "test": {
      "executor": "@nx/jest:jest"
    }
  }
}
```

---

# Creating Projects

```bash
# Generate a new React app
nx g @nx/react:app my-app

# Generate a new library
nx g @nx/js:lib my-lib

# Generate a new component
nx g @nx/react:component header --project=my-app
```

---

# Understanding the Project Graph

```bash
nx graph
```

Visualize dependencies between projects:

- See what depends on what
- Identify circular dependencies
- Understand impact of changes

---

# Task Dependencies

```json
{
  "targets": {
    "build": {
      "dependsOn": ["^build"]
    },
    "test": {
      "dependsOn": ["build"]
    }
  }
}
```

Nx knows to build dependencies first.

---

# Incremental Adoption

You don't have to migrate everything at once!

--

Start small:

1. Move shared libraries first
2. Add new projects to monorepo
3. Migrate existing projects gradually
4. Keep some repos separate if needed

---

# The Goldilocks Approach

Not everything belongs in the monorepo.

Consider keeping separate:

- Open source libraries
- Third-party integrations with different release cycles
- Projects with completely different tech stacks
- Experimental prototypes

---

# Common Pitfalls to Avoid

1. **The Big Bang Migration**
   - Don't try to move everything at once
   - Plan incremental moves

--

2. **Ignoring Developer Education**
   - Invest in training
   - Document patterns and practices

--

3. **Over-compartmentalization**
   - Don't create a library for every function
   - Find the right granularity

---

# Common Pitfalls (continued)

4. **Neglecting CI/CD Updates**
   - Update pipelines as you migrate
   - Use Nx Cloud for distributed execution

--

5. **Fighting the Tool**
   - Embrace Nx conventions
   - Don't try to recreate old workflows

---

# Performance Tips

- **Use computation caching aggressively**
  - Set up Nx Cloud early
  - Cache everything cacheable

--

- **Optimize your project graph**
  - Minimize unnecessary dependencies
  - Use buildable libraries strategically

--

- **Parallelize tasks**
  - Use `--parallel` flag
  - Configure appropriate parallel limits

---

# Scaling Strategies

As your monorepo grows:

- **Partition your workspace**
  - Group related projects
  - Use consistent naming conventions

--

- **Implement code ownership**
  - CODEOWNERS file
  - Project-level permissions

--

- **Monitor performance**
  - Track build times
  - Identify bottlenecks

---

# The Cultural Shift

Moving to a monorepo isn't just technical.

It requires:

- Shared ownership mentality
- Consistent coding standards
- Collaborative mindset
- Trust in shared tooling

---

# Making the Case to Leadership

**Cost Savings:**

- Reduced CI/CD time = lower cloud costs
- Faster development = quicker time to market
- Less context switching = higher productivity

--

**Risk Reduction:**

- Consistent security updates
- Unified testing standards
- Easier compliance tracking

---

# Success Metrics

Track these to measure success:

- Build/test time reduction
- Deployment frequency
- Time to fix bugs
- Developer satisfaction scores
- Onboarding time for new developers

---

# When Monorepos Might Not Be Right

Be honest about limitations:

- Massive codebases (millions of files)
- Completely unrelated projects
- Different security/compliance requirements
- Teams that can't coordinate

---

# The Nx Ecosystem

Beyond core features:

- **Nx Console**: IDE integration
- **Nx Cloud**: Distributed caching and execution
- **Nx Plugins**: Framework-specific generators
- **Nx Graph**: Dependency visualization
- **Nx Migrate**: Automated updates

---

# Nx Console Demo

[Show IDE with Nx Console]

- Visual task running
- Generate code through UI
- Explore project graph
- Run affected commands

???

- Available for VS Code and IntelliJ
- Makes Nx more approachable for newcomers
- Great for discovering available generators

---

# Real Commands You'll Use Daily

```bash
# Run affected tests
nx affected:test

# Build specific project
nx build my-app

# Serve app with dependencies
nx serve my-app

# Generate new library
nx g @nx/js:lib my-feature

# See what's affected
nx affected:graph
```

---

# Advanced: Project Graph Plugins

Extend Nx to understand any technology:

- **Automatic project detection** for non-JS code
- **Dependency analysis** across languages
- **Custom project configuration** inference

```typescript
export const createNodesV2 = [
  '**/Cargo.toml', // Find Rust projects
  (projectFiles) => {
    // Add projects and configuration
    return createProjectFromCargoToml(projectFiles);
  },
];
```

---

# Graph Plugins: How They Work

Graph plugins have two main hooks:

**`createNodesV2`**: Find and configure projects

```typescript
// Pattern matching + project creation
[
  '**/project.json',
  (files) => {
    /* create nodes */
  },
];
```

**`createDependencies`**: Analyze relationships

```typescript
// Find imports, references, dependencies
(options, context) => {
  /* return dependencies */
};
```

Nx merges results from all plugins to build the complete graph!

---

# Advanced: Custom Generators

Codify your patterns:

```typescript
export default async function (tree: Tree, schema: Schema) {
  // Generate files based on templates
  // Update configuration
  // Ensure consistency
}
```

---

# The Happy Path

With Nx properly configured:

- Developers focus on features, not infrastructure
- CI/CD is fast and reliable
- Releases are predictable
- Code quality is consistent
- Scaling is manageable

---

# Case Study: From 50 Repos to 1

**Before:**

- 50 repositories
- 15 different build configurations
- 3-day release process
- "Dependency hell"

**After:**

- 1 monorepo with Nx
- Unified tooling
- 2-hour release process
- Clear dependency graph

---

# Tips for Your Journey

1. **Start with a proof of concept**
   - Pick 2-3 related projects
   - Demonstrate value quickly

--

2. **Get buy-in early**
   - Include skeptics in planning
   - Address concerns proactively

--

3. **Measure everything**
   - Before and after metrics
   - Share wins publicly

---

# Tips (continued)

4. **Invest in automation**
   - Generators for common patterns
   - Automated dependency updates
   - CI/CD optimization

--

5. **Build a community**
   - Internal champions
   - Knowledge sharing sessions
   - Documentation culture

---

# Resources for Learning

- **Official Nx Documentation**: nx.dev
- **Nx YouTube Channel**: Tutorials and deep dives
- **Nx Cloud**: nx.app
- **Community Discord**: Community and support
- **Nx Conf**: Annual conference

---

# The Path Forward

Your monorepo journey will be unique, but you're not alone.

- Start small
- Learn from others
- Embrace the tools
- Be patient with the process
- Celebrate the wins

---

# Key Takeaways

- Monorepos solve real problems at scale
- The migration is challenging but worthwhile
- Nx makes monorepos manageable
- Success requires both technical and cultural changes
- Start small, measure results, iterate

---

# One More Thing...

Remember: The goal isn't to have a monorepo.

--

The goal is to ship better software, faster, with happier developers.

--

Monorepos with Nx are just a really good way to get there.

---

<div style="display: grid; grid-template-columns: 1fr 1fr; height: 100%">
<div>
  <h2>Questions?</h2>
  <div style="margin-top: 40px;">
    <img src="/assets/kcdc-2025/KCDC QR Code - Webinar.png" style="max-width: 250px; height: auto;"/>
    <p style="font-size: 14px; color: #7ec8e3; margin-top: 10px;">Scan for session feedback</p>
  </div>
</div>
<div style="display: flex; flex-direction: column; align-items: center; align-self: center">
  <img src="/assets/ProfilePic_cropped.png" style="max-width: 50%"/>
  <h2>Contact + Links</h2>
  <ul>
    <li>Twitter (x?): @EnderAgent</li>
    <li>https://www.linkedin.com/in/craigoryvcoppola/</li>
    <li>https://github.com/agentender</li>
    <li>https://craigory.dev</li>
  </ul>
</div>
</div>
