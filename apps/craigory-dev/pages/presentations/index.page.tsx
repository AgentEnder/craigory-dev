import { PRESENTATIONS } from '@new-personal-monorepo/presentations';

import './index.page.scss';

export function Page() {
  return (
    <div className="presentations-container">
      {PRESENTATIONS.map((p) => (
        <>
          <h2
            style={{
              margin: 0,
            }}
            key={p.title + p.presentedAt + 'TITLE'}
          >
            {p.title}
          </h2>
          <div key={p.title + p.presentedAt + 'PRESENTEDAT'} className="location">{p.presentedAt}</div>
          <div key={p.title + p.presentedAt + 'PRESENTEDON'} className="date">{p.presentedOn.toLocaleDateString()}</div>
          <div key={p.title + p.presentedAt + 'DESCRIPTION'}>
            {p.description.split('\n').map((line) => (
              <p key={line}>{line}</p>
            ))}
            {p.mdUrl ? (
              <a href={"/presentations/view/" + p.mdUrl}>
                View Slides
              </a>
            ) : null}
            {p.recordingUrl ? (
              <a href={p.recordingUrl} target="_blank" rel="noreferrer">
                View Recording
              </a>
            ) : null}
          </div>
        </>
      ))}
    </div>
  );
}
