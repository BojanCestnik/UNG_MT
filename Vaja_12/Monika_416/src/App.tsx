import { useEffect, useMemo, useState } from 'react'
import AddFoodForm from './components/AddFoodForm'
import Pantry from './components/Pantry'
import RecipeList from './components/RecipeList'
import RecipeDetails from './components/RecipeDetails'
import { recipes } from './data/recipes'
import type { PantryItem, Recipe } from './types'

const STORAGE_KEY = 'my-pantry-items'
export default function App() {
  const [items,setItems]=useState<PantryItem[]>(()=>{try{return JSON.parse(localStorage.getItem(STORAGE_KEY)??'[]') as PantryItem[]}catch{return []}})
  const [editingItem,setEditingItem]=useState<PantryItem|null>(null)
  const [selectedRecipe,setSelectedRecipe]=useState<Recipe|null>(null)
  useEffect(()=>{localStorage.setItem(STORAGE_KEY,JSON.stringify(items))},[items])
  const expiringCount=useMemo(()=>items.filter(i=>{const days=(new Date(`${i.expirationDate}T00:00:00`).getTime()-new Date(new Date().toDateString()).getTime())/86400000;return days>=0&&days<=3}).length,[items])
  function saveItem(item:PantryItem){setItems(current=>editingItem?current.map(i=>i.id===item.id?item:i):[...current,item]);setEditingItem(null)}
  function deleteItem(id:string){setItems(current=>current.filter(i=>i.id!==id));if(editingItem?.id===id)setEditingItem(null)}
  return <main className="app-shell">
    <header className="topbar"><div className="brand-mark">🍋</div><span>my pantry</span><span className="topbar-note">manj zavržene hrane, več dobrih idej</span></header>
    <section className="welcome"><div className="welcome-copy"><span className="eyebrow">DOBRODOŠLA DOMA</span><h1>Tvoja shramba,<br/><em>vedno pod nadzorom.</em></h1><p>Organiziraj živila, spremljaj roke uporabe in odkrij, kaj dobrega lahko skuhaš.</p></div><div className="welcome-art">🥑<span>🍅</span><i>🥕</i></div></section>
    <div className="stats-row"><div className="stat-card"><span>🧺</span><div><strong>{items.length}</strong><small>živil v shrambi</small></div></div><div className="stat-card"><span>⏰</span><div><strong>{expiringCount}</strong><small>za porabiti kmalu</small></div></div><div className="stat-card"><span>📖</span><div><strong>{recipes.length}</strong><small>preprostih receptov</small></div></div></div>
    <div className="content-grid"><div className="left-column"><AddFoodForm onSave={saveItem} editingItem={editingItem} onCancel={()=>setEditingItem(null)}/><Pantry items={items} onEdit={setEditingItem} onDelete={deleteItem}/></div><div className="right-column"><RecipeList items={items} recipes={recipes} onSelect={setSelectedRecipe}/></div></div>
    <footer>Made with <span>♥</span> and a little lemon zest · My Pantry</footer>
    {selectedRecipe&&<RecipeDetails recipe={selectedRecipe} availableNames={items.map(i=>i.name.toLocaleLowerCase('sl'))} onClose={()=>setSelectedRecipe(null)}/>}
  </main>
}