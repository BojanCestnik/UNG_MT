import { useCallback, useEffect, useState } from 'react'
import { api, ApiError } from './api'
import type { Project, ProjectInput, Settings } from './types'
import { DEFAULT_SETTINGS } from './types'
import ProjectList from './components/ProjectList'
import ProjectForm from './components/ProjectForm'
import ProjectDetail from './components/ProjectDetail'
import ProjectSidebar from './components/ProjectSidebar'
import LayoutSettings from './components/LayoutSettings'
import { readFileBase64 } from './components/ProjectImages'

type Screen = 'list' | 'detail' | 'create' | 'edit'

export default function App() {
  const [projects, setProjects] = useState<Project[]>([])
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS)
  const [screen, setScreen] = useState<Screen>('list')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [disconnected, setDisconnected] = useState(false)
  const [notFound, setNotFound] = useState(false)
  const selected = projects.find(project => project.id === selectedId)
  const isBusy = busy || loading

  const reportError = useCallback((err: unknown) => {
    if (err instanceof ApiError) {
      setError(err.message)
      setDisconnected(err.status === 0)
    } else {
      setError(err instanceof Error ? err.message : 'Prišlo je do nepričakovane napake.')
      setDisconnected(false)
    }
  }, [])

  useEffect(() => {
    let active = true
    Promise.all([api.list(), api.settings()]).then(([list, preferences]) => {
      if (!active) return
      setProjects(list); setSettings(preferences)
    }).catch((err: unknown) => { if (active) reportError(err) })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [reportError])

  async function retry() {
    setLoading(true); setError(''); setDisconnected(false)
    try {
      const [items, prefs] = await Promise.all([api.list(), api.settings()])
      setProjects(items); setSettings(prefs)
      if (selectedId && screen === 'detail' && !items.some(item => item.id === selectedId)) setNotFound(true)
    } catch (err) { reportError(err) }
    finally { setLoading(false) }
  }
  function list() {
    setScreen('list'); setSelectedId(null); setNotFound(false); setError(''); setMobileMenuOpen(false)
  }
  function create() { setError(''); setScreen('create'); setMobileMenuOpen(false) }

  async function openProject(id: string) {
    if (busy) return
    setBusy(true); setError(''); setNotFound(false)
    try {
      const project = await api.get(id)
      setProjects(prev => prev.map(p => p.id === id ? project : p))
      setSelectedId(id); setScreen('detail'); setMobileMenuOpen(false)
    } catch (err) {
      if (err instanceof ApiError && err.status === 404) {
        setSelectedId(id); setScreen('detail'); setNotFound(true); setMobileMenuOpen(false)
      } else reportError(err)
    } finally { setBusy(false) }
  }

  async function submitProject(input: ProjectInput) {
    if (busy) return
    setBusy(true); setError('')
    try {
      if (screen === 'edit' && selected) {
        const updated = await api.update({ ...selected, ...input })
        setProjects(prev => prev.map(project => project.id === updated.id ? updated : project))
        setSelectedId(updated.id)
      } else {
        const created = await api.create(input)
        setProjects(prev => [...prev, created]); setSelectedId(created.id)
      }
      setScreen('detail'); setNotFound(false)
    } catch (err) { reportError(err) }
    finally { setBusy(false) }
  }
  async function updateProject(next: Project): Promise<boolean> {
    if (busy) return false
    setBusy(true); setError('')
    try {
      const saved = await api.update(next)
      setProjects(prev => prev.map(p => p.id === saved.id ? saved : p))
      return true
    } catch (err) {
      if (err instanceof ApiError && err.status === 404) setNotFound(true)
      else reportError(err)
      return false
    } finally { setBusy(false) }
  }
  async function deleteProject() {
    if (!selected || busy || !window.confirm('Ali res želiš izbrisati projekt in njegove slike?')) return
    setBusy(true); setError('')
    try {
      await api.remove(selected.id)
      setProjects(prev => prev.filter(p => p.id !== selected.id))
      list()
    } catch (err) { reportError(err) }
    finally { setBusy(false) }
  }
  async function saveSettings(next: Settings) {
    if (busy) return
    setBusy(true); setError('')
    try { setSettings(await api.saveSettings(next)) }
    catch (err) { reportError(err) }
    finally { setBusy(false) }
  }
  async function addImage(file: File, description: string): Promise<boolean> {
    if (!selected || busy) return false
    setBusy(true); setError('')
    try {
      if (file.size > 2 * 1024 * 1024 || !['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        throw new Error('Dovoljene so JPG, PNG in WebP slike do 2 MB.')
      }
      const data = await readFileBase64(file)
      const saved = await api.addImage(selected.id, file.name, file.type, description, data)
      setProjects(prev => prev.map(p => p.id === saved.id ? saved : p))
      return true
    } catch (err) { reportError(err); return false }
    finally { setBusy(false) }
  }
  async function deleteImage(imageId: string): Promise<boolean> {
    if (!selected || busy) return false
    setBusy(true); setError('')
    try {
      await api.removeImage(selected.id, imageId)
      const updated = await api.get(selected.id)
      setProjects(prev => prev.map(p => p.id === updated.id ? updated : p))
      return true
    } catch (err) { reportError(err); return false }
    finally { setBusy(false) }
  }

  return <div className="flex min-h-[100dvh] w-full bg-[#F7F7F2]">
    <ProjectSidebar projects={projects} selectedId={selectedId} mobileOpen={mobileMenuOpen}
      collapsed={settings.sidebarCollapsed} busy={isBusy} onClose={() => setMobileMenuOpen(false)}
      onToggleCollapse={() => void saveSettings({ ...settings, sidebarCollapsed: !settings.sidebarCollapsed })}
      onCreate={create} onList={list} onOpen={id => void openProject(id)} />
    <main className="min-w-0 flex-1 px-4 pb-12 pt-5 sm:px-6 lg:px-7 2xl:px-10">
      <header className="mb-7 flex items-center justify-between gap-3 border-b border-[#e3e8e1] pb-5">
        <div className="flex min-w-0 items-center gap-3">
          <button type="button" className="btn-secondary px-3 lg:hidden" aria-label="Odpri meni projektov" aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen(true)}>☰ <span className="hidden sm:inline">Meni</span></button>
          <div className="min-w-0"><p className="text-lg font-extrabold tracking-tight text-[#256d5b] lg:text-xl">MOJ PROJEKT</p>
            <p className="text-xs text-[#748078]">Načrtuj. Ustvari. Dokončaj.</p></div>
        </div>
        <p className="hidden text-right text-xs text-[#809088] sm:block">Tvoja delavnica, tvoj načrt.</p>
      </header>
      {error && <div role="alert" className="sticky top-2 z-20 mb-5 flex flex-wrap items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 shadow-sm">
        <p className="min-w-0 flex-1 text-sm font-semibold text-[#B91C1C]">{error}</p>
        {disconnected && <button type="button" className="btn-danger" disabled={isBusy} onClick={() => void retry()}>Poskusi znova</button>}
        <button type="button" className="btn-minimal" onClick={() => setError('')}>Zapri</button>
      </div>}

      {loading ? <div className="panel py-14 text-center text-[#63736a]" role="status">Nalaganje ...</div>
      : screen === 'list' ? <>
        <LayoutSettings settings={settings} busy={isBusy} onChange={saveSettings} />
        <ProjectList projects={projects} settings={settings} busy={isBusy} onCreate={create} onOpen={id => void openProject(id)} />
      </> : screen === 'create' ?
        <ProjectForm busy={isBusy} onSubmit={submitProject} onCancel={list} />
      : screen === 'edit' && selected && !notFound ?
        <ProjectForm key={selected.id} project={selected} busy={isBusy} onSubmit={submitProject}
          onCancel={() => { setError(''); setScreen('detail') }} />
      : screen === 'detail' && selected && !notFound ? <>
        <div className="mb-4 flex justify-end"><button type="button" className="btn-minimal" disabled={isBusy}
          onClick={() => void saveSettings({ ...settings, detailView: settings.detailView === 'tabs' ? 'sections' : 'tabs' })}>
          Prikaz: {settings.detailView === 'tabs' ? 'Zavihki' : 'Vsi razdelki'} · Spremeni
        </button></div>
        <ProjectDetail key={selected.id} project={selected} settings={settings} busy={isBusy}
          onBack={list} onEdit={() => { setError(''); setScreen('edit') }} onDelete={() => void deleteProject()}
          onUpdate={updateProject} onAddImage={addImage} onDeleteImage={deleteImage} />
      </> : <div className="panel p-8 text-center">
        <h1 className="text-xl font-bold">Projekt ni najden</h1>
        <p className="mt-2 text-sm text-[#66736d]">Projekt ne obstaja več ali ga ni mogoče odpreti.</p>
        <button type="button" className="btn-primary mt-5" onClick={list}>Nazaj na projekte</button>
      </div>}
      <footer className="mt-12 text-center text-xs text-[#96a29a]">Moj Projekt · Tvoja delavnica, tvoj načrt.</footer>
    </main>
  </div>
}
