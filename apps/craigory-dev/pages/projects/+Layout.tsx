import { PropsWithChildren } from 'react';

export function Layout({ children }: PropsWithChildren) {
  return (
    <div
      style={{
        width: '100%',
      }}
    >
      {children}
    </div>
  );
}
