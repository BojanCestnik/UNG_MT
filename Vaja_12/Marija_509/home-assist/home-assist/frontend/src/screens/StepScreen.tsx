import { useState } from 'react'
import type { Guide } from '../types'
import ProgressBar from '../components/ProgressBar'
import StepView from '../components/StepView'
import { parseStep } from '../utils/parseStep'

interface Props {
  guide: Guide
  photoError: string
  onChoosePhoto: (file: File) => void
  onSaveLog: () => void
}

export default function StepScreen({ guide, photoError, onChoosePhoto, onSaveLog }: Props) {
  const [stepIndex, setStepIndex] = useState(0) // the only state here
  const total = guide.steps.length
  const finished = stepIndex === total // one extra screen after the last step
  const percent = Math.round((stepIndex / total) * 100)
  const secondary = 'min-h-11 flex-1 rounded-xl border-2 border-teal-500 bg-white/80 font-semibold disabled:opacity-50'
  const primary = 'min-h-11 flex-1 btn-primary rounded-xl font-semibold text-white'
  const needed = [...guide.tools, ...guide.materials]

  return (
    <div className="mx-auto flex h-full max-w-4xl gap-6 lg:max-w-6xl">
      {/* Laptop only: the list of all steps */}
      <aside className="hidden w-64 shrink-0 lg:w-72 flex-col gap-2 md:flex">
        <p className="text-lg font-semibold">{guide.emoji} {guide.title}</p>
        {guide.steps.map((step, i) => (
          <p key={i} className={'rounded-xl p-2 text-sm ' + (i === stepIndex ? 'bg-sky-100 font-semibold' : i < stepIndex ? 'text-gray-500 line-through' : '')}>
            {i + 1}. {parseStep(step).sentence}
          </p>
        ))}
      </aside>
      <section className="flex flex-1 flex-col gap-4">
        <p className="tabular-nums font-semibold">{finished ? 'Repair finished' : 'Step ' + (stepIndex + 1) + ' of ' + total}</p>
        <ProgressBar percent={percent} />
        <div className="flex flex-1 flex-col items-center justify-center gap-4 overflow-y-auto">
          {finished ? (
            <>
              <div className="flex h-32 w-32 items-center justify-center rounded-full bg-green-100 text-7xl">🎉</div>
              <p className="text-xl font-semibold">Repair finished</p>
              <label className="text-center">Add a photo (optional)
                <input type="file" accept="image/jpeg,image/png" className="mt-2 block"
                  onChange={(e) => e.target.files?.[0] && onChoosePhoto(e.target.files[0])} />
              </label>
              {photoError && <p className="text-red-600">{photoError}</p>}
            </>
          ) : <StepView text={guide.steps[stepIndex]} />}
        </div>
        {!finished && (
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="font-semibold">You need:</span>
            {needed.map((item) => <span key={item} className="rounded-full bg-white/80 px-3 py-1 ring-1 ring-sky-100">{item}</span>)}
          </div>
        )}
        <div className="flex gap-4">
          <button className={secondary} disabled={stepIndex === 0} onClick={() => setStepIndex(stepIndex - 1)}>Back</button>
          {finished
            ? <button className={primary} onClick={onSaveLog}>Save to log</button>
            : <button className={primary} onClick={() => setStepIndex(stepIndex + 1)}>Next</button>}
        </div>
      </section>
    </div>
  )
}
