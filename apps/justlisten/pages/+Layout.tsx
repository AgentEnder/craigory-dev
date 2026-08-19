import {
  ErrorBoundary,
  PageShell,
} from '@new-personal-monorepo/small-app-design-system';
import type { ReactNode } from 'react';

import { PreviewPlayerProvider } from '../src/components/PreviewPlayer';
import '../src/styles.css';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary>
      <PreviewPlayerProvider>
        <PageShell>{children}</PageShell>
      </PreviewPlayerProvider>
    </ErrorBoundary>
  );
}
