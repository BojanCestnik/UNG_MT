interface Props { name: string; owned: boolean; pro?: boolean; onToggle: (name: string) => void }

export default function ToolItem({ name, owned, pro, onToggle }: Props) {
  return (
    <label className="flex min-h-11 cursor-pointer items-center gap-4 px-4 hover:bg-sky-50/70">
      <input type="checkbox" checked={owned} onChange={() => onToggle(name)} className="h-6 w-6 accent-teal-600" />
      <span className="flex-1">{name}</span>
      {pro && <span className="rounded-full bg-violet-100 px-2 text-xs font-semibold text-violet-800">pro</span>}
    </label>
  )
}
