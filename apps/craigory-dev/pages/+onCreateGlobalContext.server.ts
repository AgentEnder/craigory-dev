import { loadAllProjects } from '../src/data/projects';

export async function onCreateGlobalContext(
  globalContext: Vike.GlobalContext
) {
  try {
    globalContext.projects = await loadAllProjects();
  } catch (error) {
    // The project loader hits the GitHub Search API, which requires an
    // authenticated token. Whether losing it is fatal depends on where the
    // build is running:
    //
    // - In CI it is. The deploy workflow supplies a token, so a failure there
    //   is something actually breaking, and a published site with an empty
    //   Projects page is a regression.
    // - Anywhere else it is not. A laptop or an agent's sandbox has no reason
    //   to hold a GitHub token, and failing the whole build over one page makes
    //   every unrelated change unverifiable locally.
    //
    // `CI` is a build cache input in nx.json alongside the token names, so the
    // two branches cannot share a cache entry — an empty-projects build can
    // never be replayed as if it were a CI build's output.
    if (process.env.CI === 'true') {
      throw error;
    }
    console.warn(
      '[onCreateGlobalContext] loadAllProjects failed; continuing with an empty project list. Set GITHUB_TOKEN (or GH_TOKEN) to populate the Projects page.',
      error instanceof Error ? error.message : error
    );
    globalContext.projects = [];
  }
}
