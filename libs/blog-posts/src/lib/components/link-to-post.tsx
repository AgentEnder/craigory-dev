import { useContext } from 'react';
import { BlogPost } from '../blog-post';
import { slugMap } from '../posts';
import { getBlogUrl } from '../utils/get-blog-url';
import { PostContext } from './post-context';

export function LinkToPost({ slug, ref }: { slug: string; ref?: string }) {
  const referringBlogPost = useContext(PostContext);
  ref ??= (() => {
    if (referringBlogPost) {
      return getBlogUrl(referringBlogPost);
    }
    return undefined;
  })();

  const post = slugMap[slug];
  return (
    <a href={`${getBlogUrl(post)}${ref ? `?ref=${ref}` : ''}`}>
      <a className="text-blue-600 hover:underline">{post.title}</a>
    </a>
  );
}
