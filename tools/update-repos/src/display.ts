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
}

/**
 * Manages an interactive detail-view toggle during command execution.
 *
 * While a command runs, the user can press Enter to switch into the
 * terminal's alternate screen buffer showing full buffered command
 * output with scroll support, and press Escape/Enter to return.
 *
 * Scrolling:
 *   Up/Down    — scroll one line
 *   PgUp/PgDn  — scroll one page
 *   Home/End   — jump to top/bottom
 *   g/G        — jump to top/bottom (vim-style)
 *
 * The view auto-follows new output when scrolled to the bottom.
 */
export class DetailView {
  private active = false;
  private outputLines: string[] = [];
  private maxBufferLines = 10000;
  private label = '';
  private keypressHandler: ((str: string, key: KeyInfo) => void) | null = null;
  private rawModeWas: boolean | null = null;
  private keypressInitialized = false;

  /** Scroll offset: index of the first visible line in the buffer. */
  private scrollOffset = 0;
  /** Whether we're auto-following (scrolled to bottom). */
  private following = true;

  /**
   * Start listening for the toggle keypress.
   * Call this before running a command.
   */
  start(label: string): void {
    this.label = label;
    this.outputLines = [];
    this.scrollOffset = 0;
    this.following = true;
    this.installKeypressListener();
  }

  /**
   * Stop listening and ensure we're back on the main screen.
   */
  stop(): void {
    if (this.active) {
      this.leaveAltScreen();
    }
    this.removeKeypressListener();
  }

  /**
   * Feed output data from a running command.
   * Buffers all output. If the detail view is active and we're
   * following (scrolled to bottom), redraws to show new content.
   */
  write(chunk: string): void {
    const newLines = chunk.split('\n');

    // Merge the last buffered line with the first new chunk
    // (handles partial line writes)
    if (this.outputLines.length > 0 && newLines.length > 0) {
      this.outputLines[this.outputLines.length - 1] += newLines[0];
      for (let i = 1; i < newLines.length; i++) {
        this.outputLines.push(newLines[i]);
      }
    } else {
      this.outputLines.push(...newLines);
    }

    // Trim buffer if it exceeds max
    while (this.outputLines.length > this.maxBufferLines) {
      this.outputLines.shift();
      if (this.scrollOffset > 0) this.scrollOffset--;
    }

    if (this.active) {
      if (this.following) {
        // Auto-scroll to bottom and redraw
        this.scrollToBottom();
        this.redraw();
      }
      // If user has scrolled up, don't auto-scroll — they're reading
    }
  }

  get isActive(): boolean {
    return this.active;
  }

  private get contentRows(): number {
    return (process.stdout.rows ?? 24) - 3; // header + separator + footer
  }

  private installKeypressListener(): void {
    if (!process.stdin.isTTY) return;

    if (!this.keypressInitialized) {
      emitKeypressEvents(process.stdin);
      this.keypressInitialized = true;
    }

    this.rawModeWas = process.stdin.isRaw ?? false;
    process.stdin.setRawMode(true);
    process.stdin.resume();

    this.keypressHandler = (_str: string, key: KeyInfo) => {
      if (!key) return;

      // Ctrl+C exits the process
      if (key.name === 'c' && key.ctrl) {
        this.stop();
        process.exit(130);
      }

      if (!this.active) {
        // Enter opens detail view, everything else is ignored
        if (key.name === 'return') {
          this.enterAltScreen();
        }
        return;
      }

      // Escape only exits detail view, never cancels the process
      if (key.name === 'escape') {
        this.leaveAltScreen();
        return;
      }

      // --- Keys active in detail view ---
      switch (key.name) {
        case 'return':
          this.leaveAltScreen();
          break;

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

      // Vim-style: g = top, G = bottom
      if (_str === 'g') {
        this.scrollToTop();
        this.redraw();
      } else if (_str === 'G') {
        this.scrollToBottom();
        this.redraw();
      }
    };

    process.stdin.on('keypress', this.keypressHandler);
  }

  private removeKeypressListener(): void {
    if (this.keypressHandler) {
      process.stdin.removeListener('keypress', this.keypressHandler);
      this.keypressHandler = null;
    }
    if (process.stdin.isTTY && this.rawModeWas !== null) {
      process.stdin.setRawMode(this.rawModeWas);
      this.rawModeWas = null;
    }
    process.stdin.unref();
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
    // Start at the bottom to show the most recent output
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

    // --- Header ---
    const header = ` ${BOLD}${this.label}${RESET}`;
    process.stdout.write(header + '\n');
    process.stdout.write(DIM + '─'.repeat(cols) + RESET + '\n');

    // --- Content ---
    const visibleLines = this.outputLines.slice(
      this.scrollOffset,
      this.scrollOffset + contentRows
    );

    for (let i = 0; i < contentRows; i++) {
      const line = visibleLines[i];
      if (line !== undefined) {
        // Truncate to terminal width
        process.stdout.write(line.slice(0, cols));
      }
      if (i < contentRows - 1) {
        process.stdout.write('\n');
      }
    }

    // --- Footer (status bar) ---
    const totalLines = this.outputLines.length;
    const currentLine = Math.min(
      this.scrollOffset + contentRows,
      totalLines
    );
    const position = totalLines > 0
      ? `${this.scrollOffset + 1}–${currentLine} of ${totalLines}`
      : 'empty';
    const followIndicator = this.following ? ' [following]' : '';
    const statusText = ` ${position}${followIndicator}  ${DIM}↑↓ scroll │ PgUp/PgDn page │ g/G top/bottom │ Enter/Esc close${RESET}`;

    // Move to last row
    process.stdout.write(`\x1b[${rows};1H`);
    process.stdout.write(INVERSE + statusText.padEnd(cols) + RESET);
  }
}

/**
 * Singleton detail view instance shared across the CLI.
 */
export const detailView = new DetailView();
