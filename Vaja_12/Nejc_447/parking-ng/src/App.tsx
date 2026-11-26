import { useEffect, useState } from 'react'
import ControlsBar from './components/ControlsBar'
import Header from './components/Header'
import ParkingCard from './components/ParkingCard'
import ParkingDetails from './components/ParkingDetails'
import parkingsData from './data/parkings.json'
import {
  buildParkingViews,
  createInitialState,
  filterParkings,
  leave,
  parkHere,
  sortParkings,
  syncWithParkings,
  updateUi,
} from './parkingLogic'
import { loadState, saveState } from './storage'
import type { Parking, ParkingState, UiSettings } from './types'

const parkings: Parking[] = parkingsData

// Loads the saved state (or creates a fresh one) when the app starts.
function loadInitialState(): ParkingState {
  const saved = loadState()
  return saved ? syncWithParkings(saved, parkings) : createInitialState(parkings)
}

// Main component: holds the state and decides between the list and the detail screen.
export default function App() {
  const [state, setState] = useState<ParkingState>(loadInitialState)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  // "now" is stored in state (no timers): it is refreshed on every user action.
  const [now, setNow] = useState<number>(() => Date.now())

  useEffect(() => {
    saveState(state)
  }, [state])

  const views = buildParkingViews(parkings, state)
  const visibleParkings = sortParkings(filterParkings(views, state.ui), state.ui.sortMode)
  const selected = views.find((p) => p.id === selectedId)

  // Button clicks only call logic functions, which return the new state.
  const handlePark = (id: string) => {
    const time = Date.now()
    setNow(time)
    setState((prev) => parkHere(prev, id, time))
  }
  const handleLeave = (id: string) => {
    const time = Date.now()
    const total = parkings.find((p) => p.id === id)?.totalSpaces ?? 0
    setNow(time)
    setState((prev) => leave(prev, id, total, time))
  }
  const handleUiChange = (changes: Partial<UiSettings>) => {
    setNow(Date.now())
    setState((prev) => updateUi(prev, changes))
  }
  const handleOpen = (id: string | null) => {
    setNow(Date.now())
    setSelectedId(id)
  }

  return (
    <>
      <Header />
      {selected ? (
        <ParkingDetails
          parking={selected}
          isParked={Boolean(state.userParked[selected.id])}
          now={now}
          onBack={() => handleOpen(null)}
          onPark={handlePark}
          onLeave={handleLeave}
        />
      ) : (
        <main>
          <ControlsBar ui={state.ui} onChange={handleUiChange} />
          <div className="mx-auto max-w-120 px-4 pb-8">
            {visibleParkings.length === 0 ? (
              <p className="rounded-2xl bg-white p-4 text-center shadow-card">No car parks match your filters.</p>
            ) : (
              <ul className="flex flex-col gap-3">
                {visibleParkings.map((p) => (
                  <ParkingCard
                    key={p.id}
                    parking={p}
                    isParked={Boolean(state.userParked[p.id])}
                    now={now}
                    onOpen={handleOpen}
                    onPark={handlePark}
                    onLeave={handleLeave}
                  />
                ))}
              </ul>
            )}
          </div>
        </main>
      )}
    </>
  )
}
