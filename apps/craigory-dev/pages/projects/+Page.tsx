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
import { isContributorProject, projectAnchorId, projectTitle } from './anchor';
import { RelatedContent } from '@new-personal-monorepo/related-content';

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
      {sortedProjects.map((p, idx) => {
        const isContributor = isContributorProject(p);
        const anchor = projectAnchorId(p);
        const title = projectTitle(p);
        return (
          <div key={anchor} className="project-wrapper">
            <div className="project-header">
              <a href={`#${anchor}`} className="content-marker-link">
                <ContentMarker />
              </a>
              <h2 id={anchor}>{title}</h2>
              {isContributor && (
                <span
                  className="role-badge"
                  title="I contribute to this project but don't own it."
                >
                  Contributor
                </span>
              )}
            </div>
            {p.description && (
              <p className="project-description">{p.description}</p>
            )}
            <ProjectCard project={p} />
            <RelatedContent
              type="project"
              slug={p.repo}
              limit={2}
              className="project-related"
            />
            {idx < projects.length - 1 && <hr />}
          </div>
        );
      })}
    </>
  );
}
