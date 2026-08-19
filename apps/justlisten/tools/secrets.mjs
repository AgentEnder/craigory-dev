#!/usr/bin/env node
/**
 * Materializes JustListen's optional provider credentials and hands them to
 * Cloudflare.
 *
 * The `.env.*` files hold 1Password *references* (`secret://op/vault/item/field`),
 * not values, so this script is always run under `secreq run --env-file <file>`,
 * which resolves them into the environment first, then hands them to
 * `wrangler secret bulk`. Cloudflare preserves secrets absent from the payload,
 * so omitting a key here never clears one already set on the Worker.
 *
 * Deploy-time only: `vike dev` runs SSR inside workerd via
 * `@cloudflare/vite-plugin`, which sources local secrets from `.dev.vars`
 * rather than from this process's environment, so there is no dev mode to
 * inject into.
 *
 * Every credential is optional: JustListen falls back to the keyless iTunes API
 * and to per-provider search links. An unresolved key is skipped with a note
 * rather than failing the run.
 */
import { spawn } from 'node:child_process';

/** The only keys this app reads; anything else in the env is ignored. */
const KEYS = ['SPOTIFY_CLIENT_ID', 'SPOTIFY_CLIENT_SECRET', 'YOUTUBE_API_KEY'];

const passthrough = process.argv.slice(3).filter((arg) => arg !== '--');

/**
 * A reference that survived `secreq run` unresolved is a key with no value in
 * 1Password yet — expected while credentials are still being filled in.
 */
const resolved = new Map();
const skipped = [];
for (const key of KEYS) {
  const value = process.env[key];
  if (!value || value.startsWith('secret://')) skipped.push(key);
  else resolved.set(key, value);
}

if (skipped.length > 0) {
  console.log(`[secrets] skipping unset ${skipped.join(', ')}`);
}
if (resolved.size === 0) {
  console.log('[secrets] nothing to push — JustListen will run on iTunes alone');
  process.exit(0);
}

function run(args, stdin) {
  const child = spawn('wrangler', args, {
    stdio: [stdin === undefined ? 'inherit' : 'pipe', 'inherit', 'inherit'],
    shell: false,
  });
  if (stdin !== undefined) child.stdin.end(stdin);
  child.on('error', (error) => {
    console.error(`[secrets] failed to run wrangler: ${error.message}`);
    process.exit(1);
  });
  child.on('exit', (code) => process.exit(code ?? 1));
}

console.log(`[secrets] pushing ${[...resolved.keys()].join(', ')} to Cloudflare`);
run(['secret', 'bulk', ...passthrough], JSON.stringify(Object.fromEntries(resolved)));
