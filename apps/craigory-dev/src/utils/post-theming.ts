import { BlogPost } from '@new-personal-monorepo/blog-posts';

export function getPostThemeClasses(post: BlogPost): string {
  const classes: string[] = [];
  
  // Add theme classes based on tags
  if (post.tags.includes('tiki')) {
    classes.push('theme-tiki');
  }
  
  if (post.tags.includes('technical')) {
    classes.push('theme-technical');
  }
  
  if (post.tags.includes('review')) {
    classes.push('theme-review');
  }
  
  return classes.join(' ');
}

/**
 * The palettes a post can be rendered in. Named rather than `string` so the
 * social card generator can key its own palette table off the same set and fail
 * to compile if a theme is added here without one.
 */
export type PostThemeClass =
  | 'theme-tiki'
  | 'theme-technical'
  | 'theme-review'
  | 'theme-default';

export function getPostThemeClass(post: BlogPost): PostThemeClass {
  // Primary theme class - first matching theme
  if (post.tags.includes('tiki')) return 'theme-tiki';
  if (post.tags.includes('technical')) return 'theme-technical';
  if (post.tags.includes('review')) return 'theme-review';
  return 'theme-default';
}