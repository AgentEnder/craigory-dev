import {
  slugMap,
  Callout,
  Citations,
  CitationsProvider,
  Cite,
  CodeWrapper,
  LinkToPost,
  PostContext,
  Quote,
  Tab,
  Tabs,
  TikiTable,
} from '@new-personal-monorepo/blog-posts';
import { RelatedContent } from '@new-personal-monorepo/related-content';
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
  const hookData = pageContext.data as
    | { readingTimeMinutes?: number; slug?: string }
    | undefined;
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
  const postData = readingTimeMinutes
    ? { ...basePost, readingTimeMinutes }
    : basePost;

  return (
    <>
      <PostContext.Provider value={postData}>
        <div className={`blog-post-theme ${getPostThemeClass(postData)}`}>
          <BlogPostEnhanced>
            <CitationsProvider>
            {postData.mdx({
              components: {
                h1: BlogH1,
                pre: CodeWrapper,
                Anchor: ContentMarker,
                Callout,
                Citations,
                Cite,
                LinkToPost,
                Quote,
                Tab,
                Tabs,
                TikiTable,
              },
            })}
            </CitationsProvider>
          </BlogPostEnhanced>
        </div>
        {/* Outside the themed wrapper so a tiki post's palette does not bleed
            onto links pointing at technical content. */}
        <RelatedContent type="blog" slug={blogPost} />
      </PostContext.Provider>
      {returnLink ? (
        <div className="return-link-bottom">
          <Link href={returnLink}>← Return to previous page</Link>
        </div>
      ) : null}
    </>
  );
}
