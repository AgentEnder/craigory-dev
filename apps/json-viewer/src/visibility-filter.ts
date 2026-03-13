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
        const path = currentPath ? `${currentPath}.${i}` : String(i);
        if (hiddenPaths.has(path)) return undefined;
        return filterNode(item, path, hiddenPaths);
      })
      .filter((v) => v !== undefined);
  }

  const result: Record<string, unknown> = {};
  for (const [key, val] of Object.entries(value as Record<string, unknown>)) {
    const path = currentPath ? `${currentPath}.${key}` : key;
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
 *
 * Example: toggling "arr.0.a.x.foo" also finds "arr.1.b.x.foo" because
 * both reach property "foo" at depth 3 within array siblings.
 */
export function findSiblingPaths(
  data: unknown,
  toggledPath: string
): string[] {
  const parts = toggledPath.split('.');
  return walkAndExpand(data, parts, 0, '');
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
      const childPrefix = prefix ? `${prefix}.${i}` : String(i);
      if (remaining === 0) {
        // The toggled item IS an array element (no deeper property)
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
      const childPrefix = prefix ? `${prefix}.${k}` : k;
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
    const nextPrefix = prefix ? `${prefix}.${key}` : key;
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
    // Array in the middle of a search — each element consumes one depth level
    const results: string[] = [];
    for (let i = 0; i < node.length; i++) {
      results.push(
        ...searchAtDepth(node[i], leafProp, depth - 1, `${prefix}.${i}`)
      );
    }
    return results;
  }

  const obj = node as Record<string, unknown>;

  if (depth === 1) {
    // At the target depth: look for the leaf property
    if (leafProp in obj) {
      return [`${prefix}.${leafProp}`];
    }
    return [];
  }

  // Recurse deeper into all keys
  const results: string[] = [];
  for (const [k, v] of Object.entries(obj)) {
    if (v !== null && typeof v === 'object') {
      results.push(
        ...searchAtDepth(v, leafProp, depth - 1, `${prefix}.${k}`)
      );
    }
  }
  return results;
}

/**
 * Heuristic: an object is "dictionary-like" if it has 2+ keys and all
 * values are non-null objects. This identifies map/record patterns like
 * { lodash: { version: "4" }, react: { version: "18" } }.
 */
function isDictionaryLike(obj: Record<string, unknown>): boolean {
  const values = Object.values(obj);
  if (values.length < 2) return false;
  return values.every((v) => v !== null && typeof v === 'object');
}
