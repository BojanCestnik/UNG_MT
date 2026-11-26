import { useEffect, useState, type FormEvent } from 'react'
import type { PantryItem } from '../types'

interface Props { onSave: (item: PantryItem) => void; editingItem: PantryItem | null; onCancel: () => void }
export default function AddFoodForm({ onSave, editingItem, onCancel }: Props) {
  const [name, setName] = useState('')
  const [quantity, setQuantity] = useState('')
  const [expirationDate, setExpirationDate] = useState('')
  useEffect(() => {
    setName(editingItem?.name ?? '')
    setQuantity(editingItem?.quantity ?? '')
    setExpirationDate(editingItem?.expirationDate ?? '')
  }, [editingItem])
  function submit(event: FormEvent) {
    event.preventDefault()
    if (!name.trim() || !quantity.trim() || !expirationDate) return
    onSave({ id: editingItem?.id ?? crypto.randomUUID(), name: name.trim(), quantity: quantity.trim(), expirationDate })
    setName(''); setQuantity(''); setExpirationDate('')
  }
  return <form onSubmit={submit} className="panel form-panel">
    <div className="section-heading"><div><span className="eyebrow">MOJA SHRANBA</span><h2>{editingItem ? 'Uredi živilo' : 'Dodaj živilo'}</h2></div><span className="heading-emoji">🥑</span></div>
    <label>Ime živila<input value={name} onChange={e=>setName(e.target.value)} placeholder="npr. Mleko" required /></label>
    <div className="form-grid">
      <label>Količina<input value={quantity} onChange={e=>setQuantity(e.target.value)} placeholder="npr. 1 liter" required /></label>
      <label>Rok uporabe<input type="date" value={expirationDate} onChange={e=>setExpirationDate(e.target.value)} required /></label>
    </div>
    <div className="form-actions"><button className="primary-btn" type="submit">{editingItem ? '💾 Shrani spremembe' : '＋ Dodaj v shrambo'}</button>{editingItem && <button className="quiet-btn" type="button" onClick={onCancel}>Prekliči</button>}</div>
  </form>
}