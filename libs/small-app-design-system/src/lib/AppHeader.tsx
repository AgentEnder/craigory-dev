import type { ReactNode } from 'react';

interface AppHeaderProps {
  title: string;
  tagline?: string;
  /**
   * Rendered in the right cell. The centre cell stays optically centred
   * regardless of how wide this grows, which is why this is a 3-column grid
   * rather than a flex row.
   */
  actions?: ReactNode;
}

export function AppHeader({ title, tagline, actions }: AppHeaderProps) {
  return (
    <div className="mb-8 grid grid-cols-[1fr_auto_1fr] items-start gap-4">
      <div />
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-gray-900 mb-1">{title}</h1>
        {tagline && <p className="text-gray-500 text-sm">{tagline}</p>}
      </div>
      <div className="flex justify-end">{actions}</div>
    </div>
  );
}
