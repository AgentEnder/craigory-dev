import type { PageContext } from 'vike/types';

/**
 * Reads a head setting that may be a plain value or a function of the page
 * context. The site's custom settings (`desc`, `imageAlt`) arrive unresolved,
 * since vike only resolves the shapes it defines itself.
 */
export function resolveSetting(
  value: unknown,
  context: PageContext
): string | undefined {
  if (typeof value === 'string') return value;
  if (typeof value === 'function') {
    const resolved = (value as (ctx: PageContext) => unknown)(context);
    return typeof resolved === 'string' ? resolved : undefined;
  }
  return undefined;
}
