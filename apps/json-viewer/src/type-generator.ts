export function generateTypeDeclaration(data: unknown): string {
  const typeStr = inferType(data, 0);
  return `declare const data: ${typeStr};\n`;
}

function inferType(value: unknown, depth: number): string {
  if (value === null) return 'null';
  if (typeof value === 'string') return 'string';
  if (typeof value === 'number') return 'number';
  if (typeof value === 'boolean') return 'boolean';

  if (Array.isArray(value)) {
    if (value.length === 0) return 'unknown[]';
    const elementTypes = value.map((v) => inferType(v, depth + 1));
    const unique = [...new Set(elementTypes)];
    const elementType = unique.length === 1 ? unique[0] : `(${unique.join(' | ')})`;
    return `Array<${elementType}>`;
  }

  if (typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>);
    if (entries.length === 0) return 'Record<string, unknown>';
    const indent = '  '.repeat(depth + 1);
    const closingIndent = '  '.repeat(depth);
    const props = entries
      .map(([key, val]) => {
        const safeKey = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key) ? key : `"${key}"`;
        return `${indent}${safeKey}: ${inferType(val, depth + 1)}`;
      })
      .join(';\n');
    return `{\n${props};\n${closingIndent}}`;
  }

  return 'unknown';
}
