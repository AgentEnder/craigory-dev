layout: true
name: base

background-image: url(/assets/that-conf-wi-2024/footer.png)
background-size: contain

<div style="position: absolute; left: 20px; right: auto;" class="remark-slide-number">
    <span style="display: block">THAT Conference WI</span>
    
    Aug 1, 2024
</div>

---

template: base

background-image: url(/assets/that-conf-wi-2024/footer.png)

# From Spaghetti to S'mores:

### Tasty Techniques for Code Compartmentalization

### Craigory Coppola

<p>Slides: https://craigory.dev/presentations/view/that-conf-wi-2024-spaghetti</p>

---

background-image: url("/assets/that-conf-wi-2024/sponsors.png")
background-size: contain

---

# Introduction

- Craigory Coppola
- Previously full stack developer, with a focus on Angular and .NET
- Core team member working on Nx, a task orchestrator used to speed up workspaces via caching and parallelization.

<div style="display: flex">
    <img style="max-width: 30%" src="/assets/that-conf-wi-2023/nrwl-logo.svg" alt="Nrwl Logo"></img>
    <img style="max-width: 30%" src="/assets/that-conf-wi-2023/nx-logo.svg" alt="Nx Logo"></img>
</div>

---

# The simplest project.

- Going back to the first code a developer writes, it's often a single file.
- That file does one thing, sometimes well, and is easy to navigate.

```javascript
function add(a, b) {
  return a + b;
}

console.log(add(1, 2)); // 3
```

---

# The simplest project (continued).

- Tomorrow, the developer is asked to add a new feature.
- The feature is simple, and the developer adds it to the same file.

```javascript
function add(a, b) {
  return a + b;
}

function subtract(a, b) {
  return a - b;
}

console.log(add(1, 2)); // 3
console.log(subtract(1, 2)); // -1
```

---

# The simplest project (continued).

- The developer is asked to add another feature. This time, the feature is more complex.
- The developer doesn't see a reason to create a new file, and adds the feature to the same file.

```javascript
function add(a, b) {
  return a + b;
}

function subtract(a, b) {
  return a - b;
}

function multiply(a, b) {
  let result = 0;
  for (let i = 0; i < b; i++) {
    result = add(result, a);
  }
  return result;
}

console.log(add(1, 2)); // 3
console.log(subtract(1, 2)); // -1
console.log(multiply(1, 2)); // 2
```

---

# The simplest project (continued).

- As time goes on, the file grows and grows.
- We have a single file that does many things, and is hard to navigate.

In short, even with only a single file, we have spaghetti code.

---

<div style="display: flex; justify-content: center;">
<img src="/assets/that-conf-wi-2024/spaghetti-monster.png"></img>
</div>

---

# Compartmentalization

- Compartmentalization is the act of breaking a system into smaller parts.
- Those parts are easier to understand, and easier to work with, and easier to maintain.
- "separation of concerns", "single responsibility principle" etc.

---

# A simple project, compartmentalized.

- The developer decides to break the file into three files, one for each feature.

```javascript
// add.js
function add(a, b) {
  return a + b;
}

// subtract.js
function subtract(a, b) {
  return a - b;
}

// multiply.js
const add = require('./add');
function multiply(a, b) {
  let result = 0;
  for (let i = 0; i < b; i++) {
    result = add(result, a);
  }
  return result;
}
```

---

# A simple project, compartmentalized (continued).

The "spaghetti" has been defeated.

Immediately, there are benefits:

- The files are easier to navigate.
- Changesets are smaller, and easier to review.
- Merge conflicts are less likely.

But, there are also drawbacks:

- The whole system is harder to see at a glance.
- The developer has to remember where each function is.
- Functions must be imported and exported.

---

# We don't have smores yet.

- We have a system that is easier to work with, but harder to understand.
- The ingredients are there, but they're not yet combined into a tasty treat.

We need to take the next step, and build a fire to cook our smores.

---

# Some Caveats

- This is a bit of a contrived example.
- In the real world, this wouldn't make sense for a project that fits on a single slide.
- Let's break down a more realistic example.

---

# A larger project

- The team has built a web application.
- The application has a few features:
  - A user can log in and log out.
  - A user can view a list of items.
  - A user can add an item to the list.
  - A user can remove an item from the list.

---

# A larger project (continued)

- We have many files, and many folders already.
- We have separate modules for many of the features.
- There is a folder along the lines of "utils" or "shared" that contains many files that are used across the application.

````plaintext
├── node_modules
├── src/
│   ├── pages/
│   │   ├── home.page.ts
│   │   └── todos.page.ts
│   ├── components/
│   │   └── todo-item.component.ts
│   ├── shared/
│   │   ├── utils/
│   │   │   └── formatting.ts
│   │   └── services/
│   │       └── auth.service.ts
│   ├── bootstrap.ts
│   └── index.html
└── package.json```

---

# A larger project (continued)

- The existing structure is a good start.
  - We can still navigate the system easily.
  - We can still review changesets easily.
  - We can still avoid merge conflicts.

Importantly, the team knows where to find things, how to work, and how to move fast.

---

<div style="display: flex; justify-content: center;">
<img src="/assets/that-conf-wi-2024/chocolate-spaghetti.png"></img>
</div>

---

# What happened?

- The code is compartmentalized, but nothing is keeping it that way.
- The developers are happy that the system is compartmentalized.
- Outside of the direct team, velocity is more important than structure.

---

<div style="display: flex; justify-content: center; align-items: center; max-height: 100%">
<img src="/assets/that-conf-wi-2024/106-tech-debt.png" alt="https://www.monkeyuser.com/2018/tech-debt" style="max-width: 50vw; max-height: 60vh;"></img>
</div>

---

# How do we keep our ingredients smores-bound?

- Structure needs to be enforced.
- Developers still need to be able to move quickly.
  - The system needs to be easy to understand.
  - The system needs to be easy to maintain.
- "Outsiders" need to understand the importance of structure.

---

# Structure needs to be enforced.

It's easier to enforce structure when:
- The structure is explicit.
- The structure is easy to understand.

This means when a developer creates a new file, they should know where it goes.

If this is true, static analysis can be used to ensure that the structure is maintained.

---

# Structure needs to be enforced (continued).

The more distinct the structure, the easier it is to enforce. Monorepos can help with this.

- A monorepo is a single repository that contains many projects.
- Sometimes this means all of the code for a company is in a single repository.
- More often, this means that a single project is broken into many smaller projects.

---

```plaintext
.
├── node_modules
├── apps/
│   └── myapp/
│       ├── index.html
│       ├── bootstrap.ts
│       └── routes.ts
├── libs/
│   └── features/
│       ├── auth/
│       │   └── services/
│       │       └── auth.service.ts
│       ├── home/
│       │   └── pages/
│       │       └── home.page.ts
│       ├── todos/
│       │   └── components/
│       │       └── todo-item.component.ts
│       └── shared/
│           └── utils/
│               └── formatting.ts
└── package.json
````

---

<div style="display: flex; justify-content: center; align-items: center;">
<img src="/assets/that-conf-wi-2024/graph.png" style="height: 50vh"></img>
</div>

---

# Good tooling is the fire we need to glue our smores together.

- Tools can make it easier to stick to a good structure.

  - Static analysis can ensure that files are organized correctly.
  - Code generation can make it easier to create new files and areas of the system.

- If the tools are good, its easier to do the right thing than the wrong thing.

---

# So what's the recipe?

- Compartmentalize your code.
- Enforce the structure.
- Use good tooling.

---

# Practical Examples

- Codeowners
- Monorepo tooling: Nx, Lerna, Rush
- Static analysis: ESLint, Prettier (?), SonarQube
- Code generation: Nx generators, Angular schematics, plop, `dotnet new`

---

# Why static analysis?

Analysis can be used to ensure that the structure is maintained.

- Banned import paths for internal or external dependencies.
- Scoping packages to specific areas of the system.
- Ensuring other practices are consistent across the system.

---

# Why Monorepos

Monorepos provide a framework for structuring the system. They are an architectural decision, and as such have their own tradeoffs. Importantly, monorepos are not monoliths.

---

# Monorepo Pros

- Easier to enforce structure.
- Easier to share code.
- Atomic changesets.

---

# Monorepo Cons (or at least, things to consider)

Always somewhat true:

- A bit more files to navigate.
- A bit more to learn up front.

Tooling can help with these:

- CI/CD slowdowns.
- Slower local development.

---

# Monorepo tooling

Nx and similar tools work to alleviate the other cons of monorepos. Frequently monorepos become slower as projects are added because there are more tasks to run.

Nx and similar tools work to alleviate this by:

- Caching build artifacts.
- Running tasks in parallel.
- Providing a way to run tasks only on affected projects.

---

# Code generation

Code generation can be used to make it easier to create new files and areas of the system.

- Generators can create entire new projects or single files.
- Custom generators can be used to tailor the system to the team's needs.
- When its time to update the system, the generators can be updated to reflect the new structure.

When its faster to generate a project with the correct structure than to create it by hand, the team is more likely to do the right thing.

---

<div style="display: flex; justify-content: center; align-items: center;">
<img src="/assets/that-conf-wi-2024/smores-cooking.png" style="height: 50vh"></img>
</div>

---

# 1 Minute Summary

"Always"

- Compartmentalize your code.
- Enforce the structure.
- Use good tooling.
- Keep learning.

"Sometimes"

- Maybe use a monorepo.
- Maybe don't use a monorepo.

---

background-image: url(/assets/that-conf-wi-2024/footer.png)

<div style="display: grid; grid-template-columns: 1fr 1fr">
<div><h2>Questions?</h2></div>
<div>
  <h2>Contact + Links</h2>
  <ul>
    <li>THAT Slack</li>
    <li>Twitter (x?): @EnderAgent</li>
    <li>https://www.linkedin.com/in/craigoryvcoppola/</li>
    <li>https://github.com/agentender</li>
    <li>https://craigory.dev</li>
  </ul>
</div>
</div>

---

background-image: url("/assets/that-conf-wi-2024/sponsors.png")
background-size: contain

---

background-image: url(/assets/that-conf-wi-2024/that.png)
background-size: contain
