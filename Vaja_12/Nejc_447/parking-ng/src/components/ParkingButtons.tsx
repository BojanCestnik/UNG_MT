interface ParkingButtonsProps {
  isParked: boolean
  onPark: () => void
  onLeave: () => void
}

const BASE_CLASSES =
  'min-h-12 flex-1 rounded-xl border-2 px-4 text-base font-semibold transition-colors duration-150'
const DISABLED_CLASSES = 'cursor-not-allowed border-gray-200 bg-gray-200 text-gray-500'

// The two large buttons "I parked here" and "I left".
export default function ParkingButtons({ isParked, onPark, onLeave }: ParkingButtonsProps) {
  const parkClasses = isParked
    ? DISABLED_CLASSES
    : 'cursor-pointer border-accent bg-accent text-white active:bg-blue-800'
  const leaveClasses = isParked
    ? 'cursor-pointer border-accent bg-white text-accent active:bg-blue-100'
    : DISABLED_CLASSES

  return (
    <div className="flex gap-3">
      <button type="button" disabled={isParked} onClick={onPark} className={`${BASE_CLASSES} ${parkClasses}`}>
        I parked here
      </button>
      <button type="button" disabled={!isParked} onClick={onLeave} className={`${BASE_CLASSES} ${leaveClasses}`}>
        I left
      </button>
    </div>
  )
}
