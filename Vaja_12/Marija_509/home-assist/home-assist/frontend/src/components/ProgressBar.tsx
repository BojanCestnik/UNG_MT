export default function ProgressBar({ percent }: { percent: number }) {
  return (
    <div className="h-4 rounded-full bg-orange-200">
      <div className="h-4 rounded-full bg-orange-500 transition-all duration-300" style={{ width: percent + '%' }} />
    </div>
  )
}
