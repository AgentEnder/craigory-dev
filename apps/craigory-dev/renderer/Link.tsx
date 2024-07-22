import { usePageContext } from 'vike-react/usePageContext';

export function Link(p: {
  href?: string;
  className?: string;
  children: React.ReactNode;
}) {
  const pageContext = usePageContext();
  const { children, href, ...props } = p;
  const className = [
    props.className,
    pageContext.urlPathname === href && 'is-active',
  ]
    .filter(Boolean)
    .join(' ');
  return (
    <a
      href={
        import.meta.env.PUBLIC_ENV__BASE_URL === '/' ||
        !import.meta.env.PUBLIC_ENV__BASE_URL
          ? href
          : import.meta.env.PUBLIC_ENV__BASE_URL + href
      }
      {...props}
      className={className}
    >
      {children}
    </a>
  );
}
