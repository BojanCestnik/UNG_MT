// Pure logic: no DOM, no localStorage. Every state change returns a NEW state.
const TWO_HOURS_MS = 2 * 60 * 60 * 1000;

// Builds the first state from parkings.json.
// ASSUMPTION: on first launch every car park starts completely free.
export function createInitialState(parkings) {
  const now = Date.now();
  return {
    parkings: parkings.map((p) => ({ id: p.id, freeSpaces: p.totalSpaces, lastUpdate: now })),
    userParked: {},
    ui: { sortMode: "name", onlyCheap: false, onlyFree: false },
  };
}

// Joins static car park data with the saved free spaces and update time.
export function mergeParkings(parkings, state) {
  return parkings.map((p) => ({ ...p, ...state.parkings.find((s) => s.id === p.id) }));
}

// Returns { key, label } for a car park: green / orange / red / outdated.
export function getStatus(free, total, lastUpdate, now = Date.now()) {
  if (now - lastUpdate > TWO_HOURS_MS) return { key: "outdated", label: "No recent reports" };
  const share = free / total;
  if (share > 0.3) return { key: "green", label: "Free" };
  if (share >= 0.1) return { key: "orange", label: "Filling up" };
  return { key: "red", label: "Full" };
}

// Changes free spaces by delta (kept between 0 and total) and sets the user's parked flag.
function changeFreeSpaces(state, parkings, parkingId, delta, userIsParked) {
  const total = parkings.find((p) => p.id === parkingId).totalSpaces;
  return {
    ...state,
    parkings: state.parkings.map((item) => {
      if (item.id !== parkingId) return item;
      const freeSpaces = Math.min(total, Math.max(0, item.freeSpaces + delta));
      return { ...item, freeSpaces, lastUpdate: Date.now() };
    }),
    userParked: { ...state.userParked, [parkingId]: userIsParked },
  };
}

// "I parked here": free spaces -1, only once until the user presses "I left".
// ASSUMPTION: functions also receive state and parkings, because a pure function needs them.
export function parkHere(state, parkings, parkingId) {
  const item = state.parkings.find((p) => p.id === parkingId);
  if (state.userParked[parkingId] || item.freeSpaces <= 0) return state;
  return changeFreeSpaces(state, parkings, parkingId, -1, true);
}

// "I left": free spaces +1.
// ASSUMPTION: only possible after the same user pressed "I parked here".
export function leave(state, parkings, parkingId) {
  if (!state.userParked[parkingId]) return state;
  return changeFreeSpaces(state, parkings, parkingId, 1, false);
}

// Returns a sorted copy of the list: mode "free" = most free first, otherwise by name.
export function sortParkings(list, mode) {
  const sorted = [...list];
  if (mode === "free") return sorted.sort((a, b) => b.freeSpaces - a.freeSpaces);
  return sorted.sort((a, b) => a.name.localeCompare(b.name));
}

// Returns only the car parks that match the active filters.
export function filterParkings(list, filters) {
  return list.filter((p) => {
    if (filters.onlyCheap && p.pricePerHour >= 1) return false;
    if (filters.onlyFree && p.freeSpaces <= 0) return false;
    return true;
  });
}

// Returns a new state with changed sort/filter settings.
export function updateUiSettings(state, changes) {
  return { ...state, ui: { ...state.ui, ...changes } };
}

// Turns a timestamp into text like "just now", "5 min ago" or "2 h ago".
export function formatTimeAgo(timestamp, now = Date.now()) {
  const minutes = Math.floor((now - timestamp) / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} min ago`;
  return `${Math.floor(minutes / 60)} h ago`;
}
