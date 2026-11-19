import type { SpoolListProps } from "../types";
import { formatGrams } from "../utils";
import SpoolIcon from "./SpoolIcon";

// One card per spool. The remaining grams are calculated in App and passed in.
export default function SpoolList({
  spools,
  remainingById,
  lowStockLimit,
  hasAnySpools,
  onMarkEmpty,
  onAddFirstSpool,
}: SpoolListProps) {
  // Empty inventory: invite the user to add the first spool
  if (!hasAnySpools) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-line p-8 text-center">
        <p className="text-sm text-muted">No spools yet. Add the filament you have in stock.</p>
        <button type="button" onClick={onAddFirstSpool} className="h-11 rounded-xl bg-accent px-5 text-sm font-semibold text-bg transition-colors hover:bg-accent-hover">
          Add your first spool
        </button>
      </div>
    );
  }

  // Spools exist, but the filters hide all of them
  if (spools.length === 0) {
    return <p className="rounded-2xl border border-dashed border-line p-8 text-center text-sm text-muted">No spools match your filters</p>;
  }

  function handleMarkEmpty(id: string) {
    if (window.confirm("Mark this spool as empty? It will be hidden from the list.")) {
      onMarkEmpty(id);
    }
  }

  return (
    <ul className="flex flex-col gap-3">
      {spools.map((spool) => {
        const remaining = remainingById[spool.id] ?? 0;
        const isLow = remaining < lowStockLimit;
        const percent = Math.max(0, Math.min(100, (remaining / spool.startWeightG) * 100));
        const details = spool.brand === "" ? spool.material : `${spool.brand} · ${spool.material}`;

        return (
          <li key={spool.id} className={`rounded-2xl border bg-card p-4 ${isLow ? "border-warn" : "border-line"}`}>
            <div className="flex items-center gap-3">
              <SpoolIcon color={spool.colorHex} size={48} />

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate font-semibold">{spool.colorName}</p>
                  {isLow && (
                    <span className="rounded-full bg-warn/15 px-2 py-0.5 text-[10px] font-semibold tracking-wider text-warn">LOW</span>
                  )}
                </div>
                <p className="truncate text-sm text-muted">{details}</p>
              </div>

              <div className="text-right">
                <p className={`font-mono text-2xl font-semibold tabular-nums ${isLow ? "text-warn" : "text-ink"}`}>
                  {formatGrams(remaining)}
                  <span className="text-base">g</span>
                </p>
                <p className="text-xs text-muted">left</p>
              </div>
            </div>

            {/* progress bar: remaining / starting weight */}
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-raised">
              <div className={`h-full rounded-full ${isLow ? "bg-warn" : "bg-accent"}`} style={{ width: `${percent}%` }} />
            </div>

            <div className="mt-2 flex items-center justify-between">
              <p className="font-mono text-[11px] uppercase tracking-wider text-muted tabular-nums">
                {Math.round(percent)}% of {formatGrams(spool.startWeightG)} g
              </p>
              <button
                type="button"
                onClick={() => handleMarkEmpty(spool.id)}
                className="h-11 rounded-xl border border-line bg-raised px-4 text-sm font-medium text-ink transition-colors hover:border-muted"
              >
                Mark empty
              </button>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
