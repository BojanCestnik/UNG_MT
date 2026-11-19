import type { Project } from '../types'
import { STATUS_LABEL, costOf, euro, formatDate, progressOf } from '../types'
import MaterialList from './MaterialList'
import PhaseList from './PhaseList'
import NotesEditor from './NotesEditor'

interface Props {
  project: Project
  busy: boolean
  onBack: () => void
  onEdit: () => void
  onDelete: () => void
  onUpdate: (project: Project) => Promise<boolean>
}

export default function ProjectDetail({ project, busy, onBack, onEdit, onDelete, onUpdate }: Props) {
  const progress = progressOf(project)
  return (
    <section>
      <button type="button" className="mb-5 min-h-11 text-sm font-semibold text-[#256d5b]" disabled={busy} onClick={onBack}>← Nazaj na projekte</button>
      <div className="mb-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <h1 className="min-w-0 max-w-full break-words text-[24px] font-bold tracking-tight">{project.name}</h1>
          <span className={`status-pill status-${project.status}`}>{STATUS_LABEL[project.status]}</span>
        </div>
        <p className="mt-2 text-sm text-[#66736d]">Začetek: {formatDate(project.startDate)}</p>
        {project.description && <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-[#4d5b53]">{project.description}</p>}
      </div>

      <div className="panel mb-4 p-5">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-sm text-[#66736d]">Napredek projekta</p>
            <p className="mt-1 text-[28px] font-bold text-[#256d5b]">{progress} %</p>
          </div>
          <p className="text-right text-xs text-[#6a786e]">{project.phases.filter((phase) => phase.completed).length} od {project.phases.length} faz</p>
        </div>
        <div className="progress-track mt-3" role="progressbar" aria-label="Napredek projekta" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <div className="soft-divider mt-4 flex items-center justify-between gap-3 pt-4">
          <span className="text-sm text-[#66736d]">Predvideni stroški</span>
          <strong className="text-lg">{euro.format(costOf(project))}</strong>
        </div>
      </div>

      <div className="space-y-4">
        <MaterialList project={project} busy={busy} onUpdate={onUpdate} />
        <PhaseList project={project} busy={busy} onUpdate={onUpdate} />
        <NotesEditor project={project} busy={busy} onUpdate={onUpdate} />
      </div>
      <div className="mt-7 flex flex-wrap gap-3 border-t border-[#e0e5de] pt-5">
        <button type="button" className="btn-secondary flex-1" disabled={busy} onClick={onEdit}>Uredi projekt</button>
        <button type="button" className="btn-danger" disabled={busy} onClick={onDelete}>Izbriši projekt</button>
      </div>
    </section>
  )
}
