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

export function getPostThemeClass(post: BlogPost): string {
  // Primary theme class - first matching theme
  if (post.tags.includes('tiki')) return 'theme-tiki';
  if (post.tags.includes('technical')) return 'theme-technical';
  if (post.tags.includes('review')) return 'theme-review';
  return 'theme-default';
}