import type { Guide } from '../types'
import ToolItem from '../components/ToolItem'

interface Props { guides: Guide[]; ownedTools: string[]; onToggleTool: (name: string) => void }

export default function ToolsScreen({ guides, ownedTools, onToggleTool }: Props) {
  // All tools used by any guide, without duplicates
  const allTools = [...new Set(guides.flatMap((g) => g.tools))].sort()
  return (
    <div className="flex flex-col gap-4">
      <p className="text-gray-600">Tick the tools you own. Guides show what is missing.</p>
      <div className="rounded-2xl bg-white py-2 shadow-md">
        {allTools.map((t) => <ToolItem key={t} name={t} owned={ownedTools.includes(t)} onToggle={onToggleTool} />)}
      </div>
    </div>
  )
}
