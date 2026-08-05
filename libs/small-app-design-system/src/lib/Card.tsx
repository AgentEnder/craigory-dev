import type { HTMLAttributes, ReactNode } from 'react';
import { cx } from './cx';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function Card({ children, className, ...rest }: CardProps) {
  return (
    <div
      className={cx(
        'bg-white rounded-3xl p-6 border border-gray-100 animate-fade-in',
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
}
