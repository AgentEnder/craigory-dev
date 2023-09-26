# Redefining Projects with Nx: A Dive into the New Inference API

## Craigory Coppola

---

<div style="display: grid; grid-template-columns: 1fr 1fr; height: 100%; gap: 1rem;">
<img src="/assets/devup-2023/type-safety/color.png" style="width: 100%;">

<div>

<h1 style="margin-top: 0.5rem;"> Why Me? </h1>

<ul>
<li>Sr Engineer on Nx Core team</li>
<li>Focus on Project Configuration + Plugins</li>
</ul>

</div>
</div>

---

# So, what's Project Inference?

- Inference lets Nx "infer" how a project is configured.
- Introduced between Nx v13.3 and v14.0.0
  - First as backing mechanism for package based repos
  - Later as an experimental API for community plugins

---

# Why Inference?

Inference APIs allow Nx plugins to make Nx "just work" in existing repositories.

- Our builtin inference APIs handle loading projects from `project.json` and `package.json` files
- Community plugins can make Nx work without additional configuration for non-javascript projects.

---

# Inference API v1

Driven by implementation details of Nx at the time.

- `projectFilePatterns`: Identify files that represent the root of a project.
- `registerProjectTargets`: Takes a project file and converts it to a list of project targets.

---

# v1 Shortcomings

## Strict 1:1 mapping between project files and projects.

<div class="logos">
  <div>
  <img src="/assets/nx-conf-2023/angular-logo.png"/>
  </div>
  <div>
  <img src="/assets/nx-conf-2023/dotnet-logo.png"/>
  </div>
</div>

---

# v1 Shortcomings (cont.)

- Decoupled logic for finding project files from logic for finding project targets.
- No way to add additional metadata to a project.

---

# v1 Shortcomings (cont.)

- A bit confusing with overlapping API surface for project graph plugins.
- Never marked stable.

---

# Project Graph API v2

Splits the graph APIs into two distinct parts:

- `createNodes`: Finds graph nodes based on some files on disk.
- `createDependencies`: Finds edges to be added to the graph.

---

# `createNodes`

`[projectFilePattern, CreateNodesFunction]`

- Combines the previous inference APIs into a single API.
- A plugin provides a pattern that identifies project files, and a function that converts matching files into graph nodes.

---

# V1 API Adapter

Nx 16.8 includes an adapter that allows v1 inference APIs to be ran as a v2 plugin.

```typescript
return {
  createNodes: [
    `*/**/${combineGlobPatterns(plugin.projectFilePatterns)}`,
    (configFilePath) => {
      const name = toProjectName(configFilePath);
      return {
        projects: {
          [name]: {
            root: dirname(configFilePath),
            targets: plugin.registerProjectTargets?.(configFilePath),
          },
        },
      };
    },
  ],
}
```

---

# Overcoming Shortcomings

- No longer a 1:1 mapping between project files and projects.

`CreateNodesFunction` returns a map of projects and external nodes.

---

# Overcoming Shortcomings

- Logic for inference is encapsulated into a single method.
- Plugins can add additional metadata to a project.

---

# Merged Results

- If multiple plugins identify the same project, the configurations are merged.
- Targets, Generators, Tags, and Implicit Dependencies are merged.
- Everything else is overwritten by the last plugin that identified the project.
- Builtin inference plugins run ***last***.

---

# Example: `cspell` plugin

- `cspell` is a package that provides spell checking for code.
- Quick demo of how a plugin can use the new API to add spell checking to a project.

---

# `createDependencies`

- A bit more constrained version of `processProjectGraph`, but with a few key benefits.
- Context object is similar, but `fileMap` and `filesToProcess` have a new shape.
  - Each have two properties: `projectFileMap` and `nonProjectFiles`.
  - This lets us cache dependencies that are located via a file not directly associated with a project.
  - e.g. dependencies between external nodes read from a lock file.

---

# `createDependencies`

- Can't add new nodes to the graph, but has 100% confidence that the nodes it depends on exist.
- Guaranteed to run after all `createNodes` functions have run.

---

# `createDependencies` vs `processProjectGraph`

- `processProjectGraph` takes a `ProjectGraph` and returns an updated `ProjectGraph`.
  - Recommended pattern used `ProjectGraphBuilder`
- `createDependencies` takes the context object and returns a list of dependencies to be added to the graph.
  - Cases where nodes need to be added to the graph can be handled by `createNodes`.
- No adapter for v1 API, because it doesn't fit the new API. v1 API is ran as is, and then `createDependencies` is ran.

---

# Supporting v1 + v2

- Nx will use v2 if its available, and on v16.9 or higher.
- Nx prior to v16.9 will fall back on v1 api exports.

---

# Supporting v1 + v2

- Community plugins can use inline wrappers to maintain compatibility between Nx versions.
- `createNodes` can be built from `projectFilePatterns` and `registerProjectTargets`.
- `projectGraphProcessor` can be built from `createNodes`.
- Export both, and Nx will use what it can.

---

# Example: `@nx-dotnet/core`

- `@nx-dotnet/core` is a community plugin that adds support for .NET projects to Nx.

???

Show off in editor
  
---

# Next Steps (Us)

- Mark v2 APIs as stable.
- Remove v1 APIs after deprecation period.

---
# Next Steps (Plugin Authors)

- Check the new APIs, and provide feedback! These are still experimental, and we want to make sure they work for you.

---

<div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%">
  <img src="/assets/ProfilePic_cropped.png" style="max-width: 30%"/>
  <h2>Contact + Links</h2>
  <ul>
    <li>Twitter (x?): @EnderAgent</li>
    <li>https://www.linkedin.com/in/craigoryvcoppola/</li>
    <li>https://github.com/agentender</li>
    <li>https://craigory.dev</li>
  </ul>
</div>
