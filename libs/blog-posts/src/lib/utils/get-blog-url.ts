import { BlogPost } from '../blog-post';
export function getBlogUrl(blogPost: Pick<BlogPost, 'publishDate' | 'slug'>) {
  return `/blog/${formatDateString(blogPost.publishDate)}/${blogPost.slug}`;
}

function formatDateString(date: Date): string {
  return date.toISOString().replace(/T.*/, '');
}
