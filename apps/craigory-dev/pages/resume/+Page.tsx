import { Fragment, type ReactNode } from 'react';

import { Link } from '../../renderer/Link';
import styles from './resume.module.scss';
import { resume, talkLinks, type Entry, type Section } from './resume-data';

export function Page() {
  return (
    <div className={styles.page}>
      <nav className={styles.toolbar} aria-label="Resume">
        <Link className={styles.back} href="/">
          ← craigory.dev
        </Link>
        <button
          type="button"
          className={styles.print}
          onClick={() => window.print()}
        >
          Print / PDF
        </button>
      </nav>

      <div className={styles.sheet}>
        <header className={styles.header}>
          <div>
            <h1 className={styles.name}>{resume.name}</h1>
            <p className={styles.headline}>{resume.headline}</p>
          </div>
          <p className={styles.contact}>
            {resume.links.map((link) => (
              <a key={link.href} href={link.href}>
                {link.label}
              </a>
            ))}
          </p>
        </header>

        <div className={styles.body}>
          <section className={styles.summary} aria-labelledby="summary">
            <h2 id="summary" className={styles.asideHeading}>
              Summary
            </h2>
            <p>{resume.summary}</p>
          </section>

          <main className={styles.main}>
            {resume.sections.map((section) => (
              <ResumeSection key={section.heading} section={section} />
            ))}
          </main>

          <aside className={styles.aside}>
            <Technologies />
            <Speaking />
          </aside>
        </div>
      </div>
    </div>
  );
}

function ResumeSection({ section }: { section: Section }) {
  return (
    <section className={styles.section}>
      <h2 className={styles.sectionHeading}>{section.heading}</h2>
      {section.entries.map((entry) => (
        <ResumeEntry key={entry.id} entry={entry} />
      ))}
      {section.more && (
        <p className={styles.more}>
          More at <a href={section.more.href}>{section.more.label}</a>
        </p>
      )}
    </section>
  );
}

function ResumeEntry({ entry }: { entry: Entry }) {
  return (
    <article id={entry.id} className={styles.entry}>
      <header className={styles.entryHeader}>
        <h3 className={styles.entryName}>
          {entry.href ? <a href={entry.href}>{entry.name}</a> : entry.name}
          {entry.private && <span className={styles.tag}>private</span>}
        </h3>
        {entry.dates && <p className={styles.dates}>{entry.dates}</p>}
      </header>
      {entry.roles?.map((role) => (
        <p key={role} className={styles.role}>
          {role}
        </p>
      ))}
      {entry.lead && <p className={styles.lead}>{inline(entry.lead)}</p>}
      {entry.groups?.map((group, i) => (
        <Fragment key={group.heading ?? i}>
          {group.heading && (
            <h4 className={styles.groupHeading}>{group.heading}</h4>
          )}
          <ul className={styles.bullets}>
            {group.bullets.map((bullet) => (
              <li key={bullet}>{inline(bullet)}</li>
            ))}
          </ul>
        </Fragment>
      ))}
      {entry.links && (
        <p className={styles.entryLinks}>
          {entry.links.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
        </p>
      )}
    </article>
  );
}

function Technologies() {
  return (
    <section className={styles.asideSection} aria-labelledby="technologies">
      <h2 id="technologies" className={styles.asideHeading}>
        Technologies
      </h2>
      <dl className={styles.technologies}>
        {resume.technologies.map((group) => (
          <div key={group.category} className={styles.technology}>
            <dt className={styles.technologyName}>{group.category}</dt>
            <dd className={styles.technologyItems}>{group.items.join(', ')}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

function Speaking() {
  return (
    <section className={styles.asideSection} aria-labelledby="speaking">
      <h2 id="speaking" className={styles.asideHeading}>
        Speaking
      </h2>
      <ul className={styles.talks}>
        {resume.talks.map((talk) => {
          const { slides, recording } = talkLinks(talk.slugs);
          return (
            <li key={talk.title} className={styles.talk}>
              <span className={styles.talkTitle}>{talk.title}</span>
              <span className={styles.talkEvents}>{talk.events}</span>
              <span className={styles.talkLinks}>
                {slides && <Link href={slides}>Slides</Link>}
                {recording && <a href={recording}>Recording</a>}
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

/** Renders `backtick` spans in resume copy as code. */
function inline(text: string): ReactNode[] {
  return text
    .split('`')
    .map((part, i) => (i % 2 === 1 ? <code key={i}>{part}</code> : part));
}
