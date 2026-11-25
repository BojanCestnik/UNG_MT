import { useState } from 'react'
import type { Guide } from '../types'
import Banner from '../components/Banner'
import GuideCard from '../components/GuideCard'

interface Props { guides: Guide[]; onSelectGuide: (id: string) => void }

export default function HomeScreen({ guides, onSelectGuide }: Props) {
  // Only this screen's own filter state
  const [category, setCategory] = useState('')
  const [problem, setProblem] = useState('')
  const [search, setSearch] = useState('')

  // Derived values, calculated on every render
  const categories = [...new Set(guides.map((g) => g.category ?? 'Other'))]
  const inCategory = guides.filter((g) => !category || (g.category ?? 'Other') === category)
  const problems = [...new Set(inCategory.map((g) => g.problem))]
  const shown = inCategory.filter((g) =>
    (!problem || g.problem === problem) &&
    (g.title + ' ' + g.problem + ' ' + g.object).toLowerCase().includes(search.toLowerCase()))

  const field = 'min-h-11 w-full rounded-xl border border-gray-300 bg-white px-4'
  return (
    <div className="flex flex-col gap-4">
      <Banner text="Call a professional for electrical, gas and water-mains problems" />
      <div className="flex gap-2">
        <select className={field} value={category} onChange={(e) => { setCategory(e.target.value); setProblem('') }} aria-label="Category">
          <option value="">All categories</option>{categories.map((c) => <option key={c}>{c}</option>)}
        </select>
        <select className={field} value={problem} onChange={(e) => setProblem(e.target.value)} aria-label="Problem">
          <option value="">All problems</option>{problems.map((p) => <option key={p}>{p}</option>)}
        </select>
      </div>
      <input className={field} placeholder="Search guides..." value={search} onChange={(e) => setSearch(e.target.value)} />
      <p className="tabular-nums text-sm text-gray-600">{shown.length} guides</p>
      {shown.length === 0 && <p className="text-center text-gray-600">No guide found</p>}
      {shown.map((g) => <GuideCard key={g.id} guide={g} onSelect={onSelectGuide} />)}
    </div>
  )
}
