import type { Project, ProjectInput, Settings } from './types'

// Vite posreduje zahteve /api lokalnemu Node.js strežniku na vratih 3001.
// Zaradi tega aplikacija deluje tudi na telefonu brez ločene nastavitve IP za API.
const API_URL = '/api'

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
  settings: (): Promise<Settings> => request('/settings'),
  saveSettings: (settings: Settings): Promise<Settings> => request('/settings', {
    method: 'PUT', body: JSON.stringify(settings),
  }),
  create: (project: ProjectInput): Promise<Project> => request('/projects', {
    method: 'POST', body: JSON.stringify(project),
  }),
  update: (project: Project): Promise<Project> => request(`/projects/${encodeURIComponent(project.id)}`, {
    method: 'PUT', body: JSON.stringify(project),
  }),
  remove: (id: string): Promise<{ success: boolean }> => request(`/projects/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  }),
  addImage: (id: string, fileName: string, mimeType: string, description: string, dataBase64: string): Promise<Project> =>
    request(`/projects/${encodeURIComponent(id)}/images`, {
      method: 'POST', body: JSON.stringify({ fileName, mimeType, description, dataBase64 }),
    }),
  loadImage: (id: string, imageId: string): Promise<{ mimeType: string; dataBase64: string }> =>
    request(`/projects/${encodeURIComponent(id)}/images/${encodeURIComponent(imageId)}`),
  removeImage: (id: string, imageId: string): Promise<{ success: boolean }> =>
    request(`/projects/${encodeURIComponent(id)}/images/${encodeURIComponent(imageId)}`, { method: 'DELETE' }),
}
