import { useState } from "react";
import type { FormEvent } from "react";
import { COLORS, DEFAULT_WEIGHT_G, MATERIALS } from "../constants";
import type { SelectOption, SpoolFormErrors, SpoolFormProps } from "../types";
import { formatGrams, getTodayString } from "../utils";
import FormField from "./FormField";
import SelectInput from "./SelectInput";

const materialOptions: SelectOption[] = MATERIALS.map((material) => ({ value: material, label: material }));
const colorOptions: SelectOption[] = COLORS.map((color) => ({ value: color.name, label: color.name }));

const inputClass =
  "h-11 w-full rounded-xl border border-line bg-raised px-3 text-sm text-ink outline-none transition-colors placeholder:text-muted focus:border-accent";

// Form for adding a spool, or for editing one (when spoolToEdit is given).
// It only keeps its own input values and error messages.
// When everything is valid it calls onSave (a function from App).
export default function SpoolForm({ spoolToEdit, usedGrams = 0, onSave, onCancel }: SpoolFormProps) {
  const isEditing = spoolToEdit !== undefined;

  // Start with the values of the spool being edited, or with the defaults for a new spool
  const [material, setMaterial] = useState(spoolToEdit?.material ?? "");
  const [colorName, setColorName] = useState(spoolToEdit?.colorName ?? "");
  const [brand, setBrand] = useState(spoolToEdit?.brand ?? "");
  const [weight, setWeight] = useState(String(spoolToEdit?.startWeightG ?? DEFAULT_WEIGHT_G));
  const [purchaseDate, setPurchaseDate] = useState(spoolToEdit?.purchaseDate ?? getTodayString());
  const [price, setPrice] = useState(
    spoolToEdit !== undefined && spoolToEdit.price !== null ? String(spoolToEdit.price) : "",
  );
  const [errors, setErrors] = useState<SpoolFormErrors>({});

  // The color the user picked (or undefined), used for the swatch and for saving
  const chosenColor = COLORS.find((color) => color.name === colorName);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const chosenMaterial = MATERIALS.find((item) => item === material);
    const weightNumber = Number(weight);
    const priceNumber = Number(price);
    const newErrors: SpoolFormErrors = {};

    if (chosenMaterial === undefined) newErrors.material = "Choose a material.";
    if (chosenColor === undefined) newErrors.color = "Choose a color.";
    if (weight.trim() === "" || Number.isNaN(weightNumber) || weightNumber <= 0) {
      newErrors.weight = "Enter a weight above 0 g.";
    } else if (isEditing && weightNumber < usedGrams) {
      // The remaining weight would become negative
      newErrors.weight = `Starting weight cannot be below the ${formatGrams(usedGrams)} g already used.`;
    }
    if (price.trim() !== "" && (Number.isNaN(priceNumber) || priceNumber < 0)) {
      newErrors.price = "Price cannot be negative.";
    }

    setErrors(newErrors);
    if (chosenMaterial === undefined || chosenColor === undefined || Object.keys(newErrors).length > 0) {
      return;
    }

    onSave({
      material: chosenMaterial,
      colorName: chosenColor.name,
      colorHex: chosenColor.hex,
      brand: brand.trim(),
      startWeightG: weightNumber,
      purchaseDate: purchaseDate === "" ? getTodayString() : purchaseDate,
      price: price.trim() === "" ? null : priceNumber,
    });
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="mb-4 flex flex-col gap-4 rounded-2xl border border-line bg-card p-4">
      <h2 className="text-[11px] font-medium uppercase tracking-wider text-accent">{isEditing ? "Edit spool" : "New spool"}</h2>

      <FormField label="Material" htmlFor="spool-material" error={errors.material}>
        <SelectInput id="spool-material" value={material} options={materialOptions} placeholder="Select material" onChange={setMaterial} />
      </FormField>

      <FormField label="Color" htmlFor="spool-color" error={errors.color}>
        <div className="flex items-center gap-3">
          {/* round swatch of the selected color */}
          <span
            className="h-7 w-7 shrink-0 rounded-full border border-line"
            style={{ backgroundColor: chosenColor?.hex ?? "transparent" }}
          />
          <div className="flex-1">
            <SelectInput id="spool-color" value={colorName} options={colorOptions} placeholder="Select color" onChange={setColorName} />
          </div>
        </div>
      </FormField>

      <FormField label="Brand" htmlFor="spool-brand">
        <input id="spool-brand" type="text" value={brand} onChange={(event) => setBrand(event.target.value)} placeholder="e.g. Bambu Lab" className={inputClass} />
      </FormField>

      <div className="grid grid-cols-2 gap-3">
        <FormField label="Start weight (g)" htmlFor="spool-weight" error={errors.weight}>
          <input id="spool-weight" type="number" inputMode="decimal" min={0} value={weight} onChange={(event) => setWeight(event.target.value)} className={`${inputClass} font-mono tabular-nums`} />
        </FormField>
        <FormField label="Price (EUR)" htmlFor="spool-price" error={errors.price}>
          <input id="spool-price" type="number" inputMode="decimal" min={0} step="0.01" value={price} onChange={(event) => setPrice(event.target.value)} placeholder="0.00" className={`${inputClass} font-mono tabular-nums`} />
        </FormField>
      </div>

      <FormField label="Purchase date" htmlFor="spool-date">
        <input id="spool-date" type="date" value={purchaseDate} onChange={(event) => setPurchaseDate(event.target.value)} className={inputClass} />
      </FormField>

      <div className="flex gap-3">
        <button type="button" onClick={onCancel} className="h-11 rounded-xl border border-line bg-raised px-5 text-sm font-medium text-ink transition-colors hover:border-muted">
          Cancel
        </button>
        <button type="submit" className="h-11 flex-1 rounded-xl bg-accent text-sm font-semibold text-bg transition-colors hover:bg-accent-hover">
          {isEditing ? "Save changes" : "Save spool"}
        </button>
      </div>
    </form>
  );
}
