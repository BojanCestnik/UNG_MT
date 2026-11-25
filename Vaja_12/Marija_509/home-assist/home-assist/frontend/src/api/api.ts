// The ONLY file that calls fetch. One function per endpoint.
import type { ApiError, DiagnoseResult, Guide, LogEntry } from '../types'

// Uses the same address the page was opened from, so it also works on a phone (http://192.168.x.x:5173)
const BASE_URL = 'http://' + window.location.hostname + ':3001/api'

// Sends a request and returns typed JSON. Throws an Error with the server's message on failure.
async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(BASE_URL + path, options)
  const data: unknown = await response.json()
  if (!response.ok) {
    throw new Error((data as ApiError).error ?? 'Request failed')
  }
  return data as T
}

const jsonHeaders = { 'Content-Type': 'application/json' }

export const getGuides = () => request<Guide[]>('/guides')
export const getGuide = (id: string) => request<Guide>('/guides/' + id)
export const getTools = () => request<string[]>('/tools')
export const saveTools = (tools: string[]) =>
  request<string[]>('/tools', { method: 'PUT', headers: jsonHeaders, body: JSON.stringify(tools) })
export const getLog = () => request<LogEntry[]>('/log')
export const addLogEntry = (entry: { guideId: string; date: string; photo?: string }) =>
  request<LogEntry>('/log', { method: 'POST', headers: jsonHeaders, body: JSON.stringify(entry) })
export const deleteLogEntry = (id: string) => request<{ deleted: string }>('/log/' + id, { method: 'DELETE' })
export const diagnose = (photo: string, note: string) =>
  request<DiagnoseResult>('/diagnose', { method: 'POST', headers: jsonHeaders, body: JSON.stringify({ photo, note }) })
