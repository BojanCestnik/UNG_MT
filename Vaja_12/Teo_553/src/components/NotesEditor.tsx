import { useEffect, useState } from 'react'
import type { Project } from '../types'

interface Props {
  project: Project
  busy: boolean
  onUpdate: (project: Project) => Promise<boolean>
}

export default function NotesEditor({ project, busy, onUpdate }: Props) {
  const [notes, setNotes] = useState(project.notes)
  const [saved, setSaved] = useState(false)
  useEffect(() => { setNotes(project.notes); setSaved(false) }, [project.id, project.notes])
  const changed = notes !== project.notes

  async function save() {
    if (await onUpdate({ ...project, notes })) setSaved(true)
  }

  return (
    <section className="panel p-5" aria-labelledby="notes-heading">
      <h2 id="notes-heading" className="text-lg font-bold">Zapiski in meritve</h2>
      <p className="mt-1 text-sm text-[#66736d]">Zabeleži pomembne mere ali ugotovitve.</p>
      <label className="label mt-4" htmlFor="project-notes">Zapiski</label>
      <textarea id="project-notes" className="field min-h-36 resize-y" maxLength={10000} value={notes}
        onChange={(e) => { setNotes(e.target.value); setSaved(false) }}
        placeholder="Npr. Dolžina 120 cm, širina 60 cm ..." />
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <span role="status" className="text-xs text-[#66736d]">
          {changed ? 'Spremembe še niso shranjene.' : saved ? 'Zapiski so shranjeni.' : 'Zapiski so shranjeni s projektom.'}
        </span>
        <button type="button" disabled={busy || !changed} className="btn-primary" onClick={() => void save()}>Shrani zapiske</button>
      </div>
    </section>
  )
}
