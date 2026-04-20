# start

**Usage:** `claude-cleanup monitor start`

Start the background monitor daemon

## Flags

### help

**Type:** boolean

Show help for the current command

#### Aliases

- h

### version

**Type:** boolean

Show the version number for the CLI

### interval

**Type:** string

Check interval (e.g. 15m, 1h)

**Default:** `"15m"`

### age

**Type:** string

Staleness threshold (e.g. 2h, 30m, 1d)

**Default:** `"2h"`

### foreground

**Type:** boolean

Run in foreground with inherited stdio (don't detach)

**Default:** `false`

#### Aliases

- fg