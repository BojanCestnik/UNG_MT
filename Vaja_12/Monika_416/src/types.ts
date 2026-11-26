export interface PantryItem {
  id: string
  name: string
  quantity: string
  expirationDate: string
}
export interface Recipe {
  id: number
  name: string
  emoji: string
  ingredients: { name: string; quantity: string }[]
  time: number
  instructions: string[]
}