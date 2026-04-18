// Framework Deps
import { useCallback, useEffect, useState } from 'react';
import { useData } from 'vike-react/useData';

// Local Deps
import './styles.scss';
import { RepoData } from './types';
import { FilterBar } from './components/filter-bar';
import { ProjectCard } from './components/ProjectCard';
import { ContentMarker } from '../../src/shared-components/content-marker';
import { sortByRelevance } from './components/sort-functions';

export function Page() {
  const { projects } = useData<{ projects: RepoData[] }>();

  const [filterFn, setFilterFn] = useState<((p: RepoData) => boolean) | null>(
    null
  );
  const [filteredProjects, setFilteredProjects] = useState(projects);

  const [sortFn, setSortFn] = useState<
    (projects: RepoData[]) => (a: RepoData, b: RepoData) => number
  >(() => sortByRelevance);

  const [sortedProjects, setSortedProjects] = useState<RepoData[]>(() => {
    const fn = sortFn(projects);
    return [...filteredProjects].sort(fn);
  });

  useEffect(() => {
    setFilteredProjects(
      filterFn ? projects.filter((p) => filterFn(p)) : projects
    );
  }, [filterFn, projects]);

  useEffect(() => {
    if (filteredProjects) {
      const fn = sortFn(filteredProjects);
      setSortedProjects([...filteredProjects].sort(fn));
    }
  }, [filteredProjects, sortFn]);

  const onSetFilter = useCallback(
    (fn: (p: RepoData) => boolean) => {
      setFilterFn(() => fn);
    },
    [setFilterFn]
  );

  return (
    <>
      <h1>Projects</h1>
      <FilterBar
        onSetFilter={onSetFilter}
        repos={projects}
        onSetSort={setSortFn}
        style={{ maxWidth: '45rem' }}
      ></FilterBar>
      {sortedProjects.map((p, idx) => (
        <div key={p.repo} className="project-wrapper">
          <div className="project-header">
            <a href={`#${p.repo}`} className="content-marker-link">
              <ContentMarker />
            </a>
            <h2 id={p.repo}>{p.repo}</h2>
          </div>
          {p.description && (
            <p className="project-description">{p.description}</p>
          )}
          <ProjectCard project={p} />
          {idx < projects.length - 1 && <hr />}
        </div>
      ))}
    </>
  );
}
