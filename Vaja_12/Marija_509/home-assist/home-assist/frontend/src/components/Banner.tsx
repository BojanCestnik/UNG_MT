const risks = [
  { emoji: '⚡', label: 'Electrical' },
  { emoji: '🔥', label: 'Gas' },
  { emoji: '🚰', label: 'Water mains' },
]

export default function Banner({ text }: { text: string }) {
  return (
    <div role="alert" className="flex overflow-hidden rounded-2xl bg-gradient-to-r from-rose-50 via-red-50 to-orange-50 shadow-[0_8px_24px_rgba(229,72,77,.18)] ring-1 ring-red-200">
      <div className="hazard w-3 shrink-0 sm:w-4" aria-hidden="true" />
      <div className="flex flex-1 flex-col gap-3 p-4 sm:flex-row sm:items-center sm:gap-5">
        <div className="pulse-ring flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-500 text-2xl text-white" aria-hidden="true">📞</div>
        <div className="flex-1">
          <p className="text-lg font-bold text-red-900">Call a professional</p>
          <p className="text-red-800/80">{text.replace(/^Call a professional\s*/i, '')}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {risks.map((r) => (
            <span key={r.label} className="rounded-full bg-white/80 px-3 py-1 text-sm font-semibold text-red-800 ring-1 ring-red-200">{r.emoji} {r.label}</span>
          ))}
        </div>
      </div>
    </div>
  )
}
