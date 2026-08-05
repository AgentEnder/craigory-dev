import type { ReactNode } from 'react';
import { ErrorBoundary } from '@new-personal-monorepo/small-app-design-system';

export default function Layout({ children }: { children: ReactNode }) {
  return <ErrorBoundary>{children}</ErrorBoundary>;
}
