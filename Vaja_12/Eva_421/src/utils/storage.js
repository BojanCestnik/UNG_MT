import { toISODateString, getTodayLocal } from './dateUtils.js';

const STORAGE_KEY = 'odstevalnik_react_state_v1';
export const VALID_COLORS = ['peach', 'mint', 'sky', 'taupe', 'lavender'];

function createDefaultState() {
  const today = getTodayLocal();
  const todayIso = toISODateString(today);

  const addDays = (days) => {
    const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() + days);
    return toISODateString(d);
  };

  const sampleEvents = [
    {
      id: 'evt-holidays',
      title: 'Počitnice',
      subtitle: '',
      category: 'Potovanja',
      date: addDays(38),
      emoji: '🏖️',
      color: 'peach',
      createdAt: addDays(-12)
    },
    {
      id: 'evt-exam',
      title: 'Izpit',
      subtitle: 'Izpit iz matematike',
      category: 'Študij',
      date: addDays(12),
      emoji: '🎓',
      color: 'mint',
      createdAt: addDays(-18)
    },
    {
      id: 'evt-christmas',
      title: 'Božič',
      subtitle: 'Božični prazniki',
      category: 'Prazniki',
      date: addDays(194),
      emoji: '🎄',
      color: 'taupe',
      createdAt: addDays(-25)
    },
    {
      id: 'evt-birthday',
      title: 'Rojstni dan',
      subtitle: 'Ana (30)',
      category: 'Osebno',
      date: addDays(51),
      emoji: '🎂',
      color: 'sky',
      createdAt: addDays(-5)
    },
    {
      id: 'evt-past-sample',
      title: 'Oddaja projekta',
      subtitle: 'Spletna aplikacija',
      category: 'Študij',
      date: addDays(-6),
      emoji: '📘',
      color: 'lavender',
      createdAt: addDays(-30)
    }
  ];

  return {
    events: sampleEvents,
    pinnedEventId: 'evt-holidays',
    sortMode: 'nearest', // 'nearest' | 'category' | 'recent'
    calculator: {
      startDate: todayIso,
      endDate: addDays(14),
      includeEndDay: false
    }
  };
}

function sanitizeEvent(raw) {
  if (!raw || typeof raw !== 'object') return null;
  if (typeof raw.id !== 'string' || !raw.id.trim()) return null;
  if (typeof raw.title !== 'string' || !raw.title.trim()) return null;
  if (typeof raw.date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(raw.date)) return null;

  return {
    id: raw.id,
    title: raw.title.trim().slice(0, 60),
    subtitle: typeof raw.subtitle === 'string' ? raw.subtitle.trim().slice(0, 80) : '',
    category: typeof raw.category === 'string' && raw.category.trim() ? raw.category.trim().slice(0, 30) : 'Splošno',
    date: raw.date,
    emoji: typeof raw.emoji === 'string' ? raw.emoji.trim().slice(0, 4) : '',
    color: VALID_COLORS.includes(raw.color) ? raw.color : 'peach',
    createdAt:
      typeof raw.createdAt === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(raw.createdAt)
        ? raw.createdAt
        : toISODateString(getTodayLocal())
  };
}

export function loadState() {
  try {
    const rawJson = window.localStorage.getItem(STORAGE_KEY);
    if (!rawJson) {
      const initial = createDefaultState();
      saveState(initial);
      return initial;
    }

    const parsed = JSON.parse(rawJson);
    if (!parsed || typeof parsed !== 'object') {
      return createDefaultState();
    }

    const events = Array.isArray(parsed.events)
      ? parsed.events.map(sanitizeEvent).filter(Boolean)
      : [];

    const pinnedEventId =
      typeof parsed.pinnedEventId === 'string' &&
      events.some((ev) => ev.id === parsed.pinnedEventId)
        ? parsed.pinnedEventId
        : null;

    const validSortModes = ['nearest', 'category', 'recent'];
    const sortMode = validSortModes.includes(parsed.sortMode) ? parsed.sortMode : 'nearest';

    const todayIso = toISODateString(getTodayLocal());
    const calc = parsed.calculator && typeof parsed.calculator === 'object' ? parsed.calculator : {};

    return {
      events,
      pinnedEventId,
      sortMode,
      calculator: {
        startDate: typeof calc.startDate === 'string' ? calc.startDate : todayIso,
        endDate: typeof calc.endDate === 'string' ? calc.endDate : todayIso,
        includeEndDay: Boolean(calc.includeEndDay)
      }
    };
  } catch (error) {
    console.warn('Napaka pri branju localStorage:', error);
    return createDefaultState();
  }
}

export function saveState(state) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Shranjevanje v localStorage ni uspelo:', error);
  }
}
