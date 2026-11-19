import { useEffect, useState } from 'react'
import type { Entry } from './types'
import WaterGlass from './components/WaterGlass'
import EntryList from './components/EntryList'
import Controls from './components/Controls'
import ResetButton from './components/ResetButton'

// Nastavitve: dnevni cilj in velikost enega kozarca
const GOAL = 8
const GLASS_ML = 250

// Podatki so shranjeni po datumu, zato se vsak dan začne prazno
const todayKey = () => 'voda:' + new Date().toLocaleDateString('sv-SE')

function loadEntries(key: string): Entry[] {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as Entry[]) : []
  } catch {
    return []
  }
}

function plural(n: number): string {
  if (n === 1) return 'kozarec'
  if (n === 2) return 'kozarca'
  if (n === 3 || n === 4) return 'kozarci'
  return 'kozarcev'
}

export default function App() {
  const [key] = useState(todayKey)
  // Edino stanje aplikacije: seznam današnjih zapisov
  const [entries, setEntries] = useState<Entry[]>(() => loadEntries(key))

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(entries))
    } catch {
      // brskalnik ne dovoli shranjevanja: aplikacija deluje naprej brez njega
    }
  }, [key, entries])

  const addGlass = () => {
    const time = new Date().toLocaleTimeString('sl-SI', { hour: '2-digit', minute: '2-digit' })
    setEntries((prev) => [...prev, { id: Date.now(), time, ml: GLASS_ML }])
  }
  const undoGlass = () => setEntries((prev) => prev.slice(0, -1))
  const resetDay = () => setEntries([])

  const count = entries.length
  const left = GOAL - count
  const message = count >= GOAL ? 'Cilj dosežen! 🎉' : `Še ${left} ${plural(left)} do cilja`

  return (
    <div className="h-dvh bg-page pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] text-ink sm:flex sm:h-auto sm:min-h-dvh sm:items-center sm:justify-center sm:p-4">
      <main className="mx-auto flex h-full w-full max-w-[440px] flex-col bg-card p-5 sm:h-auto sm:rounded-[28px] sm:p-6 sm:shadow-md">
        <h1 className="mb-5 text-2xl font-extrabold">💧 Vodni dnevnik</h1>
        <WaterGlass count={count} goal={GOAL} glassMl={GLASS_ML} />
        <p className="mt-4 min-h-6 text-center font-bold sm:text-left" aria-live="polite">
          {message}
        </p>
        <h2 className="mt-5 mb-2 font-extrabold">Današnji zapisi</h2>
        <EntryList entries={entries} />
        <Controls canUndo={count > 0} onAdd={addGlass} onUndo={undoGlass} />
        <ResetButton onReset={resetDay} />
      </main>
    </div>
  )
}
