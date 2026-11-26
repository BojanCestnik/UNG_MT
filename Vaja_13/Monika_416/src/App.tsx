import { useEffect, useMemo, useState } from 'react'
import AddFoodForm from './components/AddFoodForm'
import Pantry from './components/Pantry'
import RecipeList from './components/RecipeList'
import RecipeDetails from './components/RecipeDetails'
import { recipes } from './data/recipes'
import type { PantryItem, Recipe } from './types'

type Tab = 'pantry' | 'add' | 'recipes'
const STORAGE_KEY = 'my-pantry-items'

export default function App() {
  const [items, setItems] = useState<PantryItem[]>(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]') as PantryItem[] } catch { return [] }
  })
  const [editingItem, setEditingItem] = useState<PantryItem | null>(null)
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null)
  const [activeTab, setActiveTab] = useState<Tab>('pantry')
  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)) }, [items])

  const expiringCount = useMemo(() => items.filter(item => {
    const days = (new Date(`${item.expirationDate}T00:00:00`).getTime() - new Date(new Date().toDateString()).getTime()) / 86400000
    return days >= 0 && days <= 3
  }).length, [items])

  function saveItem(item: PantryItem) {
    setItems(current => editingItem ? current.map(existing => existing.id === item.id ? item : existing) : [...current, item])
    setEditingItem(null)
    setActiveTab('pantry')
  }
  function editItem(item: PantryItem) { setEditingItem(item); setActiveTab('add') }
  function cancelEdit() { setEditingItem(null); setActiveTab('pantry') }
  function deleteItem(id: string) { setItems(current => current.filter(item => item.id !== id)); if (editingItem?.id === id) setEditingItem(null) }

  return <main className="app-shell">
    <header className="topbar"><div className="brand-mark">🍋</div><span>my pantry</span><span className="topbar-note">manj zavržene hrane, več dobrih idej</span></header>
    <section className="welcome"><div className="welcome-copy"><span className="eyebrow">DOBRODOŠLA DOMA</span><h1>Tvoja shramba,<br/><em>vedno pod nadzorom.</em></h1><p>Organiziraj živila, spremljaj roke uporabe in odkrij, kaj dobrega lahko skuhaš.</p></div><div className="welcome-art">🥑<span>🍅</span><i>🥕</i></div></section>
    <div className="stats-row"><div className="stat-card"><span>🧺</span><div><strong>{items.length}</strong><small>živil v shrambi</small></div></div><div className="stat-card"><span>⏰</span><div><strong>{expiringCount}</strong><small>za porabiti kmalu</small></div></div><div className="stat-card"><span>📖</span><div><strong>{recipes.length}</strong><small>preprostih receptov</small></div></div></div>
    <nav className="mobile-nav" aria-label="Glavna navigacija">
      <button className={activeTab === 'pantry' ? 'active' : ''} onClick={() => setActiveTab('pantry')}><span>🧺</span>Moja shramba</button>
      <button className={activeTab === 'add' ? 'active' : ''} onClick={() => { setEditingItem(null); setActiveTab('add') }}><span>＋</span>Dodaj živilo</button>
      <button className={activeTab === 'recipes' ? 'active' : ''} onClick={() => setActiveTab('recipes')}><span>🍲</span>Recepti</button>
    </nav>
    <div className={`content-grid view-${activeTab}`}>
      <div className="left-column">
        <section className="tab-section add-section"><AddFoodForm onSave={saveItem} editingItem={editingItem} onCancel={cancelEdit}/></section>
        <section className="tab-section pantry-section"><Pantry items={items} onEdit={editItem} onDelete={deleteItem}/></section>
      </div>
      <div className="right-column"><section className="tab-section recipes-section"><RecipeList items={items} recipes={recipes} onSelect={setSelectedRecipe}/></section></div>
    </div>
    <footer>Made with <span>♥</span> and a little lemon zest · My Pantry</footer>
    {selectedRecipe && <RecipeDetails recipe={selectedRecipe} availableNames={items.map(item => item.name.toLocaleLowerCase('sl'))} onClose={() => setSelectedRecipe(null)}/>}
  </main>
}
