# @agentender/pristine

A fast, git-aware replacement for `git clean -fdx`. `pristine` asks what you want
gone — reset tracked changes, remove untracked files, remove ignored files — then
deletes as quickly as possible by fanning out `fs.rm` across an oversubscribed
thread pool.

## Why

`git clean -fdx` unlinks serially. On a tree full of `node_modules`, the bottleneck
is the sheer number of `unlink`/`rmdir` syscalls. `pristine` enumerates exactly what
`git clean` would (via `git ls-files`), then removes those paths concurrently, so the
syscalls overlap instead of queueing.

## Install

```sh
npm i -g @agentender/pristine
# or run once:
npx @agentender/pristine
```

## Usage

Run it bare for an interactive, cascading prompt:

```sh
pristine
```

```
◆ Reset changed (tracked) files?
  ○ No, leave my changes
  ○ Discard working-tree changes only
  ○ Discard everything (hard reset)
◆ Remove untracked files?
◆ Remove ignored files?
   └─ Include vendor dirs (node_modules)?   (default: no)
   └─ Include env files (*.env*)?           (default: no)
```

Vendor directories (`node_modules`) and env files (`*.env*`) are **excluded by
default** — you opt in.

At the final confirmation you can choose **Dry run** to list exactly what would
happen without touching anything:

```
◆ Apply these changes?
  ○ Yes, apply them
  ○ Dry run — list what would happen
  ○ No, cancel
```

A dry run prints each action and ends with the precise command to apply it:

```
Dry run — would run:
  Reset tracked files (hard)
  rm -r newdir/        (12 files)
  rm -r node_modules/  (34201 files)
  rm stray.log

No changes made. Re-run to apply:
  pristine --reset hard --untracked --ignored --node-modules --yes
```

Directory entries are annotated with a recursive file count, so you can see the
weight of what you're about to delete before committing to it.

### Non-interactive

Passing any action flag (`--reset`, `--untracked`, `--ignored`) skips the prompts,
so it is safe in CI. The final confirmation is still required unless you pass
`--yes`.

```sh
# Remove untracked + ignored, but keep node_modules and .env files
pristine --untracked --ignored --yes

# Nuke everything git considers disposable, including node_modules
pristine --untracked --ignored --node-modules --env --yes

# Reset tracked changes and preview the rest without deleting
pristine --reset hard --untracked --ignored --dry-run
```

| Flag | Description |
| --- | --- |
| `--reset hard\|worktree` | Discard changes to tracked files first |
| `--untracked` | Remove untracked files |
| `--ignored` | Remove ignored files |
| `--node-modules` | Include vendor dirs within ignored removal |
| `--env` | Include `*.env*` files within ignored removal |
| `--yes`, `-y` | Skip the final confirmation |
| `--dry-run` | List the actions that would be taken, then exit without removing anything |
| `--cwd <dir>` | Operate on another directory |

## How it stays correct

Enumeration is delegated to `git clean -n` (dry run) — `git clean -dn` for untracked
files and `git clean -dXn` for ignored files — so `pristine` inherits `git clean`'s
exact semantics: nested `.gitignore` rules, negations, global excludes, and the
refusal to descend into nested git repositories all behave identically.

Crucially, git collapses a directory to a single entry **only when everything inside
it is being removed**. A directory that mixes categories — say `.nx/`, holding an
ignored cache next to untracked workspace data — is *descended*, so removing untracked
files never deletes the ignored ones (and vice versa). `pristine` then runs the actual
deletion itself, in parallel, with each target additionally asserted to resolve inside
the working directory first.

## License

MIT
