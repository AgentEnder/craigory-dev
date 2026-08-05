import type { Settings } from '../src/settings';

interface WrapControlsProps {
  settings: Settings;
  onChange: (next: Settings) => void;
}

export function WrapControls({ settings, onChange }: WrapControlsProps) {
  return (
    <div className="flex items-center gap-3">
      <label className="flex items-center gap-2 text-sm text-gray-600">
        <input
          type="checkbox"
          checked={settings.wrap}
          onChange={(e) => onChange({ ...settings, wrap: e.target.checked })}
          className="rounded border-gray-300"
        />
        Wrap
      </label>
      <label className="flex items-center gap-2 text-sm text-gray-600">
        <span className={settings.wrap ? '' : 'text-gray-400'}>Width</span>
        <input
          type="number"
          min={20}
          max={300}
          value={settings.width}
          disabled={!settings.wrap}
          onChange={(e) => {
            const width = Number(e.target.value);
            if (Number.isFinite(width)) onChange({ ...settings, width });
          }}
          className="w-20 px-2 py-1 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
        />
      </label>
    </div>
  );
}
