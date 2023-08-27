import { PRESENTATIONS } from '@new-personal-monorepo/presentations';
import React from 'react';

import './index.page.scss';

export function Page() {
  return (
    <div className="presentations-container">
      {Object.values(PRESENTATIONS).map((p) => (
        <React.Fragment key={p.slug}>
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
            {p.presentedOn.toLocaleDateString()}
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
                <a href={'/presentations/view/' + p.slug}>View Slides</a>
              ) : null}
              {p.recordingUrl ? (
                <a href={p.recordingUrl} target="_blank" rel="noreferrer">
                  View Recording
                </a>
              ) : null}
              {p.extraLinks
                ? p.extraLinks.map((link, idx) => (
                    <a href={link.url} target="_blank" rel="noreferrer" key={link.title}>
                      {link.title}
                    </a>
                  ))
                : null}
            </div>
          </div>
        </React.Fragment>
      ))}
    </div>
  );
}
