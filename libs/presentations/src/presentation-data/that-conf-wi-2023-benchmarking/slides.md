layout: true
name: base

background-image: url(/assets/that-conf-wi-2023/Simple_Footer.png)
background-size: contain

<div style="position: absolute; left: 20px; right: auto;" class="remark-slide-number">
    <span style="display: block">THAT Conference WI</span>
    
    July 27, 2023
</div>

---

template: base

background-image: url(/assets/that-conf-wi-2023/Footer_With_Landscape.png)

# Benchmarking like a Scientist:

### Communicating Code's Performance.

### Craigory Coppola

---

# Agenda

1. Introduction
2. Why Benchmarking?
3. The Scientific Method
4. The Scientific Method (revisited)
5. Implementation
6. Transparency and Honesty

---

# Introduction

- Craigory Coppola
- Core team member working on Nx, a task orchestrator used to speed up workspaces via caching and parallelization.
- Previously full stack developer, with a focus on Angular and .NET

<div style="display: flex">
    <img style="max-width: 30%" src="/assets/that-conf-wi-2023/nrwl-logo.svg" alt="Nrwl Logo"></img>
    <img style="max-width: 30%" src="/assets/that-conf-wi-2023/nx-logo.svg" alt="Nx Logo"></img>
</div>

???

- Nx Helps speed up development by caching and parallelizing tasks.
  - Also graph visualization.
  - Initially heavy focus on monorepo tooling, but has since expanded to support single repos as well.
  - Clients with 1k+ projects in a single workspace, so we have to be very careful about performance.
  - Value is based on speeding up development, so we have to be very careful about any overhead our tool adds.
  - Frontend tooling is getting faster overall, so any overhead we add is a larger slice of the pie now.

---

# Why Benchmarking?

There are 3 main categories of reasons to benchmark:

- Checking things for yourself
- Checking things for your peers
- Checking things against your competitors

???

- Checking things for yourself
  - Is this new library faster than the old one?
  - Is this new language faster than the old one?
  - Is this new algorithm faster than the old one?
- Checking things for your peers
  - Is this change worth the effort?
  - Should we invest in this new technology?
  - Has our performance slipped at all?
  - Do we need to invest in performance?
- Checking things against your competitors
  - Does our product perform better than our competitors?
  - Do the pages feel snappier than our competitors?
  - Do customers spend less time waiting for our product than our competitors?

---

# Checking things for yourself

- Is this new library faster than the old one?
  - Should I spend time to learn it?
  - Is this PR ready to be reviewed?

---

# Checking things for your peers

- Is this change worth it?
  - Do any performance benefits outweigh the maintenance cost of the change?
- Has our performance slipped at all?
- Should we invest in this new technology?
- Do we need to invest in performance?
  - Is this an area we need to focus on?

---

# Checking things against your competitors

- Are there competitors that are faster than us?
  - What are they doing differently?
- Even if we are faster, are we fast enough?
  - Do our customers notice the difference?
  - Do our customers care about the difference?

---

# The Benchmarks You Already Have

- How long does it take to run your E2E tests?
- How long does it take to run your unit tests?
- How large is your bundle size?

???

- These are all benchmarks that you can use to compare your codebase over time.
- E2E tests are a great way to measure the performance of your application, and can be used to compare the performance of your application over time. If your E2E tests are taking longer to run, you can use this as a signal that your application is getting slower.
- Does any 1 unit test take a long time to run? This can be a signal that the code under test is slow, or that the test itself is slow. Look at the test, and evaluate if the slow unit test reflects slow runtime code.
- Has your bundle increased in size? The bundle size of your application is reflected in how long your users will have to wait to download your application. If your bundle size is increasing, you can use this as a signal that your application may feel slower.

---

# The Scientific Method

- Used to support a given hypothesis
- Provides a testable theory as a result
- Easy to revisit and see if a given theory still holds.

---

.center[<img src="https://upload.wikimedia.org/wikipedia/commons/8/82/The_Scientific_Method.svg" style="max-width: 50%; margin: auto auto"></img>]

---

# The Benchmarks You Already Have, Revisited

- Observation: Your E2E suite is taking longer to run
- Research Topic Area: Which features are responsible for the slowdown?
- Hypothesis: The slowdown is the result of recent changes.
- Test Hypothesis: Check if the jump in E2E duration occurred after a specific commit.
- Analyze Data: Look at the identified commit, and see if there are any obvious culprits.
- Report Conclusions: Reach out to your teammates with the findings and see how to best proceed.

???

- Test Hypothesis: Does `git bisect` possibly help here? It could, but if the e2e suite takes more than a minute or two to run it could be prohibitively slow. Instead, I'd look at CI provider logs over time.

---

# Case Study #1: Nx Large Monorepo

---

.center[<img src="https://upload.wikimedia.org/wikipedia/commons/8/82/The_Scientific_Method.svg" style="max-width: 50%; margin: auto auto"></img>]

???

Example:

- Observation: Turborepo announces that it is faster than Nx.
- Research Topic Area: Time added from tooling overhead. Easily measured by time to run a cached command.
- Hypothesis: The stated difference is inaccurate.
- Test Hypothesis: Run the same command in both tools and compare the results. Vercel's benchmarks aren't public, so we'll have to run our own.
- Analyze Data: Compare the results of the two tools.
- Report Conclusions: Publish the results of the benchmark, with source code and methodology.

---

# Case Study #1: Nx Large Monorepo

## For your peers.

<div style="display: grid; grid-template-columns: 1fr 1fr">
<ul>
    <li>https://github.com/vsavkin/large-monorepo</li>
    <li>"E2E Benchmark"
        <ul>
            <li>
                Measures the time to run a cached command in each tool, from the terminal.
            </li>
        </ul>
    </li>
</ul>
<img style="max-width: 100%" src="/assets/that-conf-wi-2023/turbo-nx-perf.gif" alt="Nrwl Logo"></img>
</div>

???

- Turborepo announces that it is faster than Nx.
- We don't believe it, but don't want to just say that without any backing.

---

# Case Study #1: Nx Large Monorepo

## Implementation

```typescript
let start = new Date().getTime();
for (let i = 0; i < NUMBER_OF_RUNS; ++i) {
  spawnSync('turbo', ['run', 'build', `--concurrency=10`]);
}
const turboTime = new Date().getTime() - start;
start = new Date().getTime();
for (let i = 0; i < NUMBER_OF_RUNS; ++i) {
  spawnSync('nx', ['run-many', '-t', 'build', '--parallel', 10]);
}
const nxTime = new Date().getTime() - start;
const averageNxTime = nxTime / NUMBER_OF_RUNS;
const averageTurboTime = turboTime / NUMBER_OF_RUNS;
```

---

# Case Study #2: `findMatchingProjects`

- Internal function in Nx codebase
- Called during several important CLI commands and graph construction
- "Hot Path" for performance
- Seems like it could be faster.

---

.center[<img src="https://upload.wikimedia.org/wikipedia/commons/8/82/The_Scientific_Method.svg" style="max-width: 50%; margin: auto auto"></img>]

???

- Observation: Flame chart reveals minimatch, a library we use to match glob patterns, is taking the majority of the time. For each project pattern we look at, minimatch compiles the glob pattern to a regular expression and evaluates it. This is expensive, and we can avoid it by caching the results.
- Research Topic Area: Single unit - similar to a unit test
- Hypothesis: Caching the results of minimatch will improve performance.
- Test Hypothesis: Establish a baseline for the function, then add caching and compare the results. Ensure that the worst-case is comparable to the original function, and the best-case is faster.
- Analyze Data: Record the benchmark result as an expected duration.
- Report Conclusions: Write a unit test that compares the runtime of the function to the expected duration.

---

# Case Study #2: `findMatchingProjects`

- Observation: Flame chart reveals minimatch, a library we use to match glob patterns, is taking the majority of the time. For each project pattern we look at, minimatch compiles the glob pattern to a regular expression and evaluates it. This is expensive, and we can avoid it by caching the results.

--

- Research Topic Area: Single unit - similar to a unit test

--

- Hypothesis: Caching the results of minimatch will improve performance.

--

- Test Hypothesis: Establish a baseline for the function, then add caching and compare the results. Ensure that the worst-case is comparable to the original function, and the best-case is faster.

--

- Analyze Data: Record the benchmark result as an expected duration.

--

- Report Conclusions: Write a unit test that compares the runtime of the function to the expected duration.

---

# Case Study #2: `findMatchingProjects`

```typescript
it(`should be faster than using minimatch directly multiple times (${pattern})`, () => {
  const iterations = 100;
  const cacheTime = time(() => getMatchingStringsWithCache(pattern, items), iterations);
  const directTime = time(() => minimatch.match(items, pattern), iterations);
  // Using minimatch directly takes at least twice as long than using the cache.
  expect(directTime / cacheTime).toBeGreaterThan(2);
});

it(`should be comparable to using minimatch a single time (${pattern})`, () => {
  const cacheTime = time(() => getMatchingStringsWithCache(pattern, items));
  const directTime = time(() => minimatch.match(items, pattern));
  // We are dealing with really small file sets here, with such a small
  // difference it time, the system variablility can make this flaky for
  // smaller values. If we are within 1ms, we are good.
  expect(cacheTime).toBeLessThan(directTime + 1);
});
```

---

# Case Study #3: Runtime Benchmarks

## For your users.

- Support ticket is raised:
  - "This page is slow when I access it"
  - "This command takes a long time to run"
  - "Should this be this slow?"
- How can you help answer, when you can't reproduce the slowness?

???

- Users won't be able to provide you with a flame chart, or a unit-level benchmark result.
- Need some form of instrumentation to help you understand what is happening in the wild.

---

.center[<img src="https://upload.wikimedia.org/wikipedia/commons/8/82/The_Scientific_Method.svg" style="max-width: 50%; margin: auto auto"></img>]

---

# Case Study #3: Runtime Benchmarks

- Observation: User reports that a command is slow.
- Research Topic Area: Entire system
- Hypothesis: Instrumenting the command will help us understand what is happening, and help us reproduce the issue.
- Test Hypothesis: Provide a flag that enables instrumentation, and let the user run the command.
- Analyze Data: User provided logs show a slow section of code.
- Report Conclusions: Issue is resolved, or we have enough information to reproduce the issue locally.

???

- We can't reproduce it locally, so we need to get more information.

---

# Case Study #3

```typescript
import { PerformanceObserver } from 'perf_hooks';

if (process.env.NX_PERF_LOGGING === 'true') {
  const obs = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      console.log(`Time for '${entry.name}'`, entry.duration);
    }
  });
  obs.observe({ entryTypes: ['measure'] });
}
```

> https://github.com/nrwl/nx/blob/master/packages/nx/src/utils/perf-logging.ts

---

# Transparency and Repeatability

- Publish the results of your benchmarks
- Make the source code available to stakeholders
  - If comparing internally, this is your team
  - If comparing to an external tool, and sharing the results publicly, this is the general public.

---

# Automated Benchmarks

- Web vitals / Lighthouse
- Unit Test Performance
- Bundle Size restrictions

???

- Run lighthouse reports during CI, if the score drops below a certain threshold, fail the build.
- Tune the timeouts for your test suites. By default most frameworks will fail if a test takes longer than a certain amount of time, but you can tune this to be more strict. If a few tests take longer change the timeout for them, not the entire suite.
  - Jest + Mocha default: 5s
  - MSTest / NUnit / XUnit have no default timeout. MSTest + NUnit can be specified, XUnit requires something custom.
- Fail the build if the bundle size is too large. Angular has a built-in mechanism for this, but you can also use a tool like size-limit.

---

# Web Vitals and Lighthouse

- Web Vitals: https://web.dev/vitals/
  - Cypress Plugin: https://www.npmjs.com/package/cypress-web-vitals
- Lighthouse CI:
  - https://github.com/GoogleChrome/lighthouse-ci

---

# Unit Test Performance

- Jest Timeouts example:

```typescript
describe('feature-tests', () => {
  it('a short test', () => {
    expect(true).toBe(true);
  }, 100);

  it('a long test', () => {
    expect(someLongOperation()).toBe(true);
  }, 10000);
});
```

---

# Bundle Size Restrictions

- Example from Angular configuration

```json5
{
  budgets: [
    {
      type: 'initial',
      maximumWarning: '2mb',
      maximumError: '5mb',
    },
  ],
}
```

- Could also use a tool like `size-limit`: https://www.npmjs.com/package/size-limit

---

background-image: url(/assets/that-conf-wi-2023/Session_Survey_Speaker.png)
background-size: contain

.center-image[![Session Survey QR Code](https://storage.googleapis.com/that-bucket/qrcodes/wi/2023/WGucIjHEx8oacKVjMPac.png)]

.center[https://that.land/44gHmZz]

---

background-image: url("/assets/that-conf-wi-2023/Sponsors.png")
background-size: contain

---

background-image: url(/assets/that-conf-wi-2023/Save_the_Date.png)
background-size: contain

---

background-image: url(/assets/that-conf-wi-2023/THAT_Conference.png)
background-size: contain
