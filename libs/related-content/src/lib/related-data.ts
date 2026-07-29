import type { RelatedItem, RelatedItemType, RelatedMap } from './types';
import { relatedKey } from './types';

/**
 * The generated map, loaded so that its absence is a normal state.
 *
 * `src/generated/related.json` is gitignored — it is a build artifact of an
 * embedding pass that downloads a ~130MB model. A plain `import` of a missing
 * file is a hard build error, which would mean a fresh clone could not run
 * `vike dev` or typecheck until that pass had been run at least once.
 * `import.meta.glob` resolves a non-matching pattern to `{}` instead, so the
 * site simply renders no Related sections.
 */
const generated = import.meta.glob<{ default: RelatedMap }>(
  '../generated/related.json',
  { eager: true }
);

export const RELATED: RelatedMap = Object.values(generated)[0]?.default ?? {};

export function getRelated(type: RelatedItemType, slug: string): RelatedItem[] {
  return RELATED[relatedKey(type, slug)] ?? [];
}
