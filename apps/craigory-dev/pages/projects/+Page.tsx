// Framework Deps
import { useCallback, useEffect, useState } from 'react';
import { useData } from 'vike-react/useData';

// Vendor Deps
import { DiNpm } from 'react-icons/di';
import { FaCalendar, FaGithub, FaGlobe, FaStar } from 'react-icons/fa';

// Local Deps
import { getLanguageLogo } from './language-logos';
import './styles.scss';
import { ProjectData, RepoData } from './types';
import { FilterBar } from './components/filter-bar';
import { PercentBar } from './components/percent-bar';
import { ContentMarker } from '../../src/shared-components/content-marker';
import { FormattedDate } from '@new-personal-monorepo/date-utils';
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
      ></FilterBar>
      {sortedProjects.map((p, idx) => (
        <div key={p.repo}>
          <div style={{ position: 'relative' }}>
            <a
              href={`#${p.repo}`}
              style={{
                // position: 'absolute',
                fontSize: '2rem',
                textDecoration: 'none',
                color: 'darkgray',
                // left: '-3.5rem',
                // top: '1.75rem',
                marginLeft: '-3.5rem',
                marginRight: 'calc(3.5rem - 1ch)',
              }}
            >
              <ContentMarker></ContentMarker>
            </a>

            <h2
              id={p.repo}
              style={{
                display: 'inline-block',
              }}
            >
              {p.repo}
            </h2>
          </div>
          <p>{p.description}</p>

          <table>
            <thead>
              <tr>
                <th colSpan={2}>Project Info</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <div>
                    <div>
                      <FaGithub
                        style={{
                          fontSize: '1.5rem',
                          verticalAlign: 'middle',
                          marginRight: '0.5rem',
                        }}
                      />
                    </div>
                    <div>Source URL</div>
                  </div>
                </td>
                <td>
                  <a href={p.url} target="_blank" rel="noreferrer">
                    {'type' in p && p.type === 'github'
                      ? p.data.full_name
                      : p.repo}
                  </a>
                </td>
              </tr>
              {p.deployment ? (
                <tr>
                  <td>
                    <div>
                      <FaGlobe
                        style={{
                          fontSize: '1.5rem',
                          verticalAlign: 'middle',
                          marginRight: '0.5rem',
                        }}
                      ></FaGlobe>
                      <div>Live URL</div>
                    </div>
                  </td>
                  <td>
                    <div>{DeploymentLink(p)}</div>
                  </td>
                </tr>
              ) : null}
              {p.stars ? (
                <tr>
                  <td>
                    <div>
                      <FaStar
                        style={{
                          fontSize: '1.5rem',
                          verticalAlign: 'middle',
                          marginRight: '0.5rem',
                        }}
                      ></FaStar>
                      <div>Stars</div>
                    </div>
                  </td>
                  <td>{p.stars}</td>
                </tr>
              ) : null}
              {p.lastCommit ? (
                <tr>
                  <td>
                    <div>
                      <FaCalendar
                        style={{
                          fontSize: '1.5rem',
                          verticalAlign: 'middle',
                          marginRight: '0.5rem',
                        }}
                      ></FaCalendar>
                      <div>Last Commit</div>
                    </div>
                  </td>
                  <td>
                    <FormattedDate date={p.lastCommit} format="MMM do yyyy" />
                  </td>
                </tr>
              ) : null}
            </tbody>
            {p.languages ? (
              <>
                <thead>
                  <tr>
                    <th colSpan={2}>Languages Used</th>
                  </tr>
                  <tr>
                    <th>Language</th>
                    <th>%</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(p.languages)
                    .sort(([, a], [, b]) => b - a)
                    .map(([name, percent]) => (
                      <tr key={name}>
                        <td>
                          <div>
                            <span>{getLanguageLogo(name)}</span>
                            <span>{name}</span>
                          </div>
                        </td>
                        <td>
                          <PercentBar
                            percent={percent}
                            label={percent.toFixed(2)}
                          ></PercentBar>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </>
            ) : null}
            {Object.keys(p.publishedPackages ?? {}).length ? (
              <>
                <thead>
                  <tr>
                    <th colSpan={2}>Published Packages</th>
                  </tr>
                  <tr>
                    <th>Package</th>
                    <th>Weekly Downloads</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(p.publishedPackages ?? {})
                    .sort(([, a], [, b]) => b.downloads - a.downloads)
                    .map(([name, { url, downloads, registry }]) => (
                      <tr key={name}>
                        <td>
                          <a href={url} target="_blank" rel="noreferrer">
                            {registry === 'npm' ? (
                              <span
                                style={{
                                  fontSize: '1.5rem',
                                  verticalAlign: 'middle',
                                  marginRight: '0.5rem',
                                }}
                              >
                                <DiNpm />
                              </span>
                            ) : null}{' '}
                            {name}
                          </a>
                        </td>
                        <td>{downloads}</td>
                      </tr>
                    ))}
                </tbody>
              </>
            ) : null}
          </table>
          {idx < projects.length - 1 ? <hr /> : null}
        </div>
      ))}
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

function DeploymentLink(p: ProjectData) {
  const [displayName, setDisplayName] = useState(p.deployment);
  useEffect(() => {
    if (!p.deployment) return;

    try {
      const url = p.deployment.startsWith('/')
        ? new URL(p.deployment, window.location.origin)
        : p.deployment;
      setDisplayName(url.toString());
    } catch {
      setDisplayName(p.deployment);
    }
  }, [p.deployment]);

  if (!p.deployment) return;

  return (
    <a href={p.deployment} target="_blank" rel="noreferrer">
      {displayName}
    </a>
  );
}

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
