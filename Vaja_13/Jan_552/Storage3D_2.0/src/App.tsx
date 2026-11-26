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
  getUsedGrams,
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
  const [formOpen, setFormOpen] = useState(false); // the "add spool" form
  const [editingSpoolId, setEditingSpoolId] = useState<string | null>(null); // the spool being edited
  const [showArchived, setShowArchived] = useState(false);

  // Save to localStorage whenever spools, prints or the limit change
  useEffect(() => {
    saveToStorage(spools, prints, lowStockLimit);
  }, [spools, prints, lowStockLimit]);

  // ----- Calculated from the state (not stored) -----
  const activeSpools = spools.filter((spool) => !spool.archived);
  const filteredSpools = filterSpools(spools, materialFilter, colorFilter, showArchived);
  const stats = getMonthlyStats(prints, spools);

  const remainingById: Record<string, number> = {};
  spools.forEach((spool) => {
    remainingById[spool.id] = getRemainingGrams(spool, prints);
  });

  // The spool that is being edited (only active spools can be edited)
  const editingSpool = spools.find((spool) => spool.id === editingSpoolId && !spool.archived);
  const formVisible = formOpen || editingSpool !== undefined;
  const hasAnySpools = activeSpools.length > 0 || (showArchived && spools.length > 0);

  // ----- Functions that change the state -----
  function closeForm() {
    setFormOpen(false);
    setEditingSpoolId(null);
  }

  // Same form for adding and editing: App decides what to do with the saved data
  function handleSaveSpool(data: NewSpoolData) {
    if (editingSpool !== undefined) {
      // Edit: keep the id (so the prints stay linked) and the archived flag
      setSpools((previous) => previous.map((spool) => (spool.id === editingSpool.id ? { ...spool, ...data } : spool)));
    } else {
      setSpools((previous) => [...previous, { ...data, id: createId(), archived: false }]);
    }
    closeForm();
  }

  // Archive, never delete
  function handleMarkEmpty(id: string) {
    setSpools((previous) => previous.map((spool) => (spool.id === id ? { ...spool, archived: true } : spool)));
    if (id === editingSpoolId) closeForm();
  }

  function handleRestoreSpool(id: string) {
    setSpools((previous) => previous.map((spool) => (spool.id === id ? { ...spool, archived: false } : spool)));
  }

  function handleStartEdit(id: string) {
    setFormOpen(false);
    setEditingSpoolId(id);
  }

  function handleAddPrint(data: NewPrintData) {
    setPrints((previous) => [...previous, { ...data, id: createId() }]);
  }

  function handleDeletePrint(id: string) {
    setPrints((previous) => previous.filter((print) => print.id !== id));
  }

  function handleTabChange(tab: Tab) {
    setActiveTab(tab);
    closeForm();
  }

  function handlePlusClick() {
    if (formVisible) {
      closeForm();
    } else {
      setFormOpen(true);
    }
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
              onClick={handlePlusClick}
              aria-label={formVisible ? "Close the spool form" : "Add spool"}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-accent text-bg transition-colors hover:bg-accent-hover"
            >
              {formVisible ? <CloseIcon /> : <PlusIcon />}
            </button>
          )}
        </div>

        <div>
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          <div className="mt-1 flex items-center justify-between gap-3">
            <p className="text-sm text-muted">{subtitle}</p>

            {/* "Show archived" switch (the negative margin keeps the 44px tap area without making the row taller) */}
            {activeTab === "spools" && (
              <button
                type="button"
                role="switch"
                aria-checked={showArchived}
                onClick={() => setShowArchived(!showArchived)}
                className="-my-3 flex min-h-11 items-center gap-2"
              >
                <span className="text-[11px] font-medium uppercase tracking-wider text-muted">Show archived</span>
                <span
                  className={`relative h-5 w-9 rounded-full border transition-colors ${
                    showArchived ? "border-accent bg-accent/15" : "border-line bg-raised"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 h-3.5 w-3.5 rounded-full transition-all ${
                      showArchived ? "left-[18px] bg-accent" : "left-0.5 bg-muted"
                    }`}
                  />
                </span>
              </button>
            )}
          </div>
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
            {formVisible && (
              <SpoolForm
                // a new key resets the form when you switch between "add" and "edit"
                key={editingSpool?.id ?? "new"}
                spoolToEdit={editingSpool}
                usedGrams={editingSpool === undefined ? 0 : getUsedGrams(editingSpool, prints)}
                onSave={handleSaveSpool}
                onCancel={closeForm}
              />
            )}
            {/* While the form is open on an empty inventory, hide the "add your first spool" box */}
            {!(formVisible && !hasAnySpools) && (
              <SpoolList
                spools={filteredSpools}
                remainingById={remainingById}
                lowStockLimit={lowStockLimit}
                hasAnySpools={hasAnySpools}
                onMarkEmpty={handleMarkEmpty}
                onEdit={handleStartEdit}
                onRestore={handleRestoreSpool}
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
            onDeletePrint={handleDeletePrint}
          />
        )}

        {activeTab === "stats" && <StatsPanel stats={stats} />}
      </main>

      {/* Bottom zone (fixed) */}
      <TabBar activeTab={activeTab} onTabChange={handleTabChange} />
    </div>
  );
}
