import type { TabBarProps, TabItem } from "../types";
import { PrintLogTabIcon, SpoolsTabIcon, StatsTabIcon } from "./Icons";

const TABS: TabItem[] = [
  { id: "spools", label: "Spools", Icon: SpoolsTabIcon },
  { id: "prints", label: "Print Log", Icon: PrintLogTabIcon },
  { id: "stats", label: "Stats", Icon: StatsTabIcon },
];

// Floating bottom navigation. It stays visible while the middle part of the screen scrolls.
export default function TabBar({ activeTab, onTabChange }: TabBarProps) {
  return (
    <nav className="absolute inset-x-4 bottom-[max(1rem,env(safe-area-inset-bottom))] flex gap-1 rounded-3xl border border-line bg-card p-1.5">
      {TABS.map(({ id, label, Icon }) => {
        const isActive = id === activeTab;
        return (
          <button
            key={id}
            type="button"
            onClick={() => onTabChange(id)}
            aria-current={isActive ? "page" : undefined}
            className={`flex min-h-14 flex-1 flex-col items-center justify-center gap-0.5 rounded-2xl text-xs font-medium transition-colors ${
              isActive ? "bg-accent/15 text-accent" : "text-muted hover:text-ink"
            }`}
          >
            <Icon />
            {label}
          </button>
        );
      })}
    </nav>
  );
}
