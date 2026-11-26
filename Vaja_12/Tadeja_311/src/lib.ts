import type { AppSettings, CalendarEvent, Category, Goal, PlannerData, Task } from './types';

export const CATEGORIES: Category[] = ['Študij', 'Delo', 'Osebno', 'Zdravje', 'Drugo'];
export const PERIOD_LABELS = { daily: 'Dnevni', weekly: 'Tedenski', monthly: 'Mesečni' } as const;
export const STORAGE_KEY = 'moj-ritem-podatki-v1';

export function localDate(value: Date = new Date()): string {
  return [value.getFullYear(), String(value.getMonth() + 1).padStart(2, '0'), String(value.getDate()).padStart(2, '0')].join('-');
}
export function parseDate(date: string): Date {
  const [year, month, day] = date.split('-').map(Number);
  return new Date(year, month - 1, day);
}
export function shiftDate(date: string, days: number): string {
  const result = parseDate(date);
  result.setDate(result.getDate() + days);
  return localDate(result);
}
export function shiftMonth(date: string, months: number): string {
  const result = parseDate(date);
  const day = result.getDate();
  result.setDate(1);
  result.setMonth(result.getMonth() + months);
  result.setDate(Math.min(day, new Date(result.getFullYear(), result.getMonth() + 1, 0).getDate()));
  return localDate(result);
}
export function startOfWeek(date: string): string {
  const day = parseDate(date).getDay();
  return shiftDate(date, -(day === 0 ? 6 : day - 1));
}
export function dateLabel(date: string, options?: Intl.DateTimeFormatOptions): string {
  return new Intl.DateTimeFormat('sl-SI', options ?? { day: 'numeric', month: 'long', year: 'numeric' }).format(parseDate(date));
}
export function longToday(): string {
  return new Intl.DateTimeFormat('sl-SI', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(new Date());
}
export function dateTime(date: string, time: string): number {
  return new Date(`${date}T${time || '23:59'}:00`).getTime();
}
export function isOverdue(task: Task): boolean {
  return !task.completed && dateTime(task.date, task.time) < Date.now();
}
export function percentage(completed: number, total: number): number {
  return total > 0 ? Math.round((completed / total) * 100) : 0;
}
export function goalPercentage(goal: Goal): number {
  return percentage(goal.progress, goal.target);
}
export function newId(): string {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
export function categoryStyle(category: Category): { badge: string; dot: string } {
  switch (category) {
    case 'Študij': return { badge: 'bg-[#EEE9FF] text-[#6953B8]', dot: 'bg-[#9D8CE8]' };
    case 'Delo': return { badge: 'bg-[#E3F3FF] text-[#3F7899]', dot: 'bg-[#83C7ED]' };
    case 'Osebno': return { badge: 'bg-[#FFE6ED] text-[#B55D7C]', dot: 'bg-[#F4A6C0]' };
    case 'Zdravje': return { badge: 'bg-[#E4F6ED] text-[#397D67]', dot: 'bg-[#86CFB0]' };
    case 'Drugo': return { badge: 'bg-[#FFF2E0] text-[#98703D]', dot: 'bg-[#EAC58F]' };
  }
}
export function seedData(): PlannerData {
  const today = localDate();
  return {
    tasks: [
      { id: 'task-1', title: 'Pripravi zapiske za predavanje', description: 'Uredi zapiske in izpiši najpomembnejše pojme.', date: today, time: '10:00', category: 'Študij', important: true, completed: true },
      { id: 'task-2', title: 'Sprehod na svežem zraku', description: 'Vzemi si pol ure zase.', date: today, time: '17:30', category: 'Zdravje', important: false, completed: false },
      { id: 'task-3', title: 'Preberi 20 strani knjige', description: '', date: today, time: '20:00', category: 'Osebno', important: false, completed: false },
      { id: 'task-4', title: 'Dokončaj seminarsko nalogo', description: 'Preveri vire in pošlji končno različico.', date: shiftDate(today, 1), time: '14:00', category: 'Študij', important: true, completed: false },
      { id: 'task-5', title: 'Naredi načrt za prihodnji teden', description: '', date: shiftDate(today, 2), time: '18:00', category: 'Osebno', important: false, completed: false }
    ],
    events: [
      { id: 'event-1', title: 'Predavanje', date: today, time: '09:00', category: 'Študij', reminderMinutesBefore: null },
      { id: 'event-2', title: 'Kava s prijateljico', date: shiftDate(today, 1), time: '16:00', category: 'Osebno', reminderMinutesBefore: 30 },
      { id: 'event-3', title: 'Vadba joge', date: shiftDate(today, 3), time: '18:00', category: 'Zdravje', reminderMinutesBefore: 15 },
      { id: 'event-4', title: 'Sestanek za projekt', date: shiftDate(today, 5), time: '11:00', category: 'Delo', reminderMinutesBefore: 60 }
    ],
    goals: [
      { id: 'goal-1', title: 'Popij 8 kozarcev vode', period: 'daily', deadline: today, target: 8, progress: 5, completed: false },
      { id: 'goal-2', title: 'Trikrat pojdi na sprehod', period: 'weekly', deadline: shiftDate(today, 6), target: 3, progress: 1, completed: false },
      { id: 'goal-3', title: 'Preberi eno knjigo', period: 'monthly', deadline: shiftDate(today, 25), target: 20, progress: 12, completed: false }
    ],
    settings: { remindersEnabled: true, defaultReminderMinutes: 15 }
  };
}
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
const validDate = (value: unknown): value is string => typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) && localDate(parseDate(value)) === value;
const validTime = (value: unknown): value is string => typeof value === 'string' && /^([01]\d|2[0-3]):[0-5]\d$/.test(value);
const validCategory = (value: unknown): value is Category => CATEGORIES.includes(value as Category);
function validTask(value: unknown): value is Task {
  return isRecord(value) && typeof value.id === 'string' && typeof value.title === 'string' && typeof value.description === 'string' && validDate(value.date) && validTime(value.time) && validCategory(value.category) && typeof value.important === 'boolean' && typeof value.completed === 'boolean';
}
function validEvent(value: unknown): value is CalendarEvent {
  return isRecord(value) && typeof value.id === 'string' && typeof value.title === 'string' && validDate(value.date) && validTime(value.time) && validCategory(value.category) && (value.reminderMinutesBefore === null || (typeof value.reminderMinutesBefore === 'number' && Number.isFinite(value.reminderMinutesBefore) && value.reminderMinutesBefore >= 0));
}
function validGoal(value: unknown): value is Goal {
  return isRecord(value) && typeof value.id === 'string' && typeof value.title === 'string' && ['daily', 'weekly', 'monthly'].includes(String(value.period)) && validDate(value.deadline) && typeof value.target === 'number' && Number.isFinite(value.target) && value.target > 0 && typeof value.progress === 'number' && Number.isFinite(value.progress) && value.progress >= 0 && value.progress <= value.target && typeof value.completed === 'boolean';
}
function validSettings(value: unknown): value is AppSettings {
  return isRecord(value) && typeof value.remindersEnabled === 'boolean' && typeof value.defaultReminderMinutes === 'number' && [0, 5, 10, 15, 30, 60].includes(value.defaultReminderMinutes);
}
export function loadData(): PlannerData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return seedData();
    const data: unknown = JSON.parse(raw);
    if (isRecord(data) && Array.isArray(data.tasks) && data.tasks.every(validTask) && Array.isArray(data.events) && data.events.every(validEvent) && Array.isArray(data.goals) && data.goals.every(validGoal) && validSettings(data.settings)) {
      return { tasks: data.tasks, events: data.events, goals: data.goals, settings: data.settings };
    }
  } catch { /* Shranjeni podatki morda niso na voljo ali niso veljavni. */ }
  return seedData();
}
