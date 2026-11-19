type Props = { count: number; goal: number; glassMl: number }

// Kozarec, ki se polni, ter število kozarcev in količina v ml
export default function WaterGlass({ count, goal, glassMl }: Props) {
  const percent = Math.min(100, Math.round((count / goal) * 100))
  return (
    <div className="flex items-center justify-center gap-6 sm:justify-start">
      <div
        role="img"
        aria-label={`Dnevni cilj je napolnjen za ${percent} %`}
        className="relative h-[168px] w-[112px] flex-none overflow-hidden rounded-t-md rounded-b-[28px] border-4 border-accent bg-soft"
      >
        <div
          className="absolute inset-x-0 bottom-0 bg-accent transition-[height] duration-500 motion-reduce:transition-none"
          style={{ height: `${percent}%` }}
        />
      </div>
      <div>
        <div className="text-5xl leading-none font-extrabold">
          {count} <span className="text-lg text-muted">/ {goal}</span>
        </div>
        <p className="mt-1.5 text-muted">
          {count * glassMl} / {goal * glassMl} ml
        </p>
      </div>
    </div>
  )
}
