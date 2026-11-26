export type Kind = 'izpit' | 'naloga' | 'drugo';
export interface Obligation {id:string; type:Kind; course:string; title:string; due:string; note:string; done:boolean}
export type Draft = Omit<Obligation,'id'|'done'>;
export const labels:Record<Kind,string>={izpit:'Izpit',naloga:'Naloga',drugo:'Drugo'};
const dayNumber=(date:Date)=>Date.UTC(date.getFullYear(),date.getMonth(),date.getDate())/86400000;
export function todayISO(){const now=new Date();return `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;}
export function daysRemaining(due:string,now=new Date()){const [y,m,d]=due.split('-').map(Number);return Date.UTC(y,m-1,d)/86400000-dayNumber(now);}
export function formatDate(due:string){return new Intl.DateTimeFormat('sl-SI',{day:'numeric',month:'long',year:'numeric'}).format(new Date(`${due}T12:00:00`));}
export function deadlineLabel(days:number){return days<0?`Zamuja ${-days} dni`:days===0?'Danes':days===1?'Jutri':`Čez ${days} dni`;}
export function loadObligations():Obligation[]{try{const value:unknown=JSON.parse(localStorage.getItem('enia417-obligations')||'[]');if(!Array.isArray(value))return [];return value.filter((x):x is Obligation=>x&&typeof x.id==='string'&&['izpit','naloga','drugo'].includes(x.type)&&typeof x.course==='string'&&typeof x.title==='string'&&typeof x.due==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(x.due)&&!Number.isNaN(Date.parse(x.due))&&typeof x.note==='string'&&typeof x.done==='boolean');}catch{return []}}
