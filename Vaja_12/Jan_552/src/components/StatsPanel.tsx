import type { StatsPanelProps } from "../types";
import { formatGrams } from "../utils";

// Only displays the stats that App calculated. No calculations here.
export default function StatsPanel({ stats }: StatsPanelProps) {
  // The biggest value is the 100% bar; the other bars are relative to it
  const maxGrams = stats.byMaterial.reduce((max, item) => Math.max(max, item.grams), 0);

  return (
    <div className="flex flex-col gap-3">
      {/* stat tiles */}
      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2 rounded-2xl border border-line bg-card p-4">
          <p className="text-[11px] font-medium uppercase tracking-wider text-muted">Total used</p>
          <p className="mt-1 font-mono text-4xl font-semibold tabular-nums text-accent">
            {formatGrams(stats.totalGrams)}
            <span className="text-xl"> g</span>
          </p>
        </div>
        <div className="rounded-2xl border border-line bg-card p-4">
          <p className="text-[11px] font-medium uppercase tracking-wider text-muted">Prints</p>
          <p className="mt-1 font-mono text-2xl font-semibold tabular-nums">{stats.printCount}</p>
        </div>
        <div className="rounded-2xl border border-line bg-card p-4">
          <p className="text-[11px] font-medium uppercase tracking-wider text-muted">Avg per print</p>
          <p className="mt-1 font-mono text-2xl font-semibold tabular-nums">
            {stats.averageGrams === null ? "-" : formatGrams(stats.averageGrams)}
            {stats.averageGrams !== null && <span className="text-base"> g</span>}
          </p>
        </div>
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
