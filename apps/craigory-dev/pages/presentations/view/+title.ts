import { PRESENTATIONS } from '@new-personal-monorepo/presentations';
import { PageContext } from 'vike/types';

export default (pageContext: PageContext) => {
  const presentation = PRESENTATIONS[pageContext.routeParams?.presentation];
  return presentation.title;
};
