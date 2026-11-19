import { useEffect, useState } from "react";
import FilterBar from "./components/FilterBar";
import PrintForm from "./components/PrintForm";
import SpoolForm from "./components/SpoolForm";
import SpoolIcon from "./components/SpoolIcon";
import SpoolList from "./components/SpoolList";
import StatsPanel from "./components/StatsPanel";
import TabBar from "./components/TabBar";
import { CloseIcon, PlusIcon } from "./components/Icons";
import type { NewPrintData, NewSpoolData, PrintLog, Spool, Tab } from "./types";
import {
  createId,
  filterSpools,
  getMonthLabel,
  getMonthlyStats,
  getRemainingGrams,
  loadLowStockLimit,
  loadPrints,
  loadSpools,
  saveToStorage,
} from "./utils";

// App holds ALL the app data (state) and the functions that change it.
// Everything else only gets data and functions through props.
export default function App() {
  // ----- State -----
  const [activeTab, setActiveTab] = useState<Tab>("spools");
  const [spools, setSpools] = useState<Spool[]>(() => loadSpools());
  const [prints, setPrints] = useState<PrintLog[]>(() => loadPrints());
  const [lowStockLimit, setLowStockLimit] = useState<number>(() => loadLowStockLimit());
  const [materialFilter, setMaterialFilter] = useState("All");
  const [colorFilter, setColorFilter] = useState("All");
  const [formOpen, setFormOpen] = useState(false);

  // Save to localStorage whenever spools, prints or the limit change
  useEffect(() => {
    saveToStorage(spools, prints, lowStockLimit);
  }, [spools, prints, lowStockLimit]);

  // ----- Calculated from the state (not stored) -----
  const activeSpools = spools.filter((spool) => !spool.archived);
  const filteredSpools = filterSpools(spools, materialFilter, colorFilter);
  const stats = getMonthlyStats(prints, spools);

  const remainingById: Record<string, number> = {};
  spools.forEach((spool) => {
    remainingById[spool.id] = getRemainingGrams(spool, prints);
  });

  // ----- Functions that change the state -----
  function handleAddSpool(data: NewSpoolData) {
    setSpools((previous) => [...previous, { ...data, id: createId(), archived: false }]);
    setFormOpen(false);
  }

  // Archive, never delete
  function handleMarkEmpty(id: string) {
    setSpools((previous) => previous.map((spool) => (spool.id === id ? { ...spool, archived: true } : spool)));
  }

  function handleAddPrint(data: NewPrintData) {
    setPrints((previous) => [...previous, { ...data, id: createId() }]);
  }

  function handleTabChange(tab: Tab) {
    setActiveTab(tab);
    setFormOpen(false);
  }

  // ----- Page title and subtitle for the current tab -----
  let title = "Spools";
  let subtitle = `${activeSpools.length} ${activeSpools.length === 1 ? "spool" : "spools"} in inventory`;
  if (activeTab === "prints") {
    title = "Print Log";
    subtitle = `${prints.length} ${prints.length === 1 ? "print" : "prints"} logged`;
  } else if (activeTab === "stats") {
    title = "Stats";
    subtitle = getMonthLabel();
  }

  return (
    // Exactly screen height; only the middle part scrolls
    <div className="relative mx-auto flex h-dvh max-w-[480px] flex-col overflow-hidden border-x border-line bg-bg text-ink">
      {/* Top zone (fixed) */}
      <header className="flex shrink-0 flex-col gap-4 px-4 pb-3 pt-4">
        <div className="flex h-11 items-center justify-between">
          <div className="flex items-center gap-2">
            <SpoolIcon color="var(--color-accent)" size={28} />
            <span className="text-lg font-semibold tracking-tight">
              Storage<span className="text-accent">.3D</span>
            </span>
          </div>

          {activeTab === "spools" && (
            <button
              type="button"
              onClick={() => setFormOpen(!formOpen)}
              aria-label={formOpen ? "Close add spool form" : "Add spool"}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-accent text-bg transition-colors hover:bg-accent-hover"
            >
              {formOpen ? <CloseIcon /> : <PlusIcon />}
            </button>
          )}
        </div>

        <div>
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          <p className="mt-1 text-sm text-muted">{subtitle}</p>
        </div>

        {activeTab === "spools" && (
          <FilterBar
            materialFilter={materialFilter}
            colorFilter={colorFilter}
            lowStockLimit={lowStockLimit}
            onMaterialChange={setMaterialFilter}
            onColorChange={setColorFilter}
            onLimitChange={setLowStockLimit}
          />
        )}
      </header>

      {/* Middle zone (the only part that scrolls). Bottom padding keeps the last item above the tab bar. */}
      <main className="flex-1 overflow-y-auto px-4 pb-28 pt-2">
        {activeTab === "spools" && (
          <>
            {formOpen && <SpoolForm onAddSpool={handleAddSpool} onCancel={() => setFormOpen(false)} />}
            {/* While the form is open on an empty inventory, hide the "add your first spool" box */}
            {!(formOpen && activeSpools.length === 0) && (
              <SpoolList
                spools={filteredSpools}
                remainingById={remainingById}
                lowStockLimit={lowStockLimit}
                hasAnySpools={activeSpools.length > 0}
                onMarkEmpty={handleMarkEmpty}
                onAddFirstSpool={() => setFormOpen(true)}
              />
            )}
          </>
        )}

        {activeTab === "prints" && (
          <PrintForm
            activeSpools={activeSpools}
            allSpools={spools}
            prints={prints}
            remainingById={remainingById}
            onAddPrint={handleAddPrint}
          />
        )}

        {activeTab === "stats" && <StatsPanel stats={stats} />}
      </main>

      {/* Bottom zone (fixed) */}
      <TabBar activeTab={activeTab} onTabChange={handleTabChange} />
    </div>
  );
}
