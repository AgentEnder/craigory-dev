import { usePageContext } from 'vike-react/usePageContext';
import { RepoData } from './types';
import { format, isThisYear } from 'date-fns';
import { DiNpm } from 'react-icons/di';
import { FaGithub, FaGlobe, FaStar, FaCalendar } from 'react-icons/fa';

import './styles.scss';
import { getLanguageLogo } from './language-logos';

export function Page() {
  const { projects } = useData();

  return (
    <>
      <h1>Projects</h1>
      Sorted by GitHub stars and last commit date.
      {projects.map((p, idx) => (
        <>
          <div key={p.repo} style={{ position: 'relative' }}>
            <a
              href={`/projects#${p.repo}`}
              style={{
                position: 'absolute',
                fontSize: '2rem',
                textDecoration: 'none',
                color: 'darkgray',
                scrollBehavior: 'smooth',
                left: '-3.5rem',
                top: '2.75rem',
              }}
            >
              #
            </a>
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'baseline',
              }}
              id={p.repo}
            >
              <h2>{p.repo}</h2>
              <div style={{ flexGrow: 1 }}></div>
            </div>
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
                      {p.url}
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
                      <div>
                        <a href={p.deployment} target="_blank" rel="noreferrer">
                          {p.deployment}
                        </a>
                      </div>
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
                    <td>{format(p.lastCommit, `MMM do yyyy`)}</td>
                  </tr>
                ) : null}
              </tbody>
            </table>
            <p>{p.description}</p>

            {/* {p.readme ? (
            <div
              dangerouslySetInnerHTML={{
                __html: renderMarkdownToHTML(p.readme),
              }}
            ></div>
          ) : null} */}
            {p.languages ? (
              <div>
                <h3>Languages</h3>
                <table>
                  <thead>
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
                          <td>{percent}%</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            ) : null}
            {Object.keys(p.publishedPackages ?? {}).length ? (
              <div>
                <h3>Published Packages</h3>
                <table>
                  <thead>
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
                </table>
              </div>
            ) : null}
          </div>
          {idx < projects.length - 1 ? <hr /> : null}
        </>
      ))}
    </>
  );
}

function useData() {
  const ctx = usePageContext();
  console.log();
  return (ctx.data ?? {
    projects: [],
  }) as {
    projects: RepoData[];
  };
}
