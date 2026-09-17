import type { ReactNode } from 'react';
import { cx } from './cx';

/**
 * Container width. The tool apps genuinely need all three: a single-output tool
 * like the QR generator reads better in a narrow column, editor-style apps with
 * side-by-side panes need the room, and a couple of them -- the tree generator
 * -- put monospace output in one of those panes, where the pane has to clear a
 * fixed column count or the output is simply not legible.
 */
export type PageWidth = 'narrow' | 'wide' | 'full';

const WIDTHS: Record<PageWidth, string> = {
  narrow: 'max-w-md',
  wide: 'max-w-4xl',
  // Past a laptop's viewport, so in practice this fills the screen and the cap
  // only bites on a very wide display, where an unbounded line would be worse.
  full: 'max-w-[110rem]',
};

interface PageShellProps {
  children: ReactNode;
  width?: PageWidth;
  className?: string;
}

export function PageShell({
  children,
  width = 'wide',
  className,
}: PageShellProps) {
  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className={cx(WIDTHS[width], 'mx-auto', className)}>{children}</div>
    </div>
  );
}
