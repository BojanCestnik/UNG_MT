import { useState } from 'react'
import type { Guide } from '../types'
import ProgressBar from '../components/ProgressBar'
import StepView from '../components/StepView'

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
  const secondary = 'min-h-11 flex-1 rounded-xl border-2 border-orange-500 bg-white font-semibold disabled:opacity-50'

  return (
    <div className="flex h-full flex-col gap-4">
      <p className="tabular-nums font-semibold">{finished ? 'Repair finished' : 'Step ' + (stepIndex + 1) + ' of ' + total}</p>
      <ProgressBar percent={percent} />
      <div className="flex flex-1 flex-col items-center justify-center gap-4">
        {finished ? (
          <>
            <p className="text-lg font-semibold">Repair finished</p>
            <label className="text-center">Add a photo (optional)
              <input type="file" accept="image/jpeg,image/png" className="mt-2 block"
                onChange={(e) => e.target.files?.[0] && onChoosePhoto(e.target.files[0])} />
            </label>
            {photoError && <p className="text-red-600">{photoError}</p>}
          </>
        ) : <StepView text={guide.steps[stepIndex]} />}
      </div>
      <div className="flex gap-4">
        <button className={secondary} disabled={stepIndex === 0} onClick={() => setStepIndex(stepIndex - 1)}>Back</button>
        {finished
          ? <button className="min-h-11 flex-1 rounded-xl bg-orange-500 font-semibold text-white" onClick={onSaveLog}>Save to log</button>
          : <button className="min-h-11 flex-1 rounded-xl bg-orange-500 font-semibold text-white" onClick={() => setStepIndex(stepIndex + 1)}>Next</button>}
      </div>
    </div>
  )
}
