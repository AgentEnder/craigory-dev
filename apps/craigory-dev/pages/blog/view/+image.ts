import { slugMap } from '@new-personal-monorepo/blog-posts';
import type { PageContext } from 'vike/types';
import { absoluteAssetUrl, absoluteSiteUrl } from '../../../renderer/site-url';
import { cardPath } from '../../../renderer/card-path';

/**
 * A post may ship a hand-made social card instead of the generated one. The
 * `ogImage.src` here is vite's hashed asset URL, since this runs inside the
 * site's build — the same import reaches the card generator as a filesystem
 * path, which is why the generator knows to skip these posts.
 */
export default (pageContext: PageContext) => {
  const post = slugMap[pageContext.routeParams?.slug];
  return post?.ogImage
    ? absoluteAssetUrl(post.ogImage.src)
    : absoluteSiteUrl(cardPath(pageContext.urlOriginal));
};
