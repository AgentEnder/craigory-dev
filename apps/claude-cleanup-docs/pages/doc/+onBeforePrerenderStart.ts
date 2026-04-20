import type { OnBeforePrerenderStartAsync } from 'vike/types';

import { getAllSlugs } from '../../src/docs.server';

export const onBeforePrerenderStart: OnBeforePrerenderStartAsync = async () => {
  return getAllSlugs()
    .filter((slug) => slug.length > 0)
    .map((slug) => '/' + slug);
};
