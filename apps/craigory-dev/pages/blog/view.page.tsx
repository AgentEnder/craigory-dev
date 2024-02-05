import { slugMap } from '@new-personal-monorepo/blog-posts';
import { usePageContext } from '@new-personal-monorepo/vike-utils';

import './view.page.scss';
import { CodeWrapper } from './code-wrapper';
import { useEffect, useState } from 'react';

export function Page() {
  const pageContext = usePageContext();

  const blogPost = pageContext.routeParams?.slug;
  const [returnLink, setReturnLink] = useState<string | undefined>();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get('ref');
    if (ref) {
      setReturnLink(ref);
    }
  }, [])

  if (!blogPost) {
    throw new Error();
  }

  const data = slugMap[blogPost];

  return (
    <>
      {returnLink ? <a href={returnLink}>Return to previous page</a> : null}
      {data.mdx({
        components: {
          pre: CodeWrapper,
        },
      })}
      {returnLink ? <a href={returnLink}>Return to previous page</a> : null}
    </>
  );
}
