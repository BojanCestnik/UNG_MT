import type { ParkingStatus } from '../types'

// Text label shown in the badge (colour is never the only signal).
export const STATUS_LABELS: Record<ParkingStatus, string> = {
  free: 'Free',
  fillingUp: 'Filling up',
  full: 'Full',
  outdated: 'No recent reports',
}

// Badge background colour for each status.
export const STATUS_BADGE_CLASSES: Record<ParkingStatus, string> = {
  free: 'bg-status-free',
  fillingUp: 'bg-status-filling',
  full: 'bg-status-full',
  outdated: 'bg-status-outdated',
}

// Left card border colour for each status.
export const STATUS_BORDER_CLASSES: Record<ParkingStatus, string> = {
  free: 'border-l-status-free',
  fillingUp: 'border-l-status-filling',
  full: 'border-l-status-full',
  outdated: 'border-l-status-outdated',
}
