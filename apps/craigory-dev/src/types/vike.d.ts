import type { RepoData } from '../../pages/projects/types';

declare global {
  namespace Vike {
    interface GlobalContext {
      projects: RepoData[];
    }
  }
}
