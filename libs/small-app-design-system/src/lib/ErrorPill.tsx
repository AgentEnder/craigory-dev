import type { ReactNode } from 'react';
import { cx } from './cx';

interface ErrorPillProps {
  children: ReactNode;
  className?: string;
}

export function ErrorPill({ children, className }: ErrorPillProps) {
  return (
    <div
      role="alert"
      className={cx(
        'px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 animate-fade-in',
        className
      )}
    >
      {children}
    </div>
  );
}
