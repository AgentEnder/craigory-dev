import type { ReactNode } from 'react';
import { ErrorBoundary } from '../components/ErrorBoundary';

export default function Layout({ children }: { children: ReactNode }) {
  return <ErrorBoundary>{children}</ErrorBoundary>;
}
