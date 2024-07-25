import { slugMap } from '@new-personal-monorepo/blog-posts';
import { formatDateString } from '@new-personal-monorepo/date-utils';
import { OnBeforePrerenderStartAsync } from 'vike/types';

export const onBeforePrerenderStart: OnBeforePrerenderStartAsync = async () => {
  return Object.values(slugMap).map((post) => ({
    url: `/blog/${formatDateString(post.publishDate)}/${post.slug}`,
    pageContext: {
      data: {},
    },
  }));
};
