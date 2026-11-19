// The only file that touches localStorage.
const STORAGE_KEY = "parkingState";

// Reads the saved state; returns null if nothing is saved yet.
export function loadState() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY));
  } catch (error) {
    return null;
  }
}

// Saves the whole state object.
export function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

// Deletes the saved state (the next launch starts from parkings.json).
export function resetState() {
  localStorage.removeItem(STORAGE_KEY);
}
