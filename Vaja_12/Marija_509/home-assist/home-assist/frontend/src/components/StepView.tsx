import { parseStep } from '../utils/parseStep'

export default function StepView({ text }: { text: string }) {
  const { icon, sentence, tip, image } = parseStep(text)
  return (
    <div className="flex w-full max-w-xl flex-col items-center gap-4">
      {image && (
        <img src={'/steps/' + image} alt="" className="max-h-64 w-full rounded-2xl object-cover shadow-md"
          onError={(e) => { e.currentTarget.style.display = 'none' }} />
      )}
      {icon && <div className="flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-teal-100 to-sky-100 text-7xl lg:h-44 lg:w-44 lg:text-8xl">{icon}</div>}
      <p className="text-center text-xl leading-relaxed lg:text-2xl">{sentence}</p>
      {tip && <p className="w-full rounded-xl border-2 border-sky-300 bg-sky-50 p-4">💡 <span className="font-semibold">Tip:</span> {tip}</p>}
    </div>
  )
}
