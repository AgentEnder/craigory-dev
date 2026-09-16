import { cx } from '@new-personal-monorepo/small-app-design-system';

interface ToggleChipProps {
  label: string;
  pressed: boolean;
  onPressedChange: (next: boolean) => void;
  title?: string;
}

/**
 * A compact on/off control for a pane's own view settings, sized to sit in a
 * pane header beside a heading.
 *
 * The state is spelled out in the text rather than carried by colour alone --
 * at this size a filled-versus-outlined chip is not a reliable signal, and it
 * is no signal at all to anyone who cannot pick the two apart.
 */
export function ToggleChip({
  label,
  pressed,
  onPressedChange,
  title,
}: ToggleChipProps) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      title={title}
      onClick={() => onPressedChange(!pressed)}
      className={cx(
        'px-2.5 py-1 rounded-lg border text-xs font-medium transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-blue-500 active:scale-[0.98]',
        pressed
          ? 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200'
          : 'bg-white border-gray-200 text-gray-400 hover:text-gray-600 hover:border-gray-300'
      )}
    >
      {label} {pressed ? 'on' : 'off'}
    </button>
  );
}
