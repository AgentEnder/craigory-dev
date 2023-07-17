import {
  PageContext,
  PageContextProvider,
} from '@new-personal-monorepo/vite-plugin-ssr-utils';
import React from 'react';

export function MinimumPageShell({
  children,
  pageContext,
}: {
  children: React.ReactNode;
  pageContext: PageContext;
}) {
  return (
    <React.StrictMode>
      <PageContextProvider pageContext={pageContext}>
        {children}
      </PageContextProvider>
    </React.StrictMode>
  )
}
