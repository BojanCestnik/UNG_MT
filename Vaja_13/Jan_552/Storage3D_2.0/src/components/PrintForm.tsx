import { useState } from "react";
import type { FormEvent } from "react";
import { RECENT_PRINTS_LIMIT } from "../constants";
import type { PrintFormErrors, PrintFormProps, SelectOption } from "../types";
import { formatEuro, formatGrams, getPrintCost, getRecentPrints, getSpoolName, getTodayString } from "../utils";
import FormField from "./FormField";
import { TrashIcon } from "./Icons";
import SelectInput from "./SelectInput";
import SpoolIcon from "./SpoolIcon";

const inputClass =
  "h-11 w-full rounded-xl border border-line bg-raised px-3 text-sm text-ink outline-none transition-colors placeholder:text-muted focus:border-accent";

// Form for logging a print, with the newest prints listed below it.
export default function PrintForm({ activeSpools, allSpools, prints, remainingById, onAddPrint, onDeletePrint }: PrintFormProps) {
  const [spoolId, setSpoolId] = useState("");
  const [grams, setGrams] = useState("");
  const [date, setDate] = useState(getTodayString());
  const [name, setName] = useState("");
  const [errors, setErrors] = useState<PrintFormErrors>({});

  // Dropdown text: "Material - Color - remaining g"
  const spoolOptions: SelectOption[] = activeSpools.map((spool) => ({
    value: spool.id,
    label: `${spool.material} - ${spool.colorName} - ${formatGrams(remainingById[spool.id] ?? 0)} g`,
  }));

  const recentPrints = getRecentPrints(prints, RECENT_PRINTS_LIMIT);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const chosenSpool = activeSpools.find((spool) => spool.id === spoolId);
    const gramsNumber = Number(grams);
    const newErrors: PrintFormErrors = {};

    if (chosenSpool === undefined) {
      newErrors.spool = "Choose a spool.";
    }
    if (grams.trim() === "" || Number.isNaN(gramsNumber) || gramsNumber <= 0) {
      newErrors.grams = "Enter grams used above 0.";
    } else if (chosenSpool !== undefined && gramsNumber > (remainingById[chosenSpool.id] ?? 0)) {
      newErrors.grams = `Only ${formatGrams(remainingById[chosenSpool.id] ?? 0)} g left on this spool.`;
    }

    setErrors(newErrors);
    if (chosenSpool === undefined || Object.keys(newErrors).length > 0) return;

    onAddPrint({
      spoolId: chosenSpool.id,
      gramsUsed: gramsNumber,
      date: date === "" ? getTodayString() : date,
      name: name.trim(),
    });

    // Clear the form for the next print (the spool stays selected)
    setGrams("");
    setName("");
    setDate(getTodayString());
  }

  // Ask first. The spool itself is not changed; its remaining grams are calculated again.
  function handleDelete(id: string) {
    if (window.confirm("Delete this print? The grams go back to the spool.")) {
      onDeletePrint(id);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {activeSpools.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-line p-8 text-center text-sm text-muted">Add a spool first</p>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4 rounded-2xl border border-line bg-card p-4">
          <FormField label="Spool" htmlFor="print-spool" error={errors.spool}>
            <SelectInput id="print-spool" value={spoolId} options={spoolOptions} placeholder="Select spool" onChange={setSpoolId} />
          </FormField>

          <FormField label="Grams used" htmlFor="print-grams" error={errors.grams}>
            <input id="print-grams" type="number" inputMode="decimal" min={0} value={grams} onChange={(event) => setGrams(event.target.value)} placeholder="0" className={`${inputClass} font-mono tabular-nums`} />
          </FormField>

          <FormField label="Date" htmlFor="print-date">
            <input id="print-date" type="date" value={date} onChange={(event) => setDate(event.target.value)} className={inputClass} />
          </FormField>

          <FormField label="Print name (optional)" htmlFor="print-name">
            <input id="print-name" type="text" value={name} onChange={(event) => setName(event.target.value)} placeholder="e.g. Benchy" className={inputClass} />
          </FormField>

          <button type="submit" className="h-11 rounded-xl bg-accent text-sm font-semibold text-bg transition-colors hover:bg-accent-hover">
            Save print
          </button>
        </form>
      )}

      <section className="flex flex-col gap-3">
        <h2 className="text-[11px] font-medium uppercase tracking-wider text-muted">Recent prints</h2>

        {recentPrints.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-line p-6 text-center text-sm text-muted">No prints logged yet</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {recentPrints.map((print) => {
              // Look the spool up in ALL spools, so prints of archived spools still show a name
              const spool = allSpools.find((item) => item.id === print.spoolId);
              const cost = getPrintCost(print, spool); // null when the spool has no price
              return (
                <li key={print.id} className="flex items-center gap-3 rounded-2xl border border-line bg-card p-3">
                  <SpoolIcon color={spool?.colorHex ?? "#6B7280"} size={32} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{print.name === "" ? "Untitled" : print.name}</p>
                    <p className="truncate font-mono text-xs text-muted tabular-nums">
                      {print.date} · {spool === undefined ? "Unknown spool" : getSpoolName(spool)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-lg font-semibold tabular-nums">
                      {formatGrams(print.gramsUsed)}
                      <span className="text-sm">g</span>
                    </p>
                    {cost !== null && <p className="font-mono text-[11px] text-muted tabular-nums">{formatEuro(cost)}</p>}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDelete(print.id)}
                    aria-label="Delete print"
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-muted transition-colors hover:text-danger"
                  >
                    <TrashIcon />
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
