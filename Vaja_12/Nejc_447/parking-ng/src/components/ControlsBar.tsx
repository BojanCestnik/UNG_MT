import type { SortMode, UiSettings } from '../types'

interface ControlsBarProps {
  ui: UiSettings
  onChange: (changes: Partial<UiSettings>) => void
}

interface FilterChipProps {
  label: string
  isActive: boolean
  onToggle: () => void
}

// A toggle button for one filter. Active chips are filled blue.
function FilterChip({ label, isActive, onToggle }: FilterChipProps) {
  const stateClasses = isActive
    ? 'border-accent bg-accent text-white'
    : 'border-gray-300 bg-white text-gray-900'
  return (
    <button
      type="button"
      aria-pressed={isActive}
      onClick={onToggle}
      className={`min-h-11 cursor-pointer rounded-full border-2 px-4 font-semibold transition-colors duration-150 ${stateClasses}`}
    >
      {label}
    </button>
  )
}

// Sticky bar with the sort select and the two filter chips.
export default function ControlsBar({ ui, onChange }: ControlsBarProps) {
  return (
    <div className="sticky top-0 z-10 bg-page py-3">
      <div className="mx-auto flex max-w-120 flex-wrap items-center gap-2 px-4">
        <label className="sr-only" htmlFor="sort-select">
          Sort car parks
        </label>
        <select
          id="sort-select"
          value={ui.sortMode}
          onChange={(e) => onChange({ sortMode: e.target.value as SortMode })}
          className="min-h-11 rounded-xl border-2 border-gray-300 bg-white px-3 font-semibold"
        >
          <option value="mostFree">Most free spaces</option>
          <option value="name">Name (A–Z)</option>
        </select>
        <FilterChip label="Only cheap" isActive={ui.onlyCheap} onToggle={() => onChange({ onlyCheap: !ui.onlyCheap })} />
        <FilterChip label="Only free" isActive={ui.onlyFree} onToggle={() => onChange({ onlyFree: !ui.onlyFree })} />
      </div>
    </div>
  )
}
