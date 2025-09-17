import { PageShell } from './PageShell';
import { PropsWithChildren } from 'react';

export function Layout({ children }: PropsWithChildren) {
  return <PageShell>{children}</PageShell>;
}
