import { usePageContext } from '@new-personal-monorepo/vite-plugin-ssr-utils';

export function Link(p: {
  href?: string;
  className?: string;
  children: React.ReactNode;
}) {
  const pageContext = usePageContext();
  const { children, ...props } = p;
  const className = [
    props.className,
    pageContext.urlPathname === props.href && 'is-active',
  ]
    .filter(Boolean)
    .join(' ');
  return (
    <a {...props} className={className}>
      {children}
    </a>
  );
}
