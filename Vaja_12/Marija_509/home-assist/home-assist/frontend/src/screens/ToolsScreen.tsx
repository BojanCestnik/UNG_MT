import { useState } from 'react'
import type { Guide } from '../types'
import ToolItem from '../components/ToolItem'
import { TOOL_CATALOG } from '../data/toolCatalog'

interface Props { guides: Guide[]; ownedTools: string[]; onToggleTool: (name: string) => void }
type Level = 'all' | 'basic' | 'pro'

export default function ToolsScreen({ guides, ownedTools, onToggleTool }: Props) {
  const [level, setLevel] = useState<Level>('all')
  const [search, setSearch] = useState('')

  // The catalogue plus any tool that a guide uses but the catalogue does not know
  const known = TOOL_CATALOG.map((t) => t.name)
  const extra = [...new Set(guides.flatMap((g) => g.tools))]
    .filter((name) => !known.includes(name))
    .map((name) => ({ name, group: 'Other', pro: false }))
  const shown = [...TOOL_CATALOG, ...extra].filter((t) =>
    (level === 'all' || (level === 'pro') === t.pro) && t.name.toLowerCase().includes(search.toLowerCase()))
  const groups = [...new Set(shown.map((t) => t.group))]

  const levelButton = (id: Level, label: string) => (
    <button key={id} onClick={() => setLevel(id)}
      className={'min-h-11 flex-1 rounded-xl border-2 border-teal-500 font-semibold ' + (level === id ? 'btn-primary text-white' : 'bg-white text-teal-900')}>{label}</button>
  )

  return (
    <div className="flex flex-col gap-4">
      <p className="tabular-nums text-gray-600">You own {ownedTools.length} of {TOOL_CATALOG.length} tools. Guides show what is missing.</p>
      <div className="flex gap-2">{levelButton('all', 'All')}{levelButton('basic', 'Basic')}{levelButton('pro', 'Professional')}</div>
      <input className="min-h-11 w-full rounded-xl border border-sky-200 bg-white/80 px-4" placeholder="Search tools..." value={search} onChange={(e) => setSearch(e.target.value)} />
      <div className="grid items-start gap-4 md:grid-cols-2 xl:grid-cols-3">
        {groups.map((group) => (
          <div key={group}>
            <p className="mb-2 font-semibold">{group}</p>
            <div className="glass rounded-2xl py-2">
              {shown.filter((t) => t.group === group).map((t) => (
                <ToolItem key={t.name} name={t.name} pro={t.pro} owned={ownedTools.includes(t.name)} onToggle={onToggleTool} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
