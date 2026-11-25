import { useEffect, useRef, useState } from 'react';
import DashboardView from './components/DashboardView';
import TasksView from './components/TasksView';
import CalendarView from './components/CalendarView';
import GoalsView from './components/GoalsView';
import { loadData, localDate, longToday, seedData, STORAGE_KEY } from './lib';
import type { AppSettings, CalendarEvent, Goal, PlannerData, Screen, Task } from './types';

const PAGES: { key: Screen; label: string; icon: string }[] = [
  { key: 'home', label: 'Domov', icon: 'home' },
  { key: 'tasks', label: 'Moje naloge', icon: 'check' },
  { key: 'calendar', label: 'Koledar', icon: 'calendar' },
  { key: 'goals', label: 'Moji cilji', icon: 'target' },
  { key: 'statistics', label: 'Statistika', icon: 'chart' },
  { key: 'settings', label: 'Nastavitve', icon: 'settings' }
];

function NavIcon({ name }: { name: string }) {
  const common = { width: 19, height: 19, viewBox: '0 0 24 24', stroke: 'currentColor', strokeWidth: 1.9, fill: 'none', strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, 'aria-hidden': true as const };
  switch (name) {
    case 'home': return <svg {...common}><path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z"/><path d="M9 21v-8h6v8"/></svg>;
    case 'check': return <svg {...common}><rect x="3" y="3" width="18" height="18" rx="5"/><path d="m8 12 3 3 5-6"/></svg>;
    case 'calendar': return <svg {...common}><rect x="3" y="5" width="18" height="16" rx="3"/><path d="M7 3v4M17 3v4M3 10h18"/></svg>;
    case 'target': return <svg {...common}><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1" fill="currentColor"/></svg>;
    case 'chart': return <svg {...common}><path d="M4 20h16M7 17v-6M12 17V5M17 17V9"/></svg>;
    default: return <svg {...common}><circle cx="12" cy="12" r="3"/><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42"/></svg>;
  }
}

interface Alert { id: string; message: string }

export default function App() {
  const [initialData] = useState<PlannerData>(loadData);
  const [tasks, setTasks] = useState<Task[]>(initialData.tasks);
  const [events, setEvents] = useState<CalendarEvent[]>(initialData.events);
  const [goals, setGoals] = useState<Goal[]>(initialData.goals);
  const [settings, setSettings] = useState<AppSettings>(initialData.settings);
  const [activeScreen, setActiveScreen] = useState<Screen>('home');
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const displayedReminders = useRef(new Set<string>());

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ tasks, events, goals, settings })); }
    catch { /* Če je shranjevanje blokirano, aplikacija še vedno deluje v trenutni seji. */ }
  }, [tasks, events, goals, settings]);

  useEffect(() => {
    if (!settings.remindersEnabled) return;
    function checkReminders() {
      const now = Date.now();
      const newAlerts: Alert[] = [];
      for (const event of events) {
        const minutes = event.reminderMinutesBefore ?? settings.defaultReminderMinutes;
        const startsAt = new Date(`${event.date}T${event.time}:00`).getTime();
        const reminderAt = startsAt - minutes * 60_000;
        const id = `event-${event.id}-${event.date}-${event.time}`;
        if (now >= reminderAt && now <= startsAt && !displayedReminders.current.has(id)) {
          displayedReminders.current.add(id);
          newAlerts.push({ id, message: `🔔 Kmalu: ${event.title} (${event.time})` });
        }
      }
      const overdue = tasks.filter(task => !task.completed && new Date(`${task.date}T${task.time}:00`).getTime() < now);
      const taskReminderId = `tasks-${localDate()}`;
      if (overdue.length > 0 && !displayedReminders.current.has(taskReminderId)) {
        displayedReminders.current.add(taskReminderId);
        newAlerts.push({ id: taskReminderId, message: `🌷 Imaš ${overdue.length} ${overdue.length === 1 ? 'nedokončano nalogo' : 'nedokončanih nalog'}, ki že čakajo nate.` });
      }
      if (newAlerts.length > 0) setAlerts(prev => [...prev, ...newAlerts].slice(-4));
    }
    checkReminders();
    const intervalId = window.setInterval(checkReminders, 30_000);
    return () => window.clearInterval(intervalId);
  }, [events, settings.remindersEnabled, settings.defaultReminderMinutes, tasks]);

  function upsertTask(task: Task) {
    setTasks(previous => previous.some(item => item.id === task.id) ? previous.map(item => item.id === task.id ? task : item) : [...previous, task]);
  }
  function upsertEvent(event: CalendarEvent) {
    setEvents(previous => previous.some(item => item.id === event.id) ? previous.map(item => item.id === event.id ? event : item) : [...previous, event]);
  }
  function upsertGoal(goal: Goal) {
    setGoals(previous => previous.some(item => item.id === goal.id) ? previous.map(item => item.id === goal.id ? goal : item) : [...previous, goal]);
  }
  function updateGoalProgress(id: string, value: number) {
    setGoals(previous => previous.map(goal => {
      if (goal.id !== id) return goal;
      const progress = Math.max(0, Math.min(goal.target, value));
      return { ...goal, progress, completed: progress >= goal.target };
    }));
  }
  function resetExamples() {
    if (!window.confirm('Ali želiš izbrisati svoje podatke in ponovno naložiti vzorčne primere?')) return;
    const fresh = seedData();
    setTasks(fresh.tasks); setEvents(fresh.events); setGoals(fresh.goals); setSettings(fresh.settings);
    displayedReminders.current.clear();
    setAlerts([]);
    setActiveScreen('home');
  }

  const pageTitle = PAGES.find(page => page.key === activeScreen)?.label ?? 'Domov';
  const commonData = { tasks, events, goals };

  return (
    <div className="min-h-screen bg-[#F8F7FF] lg:flex">
      <aside className="border-b border-[#E9E6F3] bg-white lg:sticky lg:top-0 lg:h-screen lg:w-[246px] lg:shrink-0 lg:border-b-0 lg:border-r">
        <div className="mx-auto max-w-[1120px] px-4 pt-5 pb-3 sm:px-6 lg:flex lg:h-full lg:flex-col lg:px-4 lg:pt-9 lg:pb-6">
          <button onClick={() => setActiveScreen('home')} className="mb-4 flex items-center gap-3 rounded-xl text-left lg:mb-12 lg:pl-3" aria-label="Moj Ritem – domov">
            <span className="flex size-11 items-center justify-center rounded-2xl bg-[#EEE9FF] text-2xl" aria-hidden="true">🌸</span>
            <span><strong className="block text-[21px] leading-tight tracking-[-.05em]">Moj Ritem</strong><span className="text-xs font-medium text-[#8C87A4]">Tvoj dan, tvoj tempo</span></span>
          </button>
          <nav aria-label="Glavna navigacija" className="grid grid-cols-3 gap-1.5 sm:grid-cols-6 lg:flex lg:flex-col lg:gap-1">
            {PAGES.map(page => <button key={page.key} onClick={() => setActiveScreen(page.key)} aria-current={activeScreen === page.key ? 'page' : undefined} className={`nav-item !min-h-[48px] flex-col justify-center gap-1 !px-1 !py-2 text-center sm:!text-[13px] lg:!min-h-[48px] lg:flex-row lg:justify-start lg:gap-3 lg:!px-4 lg:!py-3 lg:text-left ${activeScreen === page.key ? 'active' : ''}`}>
              <NavIcon name={page.icon}/><span className="text-[11px] leading-tight sm:text-xs lg:text-sm">{page.label}</span>
            </button>)}
          </nav>
          <div className="mt-auto hidden rounded-3xl bg-[#F0ECFF] p-5 lg:block">
            <span className="mb-2 block text-2xl" aria-hidden="true">✨</span>
            <strong className="text-sm">Majhni koraki štejejo.</strong>
            <p className="mt-1 text-[13px] leading-relaxed text-[#77718D]">Vsak dan je nova priložnost, da ujameš svoj ritem.</p>
          </div>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <main className="mx-auto max-w-[1120px] px-4 py-7 sm:px-6 sm:py-9 lg:px-9 lg:py-10">
          <header className="mb-8 flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="mb-2 text-[12px] font-bold tracking-[.13em] text-[#8F80C4] uppercase">Moj mali svet organizacije</p>
              <h1 className="text-[29px] leading-tight font-extrabold tracking-[-.05em] text-[#25243A] sm:text-[34px]">{activeScreen === 'home' ? 'Lep dan za nov začetek! ☀️' : pageTitle}</h1>
              <p className="mt-2 text-sm text-[#77718D]">{activeScreen === 'home' ? 'Vzemi si trenutek in poglej, kaj te danes čaka.' : 'Vse, kar potrebuješ, na enem mirnem mestu.'}</p>
            </div>
            <div className="inline-flex min-h-[44px] items-center gap-2 rounded-2xl border border-[#ECE7F7] bg-white px-4 py-3 text-[13px] font-semibold text-[#665E82] shadow-sm"><span aria-hidden="true">🗓️</span><span className="first-letter:uppercase">{longToday()}</span></div>
          </header>

          {activeScreen === 'home' && <DashboardView mode="home" {...commonData} onNavigate={setActiveScreen} onToggleTask={id => setTasks(previous => previous.map(task => task.id === id ? { ...task, completed: !task.completed } : task))}/>}
          {activeScreen === 'statistics' && <DashboardView mode="statistics" {...commonData} onNavigate={setActiveScreen} onToggleTask={id => setTasks(previous => previous.map(task => task.id === id ? { ...task, completed: !task.completed } : task))}/>}
          {activeScreen === 'tasks' && <TasksView tasks={tasks} onSave={upsertTask} onDelete={id => setTasks(previous => previous.filter(task => task.id !== id))} onToggle={id => setTasks(previous => previous.map(task => task.id === id ? { ...task, completed: !task.completed } : task))}/>}
          {activeScreen === 'calendar' && <CalendarView events={events} onSave={upsertEvent} onDelete={id => setEvents(previous => previous.filter(event => event.id !== id))}/>}
          {activeScreen === 'goals' && <GoalsView goals={goals} onSave={upsertGoal} onDelete={id => setGoals(previous => previous.filter(goal => goal.id !== id))} onProgress={updateGoalProgress}/>}
          {activeScreen === 'settings' && <section className="mx-auto max-w-[720px] space-y-6">
            <div className="panel p-6 sm:p-8">
              <span className="mb-4 inline-flex size-12 items-center justify-center rounded-2xl bg-[#EEE9FF] text-2xl" aria-hidden="true">🔔</span>
              <h2 className="section-title">Nežni opomniki</h2>
              <p className="mt-2 mb-6 text-sm leading-relaxed subtle">Opomniki se prikažejo znotraj aplikacije, ko jo imaš odprto. Niso potisna obvestila in ne delujejo, ko je zavihek zaprt.</p>
              <label className="flex cursor-pointer items-center justify-between gap-4 rounded-2xl bg-[#FAF9FF] p-4">
                <span><strong className="block text-sm">Omogoči opomnike</strong><span className="mt-1 block text-xs subtle">Opozorila za dogodke in zamujene naloge</span></span>
                <input type="checkbox" className="size-6 accent-[#6D5CE7]" checked={settings.remindersEnabled} onChange={event => setSettings(previous => ({ ...previous, remindersEnabled: event.target.checked }))}/>
              </label>
              <div className="mt-6 max-w-[360px]"><label htmlFor="reminder-time" className="mb-2 block text-sm font-bold">Privzeti čas opomnika</label><select id="reminder-time" className="field" value={settings.defaultReminderMinutes} onChange={event => setSettings(previous => ({ ...previous, defaultReminderMinutes: Number(event.target.value) }))} disabled={!settings.remindersEnabled}>{[0, 5, 10, 15, 30, 60].map(min => <option key={min} value={min}>{min === 0 ? 'Ob začetku dogodka' : `${min} minut pred dogodkom`}</option>)}</select></div>
            </div>
            <div className="panel p-6 sm:p-8"><h2 className="section-title">Tvoji podatki</h2><p className="mt-2 mb-5 text-sm leading-relaxed subtle">Naloge, dogodki, cilji in nastavitve se samodejno shranjujejo samo v tem brskalniku. Ne prenašajo se na strežnik in se ne sinhronizirajo med napravami.</p><button className="btn-quiet" onClick={resetExamples}>↺ Ponastavi na vzorčne podatke</button></div>
            <p className="px-1 text-center text-sm text-[#8A83A0]">Narejeno z mislijo na mirnejše dni. 🌸</p>
          </section>}
        </main>
      </div>

      {alerts.length > 0 && <div className="fixed right-4 bottom-4 z-50 flex w-[min(340px,calc(100vw-32px))] flex-col gap-2" aria-live="polite" aria-atomic="false">
        {alerts.map(alert => <div key={alert.id} className="flex items-start gap-3 rounded-2xl border border-[#E3D9FF] bg-white p-4 shadow-md"><span className="flex-1 text-sm font-semibold leading-relaxed">{alert.message}</span><button aria-label="Zapri opomnik" onClick={() => setAlerts(prev => prev.filter(item => item.id !== alert.id))} className="flex size-8 shrink-0 items-center justify-center rounded-xl text-[#746A92] hover:bg-[#F0ECFF]">✕</button></div>)}
      </div>}
    </div>
  );
}
