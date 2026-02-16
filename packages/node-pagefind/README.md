# node-pagefind

A Node.js CLI and SDK for querying [Pagefind](https://pagefind.app/) search indices. Supports both local and remote data sources with automatic version-keyed caching.

## Features

- Query any Pagefind index from Node.js — local or remote
- CLI with `search`, `filters`, and `info` subcommands
- Programmatic SDK via cli-forge's `.sdk()` method
- `PagefindClient` class for fine-grained lifecycle control
- Version-keyed caching in `/tmp/node-pagefind/` with automatic invalidation
- Optional `--cachePath` for custom cache directories (bypasses version management)

## Installation

```bash
npm install node-pagefind
```

## CLI Usage

### Search a remote site

```bash
node-pagefind search "react hooks" --url nx.dev/docs --limit 5 --excerpt
```

### Search a local build

```bash
node-pagefind search "getting started" --path ./dist
```

### List available filters

```bash
node-pagefind filters --url nx.dev/docs
```

### Show index info

```bash
node-pagefind info --url nx.dev/docs
```

### Custom cache directory

```bash
node-pagefind search "query" --url nx.dev/docs --cachePath ./my-cache
```

## SDK Usage

The package exports a cli-forge SDK where each subcommand becomes a typed async function:

```typescript
import { sdk } from 'node-pagefind';

const result = await sdk.search({
  query: 'react hooks',
  url: 'https://nx.dev/docs',
  limit: 5,
});
```

## PagefindClient Usage

For more control over initialization and reuse across multiple queries:

```typescript
import { PagefindClient } from 'node-pagefind';

const client = new PagefindClient({ baseUrl: 'https://nx.dev/docs' });
await client.init('en');

const results = await client.search('react hooks');
const filters = await client.filters();
```

## Caching

By default, downloaded `pagefind.js` files are cached in `/tmp/node-pagefind/<version>/` with a `known-versions.json` map tracking which data source uses which version. If a version mismatch occurs at init time, the cache is invalidated and the client is re-downloaded automatically.

When `cachePath` is provided, the file is stored directly at `<cachePath>/pagefind.js` with no version management — useful for CI/CD or embedded use cases where you want deterministic control over the cache location.

## Development

```bash
# Build
npm run build

# Run tests
npm run test

# Type check
npm run typecheck
```
