import type { ColorOption, Material } from "./types";

// Fixed list for the Material dropdown and filter.
export const MATERIALS: Material[] = ["PLA", "PETG", "ABS", "ASA", "TPU", "Nylon", "PC", "Other"];

// Fixed list for the Color dropdown and filter (name + default hex code).
export const COLORS: ColorOption[] = [
  { name: "Black", hex: "#111111" },
  { name: "White", hex: "#F2F2F2" },
  { name: "Gray", hex: "#8A8F98" },
  { name: "Silver", hex: "#C0C4CC" },
  { name: "Red", hex: "#E5484D" },
  { name: "Orange", hex: "#F5821F" },
  { name: "Yellow", hex: "#F6C90E" },
  { name: "Green", hex: "#30A46C" },
  { name: "Blue", hex: "#3E63DD" },
  { name: "Purple", hex: "#8E4EC6" },
  { name: "Pink", hex: "#E93D82" },
  { name: "Brown", hex: "#8B5E3C" },
  { name: "Beige", hex: "#D9C3A0" },
  { name: "Transparent", hex: "#9FD3E6" },
  { name: "Other", hex: "#6B7280" },
];

export const DEFAULT_LOW_STOCK_LIMIT = 200; // grams
export const DEFAULT_WEIGHT_G = 1000; // grams, default for a new spool
export const RECENT_PRINTS_LIMIT = 20;

// localStorage keys
export const STORAGE_KEYS = {
  spools: "storage3d.spools",
  prints: "storage3d.prints",
  settings: "storage3d.settings",
} as const;
