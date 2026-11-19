import type { Recipe } from '../types'
interface Props { recipe: Recipe; availableNames: string[]; onClose: () => void }
export default function RecipeDetails({recipe,availableNames,onClose}:Props) {
  const missing = recipe.ingredients.filter(i=>!availableNames.includes(i.name.toLocaleLowerCase('sl')))
  return <div className="modal-backdrop" onClick={onClose}><section className="recipe-modal" onClick={e=>e.stopPropagation()}>
    <button className="modal-close" onClick={onClose} aria-label="Zapri">✕</button>
    <div className="recipe-hero">{recipe.emoji}</div><span className="eyebrow">RECEPT · {recipe.time} MIN</span><h2>{recipe.name}</h2>
    <h3>🥕 Sestavine</h3><ul className="ingredient-list">{recipe.ingredients.map(i=><li key={i.name}><span>{i.name} <small>({i.quantity})</small></span>{availableNames.includes(i.name.toLocaleLowerCase('sl')) ? <b className="available">✓ Imam</b> : <b className="missing">＋ Manjka</b>}</li>)}</ul>
    {missing.length>0 && <p className="missing-note">Manjkajoče sestavine: {missing.map(i=>i.name).join(', ')}.</p>}
    <h3>👩‍🍳 Priprava</h3><ol className="instructions">{recipe.instructions.map((step,i)=><li key={i}>{step}</li>)}</ol>
  </section></div>
}