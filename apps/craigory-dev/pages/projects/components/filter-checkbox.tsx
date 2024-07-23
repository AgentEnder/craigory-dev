import { useEffect, useRef, useState } from 'react';

export type FilterCheckboxProps = {
  label: string;
  onValueChange: (v: boolean | null) => void;
  allowIndeterminate?: boolean;
  defaultValue: boolean | null;
};

export function FilterCheckbox({
  label,
  onValueChange,
  allowIndeterminate,
  defaultValue,
}: FilterCheckboxProps) {
  const [value, setValue] = useState<boolean | null>(defaultValue);

  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (value === null && allowIndeterminate && input.current) {
      input.current.indeterminate = true;
    }
  }, [value, input, allowIndeterminate]);

  return (
    <>
      <td>
        <div>
          <label htmlFor={label + '-checkbox'}>{label}</label>
        </div>
      </td>
      <td>
        <input
          type="checkbox"
          checked={value === true}
          ref={input}
          id={label + '-checkbox'}
          onChange={(e) => {
            if (value) {
              setValue(false);
              onValueChange(false);
            } else if (value === null || !allowIndeterminate) {
              setValue(true);
              onValueChange(true);
            } else {
              setValue(null);
              onValueChange(null);
            }
          }}
        />
      </td>
    </>
  );
}
