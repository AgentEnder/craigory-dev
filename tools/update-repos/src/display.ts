import { PassThrough } from 'node:stream';
import { emitKeypressEvents } from 'node:readline';

const ALT_SCREEN_ENTER = '\x1b[?1049h';
const ALT_SCREEN_EXIT = '\x1b[?1049l';
const CLEAR_SCREEN = '\x1b[2J';
const CURSOR_HOME = '\x1b[H';
const CURSOR_HIDE = '\x1b[?25l';
const CURSOR_SHOW = '\x1b[?25h';
const DIM = '\x1b[2m';
const RESET = '\x1b[0m';
const BOLD = '\x1b[1m';
const INVERSE = '\x1b[7m';

interface KeyInfo {
  name?: string;
  ctrl?: boolean;
  meta?: boolean;
  shift?: boolean;
  sequence?: string;
}

/**
 * A PassThrough stream that acts as stdin proxy for clack.
 *
 * We own process.stdin in raw mode and intercept detail-view keys
 * (spacebar, scroll keys). Everything else is forwarded to this
 * stream so clack can read it for prompts and spinners.
 *
 * The stream exposes isTTY and setRawMode so clack treats it like
 * a real TTY stdin.
 */
class StdinProxy extends PassThrough {
  isTTY = true;
  private _isRaw = false;

  setRawMode(mode: boolean): this {
    this._isRaw = mode;
    return this;
  }

  get isRaw(): boolean {
    return this._isRaw;
  }
}

/**
 * Manages an interactive detail-view toggle during command execution.
 *
 * Intercepts spacebar on process.stdin to toggle the alt-screen buffer.
 * All other keypresses are forwarded to a proxy stream that clack uses,
 * so spinners and prompts work normally.
 *
 * Scrolling (in detail view):
 *   Up/Down    — scroll one line
 *   PgUp/PgDn  — scroll one page
 *   Home/End   — jump to top/bottom
 *   g/G        — jump to top/bottom (vim-style)
 */
export class DetailView {
  private active = false;
  private outputLines: string[] = [];
  private maxBufferLines = 10000;
  private label = '';
  private listening = false;
  private installed = false;

  /** Scroll offset: index of the first visible line in the buffer. */
  private scrollOffset = 0;
  /** Whether we're auto-following (scrolled to bottom). */
  private following = true;

  /** Proxy stream that clack reads from instead of process.stdin. */
  readonly stdinProxy = new StdinProxy();

  /** The real stdin, saved before we replace process.stdin. */
  private realStdin: typeof process.stdin | null = null;

  /**
   * Install the keypress interceptor.
   *
   * Replaces process.stdin with our proxy PassThrough so that clack
   * (and anything else using process.stdin) reads from the proxy.
   * We listen on the real stdin, intercept detail-view keys, and
   * forward everything else to the proxy.
   *
   * Call once at CLI startup, before any clack prompts.
   */
  install(): void {
    if (this.installed || !process.stdin.isTTY) return;
    this.installed = true;

    // Save and replace process.stdin
    this.realStdin = process.stdin;

    // Replace process.stdin with our proxy so clack reads from it
    Object.defineProperty(process, 'stdin', {
      value: this.stdinProxy,
      writable: true,
      configurable: true,
    });

    // Set up raw mode on the real stdin
    this.realStdin.setRawMode(true);
    this.realStdin.resume();
    emitKeypressEvents(this.realStdin);

    this.realStdin.on('keypress', (str: string, key: KeyInfo) => {
      // Always forward Ctrl+C so the process can exit
      if (key?.name === 'c' && key?.ctrl) {
        if (this.active) this.leaveAltScreen();
        if (key.sequence) this.stdinProxy.write(key.sequence);
        return;
      }

      // When detail view is active, consume all keys for scrolling
      if (this.active) {
        this.handleDetailViewKey(str, key);
        return;
      }

      // When a command is running, intercept toggle keys to open detail view
      if (
        this.listening &&
        (key?.name === 'space' ||
          key?.name === 'return' ||
          key?.name === 'escape')
      ) {
        this.enterAltScreen();
        return;
      }

      // Forward everything else to the proxy for clack (prompts, spinners)
      if (key?.sequence) {
        this.stdinProxy.write(key.sequence);
      } else if (str) {
        this.stdinProxy.write(str);
      }
    });
  }

  /**
   * Start buffering output for a command. Enables spacebar toggle.
   */
  start(label: string): void {
    this.label = label;
    this.outputLines = [];
    this.scrollOffset = 0;
    this.following = true;
    this.listening = true;
  }

  /**
   * Stop buffering. Disables spacebar toggle and exits alt-screen if open.
   */
  stop(): void {
    this.listening = false;
    if (this.active) {
      this.leaveAltScreen();
    }
  }

  /**
   * Feed output data from a running command.
   */
  write(chunk: string): void {
    const newLines = chunk.split('\n');

    if (this.outputLines.length > 0 && newLines.length > 0) {
      this.outputLines[this.outputLines.length - 1] += newLines[0];
      for (let i = 1; i < newLines.length; i++) {
        this.outputLines.push(newLines[i]);
      }
    } else {
      this.outputLines.push(...newLines);
    }

    while (this.outputLines.length > this.maxBufferLines) {
      this.outputLines.shift();
      if (this.scrollOffset > 0) this.scrollOffset--;
    }

    if (this.active && this.following) {
      this.scrollToBottom();
      this.redraw();
    }
  }

  get isActive(): boolean {
    return this.active;
  }

  private get contentRows(): number {
    return (process.stdout.rows ?? 24) - 3;
  }

  private handleDetailViewKey(str: string, key: KeyInfo): void {
    if (!key) return;

    // Space, Enter, or Escape exits detail view
    if (
      key.name === 'space' ||
      key.name === 'return' ||
      key.name === 'escape'
    ) {
      this.leaveAltScreen();
      return;
    }

    switch (key.name) {
      case 'up':
        this.scroll(-1);
        break;
      case 'down':
        this.scroll(1);
        break;
      case 'pageup':
        this.scroll(-this.contentRows);
        break;
      case 'pagedown':
        this.scroll(this.contentRows);
        break;
      case 'home':
        this.scrollToTop();
        this.redraw();
        break;
      case 'end':
        this.scrollToBottom();
        this.redraw();
        break;
    }

    // Vim-style
    if (str === 'g') {
      this.scrollToTop();
      this.redraw();
    } else if (str === 'G') {
      this.scrollToBottom();
      this.redraw();
    }
  }

  private scroll(delta: number): void {
    const maxOffset = Math.max(
      0,
      this.outputLines.length - this.contentRows
    );
    this.scrollOffset = Math.max(
      0,
      Math.min(maxOffset, this.scrollOffset + delta)
    );
    this.following = this.scrollOffset >= maxOffset;
    this.redraw();
  }

  private scrollToTop(): void {
    this.scrollOffset = 0;
    this.following = false;
  }

  private scrollToBottom(): void {
    const maxOffset = Math.max(
      0,
      this.outputLines.length - this.contentRows
    );
    this.scrollOffset = maxOffset;
    this.following = true;
  }

  private enterAltScreen(): void {
    this.active = true;
    process.stdout.write(ALT_SCREEN_ENTER + CURSOR_HIDE);
    this.scrollToBottom();
    this.redraw();
  }

  private leaveAltScreen(): void {
    this.active = false;
    process.stdout.write(CURSOR_SHOW + ALT_SCREEN_EXIT);
  }

  private redraw(): void {
    const rows = process.stdout.rows ?? 24;
    const cols = process.stdout.columns ?? 80;
    const contentRows = this.contentRows;

    process.stdout.write(CLEAR_SCREEN + CURSOR_HOME);

    // Header
    const header = ` ${BOLD}${this.label}${RESET}`;
    process.stdout.write(header + '\n');
    process.stdout.write(DIM + '─'.repeat(cols) + RESET + '\n');

    // Content
    const visibleLines = this.outputLines.slice(
      this.scrollOffset,
      this.scrollOffset + contentRows
    );

    for (let i = 0; i < contentRows; i++) {
      const line = visibleLines[i];
      if (line !== undefined) {
        process.stdout.write(line.slice(0, cols));
      }
      if (i < contentRows - 1) {
        process.stdout.write('\n');
      }
    }

    // Footer
    const totalLines = this.outputLines.length;
    const currentLine = Math.min(
      this.scrollOffset + contentRows,
      totalLines
    );
    const position =
      totalLines > 0
        ? `${this.scrollOffset + 1}–${currentLine} of ${totalLines}`
        : 'empty';
    const followIndicator = this.following ? ' [following]' : '';
    const statusText = ` ${position}${followIndicator}  ${DIM}↑↓ scroll │ PgUp/PgDn page │ g/G top/bottom │ Space/Enter/Esc close${RESET}`;

    process.stdout.write(`\x1b[${rows};1H`);
    process.stdout.write(INVERSE + statusText.padEnd(cols) + RESET);
  }
}

/**
 * Singleton detail view instance shared across the CLI.
 */
export const detailView = new DetailView();
