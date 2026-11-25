import { useEffect, useState } from 'react'
import type { Guide, LogEntry, Screen } from './types'
import { addLogEntry, deleteLogEntry, getGuides, getLog, getTools, saveTools } from './api/api'
import { validatePhoto } from './utils/validatePhoto'
import { readFileAsDataUrl } from './utils/readFile'
import TabBar from './components/TabBar'
import HomeScreen from './screens/HomeScreen'
import ToolsScreen from './screens/ToolsScreen'
import GuideDetailScreen from './screens/GuideDetailScreen'
import StepScreen from './screens/StepScreen'
import LogScreen from './screens/LogScreen'
import ScanScreen from './screens/ScanScreen'

export default function App() {
  // Shared state lives here; screens get data through props.
  const [screen, setScreen] = useState<Screen>('home')
  const [selectedGuideId, setSelectedGuideId] = useState<string | null>(null)
  const [guides, setGuides] = useState<Guide[]>([])
  const [ownedTools, setOwnedTools] = useState<string[]>([])
  const [log, setLog] = useState<LogEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('') // short error messages, e.g. a tick that failed
  const [pendingPhoto, setPendingPhoto] = useState<string | undefined>(undefined)
  const [photoError, setPhotoError] = useState('')

  // Loads guides, tools and log together. isCancelled stops state updates after unmount.
  async function loadData(isCancelled: () => boolean) {
    setLoading(true)
    setError('')
    try {
      const [g, t, l] = await Promise.all([getGuides(), getTools(), getLog()])
      if (isCancelled()) return
      setGuides(g); setOwnedTools(t); setLog(l)
    } catch {
      if (!isCancelled()) setError('Cannot reach the server')
    } finally {
      if (!isCancelled()) setLoading(false)
    }
  }

  useEffect(() => {
    let cancelled = false
    loadData(() => cancelled)
    return () => { cancelled = true }
  }, [])

  // Update the screen at once, then tell the server. If that fails, go back to the old list.
  async function toggleTool(name: string) {
    const previous = ownedTools
    const next = previous.includes(name) ? previous.filter((t) => t !== name) : [...previous, name]
    setOwnedTools(next)
    try {
      await saveTools(next)
      setNotice('')
    } catch {
      setOwnedTools(previous)
      setNotice('Could not save your tools. Try again.')
    }
  }

  async function choosePhoto(file: File) {
    const problem = validatePhoto(file)
    if (problem) { setPhotoError(problem); setPendingPhoto(undefined); return }
    setPhotoError('')
    setPendingPhoto(await readFileAsDataUrl(file))
  }

  async function saveToLog() {
    if (!selectedGuideId) return
    try {
      const entry = await addLogEntry({ guideId: selectedGuideId, date: new Date().toISOString(), photo: pendingPhoto })
      setLog([entry, ...log])
      setPendingPhoto(undefined); setPhotoError(''); setNotice('')
      setScreen('log')
    } catch (e) {
      setPhotoError(e instanceof Error ? e.message : 'Could not save')
    }
  }

  async function deleteFromLog(id: string) {
    try {
      await deleteLogEntry(id)
      setLog(log.filter((entry) => entry.id !== id))
    } catch {
      setNotice('Could not delete the entry.')
    }
  }

  function openScannedGuide(guide: Guide) { setGuides((g) => [...g, guide]); selectGuide(guide.id) }

  function selectGuide(id: string) { setSelectedGuideId(id); setScreen('detail') }

  const selectedGuide = guides.find((g) => g.id === selectedGuideId)
  const inFlow = screen === 'detail' || screen === 'step'

  function renderScreen() {
    if (loading) return <p className="text-center">Loading...</p>
    if (error) return (
      <div className="flex flex-col items-center gap-4">
        <p className="text-red-600">{error}. Is the backend running on port 3001?</p>
        <button className="min-h-11 rounded-xl bg-teal-700 px-6 font-semibold text-white" onClick={() => loadData(() => false)}>Try again</button>
      </div>)
    if (screen === 'home') return <HomeScreen guides={guides} onSelectGuide={selectGuide} onScan={() => setScreen('scan')} />
    if (screen === 'scan') return <ScanScreen ownedTools={ownedTools} onOpenGuide={openScannedGuide} />
    if (screen === 'tools') return <ToolsScreen guides={guides} ownedTools={ownedTools} onToggleTool={toggleTool} />
    if (screen === 'log') return <LogScreen log={log} guides={guides} onDeleteLog={deleteFromLog} />
    if (screen === 'detail') return <GuideDetailScreen guide={selectedGuide} ownedTools={ownedTools} onStart={() => setScreen('step')} onBack={() => setScreen('home')} />
    return selectedGuide ? <StepScreen key={selectedGuide.id} guide={selectedGuide} photoError={photoError} onChoosePhoto={choosePhoto} onSaveLog={saveToLog} /> : null
  }

  return (
    <div className="mx-auto flex h-dvh w-full max-w-[1500px] flex-col lg:p-5">
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-white/35 backdrop-blur-sm lg:rounded-3xl lg:shadow-[0_20px_60px_rgba(80,110,170,.22)] lg:ring-1 lg:ring-white/70">
        <header className="flex items-center gap-3 bg-gradient-to-r from-teal-500 via-sky-500 to-violet-500 p-4 text-2xl font-bold text-white shadow-md lg:px-8 lg:py-5 lg:text-3xl">
          {inFlow && <button className="min-h-11 min-w-11 rounded-full text-xl hover:bg-white/20" aria-label="Back to guides" onClick={() => setScreen('home')}>←</button>}
          <span className="text-3xl">🔧</span>Home Assist
          <span className="ml-auto hidden text-base font-medium text-white/85 md:block">Fix it yourself, step by step</span>
        </header>
        {notice && <p className="mx-4 mt-3 rounded-xl bg-red-500 p-2 text-white shadow">{notice}</p>}
        {/* Phone: tab bar at the bottom. Laptop (lg): tab bar becomes a sidebar on the left. */}
        <div className="flex min-h-0 flex-1 flex-col lg:flex-row-reverse">
          <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">{renderScreen()}</main>
          {!inFlow && <TabBar screen={screen} onChange={setScreen} />}
        </div>
      </div>
    </div>
  )
}
