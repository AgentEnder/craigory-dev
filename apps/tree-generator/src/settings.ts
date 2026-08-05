import { useEffect, useState } from 'react';

const KEY = 'tree-generator:settings';

export interface Settings {
  wrap: boolean;
  width: number;
}

export const DEFAULT_SETTINGS: Settings = { wrap: true, width: 80 };

function read(): Settings {
  // Prerendered on the server, so there is no storage on the first pass.
  if (typeof localStorage === 'undefined') return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw) as Partial<Settings>;
    return {
      wrap: typeof parsed.wrap === 'boolean' ? parsed.wrap : DEFAULT_SETTINGS.wrap,
      width:
        typeof parsed.width === 'number' && Number.isFinite(parsed.width)
          ? parsed.width
          : DEFAULT_SETTINGS.width,
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
