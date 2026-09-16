import { useEffect, useState } from 'react';
import { clampFraction, DEFAULT_FRACTION } from './split';

const KEY = 'tree-generator:settings';

export interface Settings {
  /**
   * Reflow long annotations into hanging blocks when rendering. This one
   * changes the text the user copies, unlike sourceWrap below.
   */
  wrap: boolean;
  width: number;
  /**
   * Soft-wrap the source field. Purely how the input looks, and off by
   * default: indentation is what nests a node here, so a long annotation
   * folding back under its own indent column is actively misleading. Sideways
   * scrolling keeps one source line on one row, where the depth can be read.
   */
  sourceWrap: boolean;
  /** Share of the split row given to the source pane. */
  split: number;
}

export const DEFAULT_SETTINGS: Settings = {
  wrap: true,
  width: 80,
  sourceWrap: false,
  split: DEFAULT_FRACTION,
};

/**
 * Read one field out of parsed storage, falling back to the default whenever
 * the stored value is missing or the wrong shape -- an older build wrote fewer
 * fields, and nothing stops a user editing the entry by hand.
 */
function field<K extends keyof Settings>(
  parsed: Partial<Settings>,
  key: K,
  valid: (value: unknown) => boolean
): Settings[K] {
  return valid(parsed[key])
    ? (parsed[key] as Settings[K])
    : DEFAULT_SETTINGS[key];
}

const isBoolean = (v: unknown) => typeof v === 'boolean';
const isNumber = (v: unknown) => typeof v === 'number' && Number.isFinite(v);

function read(): Settings {
  // Prerendered on the server, so there is no storage on the first pass.
  if (typeof localStorage === 'undefined') return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw) as Partial<Settings>;
    return {
      wrap: field(parsed, 'wrap', isBoolean),
      width: field(parsed, 'width', isNumber),
      sourceWrap: field(parsed, 'sourceWrap', isBoolean),
      // Clamped rather than merely validated: a stored fraction outside the
      // range would leave one pane too small to grab the divider back from.
      split: clampFraction(field(parsed, 'split', isNumber)),
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);

  // Hydrate after mount so server and client markup agree on the first render.
  useEffect(() => setSettings(read()), []);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(settings));
    } catch {
      // Storage can be unavailable (private mode, blocked cookies). The tool
      // works fine without persistence, so this is not worth surfacing.
    }
  }, [settings]);

  return [settings, setSettings] as const;
}
