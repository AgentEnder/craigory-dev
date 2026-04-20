# Monitor Daemon

The `claude-cleanup monitor` subcommand runs cleanup on a schedule so you never have to remember to do it yourself. It's a thin, detached Node process that wakes up on an interval, runs the same `--all` cleanup the CLI does, and appends a timestamped line per cycle to a log file.

## Subcommands

| Command                          | Does                                                                    |
| -------------------------------- | ----------------------------------------------------------------------- |
| `claude-cleanup monitor start`   | Fork a detached daemon. Errors out if one is already running.           |
| `claude-cleanup monitor stop`    | Send `SIGTERM` and wait up to 5s for the PID file to disappear.         |
| `claude-cleanup monitor status`  | Print the PID + log-file size, or tell you nothing is running.          |
| `claude-cleanup monitor reset`   | `stop`, then delete the log file. Useful when the log grew unexpectedly. |

### `start` options

| Flag              | Default | Description                                           |
| ----------------- | ------- | ----------------------------------------------------- |
| `--interval <v>`  | `15m`   | How often to run a cleanup cycle                      |
| `--age <v>`       | `2h`    | Staleness threshold, same format as the top-level CLI |
| `--foreground`    | `false` | Don't detach — inherit stdio. Alias: `--fg`           |

Example — aggressive settings while debugging:

```bash
claude-cleanup monitor start --interval 1m --age 10m --fg
```

## File layout

The daemon keeps two files next to your Claude config:

| File                                           | Role                                                       |
| ---------------------------------------------- | ---------------------------------------------------------- |
| `~/.claude/claude-cleanup-monitor.pid`         | PID of the running daemon. Removed on `SIGTERM` / `exit`.  |
| `~/.claude/claude-cleanup-monitor.log`         | Append-only log, one line per cycle.                       |

Both paths are exported from the package for callers that want to tail/monitor them from elsewhere:

```ts
import { MONITOR_PID_FILE, MONITOR_LOG_FILE } from 'claude-cleanup';
```

Log output looks like:

```
[2026-04-20T14:15:00.123Z] ═══════════════════════════════════════════════
[2026-04-20T14:15:00.124Z] claude-cleanup monitor started
[2026-04-20T14:15:00.124Z]   PID:      12345
[2026-04-20T14:15:00.124Z]   Interval: 15m
[2026-04-20T14:15:00.124Z]   Age:      2h
[2026-04-20T14:15:00.124Z] ═══════════════════════════════════════════════
[2026-04-20T14:15:00.310Z] [killed] PID 99123 — stale 3h 14m — ~/projects/foo
[2026-04-20T14:15:00.312Z] Cycle complete. Killed 1, skipped 0 dead.
```

## Lifecycle details

- **Detaching.** `monitor start` spawns the daemon with `detached: true` and `stdio` pointed at the log file, then calls `unref()` so your shell can exit without killing it.
- **PID file discipline.** The daemon writes its PID on startup and clears it on `SIGTERM` or normal exit. Restart-after-crash works because subsequent `start` invocations use `process.kill(pid, 0)` to check whether the PID file is stale, and clean it up if the process is gone.
- **Shutdown.** `stop` sends `SIGTERM`, the daemon clears its interval and removes the PID file inside the signal handler, and then `stop` polls the PID file for up to 5 seconds before printing a warning.
- **No auto-restart.** This is deliberately dumb — if the host reboots, you need to start it again. If you want supervision, wire it up with launchd / systemd / `pm2`; the daemon emits exit codes and stays on stderr in `--fg` mode.

## Scheduling with launchd / systemd

If you'd rather let the OS supervise it instead of running it detached, pair `monitor start --fg` with a launchd agent (macOS) or user-level systemd service (Linux). An outline:

**macOS — `~/Library/LaunchAgents/dev.craigory.claude-cleanup.plist`:**

```xml
<key>ProgramArguments</key>
<array>
  <string>/usr/local/bin/claude-cleanup</string>
  <string>monitor</string>
  <string>start</string>
  <string>--fg</string>
  <string>--interval</string>
  <string>15m</string>
  <string>--age</string>
  <string>2h</string>
</array>
<key>RunAtLoad</key><true/>
<key>KeepAlive</key><true/>
```

Load it with `launchctl load ~/Library/LaunchAgents/dev.craigory.claude-cleanup.plist`.

**Linux — `~/.config/systemd/user/claude-cleanup.service`:**

```ini
[Unit]
Description=claude-cleanup monitor

[Service]
ExecStart=/usr/bin/env claude-cleanup monitor start --fg --interval 15m --age 2h
Restart=on-failure

[Install]
WantedBy=default.target
```

Enable with `systemctl --user enable --now claude-cleanup`.

## Troubleshooting

- **"Monitor is already running"** when you're sure it isn't: delete `~/.claude/claude-cleanup-monitor.pid` or run `claude-cleanup monitor reset`. The daemon cleans this up itself on normal exit, but a `kill -9` will leave it behind.
- **Log file growing too fast**: lower the interval (`--interval 1h`), or rotate the file with `logrotate` pointing at `~/.claude/claude-cleanup-monitor.log`. `monitor reset` is the nuclear option.
- **Sessions aren't being killed**: run the foreground CLI with the same age threshold — `claude-cleanup --age 2h` — and confirm the sessions show up as `stale` rather than `active`. Remember that "age" is measured from the last line in the JSONL conversation log, not the session-file mtime.
