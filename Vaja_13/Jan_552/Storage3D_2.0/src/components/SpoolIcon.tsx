import type { SpoolIconProps } from "../types";
import { isDarkColor } from "../utils";

// A round filament spool: a disc in the filament color, thin rings and a dark center hole.
// Used on the cards (filament color) and next to the app name (orange).
export default function SpoolIcon({ color, size = 48 }: SpoolIconProps) {
  // Very dark filaments (like Black) get light rings, otherwise the rings would not be visible
  const ringColor = isDarkColor(color) ? "#ffffff" : "#000000";
  const ringOpacity = isDarkColor(color) ? 0.2 : 0.25;

  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true" className="shrink-0">
      {/* outer disc, filled with the filament color, with a light outline so dark colors stay visible */}
      <circle cx="24" cy="24" r="22" style={{ fill: color }} stroke="#8b93a1" strokeOpacity="0.6" strokeWidth="1.5" />
      {/* thin rings = wound filament */}
      <circle cx="24" cy="24" r="17" fill="none" stroke={ringColor} strokeOpacity={ringOpacity} />
      <circle cx="24" cy="24" r="13" fill="none" stroke={ringColor} strokeOpacity={ringOpacity} />
      <circle cx="24" cy="24" r="9" fill="none" stroke={ringColor} strokeOpacity={ringOpacity} />
      {/* center hole */}
      <circle cx="24" cy="24" r="5" className="fill-bg" stroke="#8b93a1" strokeOpacity="0.4" />
    </svg>
  );
}
