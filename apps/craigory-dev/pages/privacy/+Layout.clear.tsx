import React from 'react';
import '../../renderer/PageShell.scss';

export default function Layout({ children }: { children: React.ReactNode }) {
  return <React.StrictMode>{children}</React.StrictMode>;
}
