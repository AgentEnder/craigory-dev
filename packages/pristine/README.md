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

Before the final confirmation, pristine always shows a preview of exactly what it
will remove — directory entries annotated with a recursive file count, so you can
see the weight of what you're about to delete:

```
Would remove:
  Reset tracked files (hard)
  rm -r newdir/        (12 files)
  rm -r node_modules/  (34201 files)
  rm stray.log

◆ Proceed?  (default No)
```

### Non-interactive

Passing any action flag (`--reset`, `--untracked`, `--ignored`) skips the prompts,
so it is safe in CI. The final confirmation is still required unless you pass
`--yes`.

```sh
# Remove untracked + ignored, but keep node_modules and .env files
pristine --untracked --ignored --yes

# Nuke everything git considers disposable, including node_modules
pristine --untracked --ignored --node-modules --env --yes
```

### `--dry-run` (scripting)

`--dry-run` never prompts and writes **only the paths it would remove to stdout**,
one per line — everything human goes to stderr. That makes it composable with other
tools:

```sh
# List what would be removed
pristine --untracked --ignored --node-modules --dry-run

# Pipe straight into other tools (stderr is kept separate)
pristine --untracked --ignored --dry-run | wc -l
pristine --ignored --node-modules --dry-run | fzf
```

| Flag | Description |
| --- | --- |
| `--reset hard\|worktree` | Discard changes to tracked files first |
| `--untracked` | Remove untracked files |
| `--ignored` | Remove ignored files |
| `--node-modules` | Include vendor dirs within ignored removal |
| `--env` | Include `*.env*` files within ignored removal |
| `--yes`, `-y` | Skip the final confirmation |
| `--dry-run` | Print the paths that would be removed to stdout (one per line); never prompts |
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
