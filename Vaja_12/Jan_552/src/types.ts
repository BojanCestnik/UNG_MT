import type { ComponentType, ReactNode } from "react";

// ---------- Data types ----------

export type Material = "PLA" | "PETG" | "ABS" | "ASA" | "TPU" | "Nylon" | "PC" | "Other";

export type Tab = "spools" | "prints" | "stats";

// One filament spool. Remaining weight is NOT stored; it is calculated from the prints.
export interface Spool {
  id: string;
  material: Material;
  colorName: string;
  colorHex: string;
  brand: string;
  startWeightG: number;
  purchaseDate: string; // "YYYY-MM-DD"
  price: number | null;
  archived: boolean;
}

// One logged print that used some grams of one spool.
export interface PrintLog {
  id: string;
  spoolId: string;
  gramsUsed: number;
  date: string; // "YYYY-MM-DD"
  name: string;
}

// What the forms send to App (App adds the id and the archived flag).
export type NewSpoolData = Omit<Spool, "id" | "archived">;
export type NewPrintData = Omit<PrintLog, "id">;

export interface ColorOption {
  name: string;
  hex: string;
}

export interface MaterialUsage {
  material: string;
  grams: number;
}

export interface MonthlyStats {
  totalGrams: number;
  printCount: number;
  averageGrams: number | null; // null when there are no prints
  byMaterial: MaterialUsage[];
}

export interface SelectOption {
  value: string;
  label: string;
}

export interface SpoolFormErrors {
  material?: string;
  color?: string;
  weight?: string;
  price?: string;
}

export interface PrintFormErrors {
  spool?: string;
  grams?: string;
}

// ---------- Props of the components ----------

export interface IconProps {
  className?: string;
}

export interface TabItem {
  id: Tab;
  label: string;
  Icon: ComponentType<IconProps>;
}

export interface TabBarProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

export interface FilterBarProps {
  materialFilter: string;
  colorFilter: string;
  lowStockLimit: number;
  onMaterialChange: (value: string) => void;
  onColorChange: (value: string) => void;
  onLimitChange: (value: number) => void;
}

export interface SpoolFormProps {
  onAddSpool: (data: NewSpoolData) => void;
  onCancel: () => void;
}

export interface SpoolListProps {
  spools: Spool[]; // already filtered
  remainingById: Record<string, number>;
  lowStockLimit: number;
  hasAnySpools: boolean; // false = the inventory is really empty
  onMarkEmpty: (id: string) => void;
  onAddFirstSpool: () => void;
}

export interface PrintFormProps {
  activeSpools: Spool[];
  allSpools: Spool[]; // includes archived ones, so old prints still show a name
  prints: PrintLog[];
  remainingById: Record<string, number>;
  onAddPrint: (data: NewPrintData) => void;
}

export interface StatsPanelProps {
  stats: MonthlyStats;
}

export interface SpoolIconProps {
  color: string;
  size?: number;
}

export interface SelectInputProps {
  id: string;
  value: string;
  options: SelectOption[];
  placeholder?: string;
  pill?: boolean;
  onChange: (value: string) => void;
}

export interface FormFieldProps {
  label: string;
  htmlFor: string;
  error?: string;
  children: ReactNode;
}
