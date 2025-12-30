import { DiNpm } from 'react-icons/di';
import { FaCalendar, FaGithub, FaGlobe, FaStar } from 'react-icons/fa';
import { FormattedDate } from '@new-personal-monorepo/date-utils';
import { getLanguageLogo } from '../language-logos';
import { PercentBar } from './percent-bar';
import { RepoData } from '../types';
import styles from './ProjectCard.module.scss';
import { useEffect, useState } from 'react';

interface ProjectCardProps {
  project: RepoData;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const p = project;

  return (
    <article className={styles.projectCard}>
      {/* Project Info Section */}
      <section className={styles.projectInfo}>
        <h3 className={styles.sectionHeader}>Project Info</h3>

        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>
            <FaGithub />
            Source URL
          </span>
          <span className={styles.infoValue}>
            <a href={p.url} target="_blank" rel="noreferrer">
              {'type' in p && p.type === 'github' ? p.data.full_name : p.repo}
            </a>
          </span>
        </div>

        {p.deployment && (
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>
              <FaGlobe />
              Live URL
            </span>
            <span className={styles.infoValue}>
              <DeploymentLink deployment={p.deployment} />
            </span>
          </div>
        )}

        {p.stars ? (
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>
              <FaStar />
              Stars
            </span>
            <span className={styles.infoValue}>{p.stars}</span>
          </div>
        ) : null}

        {p.lastCommit && (
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>
              <FaCalendar />
              Last Commit
            </span>
            <span className={styles.infoValue}>
              <FormattedDate date={p.lastCommit} format="MMM do yyyy" />
            </span>
          </div>
        )}
      </section>

      {/* Languages Section */}
      {p.languages && Object.keys(p.languages).length > 0 && (
        <section className={styles.projectLanguages}>
          <h3 className={styles.sectionHeader}>Languages Used</h3>
          <div className={styles.languagesGrid}>
            {Object.entries(p.languages)
              .sort(([, a], [, b]) => b - a)
              .map(([name, percent]) => (
                <div key={name} className={styles.languageRow}>
                  <span className={styles.languageName}>
                    {getLanguageLogo(name)}
                    {name}
                  </span>
                  <span className={styles.languageBar}>
                    <PercentBar percent={percent} label={percent.toFixed(2)} />
                  </span>
                </div>
              ))}
          </div>
        </section>
      )}

      {/* Published Packages Section */}
      {p.publishedPackages && Object.keys(p.publishedPackages).length > 0 && (
        <section className={styles.projectPackages}>
          <h3 className={styles.sectionHeader}>Published Packages</h3>
          <div className={styles.packagesGrid}>
            {Object.entries(p.publishedPackages)
              .sort(([, a], [, b]) => b.downloads - a.downloads)
              .map(([name, { url, downloads, registry }]) => (
                <div key={name} className={styles.packageRow}>
                  <span className={styles.packageName}>
                    <a href={url} target="_blank" rel="noreferrer">
                      {registry === 'npm' && <DiNpm className={styles.npmIcon} />}
                      {name}
                    </a>
                  </span>
                  <span className={styles.packageDownloads}>
                    {downloads.toLocaleString()} weekly
                  </span>
                </div>
              ))}
          </div>
        </section>
      )}
    </article>
  );
}

function DeploymentLink({ deployment }: { deployment: string }) {
  const [displayName, setDisplayName] = useState(deployment);

  useEffect(() => {
    try {
      const url = deployment.startsWith('/')
        ? new URL(deployment, window.location.origin)
        : deployment;
      setDisplayName(url.toString());
    } catch {
      setDisplayName(deployment);
    }
  }, [deployment]);

  return (
    <a href={deployment} target="_blank" rel="noreferrer">
      {displayName}
    </a>
  );
}
