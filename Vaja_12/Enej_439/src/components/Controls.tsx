type Props = { canUndo: boolean; onAdd: () => void; onUndo: () => void }

export default function Controls({ canUndo, onAdd, onUndo }: Props) {
  return (
    <div className="mt-3 flex gap-2.5">
      <button
        onClick={onUndo}
        disabled={!canUndo}
        aria-label="Odstrani zadnji kozarec"
        className="h-16 w-16 rounded-2xl bg-soft text-2xl font-extrabold text-ink disabled:opacity-45"
      >
        −
      </button>
      <button
        onClick={onAdd}
        className="h-16 flex-1 rounded-2xl bg-accent text-lg font-extrabold text-on-accent"
      >
        + Kozarec
      </button>
    </div>
  )
}
