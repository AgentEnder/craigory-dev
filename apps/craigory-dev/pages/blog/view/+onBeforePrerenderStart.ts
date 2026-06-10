import { getBlogUrl, slugMap } from '@new-personal-monorepo/blog-posts';
import type { OnBeforePrerenderStartAsync } from 'vike/types';

export const onBeforePrerenderStart: OnBeforePrerenderStartAsync = async () => {
  return Object.values(slugMap).map((post) => ({
    url: getBlogUrl(post),
    pageContext: {
      data: {},
    },
  }));
};
