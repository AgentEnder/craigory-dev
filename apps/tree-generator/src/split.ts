/**
 * Geometry for the draggable divider between the source and output panes.
 *
 * All of it is pure arithmetic on a single number -- the share of the row the
 * left pane takes -- so the component that owns the pointer events stays a thin
 * layer over functions that can be tested without a DOM.
 */

/**
 * How little a pane may be squeezed to. Below roughly a fifth neither pane
 * shows a useful number of monospace columns, so collapsing further only makes
 * the divider hard to grab back.
 */
export const MIN_FRACTION = 0.2;
export const MAX_FRACTION = 0.8;
export const DEFAULT_FRACTION = 0.5;

/**
 * Keyboard nudge per arrow press. Small enough to land on a column boundary
 * that a drag would have overshot, large enough to cross the pane in a
 * held-down burst rather than a hundred presses.
 */
export const KEYBOARD_STEP = 0.02;

export function clampFraction(fraction: number): number {
  if (!Number.isFinite(fraction)) return DEFAULT_FRACTION;
  return Math.min(MAX_FRACTION, Math.max(MIN_FRACTION, fraction));
}

/**
 * Total width the divider and its two gaps take out of the row. The panes
 * share what is left, so it has to come off before the fraction is worked out
 * or the divider lags the cursor by up to half of it at the ends of the range.
 *
 * Kept in step by hand with the `w-4` handle and `md:gap-2` in SplitPane.
 */
export const GUTTER_PX = 32;

/**
 * Where the pointer sits within the row, as a fraction of the space the two
 * panes actually divide.
 *
 * A row narrower than its own gutter would divide by zero or worse -- it
 * happens in the frame before layout settles -- so it falls back to the
 * default rather than producing NaN.
 */
export function fractionFromPointer(
  clientX: number,
  rect: { left: number; width: number },
  gutter = 0
): number {
  const track = rect.width - gutter;
  if (track <= 0) return DEFAULT_FRACTION;
  // Measured from the middle of the gutter, which is where the divider is.
  return clampFraction((clientX - rect.left - gutter / 2) / track);
}

/**
 * The fraction a key should move the divider to, or null when the key is not
 * one this control handles -- which is the caller's cue to leave the event
 * alone so the page keeps its normal behaviour.
 */
export function fractionForKey(key: string, current: number): number | null {
  switch (key) {
    case 'ArrowLeft':
      return clampFraction(current - KEYBOARD_STEP);
    case 'ArrowRight':
      return clampFraction(current + KEYBOARD_STEP);
    case 'Home':
      return MIN_FRACTION;
    case 'End':
      return MAX_FRACTION;
    // The keyboard counterpart to double-clicking the divider. A focused
    // separator is not a button, so nothing else claims these two.
    case 'Enter':
    case ' ':
      return DEFAULT_FRACTION;
    default:
      return null;
  }
}

/** Whole-percent value for `aria-valuenow`, which will not take a fraction. */
export function toPercent(fraction: number): number {
  return Math.round(fraction * 100);
}
