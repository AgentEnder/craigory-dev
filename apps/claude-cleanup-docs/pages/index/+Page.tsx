import { useData } from 'vike-react/useData';
import type { Data } from './+data.server';

export default function Page() {
  const { html } = useData<Data>();
  return (
    <article
      className="docs-article"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
