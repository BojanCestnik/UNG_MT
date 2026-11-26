import type {Crowd} from './types';
export default function CrowdReport({onReport}:{onReport:(c:Crowd)=>void}){return <div><p className="muted">Report the crowd</p><div className="flex flex-wrap gap-2">{(['Empty','Lively','Packed'] as Crowd[]).map(c=><button key={c} className="small" onClick={()=>onReport(c)}>{c}</button>)}</div></div>}
