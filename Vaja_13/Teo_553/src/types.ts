export type ProjectStatus = 'planned' | 'in_progress' | 'done'

export interface Material {
  id: string
  name: string
  quantity: number
  unitPrice: number
  purchased: boolean
  groupId: string | null
}

export interface MaterialGroup {
  id: string
  name: string
  parentId: string | null
}

export interface Subphase {
  id: string
  name: string
  completed: boolean
}

export interface Phase {
  id: string
  name: string
  completed: boolean
  subphases: Subphase[]
}

export interface ProjectImage {
  id: string
  fileName: string
  originalName: string
  description: string
  mimeType: string
}

export interface Project {
  id: string
  name: string
  description: string
  startDate: string
  status: ProjectStatus
  materialGroups: MaterialGroup[]
  materials: Material[]
  phases: Phase[]
  notes: string
  images: ProjectImage[]
}

export type ProjectInput = Omit<Project, 'id'>

export interface Settings {
  projectView: 'grid' | 'list' | 'compact'
  cardSize: 'small' | 'medium' | 'large'
  detailView: 'tabs' | 'sections'
  sidebarCollapsed: boolean
}

export const DEFAULT_SETTINGS: Settings = {
  projectView: 'grid', cardSize: 'medium', detailView: 'tabs', sidebarCollapsed: false,
}

export const STATUS_LABEL: Record<ProjectStatus, string> = {
  planned: 'Načrtovan',
  in_progress: 'V teku',
  done: 'Zaključen',
}

export function progressOf(project: Project): number {
  const done = project.phases.reduce((sum, phase) => sum + (phase.subphases.length
    ? phase.subphases.filter(subphase => subphase.completed).length : Number(phase.completed)), 0)
  const all = project.phases.reduce((sum, phase) => sum + (phase.subphases.length || 1), 0)
  return all ? Math.round(100 * done / all) : 0
}

export function phaseProgress(phase: Phase): number {
  if (!phase.subphases.length) return phase.completed ? 100 : 0
  return Math.round(phase.subphases.filter(subphase => subphase.completed).length * 100 / phase.subphases.length)
}

export function completedTasks(project: Project): { done: number; all: number } {
  return project.phases.reduce((totals, phase) => ({
    done: totals.done + (phase.subphases.length
      ? phase.subphases.filter(subphase => subphase.completed).length : Number(phase.completed)),
    all: totals.all + (phase.subphases.length || 1),
  }), { done: 0, all: 0 })
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
