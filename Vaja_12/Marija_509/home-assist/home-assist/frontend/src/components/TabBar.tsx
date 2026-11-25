import type { Screen } from '../types'

interface Props { screen: Screen; onChange: (screen: Screen) => void }

const tabs: { id: Screen; emoji: string; label: string }[] = [
  { id: 'home', emoji: '📖', label: 'Guides' },
  { id: 'tools', emoji: '🧰', label: 'My tools' },
  { id: 'log', emoji: '📋', label: 'Log' },
]

export default function TabBar({ screen, onChange }: Props) {
  return (
    <nav className="flex border-t border-gray-200 bg-white">
      {tabs.map((tab) => (
        <button key={tab.id} onClick={() => onChange(tab.id)}
          className={'flex min-h-11 flex-1 flex-col items-center py-2 text-sm ' + (screen === tab.id ? 'font-bold text-teal-700' : 'text-gray-600')}>
          <span>{tab.emoji}</span>{tab.label}
        </button>
      ))}
    </nav>
  )
}
