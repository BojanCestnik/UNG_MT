import type { Guide } from '../types'
import SafetyBox from '../components/SafetyBox'
import { compareTools } from '../utils/compareTools'

interface Props { guide: Guide | undefined; ownedTools: string[]; onStart: () => void; onBack: () => void }

export default function GuideDetailScreen({ guide, ownedTools, onStart, onBack }: Props) {
  if (!guide) {
    return <div className="flex flex-col gap-4"><p>Guide not found</p><button className="min-h-11 rounded-xl border-2 border-teal-500 bg-white/80 px-6 font-semibold" onClick={onBack}>Back</button></div>
  }
  const { have, missing } = compareTools(guide.tools, ownedTools)
  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-4 lg:max-w-3xl lg:text-lg">
      <SafetyBox notes={guide.safetyNotes} />
      <h2 className="text-lg font-semibold">{guide.title}</h2>
      <p className={'font-semibold ' + (missing.length === 0 ? 'text-green-600' : 'text-red-600')}>
        {missing.length === 0 ? '✅ You have everything' : '⚠️ ' + missing.length + ' of ' + guide.tools.length + ' tools missing'}
      </p>
      <div className="rounded-2xl glass p-4">
        <p className="mb-2 font-semibold">Tools</p>
        {guide.tools.map((t) => (
          <p key={t} className="flex justify-between">{t}
            <span className={have.includes(t) ? 'text-green-600' : 'text-red-600'}>{have.includes(t) ? '✓ Have' : '✗ Missing'}</span>
          </p>
        ))}
        <p className="mb-2 mt-4 font-semibold">Materials</p>
        <ul className="list-disc pl-6">{guide.materials.map((m) => <li key={m}>{m}</li>)}</ul>
      </div>
      <button className="min-h-11 btn-primary rounded-xl px-6 font-semibold text-white" onClick={onStart}>Start repair</button>
    </div>
  )
}
