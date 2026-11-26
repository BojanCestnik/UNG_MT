import { useState, type FormEvent } from 'react';
import { dateLabel, goalPercentage, localDate, newId, PERIOD_LABELS, percentage, shiftDate } from '../lib';
import type { Goal, GoalPeriod } from '../types';

interface Props {
  goals: Goal[];
  onSave: (goal: Goal) => void;
  onDelete: (id: string) => void;
  onProgress: (id: string, progress: number) => void;
}
function blankGoal(): Goal {
  return { id: '', title: '', period: 'weekly', deadline: shiftDate(localDate(), 7), target: 5, progress: 0, completed: false };
}

export default function GoalsView({ goals, onSave, onDelete, onProgress }: Props) {
  const [filter, setFilter] = useState<GoalPeriod | 'all'>('all');
  const [draft, setDraft] = useState<Goal | null>(null);
  const done = goals.filter(goal => goal.completed).length;
  const visibleGoals = goals.filter(goal => filter === 'all' || goal.period === filter).sort((a, b) => Number(a.completed) - Number(b.completed) || a.deadline.localeCompare(b.deadline));
  const overall = percentage(done, goals.length);

  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!draft || !draft.title.trim()) return;
    const target = Math.max(1, Math.floor(draft.target));
    const progress = Math.min(target, Math.max(0, Math.floor(draft.progress)));
    onSave({ ...draft, id: draft.id || newId(), title: draft.title.trim(), target, progress, completed: progress === target });
    setDraft(null);
  }
  function remove(goal: Goal) {
    if (!window.confirm(`Ali želiš izbrisati cilj »${goal.title}«?`)) return;
    onDelete(goal.id);
    if (draft?.id === goal.id) setDraft(null);
  }

  return <div className="space-y-5"><section className="flex flex-wrap items-center justify-between gap-4 rounded-3xl bg-[#F1E9FF] px-6 py-6"><div><span className="mb-1 block text-sm font-semibold text-[#8D7AC0]">Sanjarjenje je dovoljeno ✨</span><strong className="block text-xl font-extrabold tracking-[-.035em] text-[#4B3F77] sm:text-2xl">Velike sanje se začnejo z majhnim korakom.</strong><p className="mt-2 text-sm text-[#756C95]">Postavi si cilj in nežno spremljaj svoj napredek.</p></div><button className="btn-primary" onClick={() => setDraft(blankGoal())}>＋ Nov cilj</button></section>
    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">{[
      { value: goals.length, title: 'Vseh ciljev', accent: '🌼' },
      { value: done, title: 'Doseženih ciljev', accent: '🎉' },
      { value: `${overall}%`, title: 'Zaključenih ciljev', accent: '⭐' }
    ].map(item => <article key={item.title} className="panel p-4 sm:p-5"><span className="mb-2 block text-xl">{item.accent}</span><strong className="block text-[27px] font-extrabold tabular-nums">{item.value}</strong><span className="text-xs subtle sm:text-sm">{item.title}</span></article>)}</div>
    <section className="panel p-4 sm:p-6"><div className="mb-5 flex flex-wrap items-center justify-between gap-4"><h2 className="section-title">Moji osebni cilji</h2><div role="group" aria-label="Filtriraj cilje" className="flex flex-wrap gap-1.5">{([['all', 'Vsi'], ['daily', 'Dnevni'], ['weekly', 'Tedenski'], ['monthly', 'Mesečni']] as const).map(([key, label]) => <button key={key} onClick={() => setFilter(key)} aria-pressed={filter === key} className={`min-h-10 rounded-xl px-3 text-xs font-bold ${filter === key ? 'bg-[#6D5CE7] text-white' : 'bg-[#F3F0FC] text-[#776E94] hover:bg-[#E9E3FF]'}`}>{label}</button>)}</div></div>
      {visibleGoals.length === 0 ? <div className="rounded-2xl bg-[#FAF9FF] p-12 text-center"><span className="text-4xl" aria-hidden="true">🌱</span><h3 className="mt-3 font-bold">Vsaka pot se nekje začne.</h3><p className="mt-1 text-sm subtle">Dodaj prvi cilj ali izberi drugo obdobje.</p><button onClick={() => setDraft(blankGoal())} className="btn-primary mt-4">＋ Ustvari cilj</button></div> : <div className="grid gap-4 md:grid-cols-2">{visibleGoals.map(goal => <article key={goal.id} className="rounded-3xl border border-[#EEEAF7] bg-[#FEFDFF] p-5"><div className="flex items-start justify-between gap-2"><div className="min-w-0"><span className="tag bg-[#EEE9FF] text-[#725EC6]">{PERIOD_LABELS[goal.period]} cilj</span><h3 className="mt-3 text-base font-extrabold break-words">{goal.title}</h3><p className="mt-1.5 text-xs subtle">Rok: {dateLabel(goal.deadline)}</p></div><span title={goal.completed ? 'Cilj dosežen' : 'Cilj v teku'} className="text-2xl" aria-label={goal.completed ? 'Doseženo' : 'V teku'}>{goal.completed ? '🏆' : '🌷'}</span></div>
        <div className="mt-6 flex items-end justify-between gap-3"><span className="text-sm font-medium text-[#7C7690]">Napredek: <strong className="font-extrabold text-[#413776] tabular-nums">{goal.progress}/{goal.target}</strong></span><strong className="text-[20px] font-extrabold text-[#6D5CE7] tabular-nums">{goalPercentage(goal)}%</strong></div><div className="progress-track mt-2"><div className="progress-fill" style={{ width: `${goalPercentage(goal)}%` }}/></div>
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3"><div className="flex items-center gap-2"><button onClick={() => onProgress(goal.id, goal.progress - 1)} disabled={goal.progress === 0} aria-label={`Zmanjšaj napredek za ${goal.title}`} className="btn-quiet !min-h-[42px] !px-4">−</button><button onClick={() => onProgress(goal.id, goal.progress + 1)} disabled={goal.progress >= goal.target} aria-label={`Povečaj napredek za ${goal.title}`} className="btn-quiet !min-h-[42px] !px-4">＋</button></div><button onClick={() => onProgress(goal.id, goal.completed ? Math.max(0, goal.target - 1) : goal.target)} className={`min-h-[42px] rounded-xl px-3 text-xs font-extrabold ${goal.completed ? 'bg-[#E8F7EE] text-[#427E62]' : 'bg-[#EEE9FF] text-[#6652BC]'}`}>{goal.completed ? '✓ Doseženo' : '✓ Označi kot doseženo'}</button></div>
        <div className="mt-4 flex justify-end gap-2 border-t border-[#F0EDF7] pt-3"><button onClick={() => setDraft({ ...goal })} className="min-h-[40px] rounded-xl px-3 text-xs font-bold text-[#6D5CE7] hover:bg-[#F0ECFF]">✎ Uredi</button><button onClick={() => remove(goal)} className="min-h-[40px] rounded-xl px-3 text-xs font-bold text-[#AD6272] hover:bg-[#FFF0F4]">Izbriši</button></div>
      </article>)}</div>}
    </section>

    {draft && <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#242038]/45 p-4" role="presentation" onMouseDown={event => { if (event.target === event.currentTarget) setDraft(null); }}><div className="panel my-auto w-full max-w-[480px] overflow-y-auto p-5 shadow-md sm:p-7" role="dialog" aria-modal="true" aria-labelledby="goal-heading"><div className="mb-5 flex items-start justify-between gap-3"><div><span className="text-2xl" aria-hidden="true">🎯</span><h2 id="goal-heading" className="section-title mt-2">{draft.id ? 'Uredi cilj' : 'Nov osebni cilj'}</h2></div><button onClick={() => setDraft(null)} className="btn-quiet !min-h-10 !px-3" aria-label="Zapri obrazec">✕</button></div>
      <form onSubmit={save} className="space-y-4"><div><label htmlFor="goal-title" className="mb-1.5 block text-sm font-bold">Moj cilj *</label><input autoFocus id="goal-title" className="field" required maxLength={100} value={draft.title} onChange={event => setDraft(previous => previous ? { ...previous, title: event.target.value } : null)} placeholder="Npr. Preberi 3 knjige"/></div><div><label htmlFor="goal-period" className="mb-1.5 block text-sm font-bold">Obdobje</label><select id="goal-period" className="field" value={draft.period} onChange={event => setDraft(previous => previous ? { ...previous, period: event.target.value as GoalPeriod } : null)}>{(['daily', 'weekly', 'monthly'] as const).map(period => <option key={period} value={period}>{PERIOD_LABELS[period]} cilj</option>)}</select></div><div><label htmlFor="goal-deadline" className="mb-1.5 block text-sm font-bold">Rok *</label><input id="goal-deadline" className="field" required type="date" value={draft.deadline} onChange={event => setDraft(previous => previous ? { ...previous, deadline: event.target.value } : null)}/></div><div className="grid grid-cols-2 gap-3"><div><label htmlFor="goal-target" className="mb-1.5 block text-sm font-bold">Ciljna vrednost *</label><input id="goal-target" className="field" required type="number" min="1" max="100000" step="1" value={draft.target} onChange={event => setDraft(previous => previous ? { ...previous, target: Number(event.target.value) } : null)}/></div><div><label htmlFor="goal-progress" className="mb-1.5 block text-sm font-bold">Trenutni napredek</label><input id="goal-progress" className="field" required type="number" min="0" max="100000" step="1" value={draft.progress} onChange={event => setDraft(previous => previous ? { ...previous, progress: Number(event.target.value) } : null)}/></div></div><p className="text-xs leading-relaxed subtle">Primer: če želiš prebrati 5 poglavij in si prebrala 2, vpiši cilj 5 in napredek 2.</p><div className="flex gap-2"><button type="submit" className="btn-primary flex-1">{draft.id ? 'Shrani spremembe' : 'Dodaj cilj'}</button><button type="button" className="btn-quiet" onClick={() => setDraft(null)}>Prekliči</button></div></form>
    </div></div>}
  </div>;
}
