import { useState, type FormEvent } from 'react'
import type { Project, ProjectInput, ProjectStatus } from '../types'
import { todayLocal } from '../types'

interface Props {
  project?: Project
  busy: boolean
  onSubmit: (data: ProjectInput) => Promise<void>
  onCancel: () => void
}

export default function ProjectForm({ project, busy, onSubmit, onCancel }: Props) {
  const [name, setName] = useState(project?.name ?? '')
  const [description, setDescription] = useState(project?.description ?? '')
  const [startDate, setStartDate] = useState(project?.startDate ?? todayLocal())
  const [status, setStatus] = useState<ProjectStatus>(project?.status ?? 'planned')
  const [error, setError] = useState('')

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!name.trim()) { setError('Vnesi ime projekta'); return }
    if (!startDate) { setError('Vnesi datum začetka'); return }
    setError('')
    await onSubmit({
      name: name.trim(), description: description.trim(), startDate, status,
      materialGroups: project?.materialGroups ?? [], materials: project?.materials ?? [],
      phases: project?.phases ?? [], notes: project?.notes ?? '', images: project?.images ?? [],
    })
  }

  return (
    <section>
      <button type="button" disabled={busy} className="mb-5 min-h-11 text-sm font-semibold text-[#256d5b]" onClick={onCancel}>← Nazaj</button>
      <h1 className="text-[24px] font-bold tracking-tight">{project ? 'Uredi projekt' : 'Nov projekt'}</h1>
      <p className="mt-1 text-sm text-[#66736d]">Vnesi osnovne podatke svojega projekta.</p>
      <form onSubmit={submit} className="panel mt-5 space-y-5 p-5" noValidate>
        <div>
          <label className="label" htmlFor="project-name">Ime projekta *</label>
          <input id="project-name" className="field" value={name} onChange={(e) => setName(e.target.value)}
            placeholder="Npr. Delavniška miza" maxLength={120} autoFocus />
        </div>
        <div>
          <label className="label" htmlFor="project-description">Kratek opis</label>
          <textarea id="project-description" className="field min-h-24 resize-y" value={description}
            onChange={(e) => setDescription(e.target.value)} maxLength={2000}
            placeholder="Kaj želim izdelati ali popraviti?" />
        </div>
        <div>
          <label className="label" htmlFor="project-date">Datum začetka *</label>
          <input id="project-date" type="date" className="field" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        </div>
        <div>
          <label className="label" htmlFor="project-status">Stanje projekta</label>
          <select id="project-status" className="field" value={status} onChange={(e) => setStatus(e.target.value as ProjectStatus)}>
            <option value="planned">Načrtovan</option>
            <option value="in_progress">V teku</option>
            <option value="done">Zaključen</option>
          </select>
        </div>
        {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm font-medium text-[#B91C1C]">{error}</p>}
        <div className="flex flex-wrap gap-3 pt-1">
          <button type="submit" disabled={busy} className="btn-primary flex-1">{busy ? 'Shranjevanje ...' : 'Shrani projekt'}</button>
          <button type="button" disabled={busy} className="btn-secondary" onClick={onCancel}>Prekliči</button>
        </div>
      </form>
    </section>
  )
}
