import { ViewPresentation } from '@new-personal-monorepo/presentations';
import { usePageContext } from '@new-personal-monorepo/vite-plugin-ssr-utils';
import { useEffect, useState } from 'react';

export const documentProps = {
  title: 'Craigory Coppola - View Presentation',
}

export function Page() {
  const context = usePageContext();
  const [presentation, setPresentation] = useState<string | undefined>();
  useEffect(() => {
    setPresentation(context?.routeParams?.['presentation']);
  }, [context]);
  return presentation ? (
    <ViewPresentation presentationSlug={presentation}></ViewPresentation>
  ) : (
    <div>Hello?</div>
  );
}
