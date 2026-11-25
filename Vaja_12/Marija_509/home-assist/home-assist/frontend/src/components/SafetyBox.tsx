export default function SafetyBox({ notes }: { notes: string[] }) {
  return (
    <div className="rounded-xl border-2 border-amber-500 bg-amber-100 p-4">
      <p className="mb-2 font-semibold">Safety</p>
      <ul className="list-disc pl-6">{notes.map((note) => <li key={note}>{note}</li>)}</ul>
    </div>
  )
}
