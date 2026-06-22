# pristine — fast `git clean -fdx` replacement

**Date:** 2026-06-22
**Package:** `@agentender/pristine` (bin: `pristine`)
**Status:** Design approved, ready for implementation

## Goal

A small, fast CLI that replaces `git clean -fdx` (plus optional reset of tracked
changes). It prompts the user for what to remove and deletes files as quickly as
possible by fanning out `fs.rm` across an oversubscribed libuv thread pool.

## Decisions

| Question | Decision |
|---|---|
| Removal engine | **Node fan-out** (`fs.rm` recursive, concurrency-limited). Measure-first; NAPI considered and rejected for now — the repo has no native-addon infra and parallelism captures the win. |
| Enumeration | **git in JS** (`git ls-files` / `git diff`). Inherits `git clean` semantics for free. |
| Reset scope | Ask at runtime: *discard everything (hard)* vs *working-tree only*. |
| Interaction | Interactive prompts by default; CLI flags for unattended use. |
| `--directory` | Hard-coded constant on both enumeration queries (not a plan field). |
| `os` field | Omitted — pure JS, runs anywhere Node runs (incl. Windows). |

## Module layout

```
packages/pristine/
  src/
    cli.ts         # cli-forge entry, shebang, flag parsing -> run()
    index.ts       # public API (run, enumerate, removeAll) for programmatic use
    prompts.ts     # @clack/prompts cascading interactive flow
    git.ts         # enumerate untracked/ignored/changed + reset
    categorize.ts  # split ignored entries -> vendor / env / other
    remove.ts      # concurrency-limited fs.rm fan-out
    *.spec.ts      # vitest
  package.json
  tsconfig.json, tsconfig.lib.json, tsconfig.spec.json
  project.json
```

## Data flow

```
flags / prompts ──► PLAN ──► git.ts ──► target paths ──► confirm ──► remove.ts
```

- **Plan:** `{ reset?: 'hard' | 'worktree', untracked: bool, ignored: bool, vendor: bool, env: bool }`
- Stages are kept distinct (enumerate → plan → confirm → remove) so `--dry-run`
  is just "stop after the plan," and tests can assert the target list without
  touching the filesystem.
- Order of operations: **reset first** (restore tracked files), then untracked,
  then ignored.

## Interactive flow

```
◆ Reset changed (tracked) files?
  ○ No, leave my changes
  ○ Discard working-tree changes only
  ○ Discard everything (hard reset)
◆ Remove untracked files?            (yes/no)
◆ Remove ignored files?              (yes/no)
   └─ if yes:
      ◆ Include vendor dirs (node_modules)?   (yes/no, default No)
      ◆ Include env files (*.env*)?           (yes/no, default No)

— Plan summary —  (counts; vendor/env exclusions noted)
◆ Proceed? (y/N)   default No
```

Defaults bias toward safety: vendor and env **excluded** unless opted in; final
confirm defaults to No.

## Flags (cli-forge)

Presence of *any* action flag ⇒ non-interactive (no prompt-hang in CI).

| Flag | Meaning |
|---|---|
| `--reset[=hard\|worktree]` | reset changed files (bare `--reset` = hard) |
| `--untracked` | remove untracked |
| `--ignored` | remove ignored |
| `--node-modules` / `--no-node-modules` | include/exclude vendor within ignored (default off) |
| `--env` / `--no-env` | include/exclude `*.env*` within ignored (default off) |
| `--yes`, `-y` | skip the final proceed confirmation only |
| `--dry-run` | enumerate + print plan, delete nothing |
| `--cwd <dir>` | run against another directory |

`--yes` gates only the final confirm, not action selection — so `pristine --ignored`
in CI still won't delete without `--yes`.

## Git enumeration

All via `execFile` (never the shell), NUL-delimited (`-z`) for filename safety:

```
untracked:  git ls-files -z --others --exclude-standard --directory
ignored:    git ls-files -z --others --ignored --exclude-standard --directory
changed:    git diff --quiet            # exit code => tracked changes present?
guard:      git rev-parse --is-inside-work-tree
```

Reset mapping:
- `worktree` → `git restore -- .`
- `hard` → `git reset --hard HEAD`

Untracked and ignored lists are disjoint by construction (`--others` without
`--ignored` excludes ignored), so no double-deletion.

### The `--directory` collapse algorithm

`--directory` makes `git ls-files` emit a single `dir/` entry instead of every
leaf inside it — **only when every descendant is "other"** (untracked/ignored and
not tracked). The decision is purely structural and recursive:

```
collapse(D):
  allOther = true
  for child in readdir(D):
    if child is tracked:        allOther = false
    elif child is other-leaf:   emit child
    elif child is directory:
        sub = collapse(child)
        emit sub.entries
        allOther = allOther AND sub.fullyOther
  if allOther: return { fullyOther: true,  entries: [D + "/"] }   # COLLAPSE
  else:        return { fullyOther: false, entries: leaves }       # EXPAND
```

A single tracked file anywhere in a subtree poisons `allOther` up the chain,
forcing ancestors to expand to the affected branch while sibling subtrees still
collapse. Consequences:

- **Speed:** `node_modules/` → one `fs.rm(recursive)` instead of ~30k unlinks
  issued from JS.
- **Correctness:** git never collapses a directory holding a tracked file, so the
  deleter can never over-reach into a half-tracked folder. `pristine` inherits
  `git clean`'s exact semantics (nested `.gitignore`, negations, `info/exclude`,
  global excludes) for free.

This matches the `-d` in `git clean -fdx` (remove whole untracked directories).

## Categorization

`categorize.ts` partitions the ignored entries:

- **vendor** — entry is `node_modules/` or ends in `/node_modules/`
- **env** — basename matches `*.env*` (`.env`, `.env.local`, `prod.env`, …)
- **other** — everything else (`dist/`, `.cache/`, coverage, …)

Plan includes `other` whenever `ignored`; adds `vendor`/`env` only when toggled on.
`categorize.ts` reasons only about the entries git returns — it never re-walks the
tree itself.

## Removal engine

```ts
// remove.ts
import { rm } from 'node:fs/promises';
import os from 'node:os';

const CONCURRENCY = Math.max(4, os.cpus().length * 4); // I/O-bound, oversubscribe

export async function removeAll(targets, { onProgress }) {
  let done = 0;
  const failures = [];
  await pMap(targets, async (t) => {
    try { await rm(t, { recursive: true, force: true }); }
    catch (e) { failures.push({ path: t, error: e }); }
    finally { onProgress(++done, targets.length); }
  }, { concurrency: CONCURRENCY });
  return { failures };
}
```

- **`UV_THREADPOOL_SIZE`** bumped at the very top of `cli.ts` (before any fs work)
  to match concurrency — `fs.rm` runs in the libuv threadpool; the default 4
  threads otherwise cap real parallelism.
- Small internal `pMap` (no dependency) limits in-flight `rm` calls.
- `force: true` swallows ENOENT (already-gone), important under concurrency and
  collapsed-dir/child overlap.
- Failures don't abort the batch; collected and reported, non-zero exit if any.
- Progress via `@clack/prompts` spinner.

**Safety net:** every target path is resolved and asserted to be within `cwd`
before deletion (defense-in-depth against malformed git paths). `--dry-run` prints
the resolved plan and exits before `removeAll`.

**Performance thesis:** `fs.rm` is syscall-heavy (`unlink`/`rmdir` latency = I/O
wait), so oversubscribing (`cpus * 4`) overlaps more in-flight syscalls than serial
`git clean`.

## Testing (vitest)

- `categorize.spec.ts` — pure function; synthetic git output → assert partition.
- `git.spec.ts` — integration with **real git** in a temp repo (init, .gitignore,
  staged/untracked/ignored files) → assert `enumerate()` paths. Tests our flag
  choices against actual git behavior, not a mock.
- `remove.spec.ts` — temp tree; assert targets gone, within-cwd guard rejects
  escaping paths, `force:true` makes a missing path a no-op.
- `plan.spec.ts` — flag/prompt → plan resolution (e.g. `--ignored` without
  `--node-modules` ⇒ vendor excluded; any action flag ⇒ non-interactive).

## Packaging / release (mirror `claude-cleanup`)

```jsonc
{
  "name": "@agentender/pristine",
  "version": "0.0.1",
  "type": "module",
  "bin": { "pristine": "./dist/cli.js" },
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": { ".": { "import": "./dist/index.js", "types": "./dist/index.d.ts", "default": "./dist/index.js" } },
  "scripts": {
    "build": "tsc -p tsconfig.lib.json",
    "test": "vitest run",
    "lint": "eslint .",
    "typecheck": "tsc -p tsconfig.json --noEmit"
  },
  "dependencies": {
    "cli-forge": "catalog:",
    "@clack/prompts": "^0.10.0",
    "es-main": "catalog:",
    "tslib": "^2.5.0"
  },
  "publishConfig": { "access": "public" },
  "engines": { "node": ">=20" },
  "repository": {
    "type": "git",
    "url": "https://github.com/AgentEnder/craigory-dev.git",
    "directory": "packages/pristine"
  }
}
```

- `tsconfig.{json,lib,spec}.json` copied from `claude-cleanup`, paths updated.
- Add `@agentender/pristine` → `packages/pristine/src/index.ts` to root
  `tsconfig.base.json` paths.
- Auto-picked by `nx release` (`projects: ["packages/*"]`) — no extra wiring.
- `os` field omitted (pure JS).
