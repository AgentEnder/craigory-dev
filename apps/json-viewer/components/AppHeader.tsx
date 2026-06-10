import type { ReactNode } from 'react';

interface AppHeaderProps {
  actions?: ReactNode;
}

export function AppHeader({ actions }: AppHeaderProps) {
  return (
    <div className="mb-8 grid grid-cols-[1fr_auto_1fr] items-start gap-4">
      <div />
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-gray-900 mb-1">
          JSON Viewer
        </h1>
        <p className="text-gray-500 text-sm">
          Explore, filter, and transform JSON data
        </p>
      </div>
      <div className="flex justify-end">{actions}</div>
    </div>
  );
}
