import { useState, useMemo } from 'react';
import type { ReportData, RepoResult } from './types';

type StatusFilter = 'all' | 'success' | 'failure' | 'skipped';

export function App({ data }: { data: ReportData }) {
  const [filter, setFilter] = useState<StatusFilter>('all');
  const [search, setSearch] = useState('');

  const { successful, failed, skipped, needsManualPr } = useMemo(() => {
    const successful = data.results.filter((r) => r.status === 'success');
    const failed = data.results.filter((r) => r.status === 'failure');
    const skipped = data.results.filter((r) => r.status === 'skipped');
    const needsManualPr = data.results.filter(
      (r) => r.status === 'success' && !r.prUrl && r.manualPrUrl
    );
    return { successful, failed, skipped, needsManualPr };
  }, [data.results]);

  const filtered = useMemo(() => {
    let results = data.results;
    if (filter !== 'all') {
      results = results.filter((r) => r.status === filter);
    }
    if (search) {
      const q = search.toLowerCase();
      results = results.filter((r) => r.name.toLowerCase().includes(q));
    }
    return results;
  }, [data.results, filter, search]);

  return (
    <>
      <style>{`
        :root {
          --bg: #0d1117; --surface: #161b22; --surface-hover: #1c2129; --border: #30363d;
          --text: #e6edf3; --text-muted: #8b949e;
          --green: #3fb950; --green-bg: rgba(63,185,80,0.1);
          --red: #f85149; --red-bg: rgba(248,81,73,0.1);
          --yellow: #d29922; --yellow-bg: rgba(210,153,34,0.1);
          --blue: #58a6ff; --blue-bg: rgba(88,166,255,0.1);
          --gray: #484f58; --gray-bg: rgba(72,79,88,0.15);
          --radius: 10px; --font: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
        }
        @media (prefers-color-scheme: light) {
          :root {
            --bg: #f6f8fa; --surface: #ffffff; --surface-hover: #f3f4f6; --border: #d0d7de;
            --text: #1f2328; --text-muted: #656d76;
            --green: #1a7f37; --green-bg: rgba(26,127,55,0.08);
            --red: #cf222e; --red-bg: rgba(207,34,46,0.08);
            --yellow: #9a6700; --yellow-bg: rgba(154,103,0,0.08);
            --blue: #0969da; --blue-bg: rgba(9,105,218,0.08);
            --gray: #656d76; --gray-bg: rgba(101,109,118,0.08);
          }
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
          font-family: var(--font); background: var(--bg); color: var(--text);
          line-height: 1.6; padding: 2rem 1rem; -webkit-font-smoothing: antialiased;
        }
        .container { max-width: 1000px; margin: 0 auto; }
        h1 { font-size: 1.75rem; font-weight: 700; margin-bottom: 0.25rem; }
        .subtitle { color: var(--text-muted); font-size: 0.9rem; margin-bottom: 1.5rem; }
        .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 0.75rem; margin-bottom: 1.5rem; }
        .card {
          background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius);
          padding: 1rem 1.25rem; cursor: pointer; transition: border-color 0.15s, background 0.15s;
          user-select: none;
        }
        .card:hover { background: var(--surface-hover); }
        .card.active { border-color: var(--blue); background: var(--blue-bg); }
        .card-number { font-size: 1.75rem; font-weight: 700; line-height: 1.2; }
        .card-label { font-size: 0.8rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; font-weight: 500; }
        .card-success .card-number { color: var(--green); }
        .card-warn .card-number { color: var(--yellow); }
        .card-error .card-number { color: var(--red); }
        .card-skip .card-number { color: var(--gray); }
        .toolbar {
          display: flex; gap: 0.75rem; margin-bottom: 1rem; align-items: center;
        }
        .search {
          flex: 1; padding: 0.5rem 0.75rem; border-radius: 8px; border: 1px solid var(--border);
          background: var(--surface); color: var(--text); font-size: 0.9rem; font-family: var(--font);
          outline: none; transition: border-color 0.15s;
        }
        .search:focus { border-color: var(--blue); }
        .search::placeholder { color: var(--text-muted); }
        .count { color: var(--text-muted); font-size: 0.85rem; white-space: nowrap; }
        .panel {
          background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius);
          overflow: hidden; margin-bottom: 1.5rem;
        }
        table { width: 100%; border-collapse: collapse; }
        th {
          text-align: left; padding: 0.6rem 1rem; font-size: 0.75rem; font-weight: 600;
          color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em;
          background: var(--surface); border-bottom: 1px solid var(--border);
        }
        td { padding: 0.6rem 1rem; border-bottom: 1px solid var(--border); font-size: 0.9rem; vertical-align: middle; }
        tr:last-child td { border-bottom: none; }
        tr:hover td { background: var(--surface-hover); }
        .badge {
          display: inline-block; padding: 0.1em 0.6em; border-radius: 12px;
          font-size: 0.78rem; font-weight: 500; line-height: 1.6;
        }
        .badge-success { background: var(--green-bg); color: var(--green); }
        .badge-failure { background: var(--red-bg); color: var(--red); }
        .badge-skipped { background: var(--gray-bg); color: var(--gray); }
        .badge-yes { background: var(--green-bg); color: var(--green); }
        .badge-no { background: var(--gray-bg); color: var(--gray); }
        a { color: var(--blue); text-decoration: none; }
        a:hover { text-decoration: underline; }
        code { font-size: 0.88em; }
        .migration { white-space: nowrap; }
        .migration .arrow { color: var(--text-muted); margin: 0 0.25em; }
        .empty { padding: 2rem; text-align: center; color: var(--text-muted); }
        .footer { text-align: center; color: var(--text-muted); font-size: 0.8rem; margin-top: 1rem; }
        @media (max-width: 640px) {
          .summary { grid-template-columns: repeat(2, 1fr); }
          th, td { padding: 0.5rem 0.6rem; font-size: 0.82rem; }
          .col-hide-mobile { display: none; }
        }
      `}</style>
      <div className="container">
        <h1>Update Report &mdash; {data.date}</h1>
        <p className="subtitle">
          {data.results.length} repo{data.results.length !== 1 ? 's' : ''}{' '}
          processed
        </p>

        <div className="summary">
          <SummaryCard
            label="Successful"
            count={successful.length}
            variant="success"
            active={filter === 'success'}
            onClick={() => setFilter(filter === 'success' ? 'all' : 'success')}
          />
          <SummaryCard
            label="Manual PR"
            count={needsManualPr.length}
            variant="warn"
            active={false}
            onClick={() => {}}
          />
          <SummaryCard
            label="Failed"
            count={failed.length}
            variant="error"
            active={filter === 'failure'}
            onClick={() => setFilter(filter === 'failure' ? 'all' : 'failure')}
          />
          <SummaryCard
            label="Skipped"
            count={skipped.length}
            variant="skip"
            active={filter === 'skipped'}
            onClick={() => setFilter(filter === 'skipped' ? 'all' : 'skipped')}
          />
        </div>

        <div className="toolbar">
          <input
            className="search"
            type="text"
            placeholder="Filter repos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <span className="count">
            {filtered.length} of {data.results.length}
          </span>
        </div>

        <div className="panel">
          {filtered.length === 0 ? (
            <div className="empty">No repos match the current filter.</div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Repo</th>
                  <th>Status</th>
                  <th className="col-hide-mobile">Nx Migration</th>
                  <th className="col-hide-mobile">Audit</th>
                  <th>PR</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => (
                  <RepoRow key={r.name} result={r} />
                ))}
              </tbody>
            </table>
          )}
        </div>

        <p className="footer">Generated {data.generatedAt}</p>
      </div>
    </>
  );
}

function SummaryCard({
  label,
  count,
  variant,
  active,
  onClick,
}: {
  label: string;
  count: number;
  variant: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <div
      className={`card card-${variant}${active ? ' active' : ''}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
    >
      <div className="card-number">{count}</div>
      <div className="card-label">{label}</div>
    </div>
  );
}

function RepoRow({ result: r }: { result: RepoResult }) {
  const statusBadge = (
    <span className={`badge badge-${r.status}`}>{r.status}</span>
  );

  const nxCell = r.nxMigrated ? (
    <span className="migration">
      <code>{r.nxMigrated.oldVersion}</code>
      <span className="arrow">&rarr;</span>
      <code>{r.nxMigrated.newVersion}</code>
    </span>
  ) : (
    <span style={{ color: 'var(--text-muted)' }}>&mdash;</span>
  );

  const auditCell = r.auditFixed ? (
    <span className="badge badge-yes">Fixed</span>
  ) : (
    <span className="badge badge-no">No</span>
  );

  let prCell: React.ReactNode = (
    <span style={{ color: 'var(--text-muted)' }}>&mdash;</span>
  );
  if (r.prUrl) {
    prCell = <a href={r.prUrl}>View PR</a>;
  } else if (r.manualPrUrl) {
    prCell = <a href={r.manualPrUrl}>Create PR</a>;
  }

  const errorNote =
    r.error && r.status !== 'success' ? (
      <tr>
        <td
          colSpan={5}
          style={{
            paddingTop: 0,
            fontSize: '0.82rem',
            color: 'var(--text-muted)',
          }}
        >
          &nbsp;&nbsp;&nbsp;&nbsp;{r.error}
        </td>
      </tr>
    ) : null;

  return (
    <>
      <tr>
        <td>
          <code>{r.name}</code>
        </td>
        <td>{statusBadge}</td>
        <td className="col-hide-mobile">{nxCell}</td>
        <td className="col-hide-mobile">{auditCell}</td>
        <td>{prCell}</td>
      </tr>
      {errorNote}
    </>
  );
}
