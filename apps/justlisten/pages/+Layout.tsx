import {
  ErrorBoundary,
  PageShell,
} from '@new-personal-monorepo/small-app-design-system';
import type { ReactNode } from 'react';

import '../src/styles.css';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary>
      <PageShell>{children}</PageShell>
    </ErrorBoundary>
  );
}
