import type { SelectInputProps } from "../types";
import { ChevronIcon } from "./Icons";

// A dropdown with a custom chevron. Used in the forms and in the filter bar.
export default function SelectInput({ id, value, options, placeholder, pill = false, onChange }: SelectInputProps) {
  const shape = pill ? "rounded-full" : "rounded-xl";
  const textColor = value === "" ? "text-muted" : "text-ink";

  return (
    <div className="relative">
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={`h-11 w-full appearance-none truncate border border-line bg-raised pl-3 pr-9 text-sm outline-none transition-colors focus:border-accent ${shape} ${textColor}`}
      >
        {placeholder !== undefined && (
          <option value="" className="bg-card text-muted">
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value} className="bg-card text-ink">
            {option.label}
          </option>
        ))}
      </select>
      <ChevronIcon className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
    </div>
  );
}
