import { usePageContext } from 'vike-react/usePageContext';

/**
 * An `<a>` that prefixes the deploy's base path and marks itself active on the
 * current route. Remaining anchor attributes pass straight through, so callers
 * can set things like `aria-hidden` on a decorative link.
 */
export function Link({
  href,
  className,
  children,
  ...rest
}: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  const pageContext = usePageContext();
  const classes = [className, pageContext.urlPathname === href && 'is-active']
    .filter(Boolean)
    .join(' ');
  const base = import.meta.env.PUBLIC_ENV__BASE_URL;
  return (
    <a
      href={!base || base === '/' ? href : base + href}
      {...rest}
      className={classes}
    >
      {children}
    </a>
  );
}
