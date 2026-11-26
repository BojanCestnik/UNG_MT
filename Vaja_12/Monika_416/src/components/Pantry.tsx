import type { PantryItem } from '../types'
interface Props { items: PantryItem[]; onEdit: (item: PantryItem) => void; onDelete: (id: string) => void }
function status(date: string) {
  const today = new Date(); today.setHours(0,0,0,0)
  const expiry = new Date(`${date}T00:00:00`)
  const days = Math.ceil((expiry.getTime()-today.getTime())/86400000)
  if (days < 0) return { label: 'Pretečeno', className: 'expired', emoji: '🔴' }
  if (days <= 3) return { label: days === 0 ? 'Porabi danes' : `Še ${days} dni`, className: 'soon', emoji: '🟠' }
  return { label: 'Sveže', className: 'fresh', emoji: '🟢' }
}
export default function Pantry({items,onEdit,onDelete}:Props) {
  const sorted = [...items].sort((a,b)=>a.expirationDate.localeCompare(b.expirationDate))
  return <section className="panel pantry-panel">
    <div className="section-heading"><div><span className="eyebrow">PREGLED ZALOG</span><h2>Moja shramba <span className="count">{items.length}</span></h2></div><span className="heading-emoji">🧺</span></div>
    {items.length === 0 ? <div className="empty-state"><span>🥫</span><strong>Še nimaš živil</strong><p>Dodaj prvo živilo in začni urejati svojo shrambo.</p></div> :
      <div className="food-list">{sorted.map(item=>{const s=status(item.expirationDate);return <article className={`food-row ${s.className}`} key={item.id}>
        <div className="food-icon">🥬</div><div className="food-info"><strong>{item.name}</strong><span>{item.quantity} · do {new Date(`${item.expirationDate}T00:00:00`).toLocaleDateString('sl-SI')}</span><small>{s.emoji} {s.label}</small></div>
        <div className="row-actions"><button aria-label={`Uredi ${item.name}`} onClick={()=>onEdit(item)}>✏️</button><button aria-label={`Izbriši ${item.name}`} onClick={()=>onDelete(item.id)}>🗑️</button></div>
      </article>})}</div>}
    <div className="legend"><span>🟢 Sveže</span><span>🟠 Porabi kmalu</span><span>🔴 Pretečeno</span></div>
  </section>
}