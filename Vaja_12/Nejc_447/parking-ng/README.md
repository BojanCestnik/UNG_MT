# Parking NG

Crowd-sourced free parking space tracker for Nova Gorica (university project, Mobile Technologies).
Stack: React, TypeScript, Vite, Tailwind CSS v4. Data is stored in localStorage (key `parkingState`).

## Run

```
npm install
npm run dev       # development server
npm run build     # type check + production build
npm run lint
```

## Files

- `src/data/parkings.json` – static data of 8 sample car parks (id, name, address, totalSpaces, pricePerHour, openingHours)
- `src/types.ts` – all interfaces and types
- `src/storage.ts` – the only file that touches localStorage (loadState, saveState, resetState)
- `src/parkingLogic.ts` – pure functions: getStatus, parkHere, leave, sortParkings, filterParkings, formatTimeAgo, ...
- `src/App.tsx` – holds the state, switches between list and detail screen
- `src/components/` – Header, ControlsBar, ParkingCard, ParkingDetails, ParkingButtons, StatusBadge

## Data flow

Button click in a component -> callback in `App` -> function in `parkingLogic.ts` returns the new state ->
`App` updates its state -> `useEffect` saves it through `storage.ts` -> components re-render.

## Assumptions

- First launch: free spaces = total spaces, no last update, so every car park shows "No recent reports".
- "I left" is enabled only after "I parked here" at the same car park.
- If a car park shows 0 free spaces, "I parked here" still marks the user as parked but the count stays at 0.
- The car park data is sample data, not official.
- Time-ago text is refreshed on every user action (no timers or intervals).
