import { PRESENTATIONS } from '@new-personal-monorepo/presentations';

export async function onBeforePrerenderStart() {
  return Object.values(PRESENTATIONS)
    .filter((pg) => pg.mdUrl)
    .map((pg) => `/presentations/view/${pg.slug}`);
}
