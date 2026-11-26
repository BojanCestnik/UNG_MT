import { formatPrice, formatTimeAgo, getStatus } from '../parkingLogic'
import type { ParkingView } from '../types'
import ParkingButtons from './ParkingButtons'
import StatusBadge from './StatusBadge'
import { STATUS_BORDER_CLASSES } from './statusStyles'

interface ParkingCardProps {
  parking: ParkingView
  isParked: boolean
  now: number
  onOpen: (id: string) => void
  onPark: (id: string) => void
  onLeave: (id: string) => void
}

// One car park card: tap the top part to open details, use the buttons to report.
export default function ParkingCard({ parking, isParked, now, onOpen, onPark, onLeave }: ParkingCardProps) {
  const status = getStatus(parking.freeSpaces, parking.totalSpaces, parking.lastUpdate, now)

  return (
    <li className={`rounded-2xl border-l-8 bg-white p-4 shadow-card ${STATUS_BORDER_CLASSES[status]}`}>
      <button
        type="button"
        onClick={() => onOpen(parking.id)}
        aria-label={`Open details of ${parking.name}`}
        className="mb-3 block w-full cursor-pointer text-left"
      >
        <span className="block text-lg font-bold">{parking.name}</span>
        <span className="mt-1 flex items-center justify-between gap-2">
          <span className="text-2xl font-bold">
            {parking.freeSpaces} / {parking.totalSpaces} free
          </span>
          <StatusBadge status={status} />
        </span>
        <span className="mt-1 block text-gray-600">
          {formatPrice(parking.pricePerHour)} · {formatTimeAgo(parking.lastUpdate, now)}
        </span>
      </button>
      <ParkingButtons isParked={isParked} onPark={() => onPark(parking.id)} onLeave={() => onLeave(parking.id)} />
    </li>
  )
}
