/**
 * Čiste funkcije za delo z lokalnimi datumi brez zamikov zaradi časovnih pasov (UTC).
 * Vsi datumi so obravnavani kot lokalna polnoč (00:00:00).
 */

const MS_PER_DAY = 24 * 60 * 60 * 1000;

const SLOVENIAN_MONTHS = [
  'januar', 'februar', 'marec', 'april', 'maj', 'junij',
  'julij', 'avgust', 'september', 'oktober', 'november', 'december'
];

export function parseLocalDate(isoDateString) {
  if (!isoDateString || typeof isoDateString !== 'string') return null;

  const parts = isoDateString.split('-').map(Number);
  if (parts.length !== 3 || parts.some(Number.isNaN)) return null;

  const [year, month, day] = parts;
  const date = new Date(year, month - 1, day, 0, 0, 0, 0);

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }

  return date;
}

export function getTodayLocal() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
}

export function toISODateString(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getCalendarDaysDiff(startDate, endDate) {
  const utcStart = Date.UTC(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
  const utcEnd = Date.UTC(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
  return Math.round((utcEnd - utcStart) / MS_PER_DAY);
}

export function calculateDateDifference(startIso, endIso, includeEndDay = false) {
  const start = parseLocalDate(startIso);
  const end = parseLocalDate(endIso);

  if (!start || !end) return null;

  const signedDiff = getCalendarDaysDiff(start, end);
  const direction = signedDiff === 0 ? 0 : signedDiff > 0 ? 1 : -1;

  let totalDays = Math.abs(signedDiff);
  if (includeEndDay) {
    totalDays += 1;
  }

  const fullWeeks = Math.floor(totalDays / 7);
  const remainderDays = totalDays % 7;
  const workdays = countWeekdaysInSpan(start, end, includeEndDay);

  return {
    direction,
    totalDays,
    fullWeeks,
    remainderDays,
    workdays,
    includeEndDay
  };
}

function countWeekdaysInSpan(start, end, includeEndDay) {
  const signedDiff = getCalendarDaysDiff(start, end);

  if (signedDiff === 0) {
    if (!includeEndDay) return 0;
    const day = start.getDay();
    return day >= 1 && day <= 5 ? 1 : 0;
  }

  const minDate = signedDiff > 0 ? start : end;
  const daysToInspect = Math.abs(signedDiff) + (includeEndDay ? 1 : 0);

  const completeWeeks = Math.floor(daysToInspect / 7);
  let weekdays = completeWeeks * 5;

  const extraDays = daysToInspect % 7;
  const startDayOfWeek = minDate.getDay();

  for (let i = 0; i < extraDays; i++) {
    const currentDay = (startDayOfWeek + i) % 7;
    if (currentDay >= 1 && currentDay <= 5) {
      weekdays++;
    }
  }

  return weekdays;
}

export function formatDisplayDate(isoDateString) {
  const date = parseLocalDate(isoDateString);
  if (!date) return isoDateString;

  const day = date.getDate();
  const monthName = SLOVENIAN_MONTHS[date.getMonth()];
  const year = date.getFullYear();

  return `${day}. ${monthName} ${year}`;
}

export function formatRemainingDays(days) {
  if (days === 0) return 'Danes!';
  if (days === 1) return 'Še 1 dan';
  if (days === 2) return 'Še 2 dneva';
  return `Še ${days} dni`;
}

export function formatHeroCountdown(days) {
  if (days === 0) return 'Danes!';
  if (days === 1) return '1 dan';
  if (days === 2) return '2 dneva';
  return `${days} dni`;
}

export function formatPastDaysAgo(daysAgo) {
  if (daysAgo === 1) return '1 day ago';
  return `${daysAgo} days ago`;
}

export function calculateProgressPercent(createdAtIso, targetIso) {
  const created = parseLocalDate(createdAtIso);
  const target = parseLocalDate(targetIso);
  const today = getTodayLocal();

  if (!created || !target) return 0;

  const totalSpan = getCalendarDaysDiff(created, target);
  if (totalSpan <= 0) return 100;

  const elapsed = getCalendarDaysDiff(created, today);
  const ratio = Math.min(Math.max(elapsed / totalSpan, 0.08), 1);
  return Math.round(ratio * 100);
}
