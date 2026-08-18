import { useData } from 'vike-react/useData';
import { RepoData } from '../projects/types';
import { FaExternalLinkAlt } from 'react-icons/fa';
import './styles.scss';

export function Page() {
  const { tools } = useData<{ tools: RepoData[] }>();

  return (
    <>
      <h1>Developer Tools</h1>
      <p className="tools-intro">
        Tools I needed at some point, built to run in a browser tab so they are
        always one link away. Most are aimed at developers, though the glyph
        reference and the QR generator get more general use.
      </p>
      <div className="tools-grid">
        {tools.map((tool) => (
          <ToolCard key={tool.repo} tool={tool} />
        ))}
      </div>
    </>
  );
}

function ToolCard({ tool }: { tool: RepoData }) {
  const name =
    'metadata' in tool && tool.metadata.name ? tool.metadata.name : tool.repo;

  return (
    <article className="tool-card">
      <h2 className="tool-card-name">{name}</h2>
      {tool.description && (
        <p className="tool-card-description">{tool.description}</p>
      )}
      <div className="tool-card-actions">
        {tool.deployment && (
          <a
            href={tool.deployment}
            className="tool-card-launch"
            target="_blank"
            rel="noreferrer"
          >
            Launch
            <FaExternalLinkAlt />
          </a>
        )}
        <a
          href={tool.url}
          className="tool-card-source"
          target="_blank"
          rel="noreferrer"
        >
          Source
        </a>
      </div>
    </article>
  );
}
