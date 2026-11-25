import type { Guide } from '../types'

interface Props { guide: Guide; onSelect: (id: string) => void }

// One colour per category (full class names so Tailwind can find them)
const categoryStyle: Record<string, { border: string; bubble: string }> = {
  'Plumbing': { border: 'border-sky-500', bubble: 'bg-sky-100' },
  'Furniture': { border: 'border-amber-500', bubble: 'bg-amber-100' },
  'Walls & doors': { border: 'border-emerald-500', bubble: 'bg-emerald-100' },
  'Clothes': { border: 'border-purple-500', bubble: 'bg-purple-100' },
  'Security': { border: 'border-indigo-500', bubble: 'bg-indigo-100' },
  'Appliances': { border: 'border-cyan-500', bubble: 'bg-cyan-100' },
  'Garden': { border: 'border-green-500', bubble: 'bg-green-100' },
  'Bikes': { border: 'border-lime-500', bubble: 'bg-lime-100' },
  'Kitchen & cleaning': { border: 'border-orange-500', bubble: 'bg-orange-100' },
}
const defaultStyle = { border: 'border-gray-400', bubble: 'bg-gray-100' }

export default function GuideCard({ guide, onSelect }: Props) {
  const style = categoryStyle[guide.category ?? ''] ?? defaultStyle
  const badges = { easy: 'bg-green-100 text-green-900', medium: 'bg-amber-100 text-amber-900', hard: 'bg-red-100 text-red-900' }
  const badge = badges[guide.difficulty]
  return (
    <button onClick={() => onSelect(guide.id)}
      className={'flex min-h-11 w-full items-center gap-4 rounded-2xl border-l-8 bg-white p-4 text-left shadow-md ' + style.border}>
      <span className={'flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-2xl ' + style.bubble}>{guide.emoji ?? '🔧'}</span>
      <div className="flex-1">
        <h3 className="text-lg font-semibold">{guide.title}</h3>
        <p className="tabular-nums text-gray-600">{guide.minutes} min · {guide.category}</p>
      </div>
      <span className={'rounded-full px-4 py-0.5 text-sm font-semibold ' + badge}>{guide.difficulty}</span>
    </button>
  )
}
