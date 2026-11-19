import type { Project, ProjectInput } from './types'

// Isti računalnik: localhost. Za dostop s telefona uporabimo IP računalnika.
const API_URL = `${window.location.protocol}//${window.location.hostname}:3001/api`

export class ApiError extends Error {
  constructor(message: string, public readonly status: number) {
    super(message)
    this.name = 'ApiError'
  }
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  let response: Response
  try {
    response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: { 'Content-Type': 'application/json', ...options?.headers },
    })
  } catch {
    throw new ApiError('Povezava s strežnikom ni uspela', 0)
  }

  let data: unknown
  try {
    data = await response.json()
  } catch {
    throw new ApiError('Strežnik je vrnil neveljaven odgovor.', response.status)
  }
  if (!response.ok) {
    const message = typeof data === 'object' && data !== null && 'error' in data && typeof data.error === 'string'
      ? data.error : 'Zahteva ni uspela.'
    throw new ApiError(message, response.status)
  }
  return data as T
}

export const api = {
  list: (): Promise<Project[]> => request('/projects'),
  get: (id: string): Promise<Project> => request(`/projects/${encodeURIComponent(id)}`),
  create: (project: ProjectInput): Promise<Project> => request('/projects', {
    method: 'POST', body: JSON.stringify(project),
  }),
  update: (project: Project): Promise<Project> => request(`/projects/${encodeURIComponent(project.id)}`, {
    method: 'PUT', body: JSON.stringify(project),
  }),
  remove: (id: string): Promise<{ success: boolean }> => request(`/projects/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  }),
}
