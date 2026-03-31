import {
  appendFileSync,
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
 *
 * Registers a process 'exit' handler to ensure the log is closed
 * even if clack or another library calls process.exit() directly.
 */
class Logger {
  private stream: WriteStream | null = null;
  private _logPath: string = '';
  private startTime: number = 0;
  private closed = false;

  get logPath(): string {
    return this._logPath;
  }

  /**
   * Open the log file. Call once at CLI startup.
   * Registers an exit handler to flush + close the log on any exit.
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
    this.closed = false;

    this.info('='.repeat(60));
    this.info(`update-repos started at ${new Date().toISOString()}`);
    this.info('='.repeat(60));

    // Ensure log is closed on any exit (including clack's process.exit(0)).
    // Only prints log path if we haven't already closed cleanly.
    process.on('exit', (code) => {
      if (!this.closed) {
        this.closeSync(`process.exit(${code})`);
        if (this._logPath) {
          process.stderr.write(`Log: ${this._logPath}\n`);
        }
      }
    });
  }

  private formatLine(level: string, message: string): string {
    const elapsed = ((Date.now() - this.startTime) / 1000).toFixed(1);
    return `[${elapsed}s] [${level}] ${message}\n`;
  }

  private write(level: string, message: string): void {
    if (!this.stream || this.closed) return;
    this.stream.write(this.formatLine(level, message));
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
    if (!this.stream || this.closed) return;
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
   * Write a shutdown summary and close the log file (async stream).
   * Use this during normal shutdown when the event loop is still running.
   */
  close(reason: string = 'normal exit'): void {
    if (this.closed) return;
    this.closed = true;
    if (!this.stream) return;
    const elapsed = ((Date.now() - this.startTime) / 1000).toFixed(1);
    this.stream.write(this.formatLine('INFO', '='.repeat(60)));
    this.stream.write(
      this.formatLine('INFO', `update-repos ended: ${reason} (${elapsed}s total)`)
    );
    this.stream.write(this.formatLine('INFO', '='.repeat(60)));
    this.stream.end();
    this.stream = null;
  }

  /**
   * Synchronous close for use in process 'exit' handlers where
   * async I/O is not available. Uses appendFileSync directly.
   */
  private closeSync(reason: string): void {
    if (this.closed) return;
    this.closed = true;
    if (this.stream) {
      this.stream.end();
      this.stream = null;
    }
    if (!this._logPath) return;
    try {
      const elapsed = ((Date.now() - this.startTime) / 1000).toFixed(1);
      const footer = [
        this.formatLine('INFO', '='.repeat(60)),
        this.formatLine('INFO', `update-repos ended: ${reason} (${elapsed}s total)`),
        this.formatLine('INFO', '='.repeat(60)),
      ].join('');
      appendFileSync(this._logPath, footer);
    } catch {
      // Best effort — process is exiting
    }
  }
}

/** Singleton logger instance. */
export const logger = new Logger();
