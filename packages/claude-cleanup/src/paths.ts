import { join } from 'node:path';
import { homedir } from 'node:os';

const CLAUDE_DIR = join(homedir(), '.claude');

export const MONITOR_PID_FILE = join(CLAUDE_DIR, 'claude-cleanup-monitor.pid');
export const MONITOR_LOG_FILE = join(CLAUDE_DIR, 'claude-cleanup-monitor.log');
