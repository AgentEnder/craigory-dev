/** Path separator for visibility paths — null byte can't appear in JSON keys */
export const PATH_SEP = '\0';

export function applyVisibilityFilter(
  data: unknown,
  hiddenPaths: Set<string>
): unknown {
  if (hiddenPaths.size === 0) return data;
  return filterNode(data, '', hiddenPaths);
}

function filterNode(
  value: unknown,
  currentPath: string,
  hiddenPaths: Set<string>
): unknown {
  if (value === null || typeof value !== 'object') return value;

  if (Array.isArray(value)) {
    return value
      .map((item, i) => {
        const path = currentPath
          ? `${currentPath}${PATH_SEP}${i}`
          : String(i);
        if (hiddenPaths.has(path)) return undefined;
        return filterNode(item, path, hiddenPaths);
      })
      .filter((v) => v !== undefined);
  }

  const result: Record<string, unknown> = {};
  for (const [key, val] of Object.entries(
    value as Record<string, unknown>
  )) {
    const path = currentPath ? `${currentPath}${PATH_SEP}${key}` : key;
    if (hiddenPaths.has(path)) continue;
    result[key] = filterNode(val, path, hiddenPaths);
  }
  return result;
}

/**
 * Given a toggled path, find all structurally equivalent paths.
 *
 * At collection boundaries (arrays, dict-like objects), expands to all
 * siblings and searches for the same leaf property at the same depth.
 */
export function findSiblingPaths(
  data: unknown,
  toggledPath: string
): string[] {
  const parts = toggledPath.split(PATH_SEP);
  return walkAndExpand(data, parts, 0, '');
}

function joinPath(prefix: string, key: string): string {
  return prefix ? `${prefix}${PATH_SEP}${key}` : key;
}

function walkAndExpand(
  node: unknown,
  parts: string[],
  depth: number,
  prefix: string
): string[] {
  if (depth >= parts.length) return prefix ? [prefix] : [];
  if (node === null || typeof node !== 'object') return [];

  const key = parts[depth];

  if (Array.isArray(node)) {
    // Array: key is an index. Expand to ALL elements.
    const remaining = parts.length - depth - 1;
    const leafProp = parts[parts.length - 1];
    const results: string[] = [];

    for (let i = 0; i < node.length; i++) {
      const childPrefix = joinPath(prefix, String(i));
      if (remaining === 0) {
        results.push(childPrefix);
      } else {
        results.push(
          ...searchAtDepth(node[i], leafProp, remaining, childPrefix)
        );
      }
    }
    return results;
  }

  const obj = node as Record<string, unknown>;

  if (isDictionaryLike(obj)) {
    // Dict-like object: expand to ALL values
    const remaining = parts.length - depth - 1;
    const leafProp = parts[parts.length - 1];
    const results: string[] = [];

    for (const [k, v] of Object.entries(obj)) {
      const childPrefix = joinPath(prefix, k);
      if (remaining === 0) {
        results.push(childPrefix);
      } else {
        results.push(
          ...searchAtDepth(v, leafProp, remaining, childPrefix)
        );
      }
    }
    return results;
  }

  // Regular object: follow the key literally
  if (key in obj) {
    const nextPrefix = joinPath(prefix, key);
    return walkAndExpand(obj[key], parts, depth + 1, nextPrefix);
  }

  return [];
}

/**
 * Search a subtree for a property named `leafProp` at exactly `depth` levels
 * deep. Allows any intermediate key names, handling arrays by expanding all
 * elements (each consuming one depth level).
 */
function searchAtDepth(
  node: unknown,
  leafProp: string,
  depth: number,
  prefix: string
): string[] {
  if (node === null || typeof node !== 'object') return [];
  if (depth <= 0) return [];

  if (Array.isArray(node)) {
    const results: string[] = [];
    for (let i = 0; i < node.length; i++) {
      results.push(
        ...searchAtDepth(node[i], leafProp, depth - 1, joinPath(prefix, String(i)))
      );
    }
    return results;
  }

  const obj = node as Record<string, unknown>;

  if (depth === 1) {
    if (leafProp in obj) {
      return [joinPath(prefix, leafProp)];
    }
    return [];
  }

  const results: string[] = [];
  for (const [k, v] of Object.entries(obj)) {
    if (v !== null && typeof v === 'object') {
      results.push(
        ...searchAtDepth(v, leafProp, depth - 1, joinPath(prefix, k))
      );
    }
  }
  return results;
}

/**
 * Heuristic: an object is "dictionary-like" if it has 2+ keys and
 * most values are non-null objects (at least 80%). This identifies
 * map/record patterns like { "0.0.1": {...}, "0.1.0": {...} }
 * while tolerating a few non-object entries.
 */
function isDictionaryLike(obj: Record<string, unknown>): boolean {
  const values = Object.values(obj);
  if (values.length < 2) return false;
  const objectCount = values.filter(
    (v) => v !== null && typeof v === 'object'
  ).length;
  return objectCount / values.length >= 0.8;
}
