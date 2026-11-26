export default function ProgressBar({ percent }: { percent: number }) {
  return (
    <div className="h-3 rounded-full bg-white/70 ring-1 ring-sky-100">
      <div className="btn-primary h-3 rounded-full transition-all duration-300" style={{ width: percent + '%' }} />
    </div>
  )
}
