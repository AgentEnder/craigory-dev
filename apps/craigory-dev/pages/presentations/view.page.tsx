import { ViewPresentation } from '@new-personal-monorepo/presentations';
import { usePageContext } from '@new-personal-monorepo/vite-plugin-ssr-utils';
import { useEffect, useState } from 'react';

export function Page() {
  const context = usePageContext();
  const [mdUrl, setMdUrl] = useState<string | undefined>();
  useEffect(() => {
    setMdUrl(context?.routeParams?.['mdUrl']);
  }, [context]);
  return mdUrl ? (
    <ViewPresentation mdUrl={mdUrl}></ViewPresentation>
  ) : (
    <div>Hello?</div>
  );
}
