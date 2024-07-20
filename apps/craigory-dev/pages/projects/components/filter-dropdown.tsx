type FilterDropdownBaseProps = {
  label: string;
  options: string[];
  defaultValue?: string;
};

type FilterDropdownSingleProps = FilterDropdownBaseProps & {
  multiple?: false;
  onValueChange: (value: string) => void;
};

type FilterDropdownMultipleProps = FilterDropdownBaseProps & {
  multiple: true;
  onValueChange: (value: string[]) => void;
};

export type FilterDropdownProps =
  | FilterDropdownSingleProps
  | FilterDropdownMultipleProps;

export function FilterDropdown({
  label,
  onValueChange,
  options,
  defaultValue,
  multiple,
}: FilterDropdownProps) {
  return (
    <tr>
      <td>
        <div>
          <label htmlFor={label + '-dropdown'}>{label}</label>
        </div>
      </td>
      <td>
        <select
          id={label + '-dropdown'}
          onChange={(e) => {
            if (multiple) {
              onValueChange(
                Array.from(e.target.selectedOptions).map((o) => o.value)
              );
            } else {
              onValueChange(e.target.value);
            }
          }}
          defaultValue={defaultValue}
          multiple={multiple}
          style={{
            width: '100%',
          }}
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </td>
    </tr>
  );
}
