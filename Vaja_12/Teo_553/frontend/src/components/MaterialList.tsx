import { useState, type FormEvent } from 'react'
import type { Material, Project } from '../types'
import { costOf, euro } from '../types'

interface Props {
  project: Project
  busy: boolean
  onUpdate: (project: Project) => Promise<boolean>
}

interface MaterialDraft {
  name: string
  quantity: string
  unitPrice: string
  purchased: boolean
}

const EMPTY_DRAFT: MaterialDraft = { name: '', quantity: '1', unitPrice: '0', purchased: false }

export default function MaterialList({ project, busy, onUpdate }: Props) {
  const [formOpen, setFormOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [draft, setDraft] = useState<MaterialDraft>({ ...EMPTY_DRAFT })
  const [error, setError] = useState('')

  function close() { setFormOpen(false); setEditingId(null); setError(''); setDraft({ ...EMPTY_DRAFT }) }
  function edit(item: Material) {
    setEditingId(item.id)
    setDraft({ name: item.name, quantity: String(item.quantity), unitPrice: String(item.unitPrice), purchased: item.purchased })
    setFormOpen(true)
    setError('')
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const quantity = Number(draft.quantity.replace(',', '.'))
    const unitPrice = Number(draft.unitPrice.replace(',', '.'))
    if (!draft.name.trim()) { setError('Vnesi ime materiala.'); return }
    if (!draft.quantity.trim() || !Number.isFinite(quantity) || quantity <= 0) { setError('Količina mora biti večja od 0.'); return }
    if (!draft.unitPrice.trim() || !Number.isFinite(unitPrice) || unitPrice < 0) { setError('Cena ne sme biti negativna.'); return }
    if (!Number.isFinite(quantity * unitPrice)) { setError('Izračun stroška je prevelik.'); return }
    setError('')
    const item: Material = { id: editingId ?? '', name: draft.name.trim(), quantity, unitPrice, purchased: draft.purchased }
    const materials = editingId
      ? project.materials.map((old) => old.id === editingId ? item : old)
      : [...project.materials, item]
    if (await onUpdate({ ...project, materials })) close()
  }

  async function remove(id: string) {
    await onUpdate({ ...project, materials: project.materials.filter((item) => item.id !== id) })
  }

  async function toggle(item: Material) {
    await onUpdate({ ...project, materials: project.materials.map((old) => old.id === item.id ? { ...old, purchased: !old.purchased } : old) })
  }

  return (
    <section className="panel p-5" aria-labelledby="materials-heading">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 id="materials-heading" className="text-lg font-bold">Material</h2>
          <p className="mt-1 text-xs text-[#6b7770]">{project.materials.length} postavk</p>
        </div>
        {!formOpen && <button type="button" className="btn-secondary" disabled={busy} onClick={() => setFormOpen(true)}>+ Dodaj</button>}
      </div>

      {project.materials.length === 0 && <p className="mt-5 rounded-xl bg-[#f6f8f5] px-4 py-4 text-sm text-[#66736d]">Za ta projekt še ni dodanega materiala.</p>}
      <ul className="mt-4 divide-y divide-[#eef0ec]">
        {project.materials.map((item) => (
          <li key={item.id} className="py-4 first:pt-0">
            <div className="flex items-start gap-3">
              <input type="checkbox" disabled={busy} checked={item.purchased} onChange={() => void toggle(item)}
                aria-label={`Kupljeno: ${item.name}`} className="mt-1 h-5 w-5 shrink-0 accent-[#256d5b]" />
              <div className="min-w-0 flex-1">
                <p className={`break-words font-semibold ${item.purchased ? 'text-[#64746c]' : ''}`}>{item.name}</p>
                <p className="mt-1 text-sm text-[#718077]">{item.quantity} × {euro.format(item.unitPrice)}</p>
                <p className="mt-1 text-xs font-medium text-[#66736d]">{item.purchased ? 'Kupljeno' : 'Še ni kupljeno'}</p>
              </div>
              <div className="shrink-0 text-right">
                <p className="font-bold">{euro.format(item.quantity * item.unitPrice)}</p>
                <div className="mt-1 flex gap-1">
                  <button type="button" disabled={busy} className="min-h-11 rounded-lg px-2 text-xs font-semibold text-[#256d5b]" onClick={() => edit(item)}>Uredi</button>
                  <button type="button" disabled={busy} className="min-h-11 rounded-lg px-2 text-xs font-semibold text-[#B91C1C]" onClick={() => void remove(item.id)}>Izbriši</button>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {formOpen && (
        <form className="mt-2 space-y-3 rounded-xl border border-[#d9e7dc] bg-[#f8fbf8] p-4" onSubmit={submit} noValidate>
          <h3 className="font-semibold">{editingId ? 'Uredi material' : 'Dodaj material'}</h3>
          <div>
            <label className="label" htmlFor="material-name">Ime materiala *</label>
            <input id="material-name" className="field" maxLength={120} placeholder="Npr. Vijaki M6" value={draft.name}
              onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label" htmlFor="material-quantity">Količina *</label>
              <input id="material-quantity" className="field" inputMode="decimal" placeholder="1" value={draft.quantity}
                onChange={(e) => setDraft({ ...draft, quantity: e.target.value })} />
            </div>
            <div>
              <label className="label" htmlFor="material-price">Cena na enoto (€) *</label>
              <input id="material-price" className="field" inputMode="decimal" placeholder="0,00" value={draft.unitPrice}
                onChange={(e) => setDraft({ ...draft, unitPrice: e.target.value })} />
            </div>
          </div>
          <label className="flex min-h-11 items-center gap-3 text-sm font-medium">
            <input className="h-5 w-5 accent-[#256d5b]" type="checkbox" checked={draft.purchased}
              onChange={(e) => setDraft({ ...draft, purchased: e.target.checked })} />
            Kupljeno
          </label>
          {error && <p role="alert" className="text-sm text-[#B91C1C]">{error}</p>}
          <div className="flex flex-wrap gap-2">
            <button type="submit" className="btn-primary" disabled={busy}>Shrani material</button>
            <button type="button" className="btn-minimal" disabled={busy} onClick={close}>Prekliči</button>
          </div>
        </form>
      )}

      <div className="soft-divider mt-4 flex items-center justify-between gap-2 pt-4">
        <span className="text-sm text-[#66736d]">Skupni predvideni strošek</span>
        <strong className="text-lg text-[#256d5b]">{euro.format(costOf(project))}</strong>
      </div>
    </section>
  )
}
