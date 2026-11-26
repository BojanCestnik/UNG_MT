import type {
  Filters,
  Parking,
  ParkingEntry,
  ParkingState,
  ParkingStatus,
  ParkingView,
  SortMode,
  UiSettings,
} from './types'

const OUTDATED_AFTER_MS = 2 * 60 * 60 * 1000 // 2 hours
const MINUTE_MS = 60 * 1000
const HOUR_MS = 60 * MINUTE_MS
export const CHEAP_PRICE_LIMIT = 1 // EUR per hour

// Calculates the colour status from free spaces and the age of the last report.
export function getStatus(
  free: number,
  total: number,
  lastUpdate: number | null,
  now: number,
): ParkingStatus {
  if (lastUpdate === null || now - lastUpdate > OUTDATED_AFTER_MS) return 'outdated'
  const percentFree = total > 0 ? (free / total) * 100 : 0
  if (percentFree > 30) return 'free'
  if (percentFree >= 10) return 'fillingUp'
  return 'full'
}

// Turns a timestamp into text like "updated 5 min ago".
export function formatTimeAgo(timestamp: number | null, now: number): string {
  if (timestamp === null) return 'no reports yet'
  const diff = Math.max(0, now - timestamp)
  if (diff < MINUTE_MS) return 'updated just now'
  if (diff < HOUR_MS) return `updated ${Math.floor(diff / MINUTE_MS)} min ago`
  return `updated ${Math.floor(diff / HOUR_MS)} h ago`
}

// Creates the first state: every car park is empty and has no report yet.
export function createInitialState(parkings: Parking[]): ParkingState {
  return {
    parkings: parkings.map((p) => ({ id: p.id, freeSpaces: p.totalSpaces, lastUpdate: null })),
    userParked: {},
    ui: { sortMode: 'mostFree', onlyCheap: false, onlyFree: false },
  }
}

// Makes a saved state match the current car park list (new car parks, valid free spaces).
export function syncWithParkings(state: ParkingState, parkings: Parking[]): ParkingState {
  const entries = parkings.map((p): ParkingEntry => {
    const saved = state.parkings.find((e) => e.id === p.id)
    if (!saved) return { id: p.id, freeSpaces: p.totalSpaces, lastUpdate: null }
    const free = Math.min(p.totalSpaces, Math.max(0, Math.round(saved.freeSpaces)))
    return { ...saved, freeSpaces: free }
  })
  return { ...state, parkings: entries }
}

// Joins static car park data with the saved free spaces and last update time.
export function buildParkingViews(parkings: Parking[], state: ParkingState): ParkingView[] {
  return parkings.map((p) => {
    const entry = state.parkings.find((e) => e.id === p.id)
    return {
      ...p,
      freeSpaces: entry ? entry.freeSpaces : p.totalSpaces,
      lastUpdate: entry ? entry.lastUpdate : null,
    }
  })
}

// Returns a new state where one car park entry and the user's parked flag are changed.
function updateEntry(
  state: ParkingState,
  parkingId: string,
  freeSpaces: number,
  now: number,
  isParked: boolean,
): ParkingState {
  const entries = state.parkings.map((e) =>
    e.id === parkingId ? { ...e, freeSpaces, lastUpdate: now } : e,
  )
  return { ...state, parkings: entries, userParked: { ...state.userParked, [parkingId]: isParked } }
}

// Handles "I parked here": one free space less. Only once until the user presses "I left".
export function parkHere(state: ParkingState, parkingId: string, now: number): ParkingState {
  const entry = state.parkings.find((e) => e.id === parkingId)
  if (!entry || state.userParked[parkingId]) return state
  return updateEntry(state, parkingId, Math.max(0, entry.freeSpaces - 1), now, true)
}

// Handles "I left": one free space more. Only after the user pressed "I parked here".
export function leave(
  state: ParkingState,
  parkingId: string,
  totalSpaces: number,
  now: number,
): ParkingState {
  const entry = state.parkings.find((e) => e.id === parkingId)
  if (!entry || !state.userParked[parkingId]) return state
  return updateEntry(state, parkingId, Math.min(totalSpaces, entry.freeSpaces + 1), now, false)
}

// Returns a new sorted list: most free spaces first, or by name A-Z.
export function sortParkings(list: ParkingView[], mode: SortMode): ParkingView[] {
  const sorted = [...list]
  if (mode === 'name') return sorted.sort((a, b) => a.name.localeCompare(b.name))
  return sorted.sort((a, b) => b.freeSpaces - a.freeSpaces || a.name.localeCompare(b.name))
}

// Returns only the car parks that match the active filters.
export function filterParkings(list: ParkingView[], filters: Filters): ParkingView[] {
  return list.filter((p) => {
    if (filters.onlyCheap && p.pricePerHour >= CHEAP_PRICE_LIMIT) return false
    if (filters.onlyFree && p.freeSpaces < 1) return false
    return true
  })
}

// Returns a new state with changed sort mode or filters.
export function updateUi(state: ParkingState, changes: Partial<UiSettings>): ParkingState {
  return { ...state, ui: { ...state.ui, ...changes } }
}

// Formats the price per hour, for example "1.20 EUR / hour" or "Free of charge".
export function formatPrice(pricePerHour: number): string {
  if (pricePerHour === 0) return 'Free of charge'
  return `${pricePerHour.toFixed(2)} EUR / hour`
}
