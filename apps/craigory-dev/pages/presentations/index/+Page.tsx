import { PRESENTATIONS } from '@new-personal-monorepo/presentations';

import './index.page.scss';
import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { ContentMarker } from '../../../src/shared-components/content-marker';
import { Link } from '../../../renderer/Link';

export function Page() {
  const hash = useLocationHash();

  useEffect(() => {
    if (hash) {
      const active = document.querySelector('.presentation-container.active');
      if (active) {
        active.classList.remove('active');
      }
      const el = document.getElementById(hash);
      el?.classList.add('active');
    }
  }, [hash]);

  return (
    <div className="presentations-container">
      {Object.values(PRESENTATIONS).map((p) => (
        <div
          key={p.slug}
          style={{
            display: 'flex',
            flexDirection: 'row',
            gap: '1em',
            alignItems: 'top',
          }}
        >
          <div id={p.slug} className={`presentation-container`}>
            <h2
              style={{
                margin: 0,
              }}
              key={p.title + p.presentedAt + 'TITLE'}
              className="title"
            >
              {p.title}
            </h2>
            <div
              key={p.title + p.presentedAt + 'PRESENTEDAT'}
              className="location"
            >
              {p.presentedAt}
            </div>
            <div key={p.title + p.presentedAt + 'PRESENTEDON'} className="date">
              {format(p.presentedOn, 'MMM dd, yyyy')}
            </div>
            <div
              key={p.title + p.presentedAt + 'DESCRIPTION'}
              className="description"
            >
              {p.description.split('\n').map((line) => (
                <p key={line}>{line}</p>
              ))}
              <div className="links">
                {p.mdUrl || p.htmlUrl ? (
                  <Link href={'/presentations/view/' + p.slug}>
                    View Slides
                  </Link>
                ) : null}
                {p.recordingUrl ? (
                  <a href={p.recordingUrl} target="_blank" rel="noreferrer">
                    View Recording
                  </a>
                ) : null}
                {p.extraLinks
                  ? p.extraLinks.map((link, idx) => (
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noreferrer"
                        key={link.title}
                      >
                        {link.title}
                      </a>
                    ))
                  : null}
              </div>
            </div>
          </div>
          <a
            href={'#' + p.slug}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem',
              textDecoration: 'none',
              color: 'darkgray',
              scrollBehavior: 'smooth',
            }}
          >
            <ContentMarker></ContentMarker>
          </a>
        </div>
      ))}
    </div>
  );
}

function useLocationHash() {
  const [hash, setHash] = useState(globalThis?.window?.location?.hash);

  const window = globalThis?.window;
  if (!window) return null;

  window.addEventListener('hashchange', () => setHash(window.location.hash));

  return hash.slice(1);
}
