import type { Guide } from '../types'
import ToolItem from '../components/ToolItem'

interface Props { guides: Guide[]; ownedTools: string[]; onToggleTool: (name: string) => void }

// Tools that need more skill or cost more. Everything else counts as basic.
const PROFESSIONAL_TOOLS = ['Drill', 'Stud finder', 'Caulking gun', 'Drain snake']

export default function ToolsScreen({ guides, ownedTools, onToggleTool }: Props) {
  // All tools used by any guide, without duplicates
  const allTools = [...new Set(guides.flatMap((g) => g.tools))].sort()
  const basic = allTools.filter((t) => !PROFESSIONAL_TOOLS.includes(t))
  const professional = allTools.filter((t) => PROFESSIONAL_TOOLS.includes(t))

  const section = (title: string, tools: string[]) => (
    <div>
      <p className="mb-2 font-semibold">{title}</p>
      <div className="rounded-2xl bg-white py-2 shadow-md">
        {tools.map((t) => <ToolItem key={t} name={t} owned={ownedTools.includes(t)} onToggle={onToggleTool} />)}
      </div>
    </div>
  )

  return (
    <div className="flex flex-col gap-4">
      <p className="text-gray-600">Tick the tools you own. Guides show what is missing.</p>
      {section('Basic tools', basic)}
      {section('Professional tools', professional)}
    </div>
  )
}
