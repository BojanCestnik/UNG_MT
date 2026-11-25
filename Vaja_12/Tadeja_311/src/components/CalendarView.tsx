import { useState, type FormEvent } from 'react';
import { CATEGORIES, categoryStyle, dateLabel, localDate, newId, parseDate, shiftDate, shiftMonth, startOfWeek } from '../lib';
import type { CalendarEvent, Category } from '../types';

type CalendarMode = 'day' | 'week' | 'month';
interface Props {
  events: CalendarEvent[];
  onSave: (event: CalendarEvent) => void;
  onDelete: (id: string) => void;
}
function blankEvent(date: string): CalendarEvent {
  return { id: '', title: '', date, time: '12:00', category: 'Osebno', reminderMinutesBefore: null };
}

export default function CalendarView({ events, onSave, onDelete }: Props) {
  const [mode, setMode] = useState<CalendarMode>('month');
  const [cursor, setCursor] = useState(localDate);
  const [selectedDate, setSelectedDate] = useState(localDate);
  const [showAllMonth, setShowAllMonth] = useState(false);
  const [draft, setDraft] = useState<CalendarEvent | null>(null);
  const firstOfMonth = `${cursor.slice(0, 7)}-01`;
  const gridStart = startOfWeek(firstOfMonth);
  const weekStart = startOfWeek(cursor);
  const weekEnd = shiftDate(weekStart, 6);
  const monthDays = Array.from({ length: 42 }, (_, i) => shiftDate(gridStart, i));
  const weekDays = Array.from({ length: 7 }, (_, i) => shiftDate(weekStart, i));
  const weekdays = ['Pon', 'Tor', 'Sre', 'Čet', 'Pet', 'Sob', 'Ned'];
  const sortedEvents = [...events].sort((a, b) => `${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`));
  const shownEvents = sortedEvents.filter(event => mode === 'day' ? event.date === selectedDate : mode === 'week' ? event.date >= weekStart && event.date <= weekEnd : showAllMonth ? event.date.startsWith(cursor.slice(0, 7)) : event.date === selectedDate);
  const modeTitle = mode === 'month' ? dateLabel(firstOfMonth, { month: 'long', year: 'numeric' }) : mode === 'week' ? `${dateLabel(weekStart, { day: 'numeric', month: 'short' })} – ${dateLabel(weekEnd, { day: 'numeric', month: 'short', year: 'numeric' })}` : dateLabel(selectedDate, { weekday: 'long', day: 'numeric', month: 'long' });

  function jump(delta: number) {
    const next = mode === 'month' ? shiftMonth(cursor, delta) : shiftDate(cursor, mode === 'week' ? delta * 7 : delta);
    setCursor(next); setSelectedDate(next); setShowAllMonth(false);
  }
  function choose(date: string) {
    setSelectedDate(date); setCursor(date); setShowAllMonth(false);
  }
  function selectMode(next: CalendarMode) {
    setMode(next); setCursor(selectedDate); setShowAllMonth(false);
  }
  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!draft || !draft.title.trim()) return;
    onSave({ ...draft, id: draft.id || newId(), title: draft.title.trim() });
    setSelectedDate(draft.date); setCursor(draft.date); setDraft(null);
  }
  function remove(item: CalendarEvent) {
    if (!window.confirm(`Ali želiš izbrisati dogodek »${item.title}«?`)) return;
    onDelete(item.id);
    if (draft?.id === item.id) setDraft(null);
  }
  function countEvents(date: string): CalendarEvent[] {
    return sortedEvents.filter(event => event.date === date);
  }
  return <div className="space-y-5">
    <section className="flex flex-wrap items-center justify-between gap-4 rounded-3xl bg-[#EAF4FF] px-6 py-5"><div><strong className="block text-lg font-extrabold text-[#416A8A]">Tvoj čas, tvoji lepi trenutki 🗓️</strong><p className="mt-1 text-sm text-[#6E8BA3]">Vsi dogodki na enem mestu, brez hitenja.</p></div><button className="btn-primary" onClick={() => setDraft(blankEvent(selectedDate))}>＋ Nov dogodek</button></section>
    <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
      <section className="panel min-w-0 p-4 sm:p-6"><div className="flex flex-wrap items-center justify-between gap-4"><h2 className="section-title">Koledar</h2><div role="group" aria-label="Pogled koledarja" className="flex rounded-xl bg-[#F5F2FE] p-1">{([['day', 'Dan'], ['week', 'Teden'], ['month', 'Mesec']] as const).map(([key, label]) => <button key={key} onClick={() => selectMode(key)} aria-pressed={mode === key} className={`min-h-10 rounded-lg px-3 text-xs font-bold transition-colors ${mode === key ? 'bg-white text-[#6D5CE7] shadow-sm' : 'text-[#7F7697] hover:text-[#6D5CE7]'}`}>{label}</button>)}</div></div>
        <div className="mt-7 mb-5 flex flex-wrap items-center justify-between gap-2"><h3 className="min-w-0 text-base font-extrabold capitalize sm:text-lg">{modeTitle}</h3><div className="flex items-center gap-1"><button onClick={() => jump(-1)} aria-label="Prejšnje obdobje" className="btn-quiet !min-h-10 !px-3">‹</button><button onClick={() => {const today=localDate();setSelectedDate(today);setCursor(today);setShowAllMonth(false);}} className="btn-quiet !min-h-10 !px-3 !text-xs">Danes</button><button onClick={() => jump(1)} aria-label="Naslednje obdobje" className="btn-quiet !min-h-10 !px-3">›</button></div></div>
        {mode === 'month' && <div><div className="grid grid-cols-7 gap-1.5 sm:gap-2">{weekdays.map(day => <div key={day} className="pb-2 text-center text-[11px] font-bold text-[#8C85A0] sm:text-xs">{day}</div>)}</div><div className="grid grid-cols-7 gap-1 sm:gap-1.5">{monthDays.map(date => {
          const dayEvents = countEvents(date);
          return <button key={date} onClick={() => choose(date)} aria-label={`${dateLabel(date)}, ${dayEvents.length} dogodkov`} aria-pressed={date === selectedDate} className={`calendar-day min-w-0 rounded-xl ${date === selectedDate ? 'selected' : ''} ${date.slice(0, 7) !== cursor.slice(0, 7) ? 'outside' : ''}`}><span className={`flex size-6 items-center justify-center rounded-full text-xs font-bold tabular-nums sm:size-7 ${date === localDate() ? 'bg-[#6D5CE7] text-white' : ''}`}>{parseDate(date).getDate()}</span><span className="flex max-w-full flex-wrap gap-1">{dayEvents.slice(0, 3).map(event => <span key={event.id} className={`size-1.5 rounded-full sm:size-2 ${categoryStyle(event.category).dot}`} title={event.title}/>)}{dayEvents.length > 3 && <span className="text-[9px] text-[#897BBA]">+{dayEvents.length - 3}</span>}</span></button>;
        })}</div><div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-[11px] text-[#77718D]">{CATEGORIES.map(category => <span key={category} className="inline-flex items-center gap-1.5"><span className={`size-2 rounded-full ${categoryStyle(category).dot}`}/>{category}</span>)}</div></div>}
        {mode === 'week' && <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7 xl:grid-cols-4 2xl:grid-cols-7">{weekDays.map((date, i) => <button key={date} onClick={() => choose(date)} className={`min-h-[134px] rounded-2xl border p-3 text-left ${date === selectedDate ? 'border-[#A899FB] bg-[#F0EDFF]' : 'border-[#EEEAF7] bg-[#FCFBFF] hover:bg-[#F6F3FF]'}`}><span className="block text-[11px] font-bold text-[#8B83A2]">{weekdays[i]}</span><strong className={`mt-1 block text-2xl font-extrabold tabular-nums ${date === localDate() ? 'text-[#6D5CE7]' : ''}`}>{parseDate(date).getDate()}</strong><div className="mt-3 space-y-1">{countEvents(date).slice(0, 2).map(item => <span key={item.id} className="block truncate text-[11px] font-semibold text-[#63598B]">• {item.title}</span>)}{countEvents(date).length === 0 && <span className="text-[11px] subtle">Prosto</span>}</div></button>)}</div>}
        {mode === 'day' && <div className="space-y-2 rounded-2xl bg-[#FCFBFF] p-3 sm:p-4"><div className="mb-3 text-sm font-bold text-[#79708F]">{dateLabel(selectedDate, { weekday: 'long', day: 'numeric', month: 'long' })}</div>{countEvents(selectedDate).length === 0 && <div className="py-9 text-center text-sm subtle">Danes ni načrtovanih dogodkov. 🌼</div>}{countEvents(selectedDate).map(item => <button key={item.id} onClick={() => setDraft({ ...item })} className="flex min-h-14 w-full items-center gap-3 rounded-2xl border border-[#EEEAF7] bg-white p-3 text-left hover:bg-[#F5F2FF]"><strong className="w-12 shrink-0 text-xs tabular-nums">{item.time}</strong><span className={`h-8 w-1 rounded-full ${categoryStyle(item.category).dot}`}/><span className="min-w-0 flex-1 truncate text-sm font-bold">{item.title}</span></button>)}</div>}
      </section>
      <aside className="panel p-5 sm:p-6"><h2 className="section-title">{mode === 'week' ? 'Dogodki v tednu' : mode === 'month' ? showAllMonth ? 'Dogodki v mesecu' : 'Dogodki izbranega dne' : 'Dogodki dneva'}</h2><p className="mt-1 text-xs subtle">{mode === 'week' ? `${dateLabel(weekStart, { day: 'numeric', month: 'short' })} – ${dateLabel(weekEnd, { day: 'numeric', month: 'short' })}` : mode === 'month' && showAllMonth ? modeTitle : dateLabel(selectedDate)}</p>
        {mode === 'month' && <button onClick={() => setShowAllMonth(prev => !prev)} className="mt-3 min-h-[40px] text-sm font-bold text-[#6D5CE7] hover:underline">{showAllMonth ? 'Pokaži izbrani dan' : 'Pokaži ves mesec'} →</button>}
        {shownEvents.length === 0 ? <div className="mt-6 rounded-2xl bg-[#FAF9FF] p-6 text-center"><span className="text-3xl" aria-hidden="true">🌿</span><p className="mt-3 text-sm font-semibold">Ni dogodkov.</p><p className="mt-1 text-xs subtle">Lahko dodaš svojega prvega!</p></div> : <div className="mt-5 space-y-4">{shownEvents.map(event => <article key={event.id} className="rounded-2xl border border-[#F0EDF8] p-3.5"><div className="flex items-start gap-3"><span className={`mt-1 h-10 w-1 shrink-0 rounded-full ${categoryStyle(event.category).dot}`}/><div className="min-w-0 flex-1"><strong className="block text-sm leading-snug break-words">{event.title}</strong><p className="mt-1.5 text-xs text-[#89829D] tabular-nums">{dateLabel(event.date, { day: 'numeric', month: 'short' })} · {event.time}</p><span className={`tag mt-2 ${categoryStyle(event.category).badge}`}>{event.category}</span></div></div><div className="mt-2 flex justify-end gap-1"><button onClick={() => setDraft({ ...event })} className="min-h-10 rounded-lg px-3 text-xs font-bold text-[#6D5CE7] hover:bg-[#F3F0FF]">Uredi</button><button onClick={() => remove(event)} className="min-h-10 rounded-lg px-3 text-xs font-bold text-[#AD5F72] hover:bg-[#FFF0F4]">Izbriši</button></div></article>)}</div>}
        <button onClick={() => setDraft(blankEvent(selectedDate))} className="btn-quiet mt-5 w-full">＋ Dodaj dogodek</button>
      </aside>
    </div>

    {draft && <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#242038]/45 p-4" role="presentation" onMouseDown={event => { if (event.target === event.currentTarget) setDraft(null); }}><div className="panel my-auto w-full max-w-[480px] overflow-y-auto p-5 shadow-md sm:p-7" role="dialog" aria-modal="true" aria-labelledby="event-heading"><div className="mb-5 flex items-start justify-between"><div><span className="text-2xl" aria-hidden="true">🌷</span><h2 id="event-heading" className="section-title mt-2">{draft.id ? 'Uredi dogodek' : 'Nov dogodek'}</h2></div><button className="btn-quiet !min-h-10 !px-3" onClick={() => setDraft(null)} aria-label="Zapri obrazec">✕</button></div>
      <form onSubmit={save} className="space-y-4"><div><label htmlFor="event-title" className="mb-1.5 block text-sm font-bold">Naslov dogodka *</label><input autoFocus id="event-title" className="field" maxLength={100} required value={draft.title} onChange={event => setDraft(previous => previous ? { ...previous, title: event.target.value } : null)} placeholder="Npr. Kosilo s prijatelji"/></div><div className="grid grid-cols-2 gap-3"><div><label htmlFor="event-date" className="mb-1.5 block text-sm font-bold">Datum *</label><input id="event-date" className="field !px-2" required type="date" value={draft.date} onChange={event => setDraft(previous => previous ? { ...previous, date: event.target.value } : null)}/></div><div><label htmlFor="event-time" className="mb-1.5 block text-sm font-bold">Ura *</label><input id="event-time" className="field !px-2" required type="time" value={draft.time} onChange={event => setDraft(previous => previous ? { ...previous, time: event.target.value } : null)}/></div></div><div><label htmlFor="event-category" className="mb-1.5 block text-sm font-bold">Kategorija</label><select id="event-category" className="field" value={draft.category} onChange={event => setDraft(previous => previous ? { ...previous, category: event.target.value as Category } : null)}>{CATEGORIES.map(category => <option key={category}>{category}</option>)}</select></div><div><label htmlFor="event-reminder" className="mb-1.5 block text-sm font-bold">Opomnik</label><select id="event-reminder" className="field" value={draft.reminderMinutesBefore ?? -1} onChange={event => setDraft(previous => previous ? { ...previous, reminderMinutesBefore: Number(event.target.value) === -1 ? null : Number(event.target.value) } : null)}><option value={-1}>Uporabi privzeto nastavitev</option><option value={0}>Ob začetku dogodka</option>{[5, 10, 15, 30, 60].map(value => <option key={value} value={value}>{value} minut prej</option>)}</select></div><div className="flex gap-2 pt-1"><button className="btn-primary flex-1" type="submit">{draft.id ? 'Shrani spremembe' : 'Dodaj dogodek'}</button><button type="button" className="btn-quiet" onClick={() => setDraft(null)}>Prekliči</button></div></form>
    </div></div>}
  </div>;
}
