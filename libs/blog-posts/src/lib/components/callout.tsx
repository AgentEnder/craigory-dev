import { ReactNode } from 'react';
import classes from './callout.module.scss';

export interface CalloutProps {
  /**
   * Short label rendered above the body, e.g. "About the examples". Rendered
   * as plain text rather than a heading so the callout stays out of the
   * table of contents, which is built from the post's h2/h3 elements.
   */
  title?: string;
  /** Callout body. Markdown inside the tag is parsed as usual. */
  children?: ReactNode;
}

/**
 * An editorial aside — a disclaimer, scope note, or correction — set apart
 * from the body text. Deliberately unlike `blockquote`, which posts use for
 * quoting sources: no left rule, no italics.
 */
export function Callout({ title, children }: CalloutProps) {
  return (
    <aside className={classes['callout']}>
      {title ? <p className={classes['label']}>{title}</p> : null}
      {children}
    </aside>
  );
}
