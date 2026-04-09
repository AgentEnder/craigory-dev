import { loadAllProjects } from '../../src/data/projects';

export const data = async () => {
  const projects = await loadAllProjects();
  return { projects };
};
