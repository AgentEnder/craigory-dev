import { render } from 'vike/abort';
import type { PageContextServer } from 'vike/types';

import { getPageBySlug } from '../../src/docs.server';

export type Data = {
  html: string;
  title: string;
};

export async function data(pageContext: PageContextServer): Promise<Data> {
  const slug = pageContext.routeParams?.slug;
  const page = slug ? getPageBySlug(slug) : undefined;
  if (!page) throw render(404);
  return { html: page.html, title: page.title };
}
