export type RelatedItemType = 'blog' | 'presentation' | 'project';

export interface RelatedItem {
  type: RelatedItemType;
  slug: string;
  title: string;
  description: string;
  /** Site-relative; the renderer adds the base path. */
  url: string;
  /** Cosine similarity in [0, 1]. Higher is closer. */
  score: number;
}

/** Keyed by `${type}:${slug}` — see `relatedKey`. */
export type RelatedMap = Record<string, RelatedItem[]>;

export function relatedKey(type: RelatedItemType, slug: string): string {
  return `${type}:${slug}`;
}
