import type { Guide } from '../types'

interface Props { guide: Guide; onSelect: (id: string) => void }

export default function GuideCard({ guide, onSelect }: Props) {
  const badge = guide.difficulty === 'easy' ? 'bg-green-100 text-green-900' : 'bg-amber-100 text-amber-900'
  return (
    <button onClick={() => onSelect(guide.id)} className="min-h-11 w-full rounded-2xl bg-white p-4 text-left shadow-md">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-lg font-semibold">{guide.title}</h3>
        <span className={'rounded-full px-4 py-0.5 text-sm font-semibold ' + badge}>{guide.difficulty}</span>
      </div>
      <p className="tabular-nums text-gray-600">{guide.minutes} min</p>
    </button>
  )
}
