import { loadAllProjects } from '../src/data/projects';

export async function onCreateGlobalContext(
  globalContext: Vike.GlobalContext
) {
  try {
    globalContext.projects = await loadAllProjects();
  } catch (error) {
    // The project loader hits the GitHub Search API, which requires an
    // authenticated token. In a production build we want this failure to
    // surface — a published site with an empty Projects page is a
    // regression. In the dev server we'd rather keep iterating: log the
    // failure and fall back to an empty list so consumers stay iterable.
    if (!import.meta.env.DEV) {
      throw error;
    }
    console.warn(
      '[onCreateGlobalContext] loadAllProjects failed; continuing with an empty project list (dev only).',
      error instanceof Error ? error.message : error
    );
    globalContext.projects = [];
  }
}
