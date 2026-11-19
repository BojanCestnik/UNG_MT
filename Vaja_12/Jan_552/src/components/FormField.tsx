import type { FormFieldProps } from "../types";

// A label above an input, and a red error message below it.
export default function FormField({ label, htmlFor, error, children }: FormFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="whitespace-nowrap text-[11px] font-medium uppercase tracking-wider text-muted">
        {label}
      </label>
      {children}
      {error !== undefined && <p className="text-xs text-danger">{error}</p>}
    </div>
  );
}
