import type { PantryItem, Recipe } from '../types'
interface Props { items: PantryItem[]; recipes: Recipe[]; onSelect: (recipe:Recipe)=>void }
export default function RecipeList({items,recipes,onSelect}:Props) {
  const available = items.map(i=>i.name.trim().toLocaleLowerCase('sl'))
  const expiring = items.filter(i=>{const days=(new Date(`${i.expirationDate}T00:00:00`).getTime()-new Date(new Date().toDateString()).getTime())/86400000;return days>=0&&days<=3}).map(i=>i.name.toLocaleLowerCase('sl'))
  const suggestions = recipes.map(recipe=>{
    const matched=recipe.ingredients.filter(i=>available.includes(i.name.toLocaleLowerCase('sl')))
    const missing=recipe.ingredients.length-matched.length
    const priority=recipe.ingredients.filter(i=>expiring.includes(i.name.toLocaleLowerCase('sl'))).length
    return {recipe,matched:matched.length,missing,priority}
  }).filter(r=>r.missing<=2).sort((a,b)=>b.priority-a.priority||a.missing-b.missing||b.matched-a.matched)
  return <section className="panel recipes-panel">
    <div className="section-heading"><div><span className="eyebrow">KUHAJ PAMETNO</span><h2>Ideje za recepte <span className="count">{suggestions.length}</span></h2></div><span className="heading-emoji">🍓</span></div>
    <p className="section-description">Recepti, ki jih lahko pripraviš iz sestavin, ki jih že imaš. Najprej pokažemo tiste, ki porabijo živila pred iztekom roka.</p>
    {suggestions.length===0 ? <div className="empty-state"><span>🍲</span><strong>Dodaj nekaj sestavin</strong><p>Ko boš dodala živila, ti bomo predlagali recepte.</p></div> :
      <div className="recipe-grid">{suggestions.map(({recipe,matched,missing,priority})=><button className="recipe-card" key={recipe.id} onClick={()=>onSelect(recipe)}>
        <span className="recipe-emoji">{recipe.emoji}</span><span className="recipe-title">{recipe.name}</span><span className="recipe-meta">⏱ {recipe.time} min · {matched}/{recipe.ingredients.length} sestavin</span>
        <span className={`recipe-tag ${missing===0?'tag-ready':'tag-missing'}`}>{missing===0?'Vse sestavine imaš':`Manjka ${missing} ${missing===1?'sestavina':'sestavini'}`}</span>
        {priority>0&&<span className="priority-tag">✨ Porabi kmalu</span>}
      </button>)}</div>}
  </section>
}