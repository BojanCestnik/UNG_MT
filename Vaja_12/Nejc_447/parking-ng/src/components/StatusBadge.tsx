import type { ParkingStatus } from '../types'
import { STATUS_BADGE_CLASSES, STATUS_LABELS } from './statusStyles'

interface StatusBadgeProps {
  status: ParkingStatus
}

// Small badge with the colour and the text label of a car park status.
export default function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={`inline-block rounded-full px-3 py-1 text-sm font-semibold text-gray-900 ${STATUS_BADGE_CLASSES[status]}`}
    >
      {STATUS_LABELS[status]}
    </span>
  )
}
