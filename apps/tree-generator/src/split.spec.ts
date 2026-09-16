import { describe, expect, it } from 'vitest';
import {
  clampFraction,
  DEFAULT_FRACTION,
  fractionForKey,
  fractionFromPointer,
  KEYBOARD_STEP,
  MAX_FRACTION,
  MIN_FRACTION,
  toPercent,
} from './split';

describe('clampFraction', () => {
  it('leaves a fraction inside the range alone', () => {
    expect(clampFraction(0.42)).toBe(0.42);
  });

  it('pins a pane that would be squeezed past the minimum', () => {
    expect(clampFraction(0.01)).toBe(MIN_FRACTION);
    expect(clampFraction(-3)).toBe(MIN_FRACTION);
  });

  it('pins a pane that would swallow the other one', () => {
    expect(clampFraction(0.99)).toBe(MAX_FRACTION);
  });

  it('falls back to the default rather than propagating NaN', () => {
    expect(clampFraction(Number.NaN)).toBe(DEFAULT_FRACTION);
    expect(clampFraction(Number.POSITIVE_INFINITY)).toBe(DEFAULT_FRACTION);
  });
});

describe('fractionFromPointer', () => {
  const rect = { left: 100, width: 400 };

  it('measures the pointer against the row, not the viewport', () => {
    expect(fractionFromPointer(300, rect)).toBe(0.5);
    expect(fractionFromPointer(200, rect)).toBe(0.25);
  });

  it('discounts the gutter, so the divider sits under the cursor', () => {
    // 400px row, 32px of divider and gaps: the panes share 368px, measured
    // from 16px in. A cursor 100px into the row is 84/368 of the way across.
    expect(fractionFromPointer(200, rect, 32)).toBeCloseTo(84 / 368);
    // Dead centre stays dead centre whatever the gutter is.
    expect(fractionFromPointer(300, rect, 32)).toBe(0.5);
  });

  it('clamps a pointer dragged off either end of the row', () => {
    expect(fractionFromPointer(0, rect)).toBe(MIN_FRACTION);
    expect(fractionFromPointer(9999, rect)).toBe(MAX_FRACTION);
  });

  it('survives a row measured before layout settles', () => {
    expect(fractionFromPointer(300, { left: 0, width: 0 })).toBe(
      DEFAULT_FRACTION
    );
    // And a row too narrow to hold its own gutter.
    expect(fractionFromPointer(300, { left: 0, width: 20 }, 32)).toBe(
      DEFAULT_FRACTION
    );
  });
});

describe('fractionForKey', () => {
  it('nudges by one step per arrow press', () => {
    expect(fractionForKey('ArrowRight', 0.5)).toBeCloseTo(0.5 + KEYBOARD_STEP);
    expect(fractionForKey('ArrowLeft', 0.5)).toBeCloseTo(0.5 - KEYBOARD_STEP);
  });

  it('does not step past the ends', () => {
    expect(fractionForKey('ArrowLeft', MIN_FRACTION)).toBe(MIN_FRACTION);
    expect(fractionForKey('ArrowRight', MAX_FRACTION)).toBe(MAX_FRACTION);
  });

  it('jumps to either end', () => {
    expect(fractionForKey('Home', 0.5)).toBe(MIN_FRACTION);
    expect(fractionForKey('End', 0.5)).toBe(MAX_FRACTION);
  });

  it('resets on Enter or Space', () => {
    expect(fractionForKey('Enter', 0.8)).toBe(DEFAULT_FRACTION);
    expect(fractionForKey(' ', 0.2)).toBe(DEFAULT_FRACTION);
  });

  it('returns null for keys it does not own, so the page keeps them', () => {
    expect(fractionForKey('Tab', 0.5)).toBeNull();
    expect(fractionForKey('ArrowUp', 0.5)).toBeNull();
    expect(fractionForKey('a', 0.5)).toBeNull();
  });
});

describe('toPercent', () => {
  it('reports whole percents for aria-valuenow', () => {
    expect(toPercent(0.5)).toBe(50);
    expect(toPercent(0.337)).toBe(34);
  });
});
