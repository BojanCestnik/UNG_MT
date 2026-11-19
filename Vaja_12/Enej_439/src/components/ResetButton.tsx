import { useEffect, useState } from 'react'

type Props = { onReset: () => void }

// Brez okna: prvi tap zahteva potrditev, drugi tap v 3 sekundah ponastavi dan
export default function ResetButton({ onReset }: Props) {
  const [confirming, setConfirming] = useState(false)

  useEffect(() => {
    if (!confirming) return
    const timer = setTimeout(() => setConfirming(false), 3000)
    return () => clearTimeout(timer)
  }, [confirming])

  const handleClick = () => {
    if (confirming) {
      onReset()
      setConfirming(false)
    } else {
      setConfirming(true)
    }
  }

  return (
    <button
      onClick={handleClick}
      className="mt-3 h-12 w-full rounded-2xl border-2 border-line font-extrabold text-muted"
    >
      {confirming ? 'Res? Tapni še enkrat' : 'Ponastavi dan'}
    </button>
  )
}
