import type { IconProps } from "../types";

// Small inline SVG icons. They use "currentColor", so the text color sets the icon color.

const baseProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

export function PlusIcon({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg {...baseProps} className={className} aria-hidden="true">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function CloseIcon({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg {...baseProps} className={className} aria-hidden="true">
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

export function ChevronIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg {...baseProps} className={className} aria-hidden="true">
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

// Tab icon: a spool seen from the front
export function SpoolsTabIcon({ className = "h-6 w-6" }: IconProps) {
  return (
    <svg {...baseProps} className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

// Tab icon: a list of lines
export function PrintLogTabIcon({ className = "h-6 w-6" }: IconProps) {
  return (
    <svg {...baseProps} className={className} aria-hidden="true">
      <path d="M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01" />
    </svg>
  );
}

// Tab icon: bars
export function StatsTabIcon({ className = "h-6 w-6" }: IconProps) {
  return (
    <svg {...baseProps} className={className} aria-hidden="true">
      <path d="M5 20V10M12 20V4M19 20v-7" />
    </svg>
  );
}
