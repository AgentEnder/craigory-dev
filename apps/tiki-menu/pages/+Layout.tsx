import React from 'react';
import { AuthProvider } from '../src/contexts/AuthContext';
import '../src/style.css';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return <AuthProvider>{children}</AuthProvider>;
}
