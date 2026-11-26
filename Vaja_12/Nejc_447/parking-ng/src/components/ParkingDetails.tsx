import { formatPrice, formatTimeAgo, getStatus } from '../parkingLogic'
import type { ParkingView } from '../types'
import ParkingButtons from './ParkingButtons'
import StatusBadge from './StatusBadge'
import { STATUS_BORDER_CLASSES } from './statusStyles'

interface ParkingDetailsProps {
  parking: ParkingView
  isParked: boolean
  now: number
  onBack: () => void
  onPark: (id: string) => void
  onLeave: (id: string) => void
}

interface DetailRowProps {
  label: string
  value: string
}

// One line of the details list: a label and its value.
function DetailRow({ label, value }: DetailRowProps) {
  return (
    <div className="flex justify-between gap-4 border-b border-gray-200 py-2">
      <dt className="text-gray-600">{label}</dt>
      <dd className="text-right font-semibold">{value}</dd>
    </div>
  )
}

// Detail screen of one car park with all information, the report buttons and a maps link.
export default function ParkingDetails({ parking, isParked, now, onBack, onPark, onLeave }: ParkingDetailsProps) {
  const status = getStatus(parking.freeSpaces, parking.totalSpaces, parking.lastUpdate, now)
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(parking.address)}`

  return (
    <div className="mx-auto max-w-120 px-4 py-4">
      <button
        type="button"
        onClick={onBack}
        className="mb-4 min-h-11 cursor-pointer rounded-xl border-2 border-accent bg-white px-4 font-semibold text-accent transition-colors duration-150 active:bg-blue-100"
      >
        Back
      </button>
      <section className={`rounded-2xl border-l-8 bg-white p-4 shadow-card ${STATUS_BORDER_CLASSES[status]}`}>
        <h2 className="text-lg font-bold">{parking.name}</h2>
        <p className="mt-1 flex items-center justify-between gap-2">
          <span className="text-2xl font-bold">
            {parking.freeSpaces} / {parking.totalSpaces} free
          </span>
          <StatusBadge status={status} />
        </p>
        <dl className="my-3">
          <DetailRow label="Address" value={parking.address} />
          <DetailRow label="Total spaces" value={String(parking.totalSpaces)} />
          <DetailRow label="Free spaces" value={String(parking.freeSpaces)} />
          <DetailRow label="Price" value={formatPrice(parking.pricePerHour)} />
          <DetailRow label="Opening hours" value={parking.openingHours} />
          <DetailRow label="Last update" value={formatTimeAgo(parking.lastUpdate, now)} />
        </dl>
        <ParkingButtons isParked={isParked} onPark={() => onPark(parking.id)} onLeave={() => onLeave(parking.id)} />
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-block min-h-11 py-2 font-semibold text-accent underline"
        >
          Open in maps
        </a>
      </section>
    </div>
  )
}
