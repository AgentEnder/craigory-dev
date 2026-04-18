// Framework Deps
import { useCallback, useEffect, useState } from 'react';
import { useData } from 'vike-react/useData';

// Local Deps
import './styles.scss';
import { RepoData } from './types';
import { FilterBar } from './components/filter-bar';
import { ProjectCard } from './components/ProjectCard';
import { ContentMarker } from '../../src/shared-components/content-marker';
import { differenceInDays } from 'date-fns';

export function Page() {
  const { projects } = useData<{ projects: RepoData[] }>();

  const [filterFn, setFilterFn] = useState<((p: RepoData) => boolean) | null>(
    null
  );
  const [filteredProjects, setFilteredProjects] = useState(projects);

  const [sortFn, setSortFn] = useState<
    (projects: RepoData[]) => (a: RepoData, b: RepoData) => number
  >(() => calculateRelevance);

  const [sortedProjects, setSortedProjects] = useState<RepoData[]>(() => {
    const fn = sortFn(projects);
    return filteredProjects.sort(fn);
  });

  useEffect(() => {
    setFilteredProjects(
      filterFn ? projects.filter((p) => filterFn(p)) : projects
    );
  }, [filterFn, projects]);

  useEffect(() => {
    if (filteredProjects) {
      const fn = sortFn(filteredProjects);
      setSortedProjects(filteredProjects.sort(fn));
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
        const isContributor = p.type === 'github' && p.role === 'contributor';
        const anchor = isContributor
          ? p.data.full_name.replace('/', '-')
          : p.repo;
        const title = isContributor ? p.data.full_name : p.repo;
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
            {idx < projects.length - 1 && <hr />}
          </div>
        );
      })}
    </>
  );
}

const calculateRelevance = (projects: RepoData[]) => {
  const relevanceMap = new Map<string, number>();
  for (const project of projects) {
    relevanceMap.set(project.repo, calculateRelevanceForProject(project));
  }
  return (a: RepoData, b: RepoData) => {
    return relevanceMap.get(b.repo) ?? 0 - (relevanceMap.get(a.repo) ?? 0);
  };
};

function calculateRelevanceForProject(p: RepoData) {
  // popularity metrics, based on stars + published package downloads
  const stars = p.stars ?? 0;
  const downloads = Object.values(p.publishedPackages ?? {}).reduce(
    (acc, { downloads }) => acc + downloads,
    0
  );
  // Recency metrics
  const lastCommit = differenceInDays(new Date(), new Date(p.lastCommit ?? ''));

  return stars + downloads / 100 + 100 / lastCommit;
}
