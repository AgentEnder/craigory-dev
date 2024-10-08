import {
  slugMap,
  CodeWrapper,
  LinkToPost,
  PostContext,
} from '@new-personal-monorepo/blog-posts';
import { usePageContext } from 'vike-react/usePageContext';

import './view.page.scss';
import { useEffect, useState } from 'react';
import { ContentMarker } from '../../../src/shared-components/content-marker';
import { Link } from '../../../renderer/Link';

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
  }, []);

  if (!blogPost) {
    throw new Error();
  }

  const data = slugMap[blogPost];

  return (
    <>
      {returnLink ? (
        <Link href={returnLink}>Return to previous page</Link>
      ) : null}
      <PostContext.Provider value={data}>
        {data.mdx({
          components: {
            pre: CodeWrapper,
            Anchor: ContentMarker,
            LinkToPost,
          },
        })}
      </PostContext.Provider>
      {returnLink ? (
        <Link href={returnLink}>Return to previous page</Link>
      ) : null}
    </>
  );
}
