import type { Guide, LogEntry } from '../types'

interface Props { log: LogEntry[]; guides: Guide[]; onDeleteLog: (id: string) => void }

// ISO date -> DD.MM.YYYY
function formatDate(iso: string): string {
  const d = new Date(iso)
  const pad = (n: number) => String(n).padStart(2, '0')
  return pad(d.getDate()) + '.' + pad(d.getMonth() + 1) + '.' + d.getFullYear()
}

export default function LogScreen({ log, guides, onDeleteLog }: Props) {
  if (log.length === 0) return <p className="text-center text-gray-600">No repairs yet</p>
  const newestFirst = [...log].sort((a, b) => b.date.localeCompare(a.date))
  return (
    <div className="flex flex-col gap-4">
      {newestFirst.map((entry) => (
        <div key={entry.id} className="rounded-2xl glass p-4">
          <p className="text-lg font-semibold">{guides.find((g) => g.id === entry.guideId)?.title ?? 'Unknown repair'}</p>
          <p className="tabular-nums text-gray-600">{formatDate(entry.date)}</p>
          {entry.photo && <img src={entry.photo} alt="Finished repair" className="mt-2 max-h-48 rounded-xl" />}
          <button className="mt-2 min-h-11 font-semibold text-red-600"
            onClick={() => window.confirm('Delete this repair?') && onDeleteLog(entry.id)}>Delete</button>
        </div>
      ))}
    </div>
  )
}
