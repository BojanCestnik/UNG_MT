import { categoryStyle, dateLabel, dateTime, goalPercentage, localDate, percentage, shiftDate, startOfWeek } from '../lib';
import type { CalendarEvent, Goal, Screen, Task } from '../types';

interface Props {
  mode: 'home' | 'statistics';
  tasks: Task[];
  events: CalendarEvent[];
  goals: Goal[];
  onNavigate: (screen: Screen) => void;
  onToggleTask: (id: string) => void;
}

export default function DashboardView({ mode, tasks, events, goals, onNavigate, onToggleTask }: Props) {
  const today = localDate();
  const todayTasks = tasks.filter(task => task.date === today).sort((a, b) => a.time.localeCompare(b.time));
  const completedToday = todayTasks.filter(task => task.completed).length;
  const dailyProgress = percentage(completedToday, todayTasks.length);
  const completeAll = tasks.filter(task => task.completed).length;
  const completedGoals = goals.filter(goal => goal.completed).length;
  const upcoming = events.filter(event => dateTime(event.date, event.time) >= Date.now()).sort((a, b) => dateTime(a.date, a.time) - dateTime(b.date, b.time));
  const averageGoalProgress = goals.length ? Math.round(goals.reduce((sum, goal) => sum + goalPercentage(goal), 0) / goals.length) : 0;
  const weekStart = startOfWeek(today);
  const days = Array.from({ length: 7 }, (_, i) => shiftDate(weekStart, i));
  const weeklyFinished = tasks.filter(task => days.includes(task.date) && task.completed).length;
  const weeklyTotal = tasks.filter(task => days.includes(task.date)).length;

  if (mode === 'statistics') {
    const topDay = Math.max(1, ...days.map(date => tasks.filter(task => task.date === date).length));
    const categories = ['Študij', 'Delo', 'Osebno', 'Zdravje', 'Drugo'] as const;
    return <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {[
          { number: String(completeAll), label: 'Opravljenih nalog', icon: '✓', background: '#EAF5FF' },
          { number: String(tasks.length - completeAll), label: 'Neopravljenih nalog', icon: '☷', background: '#F1ECFF' },
          { number: `${percentage(weeklyFinished, weeklyTotal)} %`, label: 'Tedenska uspešnost', icon: '↗', background: '#E8F7EE' },
          { number: `${completedGoals}/${goals.length}`, label: 'Doseženih ciljev', icon: '◎', background: '#FFF0F5' }
        ].map(item => <article key={item.label} className="panel p-4 sm:p-5"><span className="mb-4 flex size-10 items-center justify-center rounded-2xl text-xl" style={{ background: item.background }} aria-hidden="true">{item.icon}</span><strong className="block text-[29px] font-extrabold tracking-[-.06em] tabular-nums">{item.number}</strong><span className="mt-1 block text-xs font-medium subtle sm:text-sm">{item.label}</span></article>)}
      </div>
      <div className="grid gap-5 lg:grid-cols-[1.35fr_1fr]">
        <section className="panel p-5 sm:p-7">
          <h2 className="section-title">Tvoj teden v številkah</h2><p className="mt-1 text-sm subtle">Število nalog po dnevih in koliko si jih opravila/-l.</p>
          <div className="mt-8 grid h-[210px] grid-cols-7 items-end gap-2 sm:gap-4" role="img" aria-label="Graf nalog v tekočem tednu">
            {days.map(date => {
              const dayTasks = tasks.filter(task => task.date === date);
              const completed = dayTasks.filter(task => task.completed).length;
              const height = dayTasks.length / topDay * 155;
              return <div key={date} className="flex h-full min-w-0 flex-col items-center justify-end gap-2" title={`${dateLabel(date)}: ${completed} od ${dayTasks.length} opravljenih`}>
                <span className="text-[11px] font-semibold text-[#756F8D] tabular-nums">{completed}/{dayTasks.length}</span>
                <div className="flex w-full max-w-[39px] flex-col justify-end overflow-hidden rounded-t-xl bg-[#EEEAFB]" style={{ height: Math.max(height, dayTasks.length ? 12 : 4) }}><div className="bg-[#8B7BEA]" style={{ height: `${percentage(completed, dayTasks.length)}%` }}/></div>
                <span className={`text-xs font-bold ${date === today ? 'text-[#6D5CE7]' : 'text-[#868098]'}`}>{dateLabel(date, { weekday: 'short' }).replace('.', '')}</span>
              </div>;
            })}
          </div>
          <p className="mt-4 text-xs subtle">Vijolična prikazuje dokončan delež nalog posameznega dne.</p>
        </section>
        <section className="panel p-5 sm:p-7"><h2 className="section-title">Napredek pri ciljih</h2><p className="mt-1 text-sm subtle">Vsak majhen korak šteje.</p>
          <div className="mt-8 flex items-center gap-5"><div className="flex size-28 shrink-0 items-center justify-center rounded-full" style={{ background: `conic-gradient(#6D5CE7 ${averageGoalProgress}%, #EEEAFB ${averageGoalProgress}% 100%)` }}><div className="flex size-[88px] flex-col items-center justify-center rounded-full bg-white"><strong className="text-[27px] font-extrabold tabular-nums">{averageGoalProgress}%</strong><span className="text-[10px] subtle">povprečje</span></div></div><div><strong className="text-[22px] font-extrabold tabular-nums">{completedGoals} od {goals.length}</strong><p className="mt-1 text-sm subtle">ciljev je doseženih</p><button onClick={() => onNavigate('goals')} className="mt-3 text-sm font-bold text-[#6D5CE7] hover:underline">Poglej cilje →</button></div></div>
          <div className="mt-7 space-y-4">{goals.slice(0, 3).map(goal => <div key={goal.id}><div className="mb-1.5 flex justify-between gap-3 text-xs"><span className="font-semibold">{goal.title}</span><span className="tabular-nums subtle">{goalPercentage(goal)}%</span></div><div className="progress-track"><div className="progress-fill" style={{ width: `${goalPercentage(goal)}%` }}/></div></div>)}{goals.length === 0 && <p className="text-sm subtle">Ko dodaš prvi cilj, se bo napredek prikazal tukaj.</p>}</div>
        </section>
      </div>
      <section className="panel p-5 sm:p-7"><h2 className="section-title">Naloge po kategorijah</h2><div className="mt-5 grid gap-4 md:grid-cols-2">{categories.map(category => { const count = tasks.filter(task => task.category === category).length; const done = tasks.filter(task => task.category === category && task.completed).length; return <div key={category}><div className="mb-2 flex items-center justify-between gap-3 text-sm"><span className="flex items-center gap-2 font-semibold"><span className={`size-2.5 rounded-full ${categoryStyle(category).dot}`}/>{category}</span><span className="text-xs subtle tabular-nums">{done}/{count}</span></div><div className="progress-track"><div className="progress-fill" style={{ width: `${percentage(done, count)}%` }}/></div></div>; })}</div></section>
    </div>;
  }

  return <div className="space-y-6">
    <section className="relative overflow-hidden rounded-3xl bg-[#EAE5FF] px-6 py-7 sm:px-9 sm:py-9">
      <div className="absolute -top-12 -right-8 size-44 rounded-full bg-white/25" aria-hidden="true"/><div className="absolute top-20 -right-14 size-36 rounded-full border-[18px] border-white/20" aria-hidden="true"/>
      <div className="relative max-w-[540px]"><p className="mb-2 text-xs font-extrabold tracking-[.12em] text-[#7C70B5] uppercase">Tvoj prostor za ravnovesje</p><h2 className="text-[25px] leading-tight font-extrabold tracking-[-.055em] text-[#41346F] sm:text-[31px]">Počasi, z občutkom. Danes zmoreš veliko. 🌷</h2><p className="mt-3 text-sm leading-relaxed text-[#756C95]">Ni treba narediti vsega naenkrat. Začni z eno stvarjo in najdi svoj ritem.</p><button onClick={() => onNavigate('tasks')} className="btn-primary mt-5">Oglej si naloge <span aria-hidden="true">↗</span></button></div>
    </section>

    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
      {[
        { value: String(todayTasks.length), title: 'Današnje naloge', icon: '☷', color: '#E7F3FF' },
        { value: String(completedToday), title: 'Že opravljene', icon: '✓', color: '#E7F5ED' },
        { value: String(upcoming.length), title: 'Prihodnji dogodki', icon: '▦', color: '#EEE8FF' },
        { value: `${completedGoals}/${goals.length}`, title: 'Doseženi cilji', icon: '◎', color: '#FFF0F5' }
      ].map(item => <article key={item.title} className="panel p-4 sm:p-5"><span className="mb-3 flex size-10 items-center justify-center rounded-2xl text-xl" style={{ backgroundColor: item.color }} aria-hidden="true">{item.icon}</span><strong className="block text-[28px] font-extrabold tracking-[-.055em] tabular-nums">{item.value}</strong><span className="mt-1 block text-[12px] font-medium subtle sm:text-[13px]">{item.title}</span></article>)}
    </div>

    <div className="grid items-start gap-5 lg:grid-cols-[1.3fr_1fr]">
      <div className="space-y-5"><section className="panel p-5 sm:p-7"><div className="mb-5 flex items-center justify-between gap-3"><div><h2 className="section-title">Današnje naloge</h2><p className="mt-1 text-xs subtle">Majhni koraki, velik občutek zadovoljstva.</p></div><button onClick={() => onNavigate('tasks')} className="text-sm font-bold whitespace-nowrap text-[#6D5CE7] hover:underline">Vse naloge →</button></div>
        {todayTasks.length === 0 ? <div className="rounded-2xl bg-[#F8F7FF] px-4 py-9 text-center"><span className="text-3xl">🌼</span><p className="mt-2 text-sm font-semibold">Danes imaš prost dan!</p><button onClick={() => onNavigate('tasks')} className="mt-3 text-sm font-bold text-[#6D5CE7] hover:underline">Dodaj prvo nalogo</button></div> : <div className="space-y-2.5">{todayTasks.slice(0, 5).map(task => <div key={task.id} className="flex items-center gap-3 rounded-2xl border border-[#F0EDF7] p-3.5"><label className="flex min-w-0 flex-1 cursor-pointer items-center gap-3"><input type="checkbox" className="size-5 shrink-0 accent-[#6D5CE7]" checked={task.completed} onChange={() => onToggleTask(task.id)} aria-label={`Označi nalogo ${task.title}`}/><span className={`min-w-0 flex-1 text-sm font-semibold ${task.completed ? 'text-[#9A96AB] line-through' : ''}`}>{task.title}</span></label><span className="hidden text-xs text-[#89839D] tabular-nums sm:block">{task.time}</span><span className={`tag ${categoryStyle(task.category).badge}`}>{task.category}</span></div>)}</div>}
      </section>
      <section className="panel p-5 sm:p-7"><div className="mb-4 flex items-center justify-between"><h2 className="section-title">Tvoji cilji</h2><button onClick={() => onNavigate('goals')} className="text-sm font-bold text-[#6D5CE7] hover:underline">Poglej vse →</button></div>{goals.length === 0 ? <p className="text-sm subtle">Ustvari cilj in spremljaj svoj napredek.</p> : <div className="space-y-4">{goals.slice(0, 3).map(goal => <div key={goal.id}><div className="mb-2 flex justify-between gap-4 text-sm"><span className="font-semibold">{goal.title}</span><span className="font-bold text-[#6D5CE7] tabular-nums">{goalPercentage(goal)}%</span></div><div className="progress-track"><div className="progress-fill" style={{ width: `${goalPercentage(goal)}%` }}/></div></div>)}</div>}</section>
      </div>
      <div className="space-y-5"><section className="panel p-5 sm:p-7"><div className="mb-4 flex items-center justify-between"><h2 className="section-title">Današnji napredek</h2><span aria-hidden="true">✨</span></div><div className="flex items-center gap-5"><div className="flex size-28 shrink-0 items-center justify-center rounded-full" style={{ background: `conic-gradient(#6D5CE7 ${dailyProgress}%, #EEEAFB ${dailyProgress}% 100%)` }}><div className="flex size-[88px] flex-col items-center justify-center rounded-full bg-white"><strong className="text-[27px] font-extrabold tabular-nums">{dailyProgress}%</strong><span className="text-[10px] subtle">opravljeno</span></div></div><div><strong className="text-base">Odlično ti gre!</strong><p className="mt-1 text-sm leading-relaxed subtle">{completedToday} od {todayTasks.length} današnjih nalog je že opravljenih.</p></div></div></section>
        <section className="panel p-5 sm:p-7"><div className="mb-5 flex items-center justify-between gap-2"><h2 className="section-title">Prihajajoči dogodki</h2><button onClick={() => onNavigate('calendar')} className="text-sm font-bold whitespace-nowrap text-[#6D5CE7] hover:underline">Koledar →</button></div>
          {upcoming.length === 0 ? <p className="rounded-2xl bg-[#FAF9FF] p-4 text-sm subtle">Za zdaj nimaš načrtovanih dogodkov.</p> : <div className="space-y-4">{upcoming.slice(0, 4).map(event => <div key={event.id} className="flex items-center gap-3"><div className={`h-12 w-1 rounded-full ${categoryStyle(event.category).dot}`} aria-hidden="true"/><div className="min-w-0 flex-1"><strong className="block truncate text-sm">{event.title}</strong><span className="mt-0.5 block text-xs subtle">{dateLabel(event.date, { day: 'numeric', month: 'short' })} · {event.time}</span></div><span className={`tag ${categoryStyle(event.category).badge}`}>{event.category}</span></div>)}</div>}
        </section>
        <div className="rounded-3xl bg-[#EAF4FF] p-5 sm:p-6"><span className="text-2xl" aria-hidden="true">💌</span><p className="mt-2 text-sm font-bold text-[#4A6A88]">Misel za lepši dan</p><p className="mt-1 text-sm leading-relaxed text-[#64829A]">Napredek ni vedno hiter. Pomembno je, da greš v svojo smer.</p></div>
      </div>
    </div>
  </div>;
}
