import type { ParkingEntry, ParkingState, UiSettings } from './types'

const STORAGE_KEY = 'parkingState'

// Checks that a value is a plain object so its fields can be read safely.
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

// Checks that a value has the shape of one saved car park entry.
function isValidEntry(value: unknown): value is ParkingEntry {
  return (
    isRecord(value) &&
    typeof value.id === 'string' &&
    typeof value.freeSpaces === 'number' &&
    (value.lastUpdate === null || typeof value.lastUpdate === 'number')
  )
}

// Checks that a value has the shape of the saved sort and filter settings.
function isValidUi(value: unknown): value is UiSettings {
  return (
    isRecord(value) &&
    (value.sortMode === 'mostFree' || value.sortMode === 'name') &&
    typeof value.onlyCheap === 'boolean' &&
    typeof value.onlyFree === 'boolean'
  )
}

// Checks that a value has the shape of the whole saved state.
function isValidState(value: unknown): value is ParkingState {
  if (!isRecord(value) || !isRecord(value.userParked)) return false
  if (!Array.isArray(value.parkings) || !isValidUi(value.ui)) return false
  const parkedValues = Object.values(value.userParked)
  return value.parkings.every(isValidEntry) && parkedValues.every((v) => typeof v === 'boolean')
}

// Reads the saved state from localStorage. Returns null if it is missing or invalid.
export function loadState(): ParkingState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw === null) return null
    const parsed: unknown = JSON.parse(raw)
    return isValidState(parsed) ? parsed : null
  } catch {
    return null
  }
}

// Writes the state to localStorage. Fails silently if storage is unavailable.
export function saveState(state: ParkingState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // ASSUMPTION: if storage is full or blocked, the app keeps working without saving.
  }
}

// Deletes the saved state (for development use only, there is no reset button).
export function resetState(): void {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // Nothing to do if storage is unavailable.
  }
}
