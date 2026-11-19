import type { Project } from '../types'
import { STATUS_LABEL, costOf, euro, formatDate, progressOf } from '../types'

interface Props {
  projects: Project[]
  busy: boolean
  onCreate: () => void
  onOpen: (id: string) => void
}

export default function ProjectList({ projects, busy, onCreate, onOpen }: Props) {
  return (
    <section>
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-[24px] font-bold tracking-tight">Moji projekti</h1>
          <p className="mt-1 text-sm text-[#66736d]">Vse ideje in načrti na enem mestu.</p>
        </div>
        <button type="button" className="btn-primary shrink-0" disabled={busy} onClick={onCreate}>+ Nov projekt</button>
      </div>
      {projects.length === 0 ? (
        <div className="panel px-6 py-12 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#e6f1e9] text-2xl font-bold text-[#256d5b]">+</div>
          <h2 className="font-semibold text-lg">Ni še ustvarjenih projektov</h2>
          <p className="mx-auto mt-2 max-w-[270px] text-sm leading-6 text-[#66736d]">Ustvari prvi projekt in začni načrtovati material, stroške ter potek dela.</p>
          <button type="button" className="btn-primary mt-5" disabled={busy} onClick={onCreate}>Ustvari prvi projekt</button>
        </div>
      ) : (
        <div className="space-y-3">
          {[...projects].reverse().map((project) => {
            const progress = progressOf(project)
            return (
              <button key={project.id} type="button" disabled={busy}
                className="panel block w-full p-5 text-left transition hover:border-[#c6d9ce] hover:shadow-sm"
                onClick={() => onOpen(project.id)} aria-label={`Odpri projekt ${project.name}`}>
                <div className="flex items-start justify-between gap-3">
                  <h2 className="min-w-0 break-words text-lg font-bold leading-6">{project.name}</h2>
                  <span className={`status-pill status-${project.status}`}>{STATUS_LABEL[project.status]}</span>
                </div>
                <p className="mt-2 text-xs text-[#718077]">Začetek: {formatDate(project.startDate)}</p>
                {project.description && <p className="mt-3 line-clamp-2 text-sm leading-6 text-[#59675f]">{project.description}</p>}
                <div className="mt-5 flex items-center justify-between text-sm">
                  <span className="font-medium text-[#63736a]">Napredek</span>
                  <strong className="text-[#256d5b]">{progress} %</strong>
                </div>
                <div className="progress-track mt-2" role="progressbar" aria-label="Napredek projekta" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
                  <div className="progress-fill" style={{ width: `${progress}%` }} />
                </div>
                <div className="soft-divider mt-5 flex items-center justify-between pt-4">
                  <span className="text-sm text-[#66736d]">Predvideni stroški</span>
                  <strong className="text-[16px]">{euro.format(costOf(project))}</strong>
                </div>
              </button>
            )
          })}
        </div>
      )}
    </section>
  )
}
