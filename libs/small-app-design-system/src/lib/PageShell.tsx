import type { ReactNode } from 'react';
import { cx } from './cx';

/**
 * Container width. The tool apps genuinely need both: a single-output tool like
 * the QR generator reads better in a narrow column, while editor-style apps with
 * side-by-side panes need the room.
 */
export type PageWidth = 'narrow' | 'wide';

const WIDTHS: Record<PageWidth, string> = {
  narrow: 'max-w-md',
  wide: 'max-w-4xl',
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
