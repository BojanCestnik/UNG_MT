export type Difficulty = 'easy' | 'medium' | 'hard'

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
  category?: string
  summary?: string
  emoji?: string
}

export interface LogEntry {
  id: string
  guideId: string
  date: string // ISO date
  photo?: string // base64 data URL
}

export type Screen = 'home' | 'scan' | 'tools' | 'detail' | 'step' | 'log'

export interface ApiError {
  error: string
}

export type DiagnoseResult =
  | { status: 'ok'; guide: Guide }
  | { status: 'professional'; kind: string; reason: string }
  | { status: 'unclear'; message: string }
