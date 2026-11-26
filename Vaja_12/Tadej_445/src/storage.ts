import type { Alarm } from "./types";

const STORAGE_KEY = "sleepy-clock-alarms";

function isAlarm(value: unknown): value is Alarm {
  if (typeof value !== "object" || value === null) return false;
  const item = value as Record<string, unknown>;
  return (
    typeof item.id === "string" &&
    typeof item.time === "string" &&
    /^\d{2}:\d{2}$/.test(item.time) &&
    typeof item.label === "string" &&
    typeof item.enabled === "boolean" &&
    (item.snoozedUntil === null || typeof item.snoozedUntil === "number")
  );
}

// Returns the saved alarms, or an empty list if nothing valid is stored.
export function loadAlarms(): Alarm[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === null) return [];
    const data: unknown = JSON.parse(saved);
    return Array.isArray(data) && data.every(isAlarm) ? data : [];
  } catch {
    return [];
  }
}

export function saveAlarms(alarms: Alarm[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(alarms));
  } catch {
    // Storage can be blocked (private mode, full disk). The app still works without it.
  }
}
