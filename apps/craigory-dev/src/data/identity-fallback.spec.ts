import { describe, expect, it, vi } from 'vitest';
import { type Identity, runWithFallback } from './identity-fallback';

const forbidden = (message = 'forbidden') =>
  Object.assign(new Error(message), { status: 403 });

const isForbidden = (error: unknown) =>
  (error as { status?: number })?.status === 403;

const identities: Identity<string>[] = [
  { name: 'auth', client: 'pat' },
  { name: 'public', client: 'app-token' },
  { name: 'anon', client: 'none' },
];

describe('runWithFallback', () => {
  it('uses the first identity when it works', async () => {
    const fn = vi.fn(async (c: string) => c);
    await expect(
      runWithFallback(identities, fn, { isRefusal: isForbidden })
    ).resolves.toBe('pat');
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('falls through each refusal in order', async () => {
    const tried: string[] = [];
    const fn = vi.fn(async (c: string) => {
      tried.push(c);
      if (c !== 'none') throw forbidden();
      return 'ok';
    });

    await expect(
      runWithFallback(identities, fn, { isRefusal: isForbidden })
    ).resolves.toBe('ok');
    expect(tried).toEqual(['pat', 'app-token', 'none']);
  });

  it('reaches the anonymous floor when both tokens are refused', async () => {
    // The property this module exists for: an org policy we do not control
    // must not be able to fail the build outright.
    const fn = vi.fn(async (c: string) => {
      if (c === 'none') return 'public data';
      throw forbidden('organization forbids access via a fine-grained PAT');
    });

    await expect(
      runWithFallback(identities, fn, { isRefusal: isForbidden })
    ).resolves.toBe('public data');
  });

  it('rethrows a failure that is not a refusal, without trying the rest', async () => {
    const fn = vi.fn(async () => {
      throw Object.assign(new Error('boom'), { status: 500 });
    });

    await expect(
      runWithFallback(identities, fn, { isRefusal: isForbidden })
    ).rejects.toThrow('boom');
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('surfaces the last identity failure rather than swallowing it', async () => {
    // Everything refused, including the floor: that is a real error and must
    // not be reported as success or as a confusing "no identities" message.
    const fn = vi.fn(async () => {
      throw forbidden('nope');
    });

    await expect(
      runWithFallback(identities, fn, { isRefusal: isForbidden })
    ).rejects.toThrow('nope');
    expect(fn).toHaveBeenCalledTimes(3);
  });

  it('announces each fallback so a log says which identity was refused', async () => {
    const onFallback = vi.fn();
    const fn = vi.fn(async (c: string) => {
      if (c === 'pat') throw forbidden();
      return 'ok';
    });

    await runWithFallback(identities, fn, {
      isRefusal: isForbidden,
      onFallback,
    });

    expect(onFallback).toHaveBeenCalledTimes(1);
    const [from, to] = onFallback.mock.calls[0];
    expect(from.name).toBe('auth');
    expect(to.name).toBe('public');
  });

  it('honours startAt so a known-refused identity is not retried', async () => {
    const tried: string[] = [];
    const fn = vi.fn(async (c: string) => {
      tried.push(c);
      return c;
    });

    await runWithFallback(identities, fn, {
      isRefusal: isForbidden,
      startAt: 2,
    });
    expect(tried).toEqual(['none']);
  });

  it('refuses an empty chain loudly', async () => {
    await expect(
      runWithFallback(identities, async () => 'x', {
        isRefusal: isForbidden,
        startAt: identities.length,
      })
    ).rejects.toThrow(/no identities/);
  });
});
