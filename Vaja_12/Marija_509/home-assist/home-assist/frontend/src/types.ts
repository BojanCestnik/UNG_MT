export type Difficulty = 'easy' | 'medium'

export interface Guide {
  id: string
  title: string
  object: string
  problem: string
  difficulty: Difficulty
  minutes: number
  tools: string[]
  materials: string[]
  safetyNotes: string[]
  steps: string[]
}

export interface LogEntry {
  id: string
  guideId: string
  date: string // ISO date
  photo?: string // base64 data URL
}

export type Screen = 'home' | 'tools' | 'detail' | 'step' | 'log'

export interface ApiError {
  error: string
}
