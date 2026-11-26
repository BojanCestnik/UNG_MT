import { useState } from 'react'
import type { Project, Settings } from '../types'
import { STATUS_LABEL, completedTasks, costOf, euro, formatDate, progressOf } from '../types'
import MaterialList from './MaterialList'
import PhaseList from './PhaseList'
import NotesEditor from './NotesEditor'
import ProjectImages from './ProjectImages'

interface Props {
  project: Project
  settings: Settings
  busy: boolean
  onBack: () => void
  onEdit: () => void
  onDelete: () => void
  onUpdate: (project: Project) => Promise<boolean>
  onAddImage: (file: File, description: string) => Promise<boolean>
  onDeleteImage: (imageId: string) => Promise<boolean>
}
type DetailTab = 'overview' | 'materials' | 'phases' | 'notes' | 'images'
const TABS: { id: DetailTab; title: string }[] = [
  { id: 'overview', title: 'Pregled' }, { id: 'materials', title: 'Material' },
  { id: 'phases', title: 'Faze dela' }, { id: 'notes', title: 'Zapiski in meritve' }, { id: 'images', title: 'Slike' },
]

export default function ProjectDetail({ project, settings, busy, onBack, onEdit, onDelete, onUpdate, onAddImage, onDeleteImage }: Props) {
  const [tab, setTab] = useState<DetailTab>('overview')
  const progress = progressOf(project)
  const tasks = completedTasks(project)
  const sections = settings.detailView === 'sections'
  const overview = <div className="panel p-5">
    <h2 className="text-lg font-bold">Pregled projekta</h2>
    {project.description && <p className="mt-3 whitespace-pre-wrap leading-7 text-[#526057]">{project.description}</p>}
    <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
      <div className="stat-box"><span>Stroški</span><strong>{euro.format(costOf(project))}</strong></div>
      <div className="stat-box"><span>Opravljena opravila</span><strong>{tasks.done}/{tasks.all}</strong></div>
      <div className="stat-box"><span>Material</span><strong>{project.materials.length}</strong></div>
      <div className="stat-box"><span>Slike</span><strong>{project.images.length}</strong></div>
    </div>
  </div>

  const content = {
    overview,
    materials: <MaterialList project={project} busy={busy} onUpdate={onUpdate} />,
    phases: <PhaseList project={project} busy={busy} onUpdate={onUpdate} />,
    notes: <NotesEditor project={project} busy={busy} onUpdate={onUpdate} />,
    images: <ProjectImages project={project} busy={busy} onAdd={onAddImage} onDelete={onDeleteImage} />,
  }

  return <section>
    <button className="mb-4 min-h-11 font-semibold text-[#256d5b]" disabled={busy} type="button" onClick={onBack}>← Nazaj na projekte</button>
    <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="break-words text-[26px] font-bold tracking-tight sm:text-[30px]">{project.name}</h1>
          <span className={`status-pill status-${project.status}`}>{STATUS_LABEL[project.status]}</span>
        </div>
        <p className="mt-2 text-sm text-[#66736d]">Začetek: {formatDate(project.startDate)}</p>
      </div>
      <div className="flex flex-wrap gap-2">
        <button className="btn-secondary" disabled={busy} type="button" onClick={onEdit}>Uredi projekt</button>
        <button className="btn-danger" disabled={busy} type="button" onClick={onDelete}>Izbriši</button>
      </div>
    </div>
    <div className="panel mb-5 p-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div><p className="text-sm text-[#66736d]">Napredek projekta</p><p className="mt-1 text-[28px] font-bold text-[#256d5b]">{progress} %</p></div>
        <p className="text-sm text-[#66736d]">{tasks.done} od {tasks.all} opravil</p>
        <div className="sm:ml-auto"><span className="text-sm text-[#66736d]">Predvideni stroški: </span><strong className="text-lg">{euro.format(costOf(project))}</strong></div>
      </div>
      <div className="progress-track mt-3" role="progressbar" aria-label="Napredek projekta" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
        <div className="progress-fill" style={{ width: `${progress}%` }} /></div>
    </div>

    {sections ? <div className="grid items-start gap-4 xl:grid-cols-2">
      <div className="xl:col-span-2">{content.overview}</div>
      <div>{content.materials}</div>
      <div>{content.phases}</div>
      <div>{content.notes}</div>
      <div>{content.images}</div>
    </div> : <>
      <div className="mb-4 flex gap-2 overflow-x-auto border-b border-[#dce6dd] pb-2" role="tablist" aria-label="Podrobnosti projekta">
        {TABS.map(item => <button key={item.id} type="button" role="tab" aria-selected={tab === item.id} disabled={busy}
          className={`min-h-11 shrink-0 rounded-xl px-4 text-sm font-semibold transition ${tab === item.id ? 'bg-[#256d5b] text-white' : 'bg-white text-[#566b5c] hover:bg-[#e5efe6]'}`}
          onClick={() => setTab(item.id)}>{item.title}</button>)}
      </div>
      <div role="tabpanel" aria-label={TABS.find(item => item.id === tab)?.title}>
        {content[tab]}
      </div>
    </>}
  </section>
}
