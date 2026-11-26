import { useState, type FormEvent } from 'react'
import type { Material, MaterialGroup, Project } from '../types'
import { costOf, euro } from '../types'

interface Props { project: Project; busy: boolean; onUpdate: (next: Project) => Promise<boolean> }
type Draft = { name: string; quantity: string; unitPrice: string; purchased: boolean; groupId: string }
const EMPTY: Draft = { name: '', quantity: '1', unitPrice: '0', purchased: false, groupId: '' }

export default function MaterialList({ project, busy, onUpdate }: Props) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formOpen, setFormOpen] = useState(false)
  const [draft, setDraft] = useState<Draft>({ ...EMPTY })
  const [openGroups, setOpenGroups] = useState<Set<string>>(new Set())
  const [error, setError] = useState('')

  const groups = project.materialGroups
  const byParent = (parentId: string | null) => groups.filter(group => group.parentId === parentId)
  const materialsIn = (groupId: string | null) => project.materials.filter(m => m.groupId === groupId)
  const groupTotal = (group: MaterialGroup): number => {
    const ids = new Set([group.id, ...groups.filter(g => g.parentId === group.id).map(g => g.id)])
    return project.materials.filter(m => ids.has(m.groupId ?? '')).reduce((sum, m) => sum + m.quantity * m.unitPrice, 0)
  }
  function showForm(groupId: string | null = null, material?: Material) {
    setError('')
    setEditingId(material?.id ?? null)
    setDraft(material
      ? { name: material.name, quantity: String(material.quantity), unitPrice: String(material.unitPrice), purchased: material.purchased, groupId: material.groupId ?? '' }
      : { ...EMPTY, groupId: groupId ?? '' })
    setFormOpen(true)
  }
  function closeForm() { setFormOpen(false); setEditingId(null); setError('') }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const quantity = Number(draft.quantity.replace(',', '.'))
    const unitPrice = Number(draft.unitPrice.replace(',', '.'))
    if (!draft.name.trim()) { setError('Vnesi ime materiala.'); return }
    if (!draft.quantity.trim() || !Number.isFinite(quantity) || quantity <= 0) { setError('Količina mora biti večja od 0.'); return }
    if (!draft.unitPrice.trim() || !Number.isFinite(unitPrice) || unitPrice < 0 || !Number.isFinite(quantity * unitPrice)) {
      setError('Cena materiala ni veljavna.'); return
    }
    const material: Material = {
      id: editingId ?? crypto.randomUUID(), name: draft.name.trim(), quantity, unitPrice,
      purchased: draft.purchased, groupId: draft.groupId || null,
    }
    const materials = editingId
      ? project.materials.map(m => m.id === editingId ? material : m)
      : [...project.materials, material]
    if (await onUpdate({ ...project, materials })) closeForm()
  }
  async function addGroup(parentId: string | null) {
    const name = window.prompt(parentId ? 'Ime podskupine materiala:' : 'Ime nove skupine materiala:')
    if (name === null) return
    if (!name.trim()) { setError('Ime skupine ne sme biti prazno.'); return }
    const group: MaterialGroup = { id: crypto.randomUUID(), name: name.trim(), parentId }
    if (await onUpdate({ ...project, materialGroups: [...groups, group] })) {
      if (parentId) setOpenGroups(prev => new Set(prev).add(parentId))
      setError('')
    }
  }
  async function renameGroup(group: MaterialGroup) {
    const name = window.prompt('Novo ime skupine:', group.name)
    if (name === null) return
    if (!name.trim()) { setError('Ime skupine ne sme biti prazno.'); return }
    await onUpdate({ ...project, materialGroups: groups.map(g => g.id === group.id ? { ...g, name: name.trim() } : g) })
  }
  async function deleteGroup(group: MaterialGroup) {
    if (!window.confirm(`Izbrišem skupino »${group.name}«? Material se ne bo izbrisal, ampak premaknil v nadrejeno skupino ali »Brez skupine«.`)) return
    const materialGroups = groups.filter(g => g.id !== group.id).map(g =>
      g.parentId === group.id ? { ...g, parentId: null } : g)
    const materials = project.materials.map(m => m.groupId === group.id ? { ...m, groupId: group.parentId } : m)
    await onUpdate({ ...project, materialGroups, materials })
  }
  async function toggleMaterial(material: Material) {
    await onUpdate({ ...project, materials: project.materials.map(m => m.id === material.id ? { ...m, purchased: !m.purchased } : m) })
  }
  function materialRow(material: Material) {
    return (
      <div key={material.id} className="flex items-start gap-3 border-b border-[#edf0eb] py-3 last:border-b-0">
        <input type="checkbox" className="mt-1 h-5 w-5 shrink-0 accent-[#256d5b]" disabled={busy} checked={material.purchased}
          onChange={() => void toggleMaterial(material)} aria-label={`Kupljeno: ${material.name}`} />
        <div className="min-w-0 flex-1">
          <p className="break-words font-semibold">{material.name}</p>
          <p className="mt-1 text-sm text-[#718077]">{material.quantity} × {euro.format(material.unitPrice)}</p>
          <p className="mt-1 text-xs text-[#66736d]">{material.purchased ? 'Kupljeno' : 'Še ni kupljeno'}</p>
        </div>
        <div className="shrink-0 text-right">
          <strong className="block text-sm">{euro.format(material.quantity * material.unitPrice)}</strong>
          <div className="flex justify-end gap-1">
            <button type="button" className="action-link" disabled={busy} onClick={() => showForm(material.groupId, material)}>Uredi</button>
            <button type="button" className="action-link text-[#B91C1C]" disabled={busy}
              onClick={() => void onUpdate({ ...project, materials: project.materials.filter(m => m.id !== material.id) })}>Izbriši</button>
          </div>
        </div>
      </div>
    )
  }
  function groupBlock(group: MaterialGroup, level: number) {
    const open = openGroups.has(group.id)
    const subgroups = byParent(group.id)
    const own = materialsIn(group.id)
    return (
      <div key={group.id} className={`rounded-xl border border-[#e4eae3] bg-white ${level ? 'my-2' : 'my-3'}`}>
        <div className="flex flex-wrap items-center gap-2 p-3">
          <button type="button" className="group-toggle min-w-0 flex-1" aria-expanded={open} disabled={busy}
            onClick={() => setOpenGroups(prev => {
              const next = new Set(prev); if (open) next.delete(group.id); else next.add(group.id); return next
            })}>
            <span aria-hidden="true" className="shrink-0">{open ? '▾' : '▸'}</span>
            <span className="truncate text-left font-bold">{group.name}</span>
            <span className="shrink-0 text-xs font-semibold text-[#256d5b]">{euro.format(groupTotal(group))}</span>
          </button>
          <div className="flex flex-wrap gap-1">
            <button className="action-link" disabled={busy} type="button" onClick={() => showForm(group.id)}>+ Material</button>
            {level === 0 && <button className="action-link" disabled={busy} type="button" onClick={() => void addGroup(group.id)}>+ Podskupina</button>}
            <button className="action-link" disabled={busy} type="button" onClick={() => void renameGroup(group)}>Uredi</button>
            <button className="action-link text-[#B91C1C]" disabled={busy} type="button" onClick={() => void deleteGroup(group)}>Izbriši</button>
          </div>
        </div>
        {open && <div className="border-t border-[#ecf1eb] px-3 pb-2">
          {own.map(materialRow)}
          {subgroups.map(child => groupBlock(child, level + 1))}
          {!own.length && !subgroups.length && <p className="py-3 text-sm text-[#78867c]">Skupina je prazna.</p>}
        </div>}
      </div>
    )
  }

  return (
    <section className="panel p-4 sm:p-5" aria-labelledby="materials-heading">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div><h2 id="materials-heading" className="text-lg font-bold">Material</h2>
          <p className="mt-1 text-xs text-[#6b7770]">{project.materials.length} postavk • {groups.length} skupin</p></div>
        <div className="flex flex-wrap gap-2">
          <button type="button" className="btn-secondary" disabled={busy} onClick={() => void addGroup(null)}>+ Nova skupina</button>
          <button type="button" className="btn-primary" disabled={busy} onClick={() => showForm(null)}>+ Material</button>
        </div>
      </div>

      {error && <p role="alert" className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-[#B91C1C]">{error}</p>}
      {!project.materials.length && !groups.length && <p className="mt-5 rounded-xl bg-[#f6f8f5] p-4 text-sm text-[#66736d]">Dodaj skupino ali prvi material.</p>}

      {groups.filter(group => group.parentId === null).map(group => groupBlock(group, 0))}
      {(materialsIn(null).length > 0 || groups.length > 0) && <div className="mt-3 rounded-xl bg-[#f7f9f6] px-4 py-3">
        <h3 className="font-bold text-[#46584c]">Brez skupine</h3>
        {materialsIn(null).map(materialRow)}
        {!materialsIn(null).length && <p className="pt-2 text-sm text-[#7f8d84]">Ni nerazvrščenega materiala.</p>}
      </div>}

      {formOpen && <form onSubmit={submit} className="mt-5 space-y-3 rounded-xl border border-[#b7d5c4] bg-[#f8fbf8] p-4" noValidate>
        <h3 className="font-bold">{editingId ? 'Uredi material' : 'Dodaj material'}</h3>
        <div><label className="label" htmlFor="material-name">Ime materiala *</label>
          <input id="material-name" className="field" maxLength={120} value={draft.name} onChange={e => setDraft({ ...draft, name: e.target.value })} placeholder="Npr. Lesena plošča" /></div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className="label" htmlFor="material-qty">Količina *</label>
            <input id="material-qty" className="field" inputMode="decimal" value={draft.quantity} onChange={e => setDraft({ ...draft, quantity: e.target.value })} /></div>
          <div><label className="label" htmlFor="material-price">Cena (€) *</label>
            <input id="material-price" className="field" inputMode="decimal" value={draft.unitPrice} onChange={e => setDraft({ ...draft, unitPrice: e.target.value })} /></div>
        </div>
        <div><label className="label" htmlFor="material-group">Skupina / podskupina</label>
          <select id="material-group" className="field" value={draft.groupId} onChange={e => setDraft({ ...draft, groupId: e.target.value })}>
            <option value="">Brez skupine</option>
            {groups.filter(g => g.parentId === null).map(g => <optgroup key={g.id} label={g.name}>
              <option value={g.id}>{g.name}</option>
              {byParent(g.id).map(child => <option value={child.id} key={child.id}>↳ {child.name}</option>)}
            </optgroup>)}
          </select>
        </div>
        <label className="flex min-h-11 items-center gap-3 text-sm font-semibold"><input type="checkbox" className="h-5 w-5 accent-[#256d5b]"
          checked={draft.purchased} onChange={e => setDraft({ ...draft, purchased: e.target.checked })} /> Kupljeno</label>
        <div className="flex flex-wrap gap-2"><button type="submit" disabled={busy} className="btn-primary">Shrani material</button>
          <button type="button" className="btn-minimal" disabled={busy} onClick={closeForm}>Prekliči</button></div>
      </form>}
      <div className="soft-divider mt-5 flex flex-wrap items-center justify-between gap-2 pt-4">
        <span className="text-sm text-[#66736d]">Skupni predvideni strošek</span>
        <strong className="text-xl text-[#256d5b]">{euro.format(costOf(project))}</strong>
      </div>
    </section>
  )
}
