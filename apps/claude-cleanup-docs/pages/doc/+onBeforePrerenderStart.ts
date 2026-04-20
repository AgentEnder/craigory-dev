import type { OnBeforePrerenderStartAsync } from 'vike/types';

import { DOC_SLUGS } from '../../src/docs-index';

export const onBeforePrerenderStart: OnBeforePrerenderStartAsync = async () => {
  return Array.from(DOC_SLUGS)
    .filter((slug) => slug.length > 0)
    .map((slug) => '/' + slug);
};
