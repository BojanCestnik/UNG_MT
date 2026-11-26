import type { Screen } from '../types'

interface Props { screen: Screen; onChange: (screen: Screen) => void }

const tabs: { id: Screen; emoji: string; label: string }[] = [
  { id: 'home', emoji: '📖', label: 'Guides' },
  { id: 'scan', emoji: '📸', label: 'Scan a problem' },
  { id: 'tools', emoji: '🧰', label: 'My tools' },
  { id: 'log', emoji: '📋', label: 'Log' },
]

export default function TabBar({ screen, onChange }: Props) {
  return (
    <nav className="flex border-t border-sky-100 bg-white pb-[env(safe-area-inset-bottom)] shadow-[0_-6px_20px_rgba(80,110,170,.12)] lg:w-60 lg:border-r lg:border-t-0 lg:bg-white/70 lg:shadow-none lg:flex-none lg:flex-col lg:gap-2 lg:p-4">
      {tabs.map((tab) => {
        const active = screen === tab.id
        return (
          <button key={tab.id} onClick={() => onChange(tab.id)} aria-current={active ? 'page' : undefined}
            className={'flex min-h-11 flex-1 flex-col items-center py-2 text-sm transition-colors lg:flex-none lg:flex-row lg:gap-3 lg:rounded-xl lg:px-4 lg:py-3 lg:text-base ' +
              (active ? 'font-bold text-teal-800 lg:bg-gradient-to-r lg:from-teal-100 lg:to-sky-100' : 'text-slate-600 lg:hover:bg-white/70')}>
            <span className="text-xl lg:text-2xl">{tab.emoji}</span>{tab.label}
          </button>
        )
      })}
    </nav>
  )
}
