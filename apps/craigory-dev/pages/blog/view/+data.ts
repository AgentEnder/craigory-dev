import { slugMap } from '@new-personal-monorepo/blog-posts';
import { calculateReadingTimeFromPost } from '../../../src/utils/reading-time';

interface PageContext {
  routeParams?: {
    slug?: string;
  };
}

export async function data(pageContext: PageContext) {
  const slug = pageContext.routeParams?.slug;
  
  if (!slug) {
    throw new Error('No slug provided');
  }

  const post = slugMap[slug];
  
  if (!post) {
    throw new Error(`Post not found: ${slug}`);
  }

  // Calculate reading time directly from the post's MDX content
  const readingTimeMinutes = calculateReadingTimeFromPost(post);

  // Return only serializable metadata
  return {
    readingTimeMinutes,
    slug
  };
}