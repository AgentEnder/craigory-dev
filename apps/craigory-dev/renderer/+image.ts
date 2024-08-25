import { PageContext } from 'vike/types';

export default (pageContext: PageContext) => {
  let base = new URL('https://craigory.dev');
  if (import.meta.env.PUBLIC_ENV__BASE_URL) {
    base = new URL(import.meta.env.PUBLIC_ENV__BASE_URL, base);
  }
  return new URL(pageContext.urlOriginal + '/og.png', base).href;
};
