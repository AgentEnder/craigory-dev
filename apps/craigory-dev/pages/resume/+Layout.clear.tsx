import React from 'react';
import { MinimumPageShell } from '../../renderer/MinimumPageShell';

export default function Layout({ children }: { children: React.ReactNode }) {
  return <MinimumPageShell>{children}</MinimumPageShell>;
}
