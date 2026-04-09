import { loadAllProjects } from '../src/data/projects';

export async function onCreateGlobalContext(
  globalContext: Vike.GlobalContext
) {
  globalContext.projects = await loadAllProjects();
}
