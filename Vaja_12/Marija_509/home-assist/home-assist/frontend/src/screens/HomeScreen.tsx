import { useState } from 'react'
import type { Guide } from '../types'
import Banner from '../components/Banner'
import GuideCard from '../components/GuideCard'

interface Props { guides: Guide[]; onSelectGuide: (id: string) => void; onScan: () => void }

export default function HomeScreen({ guides, onSelectGuide, onScan }: Props) {
  // Only this screen's own filter state
  const [category, setCategory] = useState('')
  const [problem, setProblem] = useState('')
  const [search, setSearch] = useState('')

  // Derived values, calculated on every render
  const categories = [...new Set(guides.map((g) => g.category ?? 'Other'))]
  const inCategory = guides.filter((g) => !category || (g.category ?? 'Other') === category)
  const problems = [...new Set(inCategory.map((g) => g.problem))]
  // easy first, hard last; same difficulty is sorted by title
  const order: Record<Guide['difficulty'], number> = { easy: 0, medium: 1, hard: 2 }
  const shown = inCategory.filter((g) =>
    (!problem || g.problem === problem) &&
    (g.title + ' ' + g.problem + ' ' + g.object).toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => order[a.difficulty] - order[b.difficulty] || a.title.localeCompare(b.title))

  const field = 'min-h-11 w-full rounded-xl border border-sky-200 bg-white/80 px-4'
  return (
    <div className="flex flex-col gap-4">
      <Banner text="Call a professional for electrical, gas and water-mains problems" />
      <button onClick={onScan} className="hover-lift flex items-center gap-4 rounded-2xl bg-gradient-to-r from-violet-100 via-sky-100 to-teal-100 p-4 text-left ring-1 ring-white/70">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/80 text-2xl">📸</span>
        <span className="flex-1"><span className="block text-lg font-semibold">Not sure what is wrong?</span><span className="text-slate-600">Take a photo and I will write you a step-by-step fix.</span></span>
        <span className="hidden font-semibold text-violet-700 sm:block">Try it →</span>
      </button>
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
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{shown.map((g) => <GuideCard key={g.id} guide={g} onSelect={onSelectGuide} />)}</div>
    </div>
  )
}
