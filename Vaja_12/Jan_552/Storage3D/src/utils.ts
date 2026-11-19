import { DEFAULT_LOW_STOCK_LIMIT, MATERIALS, STORAGE_KEYS } from "./constants";
import type { MonthlyStats, PrintLog, Spool } from "./types";

// ---------- Small helpers ----------

// Today as "YYYY-MM-DD" in the user's local time.
export function getTodayString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// Name of the current month, e.g. "November 2026".
export function getMonthLabel(): string {
  return new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

// Unique id. Uses crypto.randomUUID(); the fallback is only for pages opened over
// plain http (for example from a phone on the local network), where it is missing.
export function createId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `id-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

// Rounds to one decimal so numbers like 0.1 + 0.2 do not show 0.30000000000000004.
function roundToOneDecimal(value: number): number {
  return Math.round(value * 10) / 10;
}

// 926 -> "926", 12.5 -> "12.5"
export function formatGrams(value: number): string {
  const rounded = roundToOneDecimal(value);
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
}

// "Black PLA"
export function getSpoolName(spool: Spool): string {
  return `${spool.colorName} ${spool.material}`;
}

// ---------- Calculations ----------

// Remaining grams = starting weight minus all grams used in prints of this spool.
export function getRemainingGrams(spool: Spool, prints: PrintLog[]): number {
  const used = prints
    .filter((print) => print.spoolId === spool.id)
    .reduce((sum, print) => sum + print.gramsUsed, 0);
  return roundToOneDecimal(spool.startWeightG - used);
}

// Active (not archived) spools that match both filters. "All" means no filter.
export function filterSpools(spools: Spool[], material: string, color: string): Spool[] {
  return spools.filter(
    (spool) =>
      !spool.archived &&
      (material === "All" || spool.material === material) &&
      (color === "All" || spool.colorName === color),
  );
}

// The newest prints first (newest date first; for the same date, the last added first).
export function getRecentPrints(prints: PrintLog[], limit: number): PrintLog[] {
  return [...prints]
    .reverse()
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, limit);
}

// Statistics for the current calendar month. Prints of archived spools still count.
export function getMonthlyStats(prints: PrintLog[], spools: Spool[]): MonthlyStats {
  const monthPrefix = getTodayString().slice(0, 7); // "YYYY-MM"
  const thisMonth = prints.filter((print) => print.date.startsWith(monthPrefix));

  const materialBySpoolId = new Map<string, string>();
  spools.forEach((spool) => materialBySpoolId.set(spool.id, spool.material));

  const gramsByMaterial = new Map<string, number>();
  let totalGrams = 0;
  thisMonth.forEach((print) => {
    totalGrams += print.gramsUsed;
    const material = materialBySpoolId.get(print.spoolId) ?? "Other";
    gramsByMaterial.set(material, (gramsByMaterial.get(material) ?? 0) + print.gramsUsed);
  });

  const byMaterial = Array.from(gramsByMaterial, ([material, grams]) => ({
    material,
    grams: roundToOneDecimal(grams),
  })).sort((a, b) => b.grams - a.grams);

  return {
    totalGrams: roundToOneDecimal(totalGrams),
    printCount: thisMonth.length,
    averageGrams: thisMonth.length > 0 ? roundToOneDecimal(totalGrams / thisMonth.length) : null,
    byMaterial,
  };
}

// ---------- localStorage ----------

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isSpool(value: unknown): value is Spool {
  if (!isRecord(value)) return false;
  return (
    typeof value.id === "string" &&
    MATERIALS.some((material) => material === value.material) &&
    typeof value.colorName === "string" &&
    typeof value.colorHex === "string" &&
    typeof value.brand === "string" &&
    typeof value.startWeightG === "number" &&
    typeof value.purchaseDate === "string" &&
    (typeof value.price === "number" || value.price === null) &&
    typeof value.archived === "boolean"
  );
}

function isPrintLog(value: unknown): value is PrintLog {
  if (!isRecord(value)) return false;
  return (
    typeof value.id === "string" &&
    typeof value.spoolId === "string" &&
    typeof value.gramsUsed === "number" &&
    typeof value.date === "string" &&
    typeof value.name === "string"
  );
}

// Reads and parses one key. Returns null if it is missing or broken.
function readJson(key: string): unknown {
  try {
    const raw = localStorage.getItem(key);
    return raw === null ? null : JSON.parse(raw);
  } catch {
    return null;
  }
}

export function loadSpools(): Spool[] {
  const data = readJson(STORAGE_KEYS.spools);
  return Array.isArray(data) ? data.filter(isSpool) : [];
}

export function loadPrints(): PrintLog[] {
  const data = readJson(STORAGE_KEYS.prints);
  return Array.isArray(data) ? data.filter(isPrintLog) : [];
}

export function loadLowStockLimit(): number {
  const data = readJson(STORAGE_KEYS.settings);
  if (isRecord(data) && typeof data.lowStockLimit === "number" && data.lowStockLimit >= 0) {
    return data.lowStockLimit;
  }
  return DEFAULT_LOW_STOCK_LIMIT;
}

export function saveToStorage(spools: Spool[], prints: PrintLog[], lowStockLimit: number): void {
  try {
    localStorage.setItem(STORAGE_KEYS.spools, JSON.stringify(spools));
    localStorage.setItem(STORAGE_KEYS.prints, JSON.stringify(prints));
    localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify({ lowStockLimit }));
  } catch {
    // Storage can be full or blocked (private mode). The app keeps working without saving.
  }
}
