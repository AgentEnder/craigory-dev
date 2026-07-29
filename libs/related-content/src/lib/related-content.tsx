import { getRelated } from './related-data';
import type { RelatedItem, RelatedItemType } from './types';
import styles from './related-content.module.scss';

const TYPE_LABEL: Record<RelatedItemType, string> = {
  blog: 'Post',
  presentation: 'Talk',
  project: 'Project',
};

export interface RelatedContentProps {
  type: RelatedItemType;
  slug: string;
  /** Defaults to "Related". Presentation and project cards use a tighter label. */
  heading?: string;
  /** Cap the rendered list; the generated map already holds a small top-N. */
  limit?: number;
  className?: string;
}

/**
 * Renders build-time related material for one item.
 *
 * Deliberately renders nothing — not an empty heading — when there is nothing
 * related. The generated map omits weak matches entirely, so an absent section
 * means "no good neighbours", which is a better result than four bad links.
 */
export function RelatedContent({
  type,
  slug,
  heading = 'Related',
  limit,
  className,
}: RelatedContentProps) {
  const items = getRelated(type, slug);
  const shown = limit ? items.slice(0, limit) : items;
  if (!shown.length) return null;

  return (
    <nav
      className={[styles.related, className].filter(Boolean).join(' ')}
      aria-label={heading}
    >
      <h2 className={styles.heading}>{heading}</h2>
      <ul className={styles.list}>
        {shown.map((item) => (
          <RelatedLink key={`${item.type}:${item.slug}`} item={item} />
        ))}
      </ul>
    </nav>
  );
}

function RelatedLink({ item }: { item: RelatedItem }) {
  return (
    <li className={styles.item}>
      <a className={styles.link} href={item.url}>
        <span className={styles.kind}>{TYPE_LABEL[item.type]}</span>
        <span className={styles.title}>{item.title}</span>
        {item.description && (
          <span className={styles.description}>{item.description}</span>
        )}
      </a>
    </li>
  );
}
