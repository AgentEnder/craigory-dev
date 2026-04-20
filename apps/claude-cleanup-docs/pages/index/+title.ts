import type { PageContext } from 'vike/types';

export function title(pageContext: PageContext): string {
  const data = pageContext.data as { title?: string } | undefined;
  return data?.title ? `${data.title} — claude-cleanup docs` : 'claude-cleanup docs';
}
