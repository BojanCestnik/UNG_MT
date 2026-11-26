import type { StatTileProps, StatsPanelProps } from "../types";
import { formatEuro, formatGrams } from "../utils";

// One stat tile: small label on top, big monospace number, optional small note.
function StatTile({ label, value, note, wide = false }: StatTileProps) {
  return (
    <div className={`rounded-2xl border border-line bg-card p-4 ${wide ? "col-span-2" : ""}`}>
      <p className="text-[11px] font-medium uppercase tracking-wider text-muted">{label}</p>
      <p className={`mt-1 font-mono font-semibold tabular-nums ${wide ? "text-4xl text-accent" : "text-2xl"}`}>{value}</p>
      {note !== undefined && <p className="mt-1 text-[11px] text-muted">{note}</p>}
    </div>
  );
}

// Only displays the stats that App calculated. No calculations here.
export default function StatsPanel({ stats }: StatsPanelProps) {
  // The biggest value is the 100% bar; the other bars are relative to it
  const maxGrams = stats.byMaterial.reduce((max, item) => Math.max(max, item.grams), 0);

  const avgPerMonthNote =
    stats.avgCostPerMonth === null ? undefined : `≈ ${formatEuro(stats.avgCostPerMonth)} / month`;
  const unpricedNote =
    stats.unpricedPrintCount > 0
      ? `${stats.unpricedPrintCount} ${stats.unpricedPrintCount === 1 ? "print" : "prints"} without price not included`
      : undefined;

  return (
    <div className="flex flex-col gap-3">
      {/* stat tiles */}
      <div className="grid grid-cols-2 gap-3">
        <StatTile wide label="Total used" value={`${formatGrams(stats.totalGrams)} g`} />
        <StatTile label="Prints" value={String(stats.printCount)} />
        <StatTile label="Avg per print" value={stats.averageGrams === null ? "-" : `${formatGrams(stats.averageGrams)} g`} />
        <StatTile
          label="Avg per month"
          value={stats.avgGramsPerMonth === null ? "-" : `${formatGrams(stats.avgGramsPerMonth)} g`}
          note={avgPerMonthNote}
        />
        <StatTile
          label="Cost this month"
          value={stats.costThisMonth === null ? "-" : formatEuro(stats.costThisMonth)}
          note={unpricedNote}
        />
      </div>

      {/* use by material: horizontal bars made from divs */}
      <div className="rounded-2xl border border-line bg-card p-4">
        <h2 className="text-[11px] font-medium uppercase tracking-wider text-muted">Use by material</h2>

        {stats.byMaterial.length === 0 ? (
          <p className="mt-3 text-sm text-muted">No prints this month</p>
        ) : (
          <ul className="mt-3 flex flex-col gap-3">
            {stats.byMaterial.map((item) => (
              <li key={item.material}>
                <div className="mb-1 flex items-baseline justify-between text-sm">
                  <span className="font-medium">{item.material}</span>
                  <span className="font-mono tabular-nums text-muted">{formatGrams(item.grams)} g</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-raised">
                  <div className="h-full rounded-full bg-accent" style={{ width: `${maxGrams > 0 ? (item.grams / maxGrams) * 100 : 0}%` }} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
