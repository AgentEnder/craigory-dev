/**
 * Isolate initialisation must be cached on success and FORGOTTEN on failure.
 *
 * Separate file so the wasm module mocks cannot leak into render.spec.ts. Offline — these run
 * on every push, unlike the live spike suite.
 */

import { beforeEach, describe, expect, it, vi } from 'vitest';

const initWasm = vi.fn();
const initSatoriWasm = vi.fn();

vi.mock('@resvg/resvg-wasm', () => ({
  initWasm: (...args: unknown[]) => initWasm(...args),
  Resvg: class {},
}));

vi.mock('satori/standalone', () => ({
  default: vi.fn(),
  init: (...args: unknown[]) => initSatoriWasm(...args),
}));

const wasm = new Uint8Array([0, 97, 115, 109]);

/** Re-import with a fresh module registry so the cached promises start empty each time. */
async function freshRender() {
  vi.resetModules();
  return import('./render');
}

beforeEach(() => {
  initWasm.mockReset();
  initSatoriWasm.mockReset();
});

describe('initResvg', () => {
  it('initialises once and reuses the result', async () => {
    const { initResvg } = await freshRender();
    initWasm.mockResolvedValue(undefined);

    await initResvg(wasm);
    await initResvg(wasm);

    expect(initWasm).toHaveBeenCalledTimes(1);
  });

  it('treats "Already initialized" as success rather than an error', async () => {
    const { initResvg } = await freshRender();
    initWasm.mockRejectedValue(new Error('Already initialized'));

    await expect(initResvg(wasm)).resolves.toBeUndefined();
  });

  it('retries after a failure instead of wedging the isolate', async () => {
    // The regression this guards: caching the REJECTED promise meant every later request in
    // that isolate re-threw the original error forever, with no way back. A Worker isolate
    // serves many requests, so one bad init would have poisoned all of them.
    const { initResvg } = await freshRender();
    initWasm.mockRejectedValueOnce(new Error('wasm compile failed'));

    await expect(initResvg(wasm)).rejects.toThrow('wasm compile failed');

    initWasm.mockResolvedValue(undefined);
    await expect(initResvg(wasm)).resolves.toBeUndefined();
    expect(initWasm).toHaveBeenCalledTimes(2);
  });
});

describe('initSatori', () => {
  it('initialises once and reuses the result', async () => {
    const { initSatori } = await freshRender();
    initSatoriWasm.mockResolvedValue(undefined);

    await initSatori(wasm);
    await initSatori(wasm);

    expect(initSatoriWasm).toHaveBeenCalledTimes(1);
  });

  it('retries after a failure instead of wedging the isolate', async () => {
    const { initSatori } = await freshRender();
    initSatoriWasm.mockRejectedValueOnce(new Error('yoga init failed'));

    await expect(initSatori(wasm)).rejects.toThrow('yoga init failed');

    initSatoriWasm.mockResolvedValue(undefined);
    await expect(initSatori(wasm)).resolves.toBeUndefined();
    expect(initSatoriWasm).toHaveBeenCalledTimes(2);
  });
});
