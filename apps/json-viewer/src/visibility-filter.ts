export function applyVisibilityFilter(data: unknown, hiddenPaths: Set<string>): unknown {
  if (hiddenPaths.size === 0) return data;
  return filterNode(data, '', hiddenPaths);
}

function filterNode(value: unknown, currentPath: string, hiddenPaths: Set<string>): unknown {
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
