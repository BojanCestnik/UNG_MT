import type { Entry } from '../types'

type Props = { entries: Entry[] }

// Seznam današnjih zapisov, najnovejši na vrhu; se pomika znotraj sebe
export default function EntryList({ entries }: Props) {
  if (entries.length === 0) {
    return (
      <p className="min-h-0 flex-1 text-muted sm:flex-none">
        Še nič. Tapni + Kozarec, ko popiješ prvega.
      </p>
    )
  }
  return (
    <ul className="min-h-0 flex-1 overflow-y-auto sm:max-h-[200px] sm:flex-none">
      {[...entries].reverse().map((entry) => (
        <li key={entry.id} className="flex justify-between border-t border-line py-2.5">
          <span>{entry.time}</span>
          <span className="text-muted">{entry.ml} ml</span>
        </li>
      ))}
    </ul>
  )
}
