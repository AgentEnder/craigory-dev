import type { PageContext } from 'vike/types';

export const data = (pageContext: PageContext) => {
  return { projects: pageContext.globalContext.projects };
};
