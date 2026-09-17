import type { Settings } from '../src/settings';
import { DelimiterPicker } from './DelimiterPicker';

interface WrapControlsProps {
  settings: Settings;
  onChange: (next: Settings) => void;
  /**
   * Separate from onChange because changing the token also rewrites the source
   * text, which is the page's to hold.
   */
  onTokenChange: (next: string) => void;
}

export function WrapControls({
  settings,
  onChange,
  onTokenChange,
}: WrapControlsProps) {
  // Three controls is enough to overflow the header's right cell on a narrow
  // desktop window, so they are allowed to wrap onto a second row rather than
  // squeezing the title.
  return (
    <div className="flex items-center justify-end gap-x-4 gap-y-2 flex-wrap">
      <DelimiterPicker token={settings.token} onTokenChange={onTokenChange} />
      {/* Named for what it wraps. The source pane has a wrap toggle of its own,
          and that one only changes how the input looks -- this one changes the
          text that gets copied out. */}
      <label
        className="flex items-center gap-2 text-sm text-gray-600"
        title="Reflow long annotations into aligned hanging blocks. Changes the rendered output."
      >
        <input
          type="checkbox"
          checked={settings.wrap}
          onChange={(e) => onChange({ ...settings, wrap: e.target.checked })}
          className="rounded border-gray-300"
        />
        Wrap annotations
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
