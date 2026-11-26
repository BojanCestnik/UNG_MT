import { useState, type FormEvent } from 'react'
import type { Phase, Project, Subphase } from '../types'
import { completedTasks, phaseProgress, progressOf } from '../types'

interface Props { project: Project; busy: boolean; onUpdate: (next: Project) => Promise<boolean> }

export default function PhaseList({ project, busy, onUpdate }: Props) {
  const [newName, setNewName] = useState('')
  const [newOpen, setNewOpen] = useState(false)
  const [expanded, setExpanded] = useState<Set<string>>(new Set())
  const [error, setError] = useState('')
  const tasks = completedTasks(project)

  async function createPhase(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!newName.trim()) { setError('Vnesi ime faze.'); return }
    const phase: Phase = { id: crypto.randomUUID(), name: newName.trim(), completed: false, subphases: [] }
    if (await onUpdate({ ...project, phases: [...project.phases, phase] })) {
      setNewName(''); setError(''); setNewOpen(false)
    }
  }
  async function setPhase(phaseId: string, update: (p: Phase) => Phase) {
    await onUpdate({ ...project, phases: project.phases.map(p => p.id === phaseId ? update(p) : p) })
  }
  async function addSubphase(phase: Phase) {
    const name = window.prompt(`Nova podfaza za »${phase.name}«:`)
    if (name === null) return
    if (!name.trim()) { setError('Vnesi ime podfaze.'); return }
    const sub: Subphase = { id: crypto.randomUUID(), name: name.trim(), completed: !phase.subphases.length && phase.completed }
    if (await onUpdate({ ...project, phases: project.phases.map(p => p.id === phase.id
      ? { ...p, completed: false, subphases: [...p.subphases, sub] } : p) })) {
      setExpanded(prev => new Set(prev).add(phase.id)); setError('')
    }
  }
  async function renamePhase(phase: Phase) {
    const name = window.prompt('Novo ime faze:', phase.name)
    if (name === null) return
    if (!name.trim()) { setError('Ime faze ne sme biti prazno.'); return }
    await setPhase(phase.id, p => ({ ...p, name: name.trim() }))
  }
  async function renameSubphase(phase: Phase, subphase: Subphase) {
    const name = window.prompt('Novo ime podfaze:', subphase.name)
    if (name === null) return
    if (!name.trim()) { setError('Ime podfaze ne sme biti prazno.'); return }
    await setPhase(phase.id, p => ({ ...p, subphases: p.subphases.map(s => s.id === subphase.id ? { ...s, name: name.trim() } : s) }))
  }
  async function deleteSubphase(phase: Phase, subphase: Subphase) {
    if (!window.confirm(`Izbrišem podfazo »${subphase.name}«?`)) return
    await setPhase(phase.id, p => ({ ...p, completed: false, subphases: p.subphases.filter(s => s.id !== subphase.id) }))
  }
  async function togglePhase(phase: Phase) {
    const checked = phase.subphases.length ? phase.subphases.every(s => s.completed) : phase.completed
    await setPhase(phase.id, p => ({ ...p, completed: !checked,
      subphases: p.subphases.map(s => ({ ...s, completed: !checked })) }))
  }
  async function toggleSubphase(phase: Phase, subphase: Subphase) {
    await setPhase(phase.id, p => ({ ...p, subphases: p.subphases.map(s => s.id === subphase.id ? { ...s, completed: !s.completed } : s) }))
  }

  return <section className="panel p-4 sm:p-5" aria-labelledby="phases-heading">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div><h2 id="phases-heading" className="text-lg font-bold">Faze dela</h2>
        <p className="mt-1 text-xs text-[#66736d]">{tasks.done} od {tasks.all} opravil – {progressOf(project)} %</p></div>
      <button type="button" className="btn-primary" disabled={busy} onClick={() => setNewOpen(!newOpen)}>+ Dodaj fazo</button>
    </div>
    <div role="progressbar" aria-label="Napredek faz dela" aria-valuenow={progressOf(project)} aria-valuemin={0} aria-valuemax={100}
      className="progress-track mt-4"><div className="progress-fill" style={{ width: `${progressOf(project)}%` }} /></div>
    {error && <p className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-[#B91C1C]" role="alert">{error}</p>}
    {newOpen && <form onSubmit={createPhase} className="mt-4 rounded-xl border border-[#b7d5c4] bg-[#f8fbf8] p-4">
      <label className="label" htmlFor="phase-new">Ime faze</label>
      <input id="phase-new" maxLength={120} className="field" value={newName} onChange={e => setNewName(e.target.value)} placeholder="Npr. Sestavljanje ogrodja" />
      <div className="mt-3 flex flex-wrap gap-2"><button disabled={busy} type="submit" className="btn-primary">Shrani fazo</button>
        <button type="button" className="btn-minimal" onClick={() => setNewOpen(false)}>Prekliči</button></div>
    </form>}
    {project.phases.length === 0 && <p className="mt-5 rounded-xl bg-[#f6f8f5] p-4 text-sm text-[#66736d]">Ni še dodanih faz dela.</p>}
    <div className="mt-4 space-y-3">
      {project.phases.map(phase => {
        const hasSubs = phase.subphases.length > 0
        const checked = hasSubs ? phase.subphases.every(sub => sub.completed) : phase.completed
        const open = expanded.has(phase.id)
        return <div key={phase.id} className="rounded-xl border border-[#e4eae3] bg-white p-3">
          <div className="flex items-center gap-3">
            <input type="checkbox" checked={checked} disabled={busy} className="h-5 w-5 shrink-0 accent-[#256d5b]" aria-label={`Faza opravljena: ${phase.name}`}
              onChange={() => void togglePhase(phase)} />
            <div className="min-w-0 flex-1">
              <p className={`break-words font-semibold ${checked ? 'text-[#829186] line-through' : ''}`}>{phase.name}</p>
              {hasSubs && <p className="text-xs text-[#718077]">{phase.subphases.filter(sub => sub.completed).length} od {phase.subphases.length} podfaz • {phaseProgress(phase)} %</p>}
            </div>
            {hasSubs && <button className="btn-minimal px-3" type="button" disabled={busy} aria-expanded={open}
              onClick={() => setExpanded(prev => { const next = new Set(prev); open ? next.delete(phase.id) : next.add(phase.id); return next })}>
              {open ? '▾' : '▸'} <span className="sr-only">Podfaze</span>
            </button>}
          </div>
          <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 pl-7">
            <button className="action-link" type="button" disabled={busy} onClick={() => void addSubphase(phase)}>+ Podfaza</button>
            <button className="action-link" type="button" disabled={busy} onClick={() => void renamePhase(phase)}>Preimenuj</button>
            <button className="action-link text-[#B91C1C]" type="button" disabled={busy}
              onClick={() => { if (window.confirm(`Izbrišem fazo »${phase.name}« in vse njene podfaze?`)) void onUpdate({ ...project, phases: project.phases.filter(p => p.id !== phase.id) }) }}>Izbriši</button>
          </div>
          {hasSubs && open && <ul className="mt-3 space-y-1 border-t border-[#edf0ea] pt-3 pl-4 sm:pl-8">
            {phase.subphases.map(sub => <li key={sub.id} className="flex flex-wrap items-center gap-x-3 gap-y-1 py-2">
              <input type="checkbox" className="h-5 w-5 accent-[#256d5b]" checked={sub.completed} disabled={busy}
                aria-label={`Podfaza opravljena: ${sub.name}`} onChange={() => void toggleSubphase(phase, sub)} />
              <span className={`min-w-0 flex-1 break-words text-sm ${sub.completed ? 'text-[#829186] line-through' : ''}`}>{sub.name}</span>
              <button type="button" className="action-link" disabled={busy} onClick={() => void renameSubphase(phase, sub)}>Uredi</button>
              <button type="button" className="action-link text-[#B91C1C]" disabled={busy} onClick={() => void deleteSubphase(phase, sub)}>Izbriši</button>
            </li>)}
          </ul>}
        </div>
      })}
    </div>
  </section>
}
