import {
  slugMap,
  CodeWrapper,
  LinkToPost,
  PostContext,
  TikiTable,
} from '@new-personal-monorepo/blog-posts';
import { usePageContext } from 'vike-react/usePageContext';

import './view.page.scss';
import { useEffect, useState } from 'react';
import { ContentMarker } from '../../../src/shared-components/content-marker';
import { Link } from '../../../renderer/Link';
import { BlogPostEnhanced } from './BlogPostEnhanced';
import { BlogH1 } from './BlogH1';
import { getPostThemeClass } from '../../../src/utils/post-theming';

export function Page() {
  const pageContext = usePageContext();
  const hookData = pageContext.data as { readingTimeMinutes?: number; slug?: string } | undefined;
  const { readingTimeMinutes } = hookData || {};

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

  // Get post data from slugMap and merge with reading time from data hook
  const basePost = slugMap[blogPost];
  const postData = readingTimeMinutes ? { ...basePost, readingTimeMinutes } : basePost;

  return (
    <>
      {returnLink ? (
        <div className="return-link-top">
          <Link href={returnLink}>
            ← Return to previous page
          </Link>
        </div>
      ) : null}
      <PostContext.Provider value={postData}>
        <div className={`blog-post-theme ${getPostThemeClass(postData)}`}>
          <BlogPostEnhanced>
            {postData.mdx({
              components: {
                h1: BlogH1,
                pre: CodeWrapper,
                Anchor: ContentMarker,
                LinkToPost,
                TikiTable,
              },
            })}
          </BlogPostEnhanced>
        </div>
      </PostContext.Provider>
      {returnLink ? (
        <div className="return-link-bottom">
          <Link href={returnLink}>
            ← Return to previous page
          </Link>
        </div>
      ) : null}
    </>
  );
}
