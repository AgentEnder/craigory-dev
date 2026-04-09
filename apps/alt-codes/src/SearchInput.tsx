import { useRef, useEffect } from 'react';
import { withBase } from './utils';

const PLACEHOLDER = 'Search by name, alias, character, U+code, alt number…';

interface ControlledProps {
  value: string;
  onChange: (value: string) => void;
}

interface NavigatingProps {
  value?: undefined;
  onChange?: undefined;
}

type Props = ControlledProps | NavigatingProps;

/**
 * Search input used in every page header.
 *
 * - When `value` + `onChange` are provided (home page): filters the grid in-place.
 * - When uncontrolled (other pages): navigates to home with `?q=term` on Enter.
 * - Cmd+K / Ctrl+K focuses the input on any page.
 */
export function SearchInput({ value, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  // Global Cmd+K / Ctrl+K shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        inputRef.current?.select();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  if (onChange !== undefined) {
    // Controlled — live filtering on home page
    return (
      <input
        ref={inputRef}
        type="search"
        className="search-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={PLACEHOLDER}
      />
    );
  }

  // Uncontrolled — navigate to home with query on Enter
  return (
    <input
      ref={inputRef}
      type="search"
      className="search-input"
      placeholder={PLACEHOLDER}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          const q = (e.currentTarget.value ?? '').trim();
          const dest = withBase('/') + (q ? `?q=${encodeURIComponent(q)}` : '');
          window.location.href = dest;
        }
      }}
    />
  );
}
