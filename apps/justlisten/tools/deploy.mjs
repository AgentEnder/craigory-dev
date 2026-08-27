#!/usr/bin/env node
/**
 * Ships the built Worker to Cloudflare, as either a production deployment or
 * a PR preview version.
 *
 *   node tools/deploy.mjs             # wrangler deploy      (serves traffic)
 *   node tools/deploy.mjs --preview   # wrangler versions upload (0% traffic)
 *
 * `--preview` uploads a *version* rather than deploying one. A version is
 * uploaded at 0% traffic and gets its own URL, so production keeps serving the
 * previously deployed version untouched — which is the whole point on a PR.
 * `--preview-alias pr-<n>` makes that URL stable across pushes to the same PR
 * instead of changing with every version id.
 *
 * Preview versions bind production's KV namespaces (there is only one pair),
 * so `--var KV_PREFIX:pr-<n>` namespaces every key they touch. See
 * `worker/kv-scope.ts` for how that prefix is applied.
 *
 * Building is Nx's job, not this script's: the `deploy` target depends on
 * `build`, so `dist/` and the generated `dist/server/wrangler.json` are
 * already in place by the time we run.
 */
import { spawn } from 'node:child_process';

const preview = process.argv.includes('--preview');

/**
 * Locally, wrangler authenticates through an interactive OAuth login, so the
 * absence of an API token says nothing. In CI it is the only way in, and this
 * repo may not have the secret set yet (or the PR may come from a fork, where
 * secrets are withheld by design) — so skip with a note instead of failing a
 * whole PR check on a deployment that was never going to be possible.
 */
if (process.env.CI && !process.env.CLOUDFLARE_API_TOKEN) {
  console.log(
    '[deploy] no CLOUDFLARE_API_TOKEN in CI — skipping JustListen ' +
      `${preview ? 'preview upload' : 'deploy'}`
  );
  process.exit(0);
}

const args = ['deploy'];

if (preview) {
  // github.event.number on a pull_request event. Without it there is nothing
  // to scope a preview to: an unprefixed upload would share production's KV
  // keys, and an unaliased one would be unreachable from the PR comment.
  const prNumber = process.env.PR_NUMBER;
  if (!/^\d+$/.test(prNumber ?? '')) {
    console.error(
      `[deploy] --preview needs a numeric PR_NUMBER, got ${JSON.stringify(
        prNumber
      )}`
    );
    process.exit(1);
  }
  const slug = `pr-${prNumber}`;
  args.length = 0;
  args.push(
    'versions',
    'upload',
    '--preview-alias',
    slug,
    '--var',
    `KV_PREFIX:${slug}`,
    '--message',
    `Preview for PR #${prNumber}`
  );
}

console.log(`[deploy] wrangler ${args.join(' ')}`);

const child = spawn('wrangler', args, { stdio: 'inherit', shell: false });
child.on('error', (error) => {
  console.error(`[deploy] failed to run wrangler: ${error.message}`);
  process.exit(1);
});
child.on('exit', (code) => process.exit(code ?? 1));
