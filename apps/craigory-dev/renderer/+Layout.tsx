import { usePageContext } from 'vike-react/usePageContext';
import { PageShell } from './PageShell';
import { PropsWithChildren } from 'react';
import { MinimumPageShell } from './MinimumPageShell';

export function Layout({ children }: PropsWithChildren) {
  const pageContext = usePageContext();

  return pageContext.urlPathname.includes('presentations/view') ? (
    <MinimumPageShell pageContext={pageContext as any}>
      {children}
    </MinimumPageShell>
  ) : (
    <PageShell pageContext={pageContext as any}>{children}</PageShell>
  );
}
