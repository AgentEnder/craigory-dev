import type { InputHTMLAttributes, TextareaHTMLAttributes } from 'react';
import { cx } from './cx';

/**
 * The shared field treatment. The focus ring is the one visual cue every tool
 * app shares, so it lives here rather than being retyped per input.
 */
const FIELD_BASE =
  'w-full px-4 py-4 bg-white border border-gray-200 rounded-2xl ' +
  'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ' +
  'transition-all duration-200 text-gray-900 placeholder-gray-400';

interface MonoOption {
  /**
   * Render in a monospace face. Needed wherever the exact characters the user
   * typed carry meaning — leading indentation, for instance.
   */
  mono?: boolean;
}

export type TextInputProps = InputHTMLAttributes<HTMLInputElement> & MonoOption;

export function TextInput({ mono, className, ...rest }: TextInputProps) {
  return (
    <input
      className={cx(FIELD_BASE, mono && 'font-mono', className)}
      {...rest}
    />
  );
}

export type TextAreaProps = TextareaHTMLAttributes<HTMLTextAreaElement> &
  MonoOption;

export function TextArea({ mono, className, ...rest }: TextAreaProps) {
  return (
    <textarea
      className={cx(FIELD_BASE, 'resize-none', mono && 'font-mono', className)}
      {...rest}
    />
  );
}
