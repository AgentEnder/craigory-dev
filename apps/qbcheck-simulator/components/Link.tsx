import { navigate as vikeNavigate } from 'vike/client/router';

interface LinkProps {
  href: string;
  className?: string;
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent) => void;
}

export function Link({ href, className, children, onClick }: LinkProps) {
  const baseUrl = (import.meta as any).env?.BASE_URL || '/';
  const fullHref =
    baseUrl === '/' || !baseUrl ? href : baseUrl.replace(/\/$/, '') + href;

  return (
    <a href={fullHref} className={className} onClick={onClick}>
      {children}
    </a>
  );
}

// Utility function for programmatic navigation
export function navigate(path: string) {
  const baseUrl = (import.meta as any).env?.BASE_URL || '/';
  const fullPath =
    baseUrl === '/' || !baseUrl ? path : baseUrl.replace(/\/$/, '') + path;

  // Try to use vike's client-side navigation, fallback to window.location
  try {
    vikeNavigate(fullPath);
  } catch {
    window.location.href = fullPath;
  }
}
