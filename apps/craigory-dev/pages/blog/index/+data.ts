import { blogPosts } from '@new-personal-monorepo/blog-posts';
import { calculateReadingTimeFromPost } from '../../../src/utils/reading-time';

export async function data() {
  // Calculate reading times for all posts and return only serializable metadata
  const readingTimes = blogPosts.reduce((acc, post) => {
    const readingTimeMinutes = calculateReadingTimeFromPost(post);
    acc[post.slug] = readingTimeMinutes;
    return acc;
  }, {} as Record<string, number>);
  
  return {
    readingTimes
  };
}