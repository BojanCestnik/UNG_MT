export default function SafetyBox({ notes }: { notes: string[] }) {
  return (
    <div className="rounded-2xl border border-amber-300 bg-gradient-to-br from-amber-50 to-orange-50 p-4 shadow-sm">
      <p className="mb-2 font-semibold text-amber-900">🦺 Safety</p>
      <ul className="list-disc pl-6">{notes.map((note) => <li key={note}>{note}</li>)}</ul>
    </div>
  )
}
