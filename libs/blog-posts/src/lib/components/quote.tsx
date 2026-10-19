import { ReactNode } from 'react';
import { Cite } from './cite';
import classes from './quote.module.scss';

export interface QuoteProps {
  /** Source URL. Used for both the attribution link and the citation marker. */
  href: string;
  /** Who said it, e.g. "Seth Larson". */
  by: string;
  /** The work it appeared in. Rendered inside a semantic <cite>. */
  work?: string;
  /** Citation body for the marker's popover, and for the source list. */
  cite?: ReactNode;
  /** The quoted text. */
  children?: ReactNode;
}

/**
 * A quotation that carries its own source. Renders the standard
 * figure/blockquote/figcaption pairing, so the attribution is associated with
 * the quote rather than trailing off the sentence that introduced it.
 */
export function Quote({ href, by, work, cite, children }: QuoteProps) {
  return (
    <figure className={classes['quote']}>
      <blockquote cite={href}>{children}</blockquote>
      <figcaption className={classes['attribution']}>
        <span className={classes['dash']} aria-hidden="true">
          —{' '}
        </span>
        <a href={href} target="_blank" rel="noopener noreferrer">
          {by}
        </a>
        {work ? (
          <>
            , <cite>{work}</cite>
          </>
        ) : null}
        <Cite href={href}>{cite}</Cite>
      </figcaption>
    </figure>
  );
}
