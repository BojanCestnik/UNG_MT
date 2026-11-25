export default function ProgressBar({ percent }: { percent: number }) {
  return (
    <div className="h-4 rounded-full bg-teal-100">
      <div className="h-4 rounded-full bg-teal-700 transition-all duration-300" style={{ width: percent + '%' }} />
    </div>
  )
}
