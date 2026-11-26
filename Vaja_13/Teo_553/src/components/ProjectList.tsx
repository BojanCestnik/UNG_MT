import type { Project, Settings } from '../types'
import { STATUS_LABEL, costOf, euro, formatDate, progressOf } from '../types'

interface Props {
  projects: Project[]
  settings: Settings
  busy: boolean
  onCreate: () => void
  onOpen: (id: string) => void
}

export default function ProjectList({ projects, settings, busy, onCreate, onOpen }: Props) {
  const view = settings.projectView
  const compact = view === 'compact'
  const columns = settings.cardSize === 'small'
    ? 'repeat(auto-fill, minmax(min(100%, 235px), 1fr))'
    : settings.cardSize === 'large'
      ? 'repeat(auto-fill, minmax(min(100%, 425px), 1fr))'
      : 'repeat(auto-fill, minmax(min(100%, 310px), 1fr))'
  return <section aria-labelledby="projects-heading">
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
      <div><h1 id="projects-heading" className="text-[24px] font-bold tracking-tight">Moji projekti</h1>
        <p className="mt-1 text-sm text-[#66736d]">{projects.length === 1 ? '1 projekt' : `${projects.length} projektov`} na enem mestu.</p></div>
      <button className="btn-primary" disabled={busy} onClick={onCreate} type="button">+ Nov projekt</button>
    </div>
    {!projects.length ? <div className="panel py-12 px-6 text-center">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#e6f1e9] text-2xl font-bold text-[#256d5b]">+</div>
      <h2 className="text-lg font-semibold">Ni še ustvarjenih projektov</h2>
      <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#66736d]">Dodaj prvi projekt, material, faze dela in fotografije.</p>
      <button className="btn-primary mt-5" onClick={onCreate} type="button">Ustvari prvi projekt</button>
    </div> : <div className={`grid gap-3 ${view === 'list' || compact ? 'grid-cols-1' : ''}`}
      style={view === 'grid' ? { gridTemplateColumns: columns } : undefined}>
      {[...projects].reverse().map(project => {
        const progress = progressOf(project)
        return <button key={project.id} type="button" disabled={busy} onClick={() => onOpen(project.id)}
          className={`panel w-full text-left transition hover:border-[#c4dbc9] hover:shadow-sm ${compact ? 'p-3 sm:p-4' : 'p-4 sm:p-5'}`}
          aria-label={`Odpri projekt ${project.name}`}>
          <div className={`flex ${view === 'list' ? 'flex-wrap sm:flex-nowrap sm:items-center' : 'items-start'} justify-between gap-3`}>
            <div className="min-w-0 flex-1">
              <h2 className={`break-words font-bold leading-6 ${compact ? 'text-base' : 'text-lg'}`}>{project.name}</h2>
              <p className="mt-1 text-xs text-[#718077]">Začetek: {formatDate(project.startDate)}</p>
            </div>
            <span className={`status-pill status-${project.status}`}>{STATUS_LABEL[project.status]}</span>
          </div>
          {!compact && project.description && <p className="mt-3 line-clamp-2 text-sm leading-6 text-[#59675f]">{project.description}</p>}
          {view === 'list' || compact ? <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-sm">
            <span>Napredek: <strong className="text-[#256d5b]">{progress} %</strong></span>
            <span>Stroški: <strong>{euro.format(costOf(project))}</strong></span>
          </div> : <>
            <div className="mt-5 flex items-center justify-between text-sm"><span className="text-[#63736a]">Napredek</span><strong className="text-[#256d5b]">{progress} %</strong></div>
            <div className="progress-track mt-2" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100} aria-label="Napredek projekta">
              <div className="progress-fill" style={{ width: `${progress}%` }} /></div>
            <div className="soft-divider mt-5 flex items-center justify-between pt-4"><span className="text-sm text-[#66736d]">Predvideni stroški</span>
              <strong>{euro.format(costOf(project))}</strong></div>
          </>}
          {(view === 'list' || compact) && <div className="progress-track mt-3" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100} aria-label="Napredek projekta">
            <div className="progress-fill" style={{ width: `${progress}%` }} /></div>}
        </button>
      })}
    </div>}
  </section>
}
