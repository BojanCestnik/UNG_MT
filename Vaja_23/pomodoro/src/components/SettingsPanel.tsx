import { MODE_LABELS, MODES } from "../types";
import type { Durations, Mode } from "../types";

interface SettingsPanelProps {
  durations: Durations;
  onChangeDuration: (mode: Mode, minutes: number) => void;
}

function SettingsPanel({ durations, onChangeDuration }: SettingsPanelProps) {
  return (
    <section className="rounded-3xl bg-white/70 p-6">
      <h2 className="mb-4 text-lg font-bold">Settings</h2>

      <div className="grid grid-cols-3 gap-3">
        {MODES.map((mode) => (
          <label key={mode} className="flex flex-col gap-1 text-sm font-medium">
            {MODE_LABELS[mode]}
            <input
              type="number"
              min={1}
              max={99}
              value={durations[mode]}
              onChange={(event) => {
                const minutes = Number(event.target.value);
                // Ignore empty or out-of-range values so the timer stays valid.
                if (minutes >= 1 && minutes <= 99) {
                  onChangeDuration(mode, minutes);
                }
              }}
              className="w-full rounded-xl bg-cream px-3 py-2 text-base outline-none focus:ring-2 focus:ring-accent"
            />
          </label>
        ))}
      </div>

      <p className="mt-3 text-xs opacity-70">Minutes per mode</p>
    </section>
  );
}

export default SettingsPanel;
