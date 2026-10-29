import { MODE_LABELS, MODES } from "../types";
import type { Mode } from "../types";

interface ModeSelectorProps {
  currentMode: Mode;
  onSelectMode: (mode: Mode) => void;
}

function ModeSelector({ currentMode, onSelectMode }: ModeSelectorProps) {
  return (
    <div className="flex gap-2 rounded-2xl bg-peach p-1.5">
      {MODES.map((mode) => {
        const isActive = mode === currentMode;

        return (
          <button
            key={mode}
            type="button"
            onClick={() => onSelectMode(mode)}
            className={`flex-1 rounded-xl px-3 py-2 text-sm font-semibold transition-colors ${
              isActive ? "bg-accent shadow-sm" : "hover:bg-white/60"
            }`}
          >
            {MODE_LABELS[mode]}
          </button>
        );
      })}
    </div>
  );
}

export default ModeSelector;
