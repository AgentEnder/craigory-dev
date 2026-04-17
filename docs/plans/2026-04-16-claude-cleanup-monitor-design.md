# Claude Cleanup Monitor — Design

## Overview

Add a `monitor` subcommand to `claude-cleanup` that backgrounds a daemon process to periodically kill stale Claude Code sessions. This prevents sessions from silently stacking up between manual cleanups.

## Subcommand Structure

```
claude-cleanup                                             # interactive cleanup (existing)
claude-cleanup monitor start [--interval 15m] [--age 2h]   # fork daemon
claude-cleanup monitor stop                                # SIGTERM daemon, wait for PID file deletion
claude-cleanup monitor status                              # running/stopped, uptime, log size
claude-cleanup monitor reset                               # stop + delete log file
```

The root command retains its existing `--all`, `--age`, `--clearCache` flags unchanged. The `monitor` subcommand uses `demandCommand()` so bare `claude-cleanup monitor` shows help.

## New Files

### `src/daemon.ts`

Standalone cli-forge CLI for arg parsing consistency. Receives `--interval` and `--age` in milliseconds (pre-parsed by `monitor start`).

**Startup:**

1. Write PID to `~/.claude/claude-cleanup-monitor.pid`
2. Log a header with timestamp, interval, age threshold
3. Run one cleanup cycle immediately
4. Start `setInterval` for subsequent cycles

**Each cycle:**

1. `discoverSessions()` then `classifySessions()` with the age threshold
2. Filter to stale + dead sessions
3. Kill each, log PID, cwd, and stale duration
4. Log "nothing to clean" if all sessions are active

**Shutdown:**

- `SIGTERM` handler clears the interval, lets process exit naturally
- `beforeExit` handler deletes the PID file
- No dependency on `@clack/prompts` — plain stdout logging only

### `src/monitor.ts`

Exports the `monitor` subcommand with `start`, `stop`, `status`, `reset` children.

### `src/paths.ts`

Shared constants: PID file path, log file path.

## Monitor Commands

### `start`

1. Check if already running (PID file + process alive) — abort if so
2. Parse `--interval` and `--age` via `parseAge()` into milliseconds
3. Open log file in append mode via `createWriteStream(..., { flags: 'a' })`
4. Spawn `node daemon.js --interval <ms> --age <ms>` with `detached: true`, stdout/stderr piped to log stream
5. `unref()` the child, exit the parent
6. Report "monitor started (PID X)"

### `stop`

1. Read PID file — if missing, report "not running"
2. Verify alive with `kill -0` — if dead, clean stale PID file, report "not running"
3. Send `SIGTERM`
4. Poll for PID file deletion (daemon's `beforeExit` cleans it up), timeout ~5s
5. Report success or warn on timeout

### `status`

1. Read PID file — if missing, report "not running"
2. Verify alive — if dead, clean stale PID file, report "not running (cleaned stale PID file)"
3. If running: report PID
4. Report log file size (human-readable KB/MB) or "no log file"

### `reset`

1. If daemon running, stop it first (same as `stop` logic)
2. Delete log file if present
3. Delete PID file if still present
4. Report what was cleaned up
