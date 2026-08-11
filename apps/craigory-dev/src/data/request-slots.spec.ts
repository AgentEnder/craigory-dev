import { describe, expect, it } from 'vitest';
import { RequestSlots } from './request-slots';

/** A promise plus the handles to settle it, so a test can hold work open. */
function deferred<T = void>() {
  let resolve!: (value: T) => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

/** Lets every already-queued microtask drain. */
const settle = () => new Promise((r) => setTimeout(r, 0));

describe('RequestSlots', () => {
  it('rejects a nonsensical limit rather than silently letting everything through', () => {
    expect(() => new RequestSlots(0)).toThrow(/positive integer/);
    expect(() => new RequestSlots(-1)).toThrow(/positive integer/);
    expect(() => new RequestSlots(1.5)).toThrow(/positive integer/);
  });

  it('never lets more than `limit` calls run at once', async () => {
    const limit = 3;
    const slots = new RequestSlots(limit);

    let running = 0;
    let peak = 0;
    const gate = deferred();

    // Far more callers than slots, all started at once.
    const calls = Array.from({ length: 25 }, () =>
      slots.run(async () => {
        running++;
        peak = Math.max(peak, running);
        await gate.promise;
        running--;
      })
    );

    await settle();
    // The cap is holding: only `limit` bodies have started.
    expect(running).toBe(limit);
    expect(slots.waiting).toBe(25 - limit);

    gate.resolve();
    await Promise.all(calls);

    expect(peak).toBe(limit);
    expect(slots.inFlight).toBe(0);
    expect(slots.waiting).toBe(0);
  });

  it('actually runs work in parallel up to the limit', async () => {
    // Guards against the opposite failure: a "cap" that serialises everything.
    const slots = new RequestSlots(4);
    let running = 0;
    let peak = 0;
    const gate = deferred();

    const calls = Array.from({ length: 4 }, () =>
      slots.run(async () => {
        running++;
        peak = Math.max(peak, running);
        await gate.promise;
        running--;
      })
    );

    await settle();
    gate.resolve();
    await Promise.all(calls);

    expect(peak).toBe(4);
  });

  it('releases the slot when the call rejects', async () => {
    const slots = new RequestSlots(1);

    await expect(
      slots.run(async () => {
        throw new Error('boom');
      })
    ).rejects.toThrow('boom');

    expect(slots.inFlight).toBe(0);

    // A failed call must not strand the slot, or the next one hangs forever.
    await expect(slots.run(async () => 'ok')).resolves.toBe('ok');
  });

  it('hands a freed slot to the longest-waiting caller', async () => {
    const slots = new RequestSlots(1);
    const order: number[] = [];
    const gate = deferred();

    const first = slots.run(async () => {
      order.push(0);
      await gate.promise;
    });
    await settle();

    const rest = [1, 2, 3].map((n) =>
      slots.run(async () => {
        order.push(n);
      })
    );

    gate.resolve();
    await Promise.all([first, ...rest]);

    expect(order).toEqual([0, 1, 2, 3]);
  });

  it('does not release a slot before the call settles', async () => {
    // The `return await fn()` subtlety: returning the promise unawaited would
    // free the slot immediately and make the limit a no-op.
    const slots = new RequestSlots(1);
    const gate = deferred();
    let secondStarted = false;

    const first = slots.run(() => gate.promise);
    const second = slots.run(async () => {
      secondStarted = true;
    });

    await settle();
    expect(secondStarted).toBe(false);

    gate.resolve();
    await Promise.all([first, second]);
    expect(secondStarted).toBe(true);
  });
});
