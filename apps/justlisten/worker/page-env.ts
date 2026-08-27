/**
 * Threads the Worker's bindings into `pageContext` so page data hooks can read
 * KV and the provider credentials directly.
 *
 * Registered as the first universal middleware in `vike(app, [...])`; whatever
 * it returns is merged into the context Vike exposes to `+data.ts`. This is
 * what lets a data hook call the provider layer in-process instead of fetching
 * its own API over HTTP — one less round trip, and no subrequest budget spent.
 *
 * Both dev and prod run inside workerd (`@cloudflare/vite-plugin` hosts SSR
 * there in dev too), so the Hono runtime's `env` is the single source of
 * bindings in either mode.
 */
import { enhance } from '@universal-middleware/core';
import type { UniversalMiddleware } from '@universal-middleware/core';

import type { Env } from './types';

export const WORKER_ENV_KEY = 'workerEnv' as const;

interface WorkerEnvContext extends Universal.Context {
  [WORKER_ENV_KEY]: Env;
}

declare global {
  namespace Vike {
    interface PageContext {
      /**
       * Worker bindings for server-side hooks. Absent on the client, where
       * `+data.ts` results arrive already serialized.
       */
      workerEnv?: Env;
    }
  }
}

export const workerEnvMiddleware: UniversalMiddleware<
  Universal.Context,
  WorkerEnvContext,
  'hono'
> = enhance(
  (_request, _context, runtime) => {
    const honoRuntime = (
      runtime as { hono?: { env?: Record<string, unknown> } } | undefined
    )?.hono;
    return { [WORKER_ENV_KEY]: (honoRuntime?.env ?? {}) as unknown as Env };
  },
  {
    name: 'justlisten:worker-env',
    order: -900,
    immutable: false,
  }
);
