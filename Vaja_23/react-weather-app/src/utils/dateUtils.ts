const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

/**
 * Converts a UTC unix timestamp (seconds) plus a timezone offset (seconds)
 * into the place's local date key ("YYYY-MM-DD"), local hour and short day name.
 */
export function toLocalDateParts(unixSeconds: number, timezoneOffsetSeconds: number) {
  // Shift the time by the offset, then read it with UTC getters to get the place's local time
  const local = new Date((unixSeconds + timezoneOffsetSeconds) * 1000);

  return {
    dateKey: local.toISOString().slice(0, 10),
    hour: local.getUTCHours(),
    dayName: DAY_NAMES[local.getUTCDay()],
  };
}
