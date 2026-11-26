// Entry point: loads parkings.json, creates the state on first launch, starts the UI.
import { loadState, saveState } from "./storage.js";
import { createInitialState } from "./logic.js";
import { initUi } from "./ui.js";

// Loads data and state, then starts the UI.
async function start() {
  const response = await fetch("parkings.json");
  const parkings = await response.json();
  let state = loadState();
  if (!state) {
    state = createInitialState(parkings);
    saveState(state);
  }
  initUi(parkings, state);
}

start().catch(() => {
  document.getElementById("cards").innerHTML =
    '<p class="empty">Could not load parkings.json. Open the app through a local web server.</p>';
});
