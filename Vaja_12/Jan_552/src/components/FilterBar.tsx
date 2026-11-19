import { COLORS, MATERIALS } from "../constants";
import type { FilterBarProps, SelectOption } from "../types";
import FormField from "./FormField";
import SelectInput from "./SelectInput";

// "All" first, then the fixed lists
const materialOptions: SelectOption[] = [
  { value: "All", label: "All" },
  ...MATERIALS.map((material) => ({ value: material, label: material })),
];
const colorOptions: SelectOption[] = [
  { value: "All", label: "All" },
  ...COLORS.map((color) => ({ value: color.name, label: color.name })),
];

// Material filter, color filter and the low-stock limit (in grams).
export default function FilterBar({
  materialFilter,
  colorFilter,
  lowStockLimit,
  onMaterialChange,
  onColorChange,
  onLimitChange,
}: FilterBarProps) {
  return (
    <div className="grid grid-cols-[1fr_1fr_6.25rem] gap-2">
      <FormField label="Material" htmlFor="filter-material">
        <SelectInput id="filter-material" value={materialFilter} options={materialOptions} pill onChange={onMaterialChange} />
      </FormField>
      <FormField label="Color" htmlFor="filter-color">
        <SelectInput id="filter-color" value={colorFilter} options={colorOptions} pill onChange={onColorChange} />
      </FormField>
      <FormField label="Low stock (g)" htmlFor="low-stock-limit">
        <input
          id="low-stock-limit"
          type="number"
          inputMode="numeric"
          min={0}
          value={lowStockLimit}
          onChange={(event) => {
            const number = Number(event.target.value);
            onLimitChange(Number.isNaN(number) || number < 0 ? 0 : number);
          }}
          className="h-11 w-full rounded-full border border-line bg-raised px-3 text-center font-mono text-sm tabular-nums outline-none transition-colors focus:border-accent"
        />
      </FormField>
    </div>
  );
}
