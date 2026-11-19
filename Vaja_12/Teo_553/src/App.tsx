import { useEffect, useState } from 'react'
import { api, ApiError } from './api'
import type { Project, ProjectInput } from './types'
import ProjectList from './components/ProjectList'
import ProjectForm from './components/ProjectForm'
import ProjectDetail from './components/ProjectDetail'

type Screen = 'list' | 'detail' | 'create' | 'edit'

export default function App() {
  const [projects, setProjects] = useState<Project[]>([])
  const [screen, setScreen] = useState<Screen>('list')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [disconnected, setDisconnected] = useState(false)
  const [notFound, setNotFound] = useState(false)
  const selected = projects.find((project) => project.id === selectedId)

  function reportError(err: unknown) {
    if (err instanceof ApiError) {
      setError(err.message)
      setDisconnected(err.status === 0)
    } else {
      setError('Prišlo je do nepričakovane napake.')
      setDisconnected(false)
    }
  }

  useEffect(() => {
    let active = true
    api.list().then((items) => {
      if (active) setProjects(items)
    }).catch((err: unknown) => {
      if (active) reportError(err)
    }).finally(() => {
      if (active) setLoading(false)
    })
    return () => { active = false }
  }, [])

  async function retry() {
    setLoading(true)
    setError('')
    setDisconnected(false)
    try {
      const items = await api.list()
      setProjects(items)
      if (screen === 'detail' && selectedId && !items.some((item) => item.id === selectedId)) setNotFound(true)
    } catch (err) {
      reportError(err)
    } finally {
      setLoading(false)
    }
  }

  async function openProject(id: string) {
    if (busy) return
    setBusy(true)
    setError('')
    setNotFound(false)
    try {
      const project = await api.get(id)
      setProjects((prev) => prev.map((item) => item.id === id ? project : item))
      setSelectedId(id)
      setScreen('detail')
    } catch (err) {
      if (err instanceof ApiError && err.status === 404) {
        setSelectedId(id)
        setScreen('detail')
        setNotFound(true)
      } else reportError(err)
    } finally {
      setBusy(false)
    }
  }

  async function submitProject(input: ProjectInput) {
    if (busy) return
    setBusy(true)
    setError('')
    try {
      if (screen === 'edit' && selected) {
        const saved = await api.update({ ...selected, ...input })
        setProjects((prev) => prev.map((project) => project.id === saved.id ? saved : project))
        setSelectedId(saved.id)
      } else {
        const created = await api.create(input)
        setProjects((prev) => [...prev, created])
        setSelectedId(created.id)
      }
      setScreen('detail')
      setNotFound(false)
    } catch (err) {
      reportError(err)
    } finally {
      setBusy(false)
    }
  }

  async function updateProject(next: Project): Promise<boolean> {
    if (busy) return false
    setBusy(true)
    setError('')
    try {
      const saved = await api.update(next)
      setProjects((prev) => prev.map((project) => project.id === saved.id ? saved : project))
      return true
    } catch (err) {
      if (err instanceof ApiError && err.status === 404) setNotFound(true)
      else reportError(err)
      return false
    } finally {
      setBusy(false)
    }
  }

  async function deleteProject() {
    if (!selected || busy) return
    if (!window.confirm('Ali res želiš izbrisati projekt?')) return
    setBusy(true)
    setError('')
    try {
      await api.remove(selected.id)
      setProjects((prev) => prev.filter((project) => project.id !== selected.id))
      setSelectedId(null)
      setScreen('list')
      setNotFound(false)
    } catch (err) {
      if (err instanceof ApiError && err.status === 404) setNotFound(true)
      else reportError(err)
    } finally {
      setBusy(false)
    }
  }

  function back() {
    setError('')
    setDisconnected(false)
    setNotFound(false)
    setScreen('list')
  }

  const isBusy = busy || loading

  return (
    <div className="min-h-screen bg-[#F7F7F2]">
      <div className="mx-auto w-full max-w-[480px] px-4 pb-14 pt-6 sm:pt-9">
        <header className="mb-8 flex items-center gap-3 border-b border-[#e3e8e1] pb-5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#e3f0e7] text-xl" aria-hidden="true">🛠️</div>
          <div>
            <div className="text-lg font-extrabold tracking-tight text-[#256d5b]">MOJ PROJEKT</div>
            <p className="text-xs font-medium text-[#748078]">Načrtuj. Ustvari. Dokončaj.</p>
          </div>
        </header>

        {error && (
          <div role="alert" className="sticky top-2 z-10 mb-5 rounded-xl border border-red-200 bg-red-50 p-4 shadow-sm">
            <p className="text-sm font-semibold text-[#B91C1C]">{error}</p>
            <div className="mt-2 flex items-center gap-3">
              {disconnected && <button type="button" className="rounded-lg bg-[#B91C1C] px-3 py-2 text-sm font-semibold text-white" onClick={() => void retry()} disabled={isBusy}>Poskusi znova</button>}
              <button type="button" className="min-h-11 text-xs font-semibold text-[#9d3030]" onClick={() => setError('')}>Zapri sporočilo</button>
            </div>
          </div>
        )}

        {loading ? (
          <div role="status" className="panel py-12 text-center font-medium text-[#63736a]">Nalaganje ...</div>
        ) : screen === 'list' ? (
          <ProjectList projects={projects} busy={isBusy} onCreate={() => { setError(''); setScreen('create') }} onOpen={(id) => void openProject(id)} />
        ) : screen === 'create' ? (
          <ProjectForm busy={isBusy} onSubmit={submitProject} onCancel={back} />
        ) : screen === 'edit' && selected && !notFound ? (
          <ProjectForm key={selected.id} project={selected} busy={isBusy} onSubmit={submitProject}
            onCancel={() => { setError(''); setScreen('detail') }} />
        ) : screen === 'detail' && selected && !notFound ? (
          <ProjectDetail key={selected.id} project={selected} busy={isBusy} onBack={back}
            onEdit={() => { setError(''); setScreen('edit') }} onDelete={() => void deleteProject()} onUpdate={updateProject} />
        ) : (
          <div className="panel p-7 text-center">
            <h1 className="text-lg font-bold">Projekt ni najden</h1>
            <p className="mt-2 text-sm text-[#66736d]">Projekt ne obstaja več ali ga ni mogoče odpreti.</p>
            <button type="button" className="btn-primary mt-5" onClick={back}>Nazaj na projekte</button>
          </div>
        )}
        <footer className="mt-10 text-center text-xs text-[#98a39b]">Moj Projekt · Tvoja delavnica, tvoj načrt.</footer>
      </div>
    </div>
  )
}
