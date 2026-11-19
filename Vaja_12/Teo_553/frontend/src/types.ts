export type ProjectStatus = 'planned' | 'in_progress' | 'done'

export interface Material {
  id: string
  name: string
  quantity: number
  unitPrice: number
  purchased: boolean
}

export interface Phase {
  id: string
  name: string
  completed: boolean
}

export interface Project {
  id: string
  name: string
  description: string
  startDate: string
  status: ProjectStatus
  materials: Material[]
  phases: Phase[]
  notes: string
}

export type ProjectInput = Omit<Project, 'id'>

export const STATUS_LABEL: Record<ProjectStatus, string> = {
  planned: 'Načrtovan',
  in_progress: 'V teku',
  done: 'Zaključen',
}

export function progressOf(project: Project): number {
  if (project.phases.length === 0) return 0
  return Math.round(100 * project.phases.filter((phase) => phase.completed).length / project.phases.length)
}

export function costOf(project: Project): number {
  return project.materials.reduce((sum, material) => sum + material.quantity * material.unitPrice, 0)
}

export const euro = new Intl.NumberFormat('sl-SI', {
  style: 'currency', currency: 'EUR', minimumFractionDigits: 2, maximumFractionDigits: 2,
})

export function formatDate(date: string): string {
  const parts = date.split('-')
  return parts.length === 3 ? `${parts[2]}. ${parts[1]}. ${parts[0]}` : date
}

export function todayLocal(): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}
