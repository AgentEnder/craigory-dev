import { getPageBySlug } from '../../src/docs.server';

export type Data = {
  html: string;
  title: string;
};

export async function data(): Promise<Data> {
  const page = getPageBySlug('');
  if (!page) throw new Error('claude-cleanup-docs: README.md not found');
  return { html: page.html, title: page.title };
}
