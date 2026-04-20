# claude-cleanup

Find and kill stale [Claude Code](https://docs.claude.com/en/docs/claude-code/overview) sessions that have been left running in the background. Comes with an interactive picker and an optional long-running monitor daemon for set-and-forget cleanup.

> macOS and Linux only — relies on Unix signals (`kill -0`, `SIGTERM`). Windows is not supported.

## Why

Claude Code writes a small JSON file to `~/.claude/sessions/` for every interactive session it starts and usually removes it on clean exit. Crashes, force-quit terminal windows, and forgotten `claude` processes leave those entries behind along with the process itself, which can accumulate over time. `claude-cleanup` reads those session files, cross-references the PIDs against the OS process table, and lets you clean up the ones that are dead or idle.

## Install

```bash
npm install -g claude-cleanup
```

Or run it on-demand with `npx`:

```bash
npx claude-cleanup
```

The `claude` CLI should be available on your `PATH`. It is used to generate one-line summaries of each stale session via the Haiku model; the tool still works without it, but selections will only show the working directory and age.

## Quickstart

```bash
# Interactive picker — pre-selects every stale/dead session
claude-cleanup

# Kill every stale/dead session non-interactively (scripts, cron)
claude-cleanup --all

# Use a stricter threshold
claude-cleanup --age 30m
```

A session is classified as:

| Status   | Meaning                                                         |
| -------- | --------------------------------------------------------------- |
| `active` | PID is alive and last activity is within `--age`                |
| `stale`  | PID is alive but last activity is older than `--age`            |
| `dead`   | PID is no longer running (kill target is skipped, nothing to do) |

"Last activity" is read from the end of the conversation `.jsonl` log — not the session-file mtime — so long-running compiles or background watchers don't keep a session looking fresh.

## Commands

At a glance:

```bash
claude-cleanup                            # interactive picker
claude-cleanup --all                      # non-interactive, kill everything stale/dead
claude-cleanup --age 30m --clearCache     # stricter threshold, ignore cache

claude-cleanup monitor start              # background daemon: every 15m, age 2h
claude-cleanup monitor start --fg         # same but foreground (for debugging)
claude-cleanup monitor status             # is it running?
claude-cleanup monitor stop               # SIGTERM the daemon
claude-cleanup monitor reset              # stop + delete the log file
```

Full flag-by-flag reference is generated from the CLI itself and lives under [`docs/cli/`](./docs/cli/index.md). The monitor deep-dive (launchd/systemd recipes, troubleshooting, file layout) is in [`docs/monitor.md`](./docs/monitor.md).

Summaries are cached at `~/.claude/claude-cleanup-cache.json`, keyed on the conversation file + its mtime, so re-runs are fast and don't re-spend Haiku calls on unchanged sessions.

## Programmatic API

The same primitives the CLI uses are exported for scripting:

```ts
import {
  discoverSessions,
  classifySessions,
  isProcessRunning,
  killProcess,
  parseAge,
} from 'claude-cleanup';

const sessions = discoverSessions();
const classified = classifySessions(sessions, {
  isProcessRunning,
  maxAgeMs: parseAge('2h'),
});

for (const s of classified.filter((s) => s.status === 'stale')) {
  killProcess(s.pid);
}
```

Exported symbols:

- `discoverSessions(sessionsDir?)` — read `~/.claude/sessions/*.json`, returns `SessionInfo[]`
- `classifySessions(sessions, { isProcessRunning, maxAgeMs })` — tag each session `active | stale | dead`
- `isProcessRunning(pid)` — `kill -0` + `ps` check; confirms the PID is actually a `claude` process (PID-reuse guard)
- `killProcess(pid)` — `SIGTERM` wrapper that swallows errors
- `parseAge('30m' | '2h' | '1d')` — duration-string → ms
- `formatDuration(ms)`, `shortenPath(path)`, `assertPlatform()` — formatting/preflight helpers

## How session data is read

`~/.claude/sessions/<sessionId>.json` gives us the PID, cwd, and session id. The "last activity" timestamp comes from the last JSONL entry in the matching conversation log:

```
~/.claude/projects/<encoded-cwd>/<sessionId>.jsonl
```

where `<encoded-cwd>` is the cwd with `/` and `.` replaced by `-` (matching Claude Code's on-disk convention).

## Development

```bash
pnpm build        # tsc → dist/
pnpm test         # vitest
pnpm typecheck    # tsc --noEmit
pnpm run docs     # regenerate docs/cli/ from the built CLI
pnpm cli -- --help
```

## License

MIT © [Craigory Coppola](https://craigory.dev)
