import { useState, type FormEvent } from 'react'
import type { Phase, Project } from '../types'
import { progressOf } from '../types'

interface Props {
  project: Project
  busy: boolean
  onUpdate: (project: Project) => Promise<boolean>
}

export default function PhaseList({ project, busy, onUpdate }: Props) {
  const [formOpen, setFormOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const finished = project.phases.filter((phase) => phase.completed).length
  const progress = progressOf(project)

  function close() { setName(''); setError(''); setFormOpen(false); setEditingId(null) }
  function edit(phase: Phase) { setEditingId(phase.id); setName(phase.name); setError(''); setFormOpen(true) }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!name.trim()) { setError('Vnesi ime faze.'); return }
    setError('')
    const phases = editingId
      ? project.phases.map((phase) => phase.id === editingId ? { ...phase, name: name.trim() } : phase)
      : [...project.phases, { id: '', name: name.trim(), completed: false }]
    if (await onUpdate({ ...project, phases })) close()
  }

  async function toggle(phase: Phase) {
    await onUpdate({ ...project, phases: project.phases.map((old) => old.id === phase.id ? { ...old, completed: !old.completed } : old) })
  }

  return (
    <section className="panel p-5" aria-labelledby="phases-heading">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 id="phases-heading" className="text-lg font-bold">Faze dela</h2>
          <p className="mt-1 text-xs text-[#66736d]">{finished} od {project.phases.length} faz – {progress} %</p>
        </div>
        {!formOpen && <button type="button" className="btn-secondary" disabled={busy} onClick={() => setFormOpen(true)}>+ Dodaj</button>}
      </div>
      <div className="progress-track mt-4" role="progressbar" aria-label="Napredek faz dela" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
        <div className="progress-fill" style={{ width: `${progress}%` }} />
      </div>
      {project.phases.length === 0 && <p className="mt-5 rounded-xl bg-[#f6f8f5] px-4 py-4 text-sm text-[#66736d]">Ni še dodanih faz dela.</p>}
      <ul className="mt-3 divide-y divide-[#eef0ec]">
        {project.phases.map((phase) => (
          <li key={phase.id} className="flex items-center gap-3 py-3">
            <input type="checkbox" checked={phase.completed} disabled={busy} onChange={() => void toggle(phase)}
              aria-label={`Opravljeno: ${phase.name}`} className="h-5 w-5 shrink-0 accent-[#256d5b]" />
            <span className={`min-w-0 flex-1 break-words text-sm font-medium ${phase.completed ? 'text-[#819087] line-through' : ''}`}>{phase.name}</span>
            <button type="button" disabled={busy} className="min-h-11 rounded-lg px-2 text-xs font-semibold text-[#256d5b]" onClick={() => edit(phase)}>Uredi</button>
            <button type="button" disabled={busy} className="min-h-11 rounded-lg px-2 text-xs font-semibold text-[#B91C1C]" onClick={() => void onUpdate({ ...project, phases: project.phases.filter((p) => p.id !== phase.id) })}>Izbriši</button>
          </li>
        ))}
      </ul>
      {formOpen && (
        <form onSubmit={submit} noValidate className="mt-3 space-y-3 rounded-xl border border-[#d9e7dc] bg-[#f8fbf8] p-4">
          <h3 className="font-semibold">{editingId ? 'Uredi fazo' : 'Dodaj fazo'}</h3>
          <div>
            <label className="label" htmlFor="phase-name">Ime faze *</label>
            <input id="phase-name" className="field" value={name} maxLength={120}
              onChange={(e) => setName(e.target.value)} placeholder="Npr. Razrez materiala" />
          </div>
          {error && <p role="alert" className="text-sm text-[#B91C1C]">{error}</p>}
          <div className="flex flex-wrap gap-2">
            <button type="submit" className="btn-primary" disabled={busy}>Shrani fazo</button>
            <button type="button" className="btn-minimal" disabled={busy} onClick={close}>Prekliči</button>
          </div>
        </form>
      )}
    </section>
  )
}
