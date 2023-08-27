# Full Stack Type Safety Across Languages

## Craigory Coppola

---

# The Problem

- Conventional types stop at the language boundary
- Conventional types also stop at the network boundary

Types need to cross each of these boundaries to enable true type-safety for an application. Type changes on the API **_CAN_** and **_WILL_** break the front end.

---

# Pre-Demo Checks

- Node JS (https://nodejs.org/download)
  - `node -v`
  - `npm -v`
- .NET CLI (https://dotnet.microsoft.com/download)
  - `dotnet -v`

---

<div style="display: grid; grid-template-columns: 1fr 1fr; height: 100%; gap: 1rem;">
<img src="/assets/devup-2023/type-safety/color.png" style="width: 100%;">

<div>

<h1 style="margin-top: 0.5rem;"> Why Me? </h1>

<ul>
<li>Core contributor to Nx</li>
<li>Maintainer of Nx .NET, which provides the C# support for Nx used in this demo.</li>
</ul>

</div>
</div>

???

<p>
I work for Nrwl. While you may not know us, you probably know at least one of the things we build. We maintain Nx and Lerna, the 2 largest monorepo tools in the JavaScript / web ecosystem.</p>
<p> 
I spend most of my time working on new features for Nx, mostly focused around the core and plugin compatibility layers.</p>

<p>In addition, I personally maintain the dotnet / C# plugin for nx, which provides full interopt and some of the capabilities we will see today.</p>

---

# The goal

![](/assets/devup-2023/type-safety/Clipboard.png)

This is an error, at build time, in react code that was caused solely by changing the backend.

---

# The Partial Solution

    - Backend-for-frontend (BFF)
    - TypeScript Everywhere (t3, nestjs, express...)

???

With increased monorepo addoption in the JS + web communities, a simple solution has emerged for some companies.

Using TypeScript everywhere makes it easy to share the types between the backend and frontend. If you create a library (@my-company/types) and reference it in both places, you now have accomplished full stack type safety.

But, what if your backend is in C#, go, python, rust, or any other language? For some companies, a backend-for-frontend or BFF written in typescript can help bridge this gap.

It's not a full solution though.

- While you have type safety there is still a boundary that it doesn't cross. Your BFF can still be broken if the types of your API services change.

---

# A More Complete Solution

## Open API + Code Generation

Code -> JSON -> Code

- Functional Example w/ C# + Angular.

???

Utilizing openapi specs and code generation, you can break these boundaries.

---

# OpenAPI

- Code -> JSON

  ```json
  {
      "type": "object",
      "allOf": [
        {
          "$ref": "#/definitions/NewPet"
        },
        {
          "required": [
            "id"
          ],
          "properties": {
            "id": {
              "type": "integer",
              "format": "int64"
            }
          }
        }
      ]
  },
  ```

???

## JSON Schema representation of your API. Describes everything you need to know, about every endpoint, in one `.json` document.

---

# C# + Swagger

`dotnet new webapi` scaffolded projects contain a basic setup for swagger from the get-go.

`dotnet run` and navigating to the URL will display a basic UI that is built from the openapi specification.

---

# OpenAPI Extraction

    Two options:
    - Tooling based
    - Live API based

---

# Code Generation

### JSON -> Code

Tools can generate source code in your project's language.

There are a few options for tools here.

- OpenAPI codegen is semi-official Java based tool with templates for several languages
- nx-dotnet provides a basic TS types only approach

---

# Polyrepo vs Monorepo

???

This setup can be applied to either polyrepos or monorepos. The biggest differences are the level of guaranteed safety, and the constraints placed on the development process.

---

# Polyrepo

    - Most common layout for most companies right now. Each project is in its own repo.
    - Multiple sources of truth for the expected type of an object.
    - Published API compared against in-dev front end.

This isn't necessarily the prod API, it should theoretically be whichever environment the build is targetting.

---

# Monorepo

    - A bit less common for smaller companies, but seeing good adoption at mid to enterprise scale
    - My tool of choice, but not always.

Monorepos scared me whenever the company I was at prior to Nrwl started to adopt them. It sounded like a horrible idea. This obviously changed, since I'm now here evangalizing them. Just know, that if you are apprehensive, its not an uncommon reaction.

There are some pros and cons to this setup.
Pros:

- Back end devs can't make a change that causes the current front end to not build.
- Breaking changes are noticed immediately, not accidently.
  Cons:
- Some PRs may require changes that are made by both front-end and back-end developers.

---

# "Its not my team"

---

<div class="full-image">
<img src="/assets/devup-2023/type-safety/npm-downloads_1.png"/>
</div>

???

This comparison shows our tools, vs the current competition. This doesn't show our tool vs npm or yarn workspaces, since they are complimentary and have significant overlap.

---

# Alternatives Exist

    - Lage, Gradle, turborepo, babel etc can likely do this too.
    - Techniques applied are valid even if your not using C# + TypeScript, steps would be different.
    - This talk will use Nx.

???

A tools absence from this talk doesn't mean it won't work with the technique, but I had to pick one for the demo so I went with what I am most comfortable with.

# Nx

- Using Lerna v5+? You may already be using Nx without knowing it.
- Nx is a task runner, that makes your CI and dev experience faster.
- Only run things which may have been affected.
- If it didn't change, caching keeps things fast.
- DTE can make them faster.

---

# Isn't that just for JS/TS?

Nx is able to handle pretty much anything you throw at it. Under the hood, Nx is essentially a task runner. If you can describe your task in a way Nx understands, then it will happily run it.

???

There are existing plugins for languages like C#, Go, Rust, and Python that are built by the community. We have some first party support in the pipeline for this flow, but nothing that we are quite ready to announce.

---

# Some Terminology

    - Package-based vs Integrated
    - Target: A script, command, action etc that runs for a project. Think: Build, test, lint etc.
    - Generator: Code scaffolding, typically provided by plugins
    - Executor: What handles running a particular target.
    - Task: Project + Target + Options

???

- package-based just means that your monorepo is defined by something like npm/yarn/pnpm workspaces. Your targets are represented by npm scripts.

- Integrated repos are a bit deeper, and may require more configuration. But, they provide some better affordances and make it easier to create new projects or update existing ones.

Nx used to only handle integrated repos, but thats been changing over the last 2 years. If you've tried Nx and thought it was too complicated, it may be time to give it another go.

---

# Project and Target Dependencies

    - Nx lets us tell it how projects are related, if its something that can't be statically determined.
    - Running one target can cause other targets to run, on other projects.

If the dependency can be statically determined, we don't have to tell Nx.

---

# Example Time!

    - Demo assumes new project.
    - Existing apps can certainly use the technique, but may be more complex to setup.

- Demo is using C# + React within Nx. You don't need to know much about C#, nothing about react, and only what I've already mentioned for Nx.
- Demonstration is only using frontend as a vehicle for build-errors. We won't actually be opening a browser to look at the site here, since we really only care about what shows up in our terminal.

---

## From Scratch Setup, in steps.

```shell
> yarn create nx-workspace demo --preset apps
> cd demo
> yarn add --dev @nx/react @nx-dotnet/core
> yarn nx g @nx/react:app frontend
> yarn nx g @nx-dotnet/core:app backend --language "C#" --template webapi --useNxPluginOpenAPI
```

???

Thats it! Those commands get you the bare-minimum setup for this to be working, with **_0_** real effort on your part.

You should now have an Nx workspace that contains

- A react app called "frontend" using typescript, vite or webpack, jest or vitest.
- An app containing e2e tests for your react app using cypress
- A C# project called backend
- A C# project containing the unit tests for `backend`
- A library containg the API spec file extracted from backend
- A library to contain the generated types from the api spec file.

---

### create-nx-workspace

- Scaffolds out a new repo, with some base stuff setup.
- `--preset apps` tells Nx to setup the workspace to contain multiple projects, some of which are applications
- `yarn create` tells Nx to use `yarn`. Nx works with npm or pnpm as well currently.

---

### yarn add --dev @nx/react @nx-dotnet/core

    - Nx is just a task runner
    - Plugins are used for code generation and task execution.
    - Full list of plugins available at nx.dev

---

### nx.json

```jsonc
{
  "tasksRunnerOptions": {
    "default": {
      "runner": "nx-cloud",
      "options": {
        "cacheableOperations": ["build", "swagger", "codegen"]
      }
    }
  },
  "targetDefaults": {
    "codegen": {
      "dependsOn": ["^swagger", "swagger"]
    },
    "swagger": {
      "dependsOn": ["build"]
    },
    "build": {
      "dependsOn": ["^build"]
    }
  }
}
```

???

Main important parts here:

- cacheableOperations: These are the names of targets that Nx can cache. Things with side effects shouldn't be here.

- `dependsOn`: This is how we tell Nx what should happen when we run a command. We fan this out into a graph, which avoids any chance of a single target running multiple times.

---

### yarn nx g @nx/react:app frontend

    - Tells Nx to use the `app` generator from `@nx/react`.
    - `frontend` is passed in, and used as the project name.

---

### yarn nx g @nx-dotnet/core:app backend --template webapi --language C#

- Tells Nx to use the `app` generator from `@nx-dotnet/core`.
- `backend` is passed in, and used as the project name.
- Other options used to tell the plugin how to generate the new project.

???

- `--template` is any installed dotnet template. If left out, you should be prompted
- nx-dotnet supports C#, Visual Basic, and F#.
- Using the webapi template scaffolds out everything we need for the demo setup by default.

---

## Task 1: Code -> OpenAPI

Create a target, that lets Nx extract your OpenAPI document.

---

### project.json (for the api project)

```jsonc
{
  "name": "webapi",
  "targets": {
    //... some other targets are probably already here.
    "swagger": {
      "executor": "@nx-dotnet/core:update-swagger",
      "outputs": ["options.output"],
      "options": {
        "output": "libs/generated/webapi-swagger/swagger.json"
      }
    }
  }
}
```

???

This file is called "project.json". If you've worked with Nx before, your probably very familiar with it. If not, but you've worked with angular.json the syntax should be pretty familiar. If not, than you may not have to worry about it way too much. Its optional, and could be replaced with package.json scripts if you like.

We've added a new target called "swagger" which can extract the API documentation from our API automatically. We could run it manually by running `nx run webapi:swagger`, but that's not super useful on its own.

---

## Task 2: OpenAPI -> Code

    Create a target, which enables you to turn the spec back into code

---

### project.json (OpenAPI project)

```jsonc
{
  "name": "openapi-spec"
  "targets": {
    "codegen": {
      "executor": "@nx-dotnet/core:openapi-codegen",
      "outputs": ["demo/libs/generated/webapi-types"],
      "options": {
        "openapiJsonPath": "libs/generated/webapi-swagger/swagger.json",
        "outputProject": "generated-webapi-types"
      }
    }
  },
  "implicitDependencies": ["demo-apps-webapi"]
}
```

???

A few new things here, but this is pretty similar to what we seen on the previous step. We are using a different executor, but the rest is similar.

One new thing that I'd like to call out is the `implicitDependencies` property. This tells Nx that the openapi-spec project depends on the api project, despite there not being a link via code or other configuration.

At this point we can run `nx run openapi-spec:codegen` and generate typescript typings in the `generated-webapi-types` project.

---

## Task 3:

### Code -> OpenAPI -> Code

So we see how we can manually run commands to achieve the type safety, but how can we lean on tooling to get the type safety without manual intervention?

Nx can trace project level dependencies all the way from our frontend to our backend at this point. There are two implicit dependencies that help with that, and now we can lean on the tooling.

---

# The Task Graph

- Using our `dependsOn` configuration, Nx is able to expand a graph of tasks that need to run.

---

<div class="full-image">
<img src="/assets/devup-2023/type-safety/graph.png"/>
</div>

---

<div style="display: grid; grid-template-rows: 20% 60% 20%; height: 100%">
<h1> The Result</h1>
<img src="/assets/devup-2023/type-safety/Clipboard.png" style="height:100%" >
<p>
Changing any of the types in our C# code, and then trying to build the frontend with <span class="remark-inline-code">nx build frontend</span> results in a build time error.
</p>
</div>

---

<div style="display: grid; grid-template-columns: 1fr 1fr; height: 100%">
<div><h2>Questions?</h2></div>
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
