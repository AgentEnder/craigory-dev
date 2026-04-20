# claude-cleanup

**Usage:** `claude-cleanup`

Find and kill stale Claude Code sessions

## Flags

### help

**Type:** boolean

Show help for the current command

#### Aliases

- h

### version

**Type:** boolean

Show the version number for the CLI

### all

**Type:** boolean

Kill all stale sessions without prompting

**Default:** `false`

### age

**Type:** string

Staleness threshold (e.g. 2h, 30m, 1d)

**Default:** `"2h"`

### clearCache

**Type:** boolean

Clear the summary cache and re-summarize all sessions

**Default:** `false`

#### Aliases

- clear-cache

## Subcommands

[monitor](./monitor.md)
