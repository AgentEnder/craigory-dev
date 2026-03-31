# Update Repos Tool — Design

**Date:** 2026-03-31
**Location:** `tools/update-repos/`

## Overview

An interactive CLI tool that discovers all unique git repos in `~/repos`, presents a multiselect for choosing which to update, then opens PRs to migrate Nx and fix npm audit vulnerabilities using AI-assisted dependency resolution.

## CLI Interface (cli-forge)

```
tsx tools/update-repos/src/cli.ts [options]
```

**Flags:**

- `--ai-agent <false|claude|codex>` — AI agent for audit fix (default: `claude`)
- `--repos-dir <path>` — Base directory to scan (default: `~/repos`)
- `--dry-run` — Show what would happen without making changes

## Project Structure

```
tools/update-repos/
├── src/
│   ├── cli.ts          # cli-forge CLI definition
│   ├── discover.ts     # Recursive repo discovery + dedup by remote URL
│   ├── select.ts       # Clack multiselect + config persistence
│   ├── update.ts       # Per-repo update orchestrator
│   ├── audit-fix.ts    # AI-driven or plain npm audit fix
│   ├── nx-migrate.ts   # Nx migration logic
│   ├── report.ts       # Markdown + JSON report generation
│   └── utils.ts        # Shared helpers (exec, pm detection, logging)
└── project.json        # Nx target to run via tsx
```

**State file:** `~/.config/update-repos/state.json`

## Flow

### 1. Discovery (`discover.ts`)

- Recursively walk `--repos-dir` looking for `.git` directories
- For each repo, extract remote URL via `git remote get-url origin`
- Normalize URLs to deduplicate (e.g., SSH vs HTTPS for same repo)
- Skip repos with no remote

### 2. Selection (`select.ts`)

- Load `~/.config/update-repos/state.json` if it exists
- Present clack multiselect with all discovered repos
- Pre-select repos that were selected in previous runs
- Save selection back to state file

### 3. Update (`update.ts`)

For each selected repo:

1. Check `git status --porcelain`:
   - If clean → work in-place
   - If dirty → create worktree at `/tmp/upgrade-worktrees/<repo-name>` from `main`/`master`
2. `git fetch origin`
3. Create branch `chore/update-YYYY-MM-DD` from default branch
4. Detect package manager from lockfiles
5. Install dependencies
6. Run **audit fix** step
7. Run **nx migrate** step (if Nx is detected)
8. Push branch, open/update PR via `gh pr create`
9. If push fails → add to failure list
10. Clean up worktree if one was created

### 4. Audit Fix (`audit-fix.ts`)

- Run `<pm> audit` to capture output
- If `--ai-agent false`: run `<pm> audit fix` and commit
- If `--ai-agent claude|codex`: spawn the CLI with a prompt instructing it to:
  - Fix vulnerabilities by upgrading packages to compatible versions
  - Prefer actual upgrades over `resolutions`/`overrides`
  - If a peer dep indicates a newer major version, upgrade the package
  - Run install and verify the audit is cleaner
- Commit the changes

### 5. Nx Migrate (`nx-migrate.ts`)

- Run `nx migrate latest`
- If `migrations.json` is created, run `nx migrate --run-migrations --create-commits`
- Run `nx reset`
- If `post-nx-update` script exists in package.json, run it and commit

### 6. Reporting (`report.ts`)

**Markdown report (via `markdown-factory`):**

- Summary table: repo, Nx migrated (old → new), audit fixed, PR link
- Push failures section
- Skipped repos section
- Written to `~/.config/update-repos/report-YYYY-MM-DD.md`

**JSON state update (`state.json`):**

- Discovered repos (URL → local path)
- Selected repos
- Per-repo last run status (success/failure/skipped)
- Per-repo last PR URL
- Timestamp

## Dependencies (all already installed)

- `cli-forge` — CLI argument parsing
- `@clack/prompts` — Interactive multiselect
- `markdown-factory` — Report generation
- `tsx` — TypeScript execution
