// All DOM work. State is never edited here: logic.js returns a new state.
import { saveState } from "./storage.js";
import {
  getStatus, parkHere, leave, sortParkings, filterParkings,
  formatTimeAgo, mergeParkings, updateUiSettings,
} from "./logic.js";

let parkings = [];
let state = null;

// Starts the UI: stores data, attaches listeners, draws the list.
export function initUi(parkingData, initialState) {
  parkings = parkingData;
  state = initialState;
  document.getElementById("sort-select").addEventListener("change", (e) => {
    setState(updateUiSettings(state, { sortMode: e.target.value }));
  });
  document.getElementById("chip-cheap").addEventListener("click", () => {
    setState(updateUiSettings(state, { onlyCheap: !state.ui.onlyCheap }));
  });
  document.getElementById("chip-free").addEventListener("click", () => {
    setState(updateUiSettings(state, { onlyFree: !state.ui.onlyFree }));
  });
  document.getElementById("cards").addEventListener("click", handleCardClick);
  document.getElementById("back-button").addEventListener("click", showList);
  renderList();
}

// Saves a new state and redraws the list.
function setState(newState) {
  if (newState === state) return;
  state = newState;
  saveState(state);
  renderList();
}

// Handles taps on card buttons (park / leave) or on the card itself (detail).
function handleCardClick(event) {
  const button = event.target.closest("button[data-action]");
  const card = event.target.closest(".card");
  if (button) {
    const change = button.dataset.action === "park" ? parkHere : leave;
    setState(change(state, parkings, button.dataset.id));
  } else if (card) {
    showDetail(card.dataset.id);
  }
}

// Builds the HTML of the two buttons on a card.
function buttonsHtml(p) {
  const parked = Boolean(state.userParked[p.id]);
  const parkOff = parked || p.freeSpaces === 0 ? "disabled" : "";
  const leaveOff = parked ? "" : "disabled";
  return `<div class="actions">
    <button class="btn primary" data-action="park" data-id="${p.id}" ${parkOff}>I parked here</button>
    <button class="btn outline" data-action="leave" data-id="${p.id}" ${leaveOff}>I left</button>
  </div>`;
}

// Builds the HTML of one car park card.
function cardHtml(p) {
  const status = getStatus(p.freeSpaces, p.totalSpaces, p.lastUpdate);
  return `<article class="card ${status.key}" data-id="${p.id}">
    <div class="card-top"><h2>${p.name}</h2><span class="badge ${status.key}">${status.label}</span></div>
    <p class="free">${p.freeSpaces} / ${p.totalSpaces} free</p>
    <p class="meta">updated ${formatTimeAgo(p.lastUpdate)}</p>
    ${buttonsHtml(p)}
  </article>`;
}

// Keeps the sort select and filter chips in sync with the saved state.
function syncControls() {
  document.getElementById("sort-select").value = state.ui.sortMode;
  document.getElementById("chip-cheap").setAttribute("aria-pressed", String(state.ui.onlyCheap));
  document.getElementById("chip-free").setAttribute("aria-pressed", String(state.ui.onlyFree));
}

// Draws the filtered and sorted list of car parks.
export function renderList() {
  const merged = mergeParkings(parkings, state);
  const visible = sortParkings(filterParkings(merged, state.ui), state.ui.sortMode);
  document.getElementById("cards").innerHTML = visible.length
    ? visible.map(cardHtml).join("")
    : '<p class="empty">No car parks match the filters.</p>';
  syncControls();
}

// Builds one label/value row for the detail screen.
function rowHtml(label, value) {
  return `<div class="detail-row"><span>${label}</span><span>${value}</span></div>`;
}

// Draws the detail screen of one car park.
export function renderDetail(id) {
  const p = mergeParkings(parkings, state).find((item) => item.id === id);
  const status = getStatus(p.freeSpaces, p.totalSpaces, p.lastUpdate);
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(p.address)}`;
  document.getElementById("detail-content").innerHTML = `<div class="detail-card ${status.key}">
    <h2>${p.name}</h2>
    ${rowHtml("Address", p.address)}
    ${rowHtml("Total spaces", p.totalSpaces)}
    ${rowHtml("Free spaces", p.freeSpaces)}
    ${rowHtml("Price", `${p.pricePerHour.toFixed(2)} EUR/hour`)}
    ${rowHtml("Opening hours", p.openingHours)}
    ${rowHtml("Last update", formatTimeAgo(p.lastUpdate))}
    <a class="link" href="${mapsUrl}" target="_blank" rel="noopener">Open in maps</a>
  </div>`;
}

// Switches from the list to the detail screen.
function showDetail(id) {
  renderDetail(id);
  document.getElementById("list-view").hidden = true;
  document.getElementById("detail-view").hidden = false;
  window.scrollTo(0, 0);
}

// Switches from the detail screen back to the list.
function showList() {
  renderList();
  document.getElementById("detail-view").hidden = true;
  document.getElementById("list-view").hidden = false;
}
