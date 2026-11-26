// Static car park data, loaded from src/data/parkings.json
export interface Parking {
  id: string
  name: string
  address: string
  totalSpaces: number
  pricePerHour: number
  openingHours: string
}

// Changing data for one car park, saved in localStorage
export interface ParkingEntry {
  id: string
  freeSpaces: number
  lastUpdate: number | null // timestamp in milliseconds, null = no report yet
}

export type SortMode = 'mostFree' | 'name'

export interface Filters {
  onlyCheap: boolean
  onlyFree: boolean
}

export interface UiSettings extends Filters {
  sortMode: SortMode
}

// The whole saved state (localStorage key: "parkingState")
export interface ParkingState {
  parkings: ParkingEntry[]
  userParked: Record<string, boolean>
  ui: UiSettings
}

export type ParkingStatus = 'free' | 'fillingUp' | 'full' | 'outdated'

// Static data and saved data of one car park joined together for display
export interface ParkingView extends Parking {
  freeSpaces: number
  lastUpdate: number | null
}
