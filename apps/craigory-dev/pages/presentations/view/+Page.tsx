import { ViewPresentation } from '@new-personal-monorepo/presentations';
import { usePageContext } from 'vike-react/usePageContext';
import { useEffect, useState } from 'react';

export function Page() {
  const context = usePageContext();
  const [presentation, setPresentation] = useState<string | undefined>();
  useEffect(() => {
    setPresentation(context?.routeParams?.['presentation']);
  }, [context]);
  return presentation ? (
    <ViewPresentation presentationSlug={presentation}></ViewPresentation>
  ) : (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <></>
  );
}
