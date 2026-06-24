interface TreeNode {
  children: Map<string, TreeNode>;
  /** True when this node is an actual removal target (a leaf in our tree). */
  isTarget: boolean;
  /** True when this node represents a directory. */
  isDir: boolean;
  /** Recursive file count for a target directory, if known. */
  count?: number;
}

interface Line {
  text: string;
  count?: number;
}

function newNode(): TreeNode {
  return { children: new Map(), isTarget: false, isDir: false };
}

/** Insert each target path into a trie; targets become leaves, intermediate
 * segments become grouping directories. */
function buildTree(
  targets: string[],
  fileCount?: (target: string) => number | undefined
): TreeNode {
  const root = newNode();
  for (const target of targets) {
    const isDir = target.endsWith('/');
    const segments = target
      .replace(/\/+$/, '')
      .split('/')
      .filter((segment) => segment.length > 0);
    if (segments.length === 0) {
      continue;
    }
    let node = root;
    segments.forEach((segment, index) => {
      let child = node.children.get(segment);
      if (!child) {
        child = newNode();
        node.children.set(segment, child);
      }
      if (index < segments.length - 1) {
        child.isDir = true;
      }
      node = child;
    });
    node.isTarget = true;
    node.isDir = isDir;
    node.count = isDir && fileCount ? fileCount(target) : undefined;
  }
  return root;
}

function renderNode(node: TreeNode, prefix: string, lines: Line[]): void {
  const entries = [...node.children.entries()].sort(([a], [b]) =>
    a < b ? -1 : a > b ? 1 : 0
  );
  entries.forEach(([name, child], index) => {
    const isLast = index === entries.length - 1;

    // Collapse a chain of single-child grouping directories into one segment.
    let displayName = name;
    let current = child;
    while (!current.isTarget && current.children.size === 1) {
      const [childName, grandchild] = [...current.children.entries()][0];
      displayName += `/${childName}`;
      current = grandchild;
    }

    const label = current.isDir ? `${displayName}/` : displayName;
    lines.push({
      text: `${prefix}${isLast ? '└── ' : '├── '}${label}`,
      count: current.count,
    });
    renderNode(current, `${prefix}${isLast ? '    ' : '│   '}`, lines);
  });
}

/**
 * Render removal targets as an ASCII tree, grouping them under shared parents.
 * Single-child grouping directories collapse into one segment. When `fileCount`
 * is supplied, directory targets are annotated with their recursive file count,
 * right-aligned into a column. Pure: counting is the caller's concern.
 */
export function renderTree(
  targets: string[],
  fileCount?: (target: string) => number | undefined
): string[] {
  const lines: Line[] = [];
  renderNode(buildTree(targets, fileCount), '', lines);

  const column = Math.max(
    0,
    ...lines.filter((line) => line.count !== undefined).map((l) => l.text.length)
  );
  return lines.map((line) =>
    line.count === undefined
      ? line.text
      : `${line.text.padEnd(column)} (${line.count} file${line.count === 1 ? '' : 's'})`
  );
}
