interface Props { name: string; owned: boolean; onToggle: (name: string) => void }

export default function ToolItem({ name, owned, onToggle }: Props) {
  return (
    <label className="flex min-h-11 items-center gap-4 px-4">
      <input type="checkbox" checked={owned} onChange={() => onToggle(name)} className="h-6 w-6 accent-orange-500" />
      {name}
    </label>
  )
}
