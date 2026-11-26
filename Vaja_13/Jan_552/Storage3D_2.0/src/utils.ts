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

// Rounds to two decimals (used for money).
function roundToTwoDecimals(value: number): number {
  return Math.round(value * 100) / 100;
}

// 12.5 -> "12.50 €"
export function formatEuro(value: number): string {
  return `${value.toFixed(2)} €`;
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

// Grams used so far = sum of all prints of this spool.
export function getUsedGrams(spool: Spool, prints: PrintLog[]): number {
  const used = prints
    .filter((print) => print.spoolId === spool.id)
    .reduce((sum, print) => sum + print.gramsUsed, 0);
  return roundToOneDecimal(used);
}

// Remaining grams = starting weight minus all grams used in prints of this spool.
export function getRemainingGrams(spool: Spool, prints: PrintLog[]): number {
  return roundToOneDecimal(spool.startWeightG - getUsedGrams(spool, prints));
}

// The ONE place with the low-stock rule: at or below the limit.
export function isLowStock(remainingG: number, limit: number): boolean {
  return remainingG <= limit;
}

// Spools that match both filters. "All" means no filter.
// Archived spools are only included when showArchived is true.
export function filterSpools(spools: Spool[], material: string, color: string, showArchived: boolean): Spool[] {
  return spools.filter(
    (spool) =>
      (showArchived || !spool.archived) &&
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

// Cost of one print in EUR = grams used x (price / starting weight).
// Returns null when the spool has no price (or is unknown).
export function getPrintCost(print: PrintLog, spool: Spool | undefined): number | null {
  if (spool === undefined || spool.price === null) return null;
  return (print.gramsUsed * spool.price) / spool.startWeightG;
}

// Is this a very dark "#RRGGBB" color? Used to keep dark spool icons visible.
export function isDarkColor(hex: string): boolean {
  if (!/^#[0-9a-fA-F]{6}$/.test(hex)) return false;
  const red = parseInt(hex.slice(1, 3), 16);
  const green = parseInt(hex.slice(3, 5), 16);
  const blue = parseInt(hex.slice(5, 7), 16);
  const brightness = (red * 299 + green * 587 + blue * 114) / 1000; // 0 (black) .. 255 (white)
  return brightness < 60;
}

// Number of months from "YYYY-MM" (first) up to and including "YYYY-MM" (last), at least 1.
function countMonths(first: string, last: string): number {
  const months =
    (Number(last.slice(0, 4)) - Number(first.slice(0, 4))) * 12 +
    (Number(last.slice(5, 7)) - Number(first.slice(5, 7))) +
    1;
  return Math.max(1, months);
}

// Statistics for the current calendar month, plus monthly averages over all prints.
// Prints of archived spools still count.
export function getMonthlyStats(prints: PrintLog[], spools: Spool[]): MonthlyStats {
  const currentMonth = getTodayString().slice(0, 7); // "YYYY-MM"

  const spoolById = new Map<string, Spool>();
  spools.forEach((spool) => spoolById.set(spool.id, spool));

  // --- this month ---
  const thisMonth = prints.filter((print) => print.date.startsWith(currentMonth));
  const gramsByMaterial = new Map<string, number>();
  let totalGrams = 0;
  let costThisMonth = 0;
  let pricedPrintCount = 0;
  let unpricedPrintCount = 0;

  thisMonth.forEach((print) => {
    const spool = spoolById.get(print.spoolId);
    totalGrams += print.gramsUsed;

    const material = spool?.material ?? "Other";
    gramsByMaterial.set(material, (gramsByMaterial.get(material) ?? 0) + print.gramsUsed);

    const cost = getPrintCost(print, spool);
    if (cost === null) {
      unpricedPrintCount += 1;
    } else {
      costThisMonth += cost;
      pricedPrintCount += 1;
    }
  });

  const byMaterial = Array.from(gramsByMaterial, ([material, grams]) => ({
    material,
    grams: roundToOneDecimal(grams),
  })).sort((a, b) => b.grams - a.grams);

  // --- all prints: monthly averages ---
  let allGrams = 0;
  let allCost = 0;
  let anyPriced = false;
  let firstMonth = currentMonth;
  prints.forEach((print) => {
    allGrams += print.gramsUsed;
    const cost = getPrintCost(print, spoolById.get(print.spoolId));
    if (cost !== null) {
      allCost += cost;
      anyPriced = true;
    }
    const month = print.date.slice(0, 7);
    if (month < firstMonth) firstMonth = month;
  });
  const monthsCount = countMonths(firstMonth, currentMonth);

  return {
    totalGrams: roundToOneDecimal(totalGrams),
    printCount: thisMonth.length,
    averageGrams: thisMonth.length > 0 ? roundToOneDecimal(totalGrams / thisMonth.length) : null,
    byMaterial,
    avgGramsPerMonth: prints.length > 0 ? roundToOneDecimal(allGrams / monthsCount) : null,
    avgCostPerMonth: anyPriced ? roundToTwoDecimals(allCost / monthsCount) : null,
    costThisMonth: pricedPrintCount > 0 ? roundToTwoDecimals(costThisMonth) : null,
    unpricedPrintCount,
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
