import { useState, type FormEvent } from 'react';
import { CATEGORIES, categoryStyle, dateLabel, isOverdue, localDate, newId } from '../lib';
import type { Category, Task } from '../types';

type TaskFilter = 'all' | 'today' | 'upcoming' | 'done' | 'overdue';
interface Props {
  tasks: Task[];
  onSave: (task: Task) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
}
function blankTask(): Task {
  return { id: '', title: '', description: '', date: localDate(), time: '12:00', category: 'Osebno', important: false, completed: false };
}

export default function TasksView({ tasks, onSave, onDelete, onToggle }: Props) {
  const [filter, setFilter] = useState<TaskFilter>('all');
  const [category, setCategory] = useState<Category | 'all'>('all');
  const [formOpen, setFormOpen] = useState(false);
  const [draft, setDraft] = useState<Task>(blankTask);
  const today = localDate();
  const done = tasks.filter(task => task.completed).length;
  const filtered = tasks.filter(task => {
    if (category !== 'all' && task.category !== category) return false;
    switch (filter) {
      case 'today': return task.date === today;
      case 'upcoming': return !task.completed && task.date >= today;
      case 'done': return task.completed;
      case 'overdue': return isOverdue(task);
      default: return true;
    }
  }).sort((a, b) => a.completed === b.completed ? `${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`) : Number(a.completed) - Number(b.completed));

  function openForm(task?: Task) {
    setDraft(task ? { ...task } : blankTask());
    setFormOpen(true);
  }
  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!draft.title.trim()) return;
    onSave({ ...draft, id: draft.id || newId(), title: draft.title.trim(), description: draft.description.trim() });
    setFormOpen(false);
    setDraft(blankTask());
  }
  function remove(task: Task) {
    if (!window.confirm(`Ali želiš izbrisati nalogo »${task.title}«?`)) return;
    onDelete(task.id);
    if (draft.id === task.id) setFormOpen(false);
  }

  return <div className="space-y-5">
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl bg-[#EAE5FF] px-6 py-5"><div><strong className="block text-lg font-extrabold text-[#473F78]">Vsaka kljukica je majhna zmaga! ✨</strong><p className="mt-1 text-sm text-[#736A95]">Opravljenih imaš {done} od {tasks.length} nalog.</p></div><button className="btn-primary" onClick={() => openForm()}>＋ Dodaj nalogo</button></div>
    <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_350px]">
      <section className="panel min-w-0 p-4 sm:p-6"><div className="mb-5 flex flex-wrap items-center justify-between gap-3"><div><h2 className="section-title">Seznam nalog</h2><p className="mt-1 text-xs subtle">{filtered.length} {filtered.length === 1 ? 'prikazana naloga' : 'prikazanih nalog'}</p></div><select aria-label="Filtriraj po kategoriji" className="field !w-auto !min-w-[145px] !text-sm" value={category} onChange={event => setCategory(event.target.value as Category | 'all')}><option value="all">Vse kategorije</option>{CATEGORIES.map(value => <option key={value} value={value}>{value}</option>)}</select></div>
        <div className="mb-5 flex flex-wrap gap-2" role="group" aria-label="Filtriraj naloge">{([['all', 'Vse'], ['today', 'Danes'], ['upcoming', 'Prihajajoče'], ['done', 'Opravljene'], ['overdue', 'Zamujene']] as const).map(([key, label]) => <button key={key} onClick={() => setFilter(key)} aria-pressed={filter === key} className={`min-h-[42px] rounded-xl px-3 text-[13px] font-bold transition-colors ${filter === key ? 'bg-[#6D5CE7] text-white' : 'bg-[#F6F3FF] text-[#746B92] hover:bg-[#EAE5FF]'}`}>{label}</button>)}</div>
        {filtered.length === 0 ? <div className="rounded-2xl bg-[#FAF9FF] py-12 text-center"><div className="text-4xl" aria-hidden="true">🌼</div><h3 className="mt-3 font-bold">Tukaj je za zdaj prazno</h3><p className="mt-1 px-4 text-sm subtle">Dodaj novo nalogo ali izberi drug filter.</p><button className="mt-4 text-sm font-bold text-[#6D5CE7] hover:underline" onClick={() => openForm()}>Ustvari nalogo →</button></div> : <div className="space-y-3">{filtered.map(task => <article key={task.id} className={`rounded-2xl border p-4 transition-colors ${isOverdue(task) ? 'border-[#F4C3CC] bg-[#FFFAFB]' : task.completed ? 'border-[#F0EDF7] bg-[#FCFBFF]' : 'border-[#EEEAF7] bg-white'}`}>
          <div className="flex items-start gap-3"><input type="checkbox" className="mt-0.5 size-5 shrink-0 accent-[#6D5CE7]" checked={task.completed} onChange={() => onToggle(task.id)} aria-label={`Označi: ${task.title}`}/><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-1.5"><h3 className={`text-sm font-extrabold break-words sm:text-base ${task.completed ? 'text-[#A19BAE] line-through' : ''}`}>{task.title}</h3>{task.important && <span title="Pomembna naloga" className="text-[14px]" aria-label="Pomembno">⭐</span>}</div>{task.description && <p className="mt-1.5 text-sm leading-relaxed break-words subtle">{task.description}</p>}<div className="mt-3 flex flex-wrap items-center gap-2"><span className={`tag ${categoryStyle(task.category).badge}`}>{task.category}</span><span className="text-xs font-medium text-[#89829D] tabular-nums">🗓 {dateLabel(task.date, { day: 'numeric', month: 'short' })} ob {task.time}</span>{isOverdue(task) && <span className="tag bg-[#FFE5EA] text-[#AD4259]">Zamujeno</span>}</div></div></div>
          <div className="mt-3 flex justify-end gap-2 border-t border-[#F0EDF7] pt-3"><button className="min-h-[42px] rounded-xl px-3 text-xs font-bold text-[#6D5CE7] hover:bg-[#F0ECFF]" onClick={() => openForm(task)}>✎ Uredi</button><button className="min-h-[42px] rounded-xl px-3 text-xs font-bold text-[#B45F70] hover:bg-[#FFF0F3]" onClick={() => remove(task)}>Izbriši</button></div>
        </article>)}</div>}
      </section>
      <aside className="panel p-5 sm:p-6 lg:sticky lg:top-6">{formOpen ? <><div className="mb-5 flex items-start justify-between gap-3"><div><span className="mb-2 inline-block text-2xl" aria-hidden="true">✏️</span><h2 className="section-title">{draft.id ? 'Uredi nalogo' : 'Nova naloga'}</h2></div><button className="btn-quiet !min-h-[40px] !px-3" onClick={() => setFormOpen(false)} aria-label="Zapri obrazec">✕</button></div>
        <form onSubmit={save} className="space-y-4"><div><label htmlFor="task-title" className="mb-1.5 block text-sm font-bold">Naslov naloge *</label><input id="task-title" className="field" required maxLength={100} value={draft.title} onChange={event => setDraft(previous => ({ ...previous, title: event.target.value }))} placeholder="Npr. Ponovi snov"/></div><div><label htmlFor="task-description" className="mb-1.5 block text-sm font-bold">Opis</label><textarea id="task-description" className="field min-h-[95px] resize-y" maxLength={500} value={draft.description} onChange={event => setDraft(previous => ({ ...previous, description: event.target.value }))} placeholder="Dodatne podrobnosti …"/></div><div className="grid grid-cols-2 gap-3"><div><label htmlFor="task-date" className="mb-1.5 block text-sm font-bold">Datum *</label><input id="task-date" className="field !px-2" type="date" required value={draft.date} onChange={event => setDraft(previous => ({ ...previous, date: event.target.value }))}/></div><div><label htmlFor="task-time" className="mb-1.5 block text-sm font-bold">Ura *</label><input id="task-time" className="field !px-2" type="time" required value={draft.time} onChange={event => setDraft(previous => ({ ...previous, time: event.target.value }))}/></div></div><div><label htmlFor="task-category" className="mb-1.5 block text-sm font-bold">Kategorija</label><select id="task-category" className="field" value={draft.category} onChange={event => setDraft(previous => ({ ...previous, category: event.target.value as Category }))}>{CATEGORIES.map(value => <option key={value}>{value}</option>)}</select></div><label className="flex min-h-11 cursor-pointer items-center gap-3 rounded-xl bg-[#F8F7FF] px-3 py-2"><input type="checkbox" className="size-5 accent-[#6D5CE7]" checked={draft.important} onChange={event => setDraft(previous => ({ ...previous, important: event.target.checked }))}/><span className="text-sm font-semibold">⭐ Pomembna naloga</span></label><div className="flex gap-2"><button type="submit" className="btn-primary flex-1">{draft.id ? 'Shrani spremembe' : 'Dodaj nalogo'}</button><button type="button" className="btn-quiet" onClick={() => setFormOpen(false)}>Prekliči</button></div></form>
      </> : <div className="text-center"><div className="mx-auto flex size-16 items-center justify-center rounded-3xl bg-[#EEE9FF] text-3xl" aria-hidden="true">📝</div><h2 className="mt-4 text-lg font-extrabold">Prostor za tvoje načrte</h2><p className="mt-2 text-sm leading-relaxed subtle">Zapiši, kar te čaka, in z veseljem odkljukaj opravljeno.</p><button onClick={() => openForm()} className="btn-primary mt-5 w-full">＋ Nova naloga</button></div>}</aside>
    </div>
  </div>;
}
