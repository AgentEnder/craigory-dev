import { useData } from 'vike-react/useData';
import { RepoData } from '../projects/types';
import { FaExternalLinkAlt } from 'react-icons/fa';
import './styles.scss';

export function Page() {
  const { tools } = useData<{ tools: RepoData[] }>();

  return (
    <>
      <h1>Web Dev Tools</h1>
      <p className="tools-intro">
        Interactive tools for web development — built with TypeScript and React.
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
  const technologies =
    'metadata' in tool && tool.metadata.technologies
      ? tool.metadata.technologies
      : tool.languages
        ? Object.keys(tool.languages)
        : [];

  return (
    <article className="tool-card">
      <h2 className="tool-card-name">{name}</h2>
      {tool.description && (
        <p className="tool-card-description">{tool.description}</p>
      )}
      {technologies.length > 0 && (
        <div className="tool-card-tags">
          {technologies.map((tech) => (
            <span key={tech} className="tool-card-tag">
              {tech}
            </span>
          ))}
        </div>
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
