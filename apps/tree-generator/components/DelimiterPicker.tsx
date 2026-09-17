import { useState } from 'react';
import { PRESET_TOKENS } from '../src/delimiter';

interface DelimiterPickerProps {
  token: string;
  onTokenChange: (next: string) => void;
}

const CUSTOM = 'custom';

const isPreset = (token: string): boolean =>
  (PRESET_TOKENS as readonly string[]).includes(token);

/**
 * Picks the token written between a label and its annotation.
 *
 * Custom-ness is held here rather than derived from the token, because a
 * two-character custom token passes through a one-character value on its way
 * in. Deriving it would snap the field shut after the first keystroke of `##`
 * and never let the second one be typed. It still falls back to derivation, so
 * a custom token restored from storage after mount opens the field without an
 * effect to sync the two.
 *
 * The custom field is uncontrolled and commits on blur or Enter rather than
 * per keystroke, which is a correctness requirement and not a preference.
 * Committing each keystroke would rewrite the document through every prefix of
 * what is being typed, and a one-character stop on the way to `//` will happily
 * match a ` / ` that was already sitting in somebody's label, moving the
 * delimiter to the wrong place. Being uncontrolled also means there is no draft
 * state to keep in step with the prop.
 */
export function DelimiterPicker({
  token,
  onTokenChange,
}: DelimiterPickerProps) {
  const [chose, setChose] = useState(false);
  const custom = chose || !isPreset(token);

  return (
    <div className="flex items-center gap-2">
      <label className="flex items-center gap-2 text-sm text-gray-600">
        <span>Comment</span>
        <select
          value={custom ? CUSTOM : token}
          onChange={(e) => {
            const next = e.target.value;
            setChose(next === CUSTOM);
            // Picking Custom opens the field on whatever is in use now.
            // Clearing it here would rewrite every annotation in the document
            // back to the default first, purely on the way to somewhere else.
            if (next !== CUSTOM) onTokenChange(next);
          }}
          className="px-2 py-1 bg-white border border-gray-200 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {PRESET_TOKENS.map((preset) => (
            <option key={preset} value={preset}>
              {preset}
            </option>
          ))}
          <option value={CUSTOM}>Custom</option>
        </select>
      </label>
      {custom && (
        <input
          type="text"
          // Uncontrolled, so mounting it is what seeds it -- which happens
          // exactly when the mode changes.
          defaultValue={token}
          autoFocus={chose}
          onBlur={(e) => onTokenChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key !== 'Enter') return;
            e.preventDefault();
            onTokenChange(e.currentTarget.value);
          }}
          placeholder="--"
          aria-label="Custom comment delimiter"
          title="Applied when you leave the field or press Enter"
          className="w-16 px-2 py-1 bg-white border border-gray-200 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      )}
    </div>
  );
}
