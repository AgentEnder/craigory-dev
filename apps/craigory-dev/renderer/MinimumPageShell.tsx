import { PageContext } from '@new-personal-monorepo/vike-utils';
import React from 'react';

export function MinimumPageShell({
  children,
  pageContext,
}: {
  children: React.ReactNode;
  pageContext: PageContext;
}) {
  return <React.StrictMode>{children}</React.StrictMode>;
}
