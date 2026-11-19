import type { SpoolIconProps } from "../types";

// A round filament spool: a disc in the filament color, thin rings and a dark center hole.
// Used on the cards (filament color) and next to the app name (orange).
export default function SpoolIcon({ color, size = 48 }: SpoolIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true" className="shrink-0">
      {/* outer disc, filled with the filament color */}
      <circle cx="24" cy="24" r="22" style={{ fill: color }} stroke="#ffffff" strokeOpacity="0.18" />
      {/* thin rings = wound filament */}
      <circle cx="24" cy="24" r="17" fill="none" stroke="#000000" strokeOpacity="0.25" />
      <circle cx="24" cy="24" r="13" fill="none" stroke="#000000" strokeOpacity="0.25" />
      <circle cx="24" cy="24" r="9" fill="none" stroke="#000000" strokeOpacity="0.25" />
      {/* center hole */}
      <circle cx="24" cy="24" r="5" className="fill-bg" stroke="#000000" strokeOpacity="0.4" />
    </svg>
  );
}
