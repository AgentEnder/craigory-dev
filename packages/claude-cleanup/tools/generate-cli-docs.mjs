#!/usr/bin/env node
// Generates CLI reference documentation by importing the built CLI and
// feeding it to cli-forge's internal `generateDocumentation()` helper.
//
// We work around two cli-forge ergonomics issues here:
//   1) `cli-forge generate-documentation` resolves its `<cli>` argument
//      relative to cli-forge itself, not the caller's cwd — which breaks for
//      anything living inside a pnpm store.
//   2) The documentation helper isn't re-exported via cli-forge's package
//      exports, so we load it by resolved file URL instead of package
//      specifier. Harmless; the surface is stable inside dist/.
//
// Run `pnpm build` first — this script reads from ./dist/cli.js.
import { createRequire } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';
import {
  mkdirSync,
  rmSync,
  writeFileSync,
  existsSync,
} from 'node:fs';
import { dirname, join, relative } from 'node:path';
import {
  join as joinPosix,
  normalize as normalizePosix,
} from 'node:path/posix';

const packageRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const require = createRequire(import.meta.url);

const cliForgePkg = require.resolve('cli-forge/package.json', {
  paths: [packageRoot],
});
const cliForgeDocPath = join(
  dirname(cliForgePkg),
  'dist',
  'lib',
  'documentation.js',
);
const { generateDocumentation } = await import(
  pathToFileURL(cliForgeDocPath).href
);

const mdFactoryPath = require.resolve('markdown-factory', {
  paths: [packageRoot],
});
const md = await import(pathToFileURL(mdFactoryPath).href);

const cliMod = await import(
  pathToFileURL(join(packageRoot, 'dist', 'cli.js')).href
);
const cli = cliMod.default?.default ?? cliMod.default ?? cliMod;

const docs = generateDocumentation(cli);
const outDir = join(packageRoot, 'docs', 'cli');
rmSync(outDir, { recursive: true, force: true });
mkdirSync(outDir, { recursive: true });

await writeMarkdownTree(docs, outDir, outDir);
writeFileSync(
  join(outDir, `${docs.name}.json`),
  JSON.stringify(docs, null, 2) + '\n',
);

console.log(
  `Wrote CLI reference docs to ${relative(packageRoot, outDir)}`,
);

async function writeMarkdownTree(node, outDirForNode, rootDir) {
  const hasSubs = node.subcommands.length > 0;
  const dir = hasSubs ? outDirForNode : dirname(outDirForNode);
  const basename = hasSubs ? 'index' : node.name;

  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });

  const body = md.h1(
    node.name,
    ...[
      [md.bold('Usage:'), md.code(node.usage)].join(' '),
      node.description,
      flagsSection(node.options, 'Flags'),
      ...node.groupedOptions.map((group) =>
        flagsSection(
          Object.fromEntries(group.keys.map((k) => [k.key, k])),
          group.label,
        ),
      ),
      subcommandsSection(node.subcommands, dir, rootDir),
      examplesSection(node.examples),
    ].filter(Boolean),
  );

  writeFileSync(join(dir, `${basename}.md`), body + '\n');

  for (const sub of node.subcommands) {
    await writeMarkdownTree(sub, join(dir, sub.name), rootDir);
  }
}

function flagsSection(options, label) {
  const entries = Object.values(options);
  if (entries.length === 0) return undefined;
  return md.h2(label, ...entries.map(formatOption));
}

function formatOption(option) {
  return md.h3(
    option.key,
    ...[
      `${md.bold('Type:')} ${formatType(option)}`,
      option.description,
      option.default !== undefined
        ? `${md.bold('Default:')} ${md.code(JSON.stringify(option.default))}`
        : undefined,
      option.required && option.default === undefined
        ? md.bold('Required')
        : undefined,
      option.alias?.length
        ? md.h4('Aliases', md.ul(...option.alias))
        : undefined,
    ].filter(Boolean),
  );
}

function formatType(option) {
  if (option.type === 'array' && 'items' in option) {
    return `${option.items}[]`;
  }
  return option.type;
}

function subcommandsSection(subcommands, dir, rootDir) {
  if (subcommands.length === 0) return undefined;
  return md.h2(
    'Subcommands',
    ...subcommands.map((sub) =>
      md.link(
        './' +
          joinPosix(
            normalizePosix(relative(rootDir, dir)),
            sub.name + '.md',
          ),
        sub.name,
      ),
    ),
  );
}

function examplesSection(examples) {
  if (!examples?.length) return undefined;
  return md.h2('Examples', ...examples.map((e) => md.codeBlock(e, 'shell')));
}
