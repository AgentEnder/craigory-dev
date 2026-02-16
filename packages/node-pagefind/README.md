# pr-digest

A CLI tool for generating comprehensive digests of GitHub pull requests, optimized for AI agent handoffs with full timeline context.

## Features

- Fetches all PR information (title, description, branches)
- Retrieves complete timeline including reviews, comments, and status changes
- Formats output using markdown-factory for clean, readable output
- Includes AI agent instructions based on timeline analysis
- Flexible authentication (args, env vars, or gh CLI)
- Auto-detects PR from current git repository using Octokit

## Installation

```bash
npm install -g pr-digest
```

## Usage

### Auto-detect PR from current git repository

```bash
pr-digest digest
```

When run from a GitHub repository, `pr-digest` will:

1. Detect the GitHub repository from `git remote get-url origin`
2. Get the current branch name from `git branch --show-current`
3. Search GitHub for an open PR with a matching head branch
4. Generate a digest for that PR

You can still explicitly provide owner/repo/pr if needed:

- `--owner` and `--repo` override the detected GitHub repository
- `--pr` overrides the auto-detected PR number

### Using a GitHub PR URL

```bash
pr-digest digest https://github.com/owner/repo/pull/123
```

### With output file

```bash
pr-digest digest --url https://github.com/owner/repo/pull/123 --output digest.md
```

### Authentication

The tool tries token sources in this order:

1. `--token` CLI argument
2. `GH_TOKEN` environment variable
3. `GITHUB_TOKEN` environment variable
4. `gh auth token` command (requires GitHub CLI)

## Digest Format

The generated digest includes:

- **PR Header**: Title, number, and link
- **Branch Information**: Base branch (for `git diff` commands) and head branch
- **Timeline Section**: Full conversation history including:
  - Review summary with approval statistics
  - Individual review comments with review states
  - Nx Cloud CI links (detected and highlighted)
  - General Comments: Issue-level comments with threaded replies
  - File-Specific Comments\*\*: Review comments grouped by file with line numbers and ranges
  - **AI Agent Instructions**: Context-aware guidelines based on timeline data

> **Timeline Features:**

- Shows review state (approved, changes requested, commented, dismissed, etc.)
- Groups comments into threads with replies
- Detects Nx Cloud CI links in review comments and highlights them
- Provides review summary statistics for quick overview
- Helps AI agents understand the full review conversation context

## Development

```bash
# Build
npm run build

# Run tests
npm run test

# Type check
npm run typecheck

# Lint
npm run lint
```
