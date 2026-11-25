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

  function selectGuide(id: string) { setSelectedGuideId(id); setScreen('detail') }

  const selectedGuide = guides.find((g) => g.id === selectedGuideId)
  const inFlow = screen === 'detail' || screen === 'step'

  function renderScreen() {
    if (loading) return <p className="text-center">Loading...</p>
    if (error) return (
      <div className="flex flex-col items-center gap-4">
        <p className="text-red-600">{error}</p>
        <button className="min-h-11 rounded-xl bg-orange-500 px-6 font-semibold text-white" onClick={() => loadData(() => false)}>Try again</button>
      </div>)
    if (screen === 'home') return <HomeScreen guides={guides} onSelectGuide={selectGuide} />
    if (screen === 'tools') return <ToolsScreen guides={guides} ownedTools={ownedTools} onToggleTool={toggleTool} />
    if (screen === 'log') return <LogScreen log={log} guides={guides} onDeleteLog={deleteFromLog} />
    if (screen === 'detail') return <GuideDetailScreen guide={selectedGuide} ownedTools={ownedTools} onStart={() => setScreen('step')} onBack={() => setScreen('home')} />
    return selectedGuide ? <StepScreen key={selectedGuide.id} guide={selectedGuide} photoError={photoError} onChoosePhoto={choosePhoto} onSaveLog={saveToLog} /> : null
  }

  return (
    <div className="mx-auto flex h-dvh max-w-md flex-col bg-orange-50 text-gray-800 shadow-md">
      <header className="flex items-center gap-2 p-4 text-2xl font-bold">
        {inFlow && <button className="min-h-11 min-w-11 text-xl" aria-label="Back to guides" onClick={() => setScreen('home')}>←</button>}
        <span>🔧</span>Home Assist
      </header>
      {notice && <p className="mx-4 rounded-xl bg-red-600 p-2 text-white">{notice}</p>}
      <main className="flex-1 overflow-y-auto p-4">{renderScreen()}</main>
      {!inFlow && <TabBar screen={screen} onChange={setScreen} />}
    </div>
  )
}
