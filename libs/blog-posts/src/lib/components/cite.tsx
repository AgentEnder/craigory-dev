import { ReactNode } from 'react';
import classes from './cite.module.scss';

export interface CiteProps {
  /** Citation number rendered in the inline marker, e.g. [1] */
  n: number;
  /** Source URL. The marker is an anchor that opens the URL in a new tab. */
  href: string;
  /**
   * Citation body. Rendered inside a semantic <cite> element and shown in a
   * popover when the marker is hovered or focused. Always present in the DOM.
   */
  children?: ReactNode;
}

export function Cite({ n, href, children }: CiteProps) {
  return (
    <span className={classes['citation']}>
      <sup className={classes['marker']}>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={classes['anchor']}
        >
          [{n}]
        </a>
      </sup>
      <cite className={classes['popover']} role="tooltip">
        <span className={classes['popoverBody']}>{children}</span>
      </cite>
    </span>
  );
}
