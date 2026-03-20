/**
 * Classifies a collection (array or object) and returns chunk/collapse
 * thresholds tuned to its structure.
 *
 * From most to least collapsible:
 *   1. Dictionary-like objects — repetitive maps, collapse eagerly
 *   2. Regular objects — unique keys, collapse eagerly
 *   3. Heterogeneous arrays — mixed types, moderate threshold
 *   4. Homogeneous arrays — uniform shape, easy to scan, collapse late
 */

interface CollectionTraits {
  chunkSize: number;
  collapseThreshold: number;
}

export function getCollectionTraits(value: unknown): CollectionTraits {
  if (Array.isArray(value)) {
    return isHomogeneousArray(value)
      ? { chunkSize: 50, collapseThreshold: 100 }
      : { chunkSize: 25, collapseThreshold: 50 };
  }

  if (value !== null && typeof value === 'object') {
    const obj = value as Record<string, unknown>;
    return isDictionaryLike(obj)
      ? { chunkSize: 10, collapseThreshold: 10 }
      : { chunkSize: 15, collapseThreshold: 20 };
  }

  return { chunkSize: 10, collapseThreshold: 10 };
}

/**
 * An array is "homogeneous" if all elements share the same structural type.
 *
 * For primitives: all elements have the same typeof.
 * For objects: all non-null object elements share ≥50% key overlap
 *   (sampled for performance on large arrays).
 */
function isHomogeneousArray(arr: unknown[]): boolean {
  if (arr.length < 2) return true;

  const sample = arr.length > 10 ? sampleItems(arr, 10) : arr;

  const firstType = classifyElement(sample[0]);
  if (firstType === 'mixed') return false;

  for (let i = 1; i < sample.length; i++) {
    if (classifyElement(sample[i]) !== firstType) return false;
  }

  if (firstType !== 'object') return true;

  // For object arrays, check structural similarity via key overlap
  const objectSample = sample.filter(
    (v): v is Record<string, unknown> =>
      v !== null && typeof v === 'object' && !Array.isArray(v)
  );
  if (objectSample.length < 2) return true;

  const keySets = objectSample.map((v) => new Set(Object.keys(v)));
  for (let i = 0; i < keySets.length - 1; i++) {
    const a = keySets[i];
    const b = keySets[i + 1];
    const intersection = [...a].filter((k) => b.has(k)).length;
    const smaller = Math.min(a.size, b.size);
    if (smaller > 0 && intersection / smaller < 0.5) return false;
  }

  return true;
}

function classifyElement(value: unknown): string {
  if (value === null) return 'null';
  if (Array.isArray(value)) return 'array';
  return typeof value;
}

/**
 * Deterministic sampling: picks evenly spaced items from the array.
 * Avoids bias toward the beginning that `.slice(0, n)` introduces.
 */
function sampleItems<T>(arr: T[], count: number): T[] {
  const step = arr.length / count;
  const result: T[] = [];
  for (let i = 0; i < count; i++) {
    result.push(arr[Math.floor(i * step)]);
  }
  return result;
}

/**
 * An object is "dictionary-like" if it has 2+ keys, most values are
 * non-null objects, and those objects share structurally similar shapes
 * (high key overlap). Identifies Record<string, T> patterns.
 */
function isDictionaryLike(obj: Record<string, unknown>): boolean {
  const values = Object.values(obj);
  if (values.length < 2) return false;

  const objectValues = values.filter(
    (v): v is Record<string, unknown> =>
      v !== null && typeof v === 'object' && !Array.isArray(v)
  );
  if (objectValues.length / values.length < 0.8) return false;

  const sample = objectValues.slice(0, 6);
  const keySets = sample.map((v) => new Set(Object.keys(v)));

  for (let i = 0; i < keySets.length - 1; i++) {
    const a = keySets[i];
    const b = keySets[i + 1];
    const intersection = [...a].filter((k) => b.has(k)).length;
    const smaller = Math.min(a.size, b.size);
    if (smaller > 0 && intersection / smaller < 0.5) return false;
  }

  return true;
}
