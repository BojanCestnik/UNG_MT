import { useState } from 'react'
import type { Guide } from '../types'
import Banner from '../components/Banner'
import GuideCard from '../components/GuideCard'

interface Props { guides: Guide[]; onSelectGuide: (id: string) => void }

export default function HomeScreen({ guides, onSelectGuide }: Props) {
  // Only this screen's own filter state
  const [object, setObject] = useState('')
  const [problem, setProblem] = useState('')
  const [search, setSearch] = useState('')

  // Derived values, calculated on every render
  const objects = [...new Set(guides.map((g) => g.object))]
  const problems = [...new Set(guides.map((g) => g.problem))]
  const shown = guides.filter((g) =>
    (!object || g.object === object) && (!problem || g.problem === problem) &&
    g.title.toLowerCase().includes(search.toLowerCase()))

  const field = 'min-h-11 w-full rounded-xl border border-gray-300 bg-white px-4'
  return (
    <div className="flex flex-col gap-4">
      <Banner text="Call a professional for electrical, gas and water-mains problems" />
      <div className="flex gap-2">
        <select className={field} value={object} onChange={(e) => setObject(e.target.value)} aria-label="Object">
          <option value="">Object</option>{objects.map((o) => <option key={o}>{o}</option>)}
        </select>
        <select className={field} value={problem} onChange={(e) => setProblem(e.target.value)} aria-label="Problem">
          <option value="">Problem</option>{problems.map((p) => <option key={p}>{p}</option>)}
        </select>
      </div>
      <input className={field} placeholder="Search guides..." value={search} onChange={(e) => setSearch(e.target.value)} />
      {shown.length === 0 && <p className="text-center text-gray-600">No guide found</p>}
      {shown.map((g) => <GuideCard key={g.id} guide={g} onSelect={onSelectGuide} />)}
    </div>
  )
}
