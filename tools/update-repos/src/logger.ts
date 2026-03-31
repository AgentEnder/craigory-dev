import {
  createWriteStream,
  mkdirSync,
  type WriteStream,
} from 'node:fs';
import { join } from 'node:path';
import { homedir } from 'node:os';

const CONFIG_DIR = join(homedir(), '.config', 'update-repos');
const LOG_DIR = join(CONFIG_DIR, 'logs');

/**
 * File logger that writes all progress, errors, and command output
 * to a timestamped log file under ~/.config/update-repos/logs/.
 */
class Logger {
  private stream: WriteStream | null = null;
  private _logPath: string = '';
  private startTime: number = 0;

  get logPath(): string {
    return this._logPath;
  }

  /**
   * Open the log file. Call once at CLI startup.
   */
  open(): void {
    mkdirSync(LOG_DIR, { recursive: true });
    const timestamp = new Date()
      .toISOString()
      .replace(/[:.]/g, '-')
      .replace('T', '_')
      .replace('Z', '');
    this._logPath = join(LOG_DIR, `update-repos-${timestamp}.log`);
    this.stream = createWriteStream(this._logPath, { flags: 'a' });
    this.startTime = Date.now();

    this.info('='.repeat(60));
    this.info(`update-repos started at ${new Date().toISOString()}`);
    this.info('='.repeat(60));
  }

  /**
   * Write a log entry with a timestamp and level prefix.
   */
  private write(level: string, message: string): void {
    if (!this.stream) return;
    const elapsed = ((Date.now() - this.startTime) / 1000).toFixed(1);
    const line = `[${elapsed}s] [${level}] ${message}\n`;
    this.stream.write(line);
  }

  info(message: string): void {
    this.write('INFO', message);
  }

  warn(message: string): void {
    this.write('WARN', message);
  }

  error(message: string): void {
    this.write('ERROR', message);
  }

  step(message: string): void {
    this.write('STEP', message);
  }

  /**
   * Write raw command output to the log (for debugging).
   */
  output(label: string, stdout: string, stderr: string): void {
    if (!this.stream) return;
    if (stdout) {
      this.write('STDOUT', `[${label}]`);
      this.stream.write(stdout);
      if (!stdout.endsWith('\n')) this.stream.write('\n');
    }
    if (stderr) {
      this.write('STDERR', `[${label}]`);
      this.stream.write(stderr);
      if (!stderr.endsWith('\n')) this.stream.write('\n');
    }
  }

  /**
   * Write a shutdown summary and close the log file.
   */
  close(reason: string = 'normal exit'): void {
    if (!this.stream) return;
    const elapsed = ((Date.now() - this.startTime) / 1000).toFixed(1);
    this.info('='.repeat(60));
    this.info(`update-repos ended: ${reason} (${elapsed}s total)`);
    this.info('='.repeat(60));
    this.stream.end();
    this.stream = null;
  }
}

/** Singleton logger instance. */
export const logger = new Logger();
