const http = require('node:http');
const fs = require('node:fs/promises');
const path = require('node:path');
const crypto = require('node:crypto');

const PORT = 3001;
const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');
const EMPTY = { workOrders: [], materials: [], tools: [], toolReservations: [] };
let queue = Promise.resolve();
const copy = (value) => JSON.parse(JSON.stringify(value));
const id = () => crypto.randomUUID();
const fail = (status, message) => { const e = Error(message); e.status = status; throw e; };

async function ensureDB() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try { await fs.access(DB_FILE); }
  catch { await fs.writeFile(DB_FILE, JSON.stringify(EMPTY, null, 2), { flag: 'wx' }).catch(e => { if (e.code !== 'EEXIST') throw e; }); }
}
async function loadDB() {
  const parsed = JSON.parse(await fs.readFile(DB_FILE, 'utf8'));
  for (const key of Object.keys(EMPTY)) if (!Array.isArray(parsed[key])) throw Error(`Neveljavna zbirka ${key} v db.json`);
  return parsed;
}
async function writeDB(db) {
  const tmp = path.join(DATA_DIR, `db-${process.pid}-${crypto.randomUUID()}.tmp`);
  try { await fs.writeFile(tmp, JSON.stringify(db, null, 2)); await fs.rename(tmp, DB_FILE); }
  finally { await fs.rm(tmp, { force: true }).catch(() => {}); }
}
function transaction(fn) {
  const operation = queue.then(async () => {
    const db = await loadDB();
    const result = await fn(db);
    await writeDB(db);
    return result;
  });
  queue = operation.then(() => {}, () => {});
  return operation;
}
const read = (fn) => queue.then(async () => fn(await loadDB()));
function response(res, status, obj) {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Cache-Control': 'no-store',
  });
  res.end(JSON.stringify(obj));
}
function routeParts(req) { return new URL(req.url, `http://localhost:${PORT}`).pathname.split('/').filter(Boolean); }
async function body(req) {
  let raw = '';
  for await (const chunk of req) {
    raw += chunk;
    if (raw.length > 1_000_000) fail(413, 'Zahteva je prevelika.');
  }
  try { const parsed = raw ? JSON.parse(raw) : {}; if (!parsed || Array.isArray(parsed) || typeof parsed !== 'object') fail(400, 'Neveljavni podatki.'); return parsed; }
  catch(e) { if (e.status) throw e; fail(400, 'Neveljaven JSON.'); }
}
function str(v, label, required = false) {
  if (typeof v !== 'string') fail(400, `Neveljavno polje: ${label}.`);
  const s = v.trim();
  if (required && !s) fail(400, `Izpolni polje: ${label}.`);
  if (s.length > 5000) fail(400, `Predolgo polje: ${label}.`);
  return s;
}
function num(v, label, min = 0, integer = false) {
  if (typeof v !== 'number' || !Number.isFinite(v) || v < min || (integer && !Number.isInteger(v))) fail(400, `Neveljavna vrednost: ${label}.`);
  return v;
}
const isoDate = (v, label) => {
  if (typeof v !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(v) || Number.isNaN(Date.parse(v+'T12:00:00Z'))) fail(400, `Neveljaven datum: ${label}.`);
  return v;
};
const enums = (v, options, label) => { if (!options.includes(v)) fail(400, `Neveljavno stanje: ${label}.`); return v; };
const statuses = ['planned','in_progress','done'];
const opStatuses = ['pending','in_progress','done'];
function validateOps(value, previous = []) {
  if (!Array.isArray(value) || value.length > 100) fail(400, 'Neveljaven seznam operacij.');
  const ids = new Set();
  return value.map((o, i) => {
    if (!o || typeof o !== 'object') fail(400, 'Neveljavna operacija.');
    const oid = o.id && previous.some(p => p.id === o.id) ? o.id : id();
    if (ids.has(oid)) fail(400, 'Podvojena operacija.'); ids.add(oid);
    const prev = previous.find(p => p.id === oid);
    const timers = prev?.timeRecords || [];
    return { id: oid, name: str(o.name, 'Ime postopka', true), description: str(o.description ?? '', 'Opis operacije'), status: enums(o.status || 'pending', opStatuses, 'operacija'), estimatedMinutes: num(o.estimatedMinutes ?? 0,'Predviden čas'), manualMinutes: num(o.manualMinutes ?? 0,'Dejanski čas'), sequence: i + 1, timeRecords: timers, startedAt: prev?.startedAt || null };
  });
}
function validateWorkOrder(b, previous, db) {
  const operations = validateOps(b.operations || [], previous?.operations);
  const materialAssignments = Array.isArray(b.materialAssignments) ? b.materialAssignments.map(a => {
    if (!db.materials.some(m => m.id === a.materialId)) fail(400, 'Izbrani material ne obstaja.');
    const old = previous?.materialAssignments?.find(x => x.id === a.id);
    return { id: old?.id || id(), materialId: a.materialId, quantity: num(a.quantity, 'Potrebna količina', 0.000001), consumed: old?.consumed ?? false };
  }) : (previous?.materialAssignments || []);
  const existingConsumed = (previous?.materialAssignments || []).filter(x => x.consumed);
  for (const old of existingConsumed) if (!materialAssignments.some(a => a.id === old.id && a.materialId === old.materialId && a.quantity === old.quantity)) fail(400, 'Potrjene porabe materiala ni dovoljeno spremeniti ali izbrisati.');
  return {
    id: previous?.id || id(),
    number: previous?.number || `DN-${String(db.workOrders.reduce((max, w) => Math.max(max, Number(w.number?.match(/^DN-(\d+)$/)?.[1] || 0)), 0) + 1).padStart(4, '0')}`,
    product: str(b.product, 'Ime izdelka', true), customer: str(b.customer, 'Naročnik', true), description: str(b.description ?? '', 'Opis'),
    quantity: num(b.quantity, 'Količina', 1, true), startDate: isoDate(b.startDate, 'Datum začetka'),
    deadline: b.deadline ? isoDate(b.deadline, 'Rok izdelave') : '',
    priority: enums(b.priority || 'medium', ['low','medium','high'], 'prioriteta'),
    status: enums(b.status || 'planned', statuses, 'nalog'),
    notes: str(b.notes ?? '', 'Opombe'), operations, materialAssignments,
    createdAt: previous?.createdAt || new Date().toISOString(),
    completedAt: b.status === 'done' ? (previous?.completedAt || new Date().toISOString()) : null
  };
}
function validateMaterial(b, old) {
  return { id: old?.id || id(), name: str(b.name,'Material',true), standard: str(b.standard ?? '','Standard'), shape: str(b.shape ?? '','Oblika'), dimensions: str(b.dimensions ?? '','Dimenzije'), quantity: num(b.quantity,'Zaloga'), unit: enums(b.unit || 'kos',['kos','mm','m','kg'],'enota'), location: str(b.location ?? '','Lokacija') };
}
function validateTool(b, old) {
  return { id: old?.id || id(), name: str(b.name,'Ime orodja',true), category: str(b.category,'Kategorija',true), manufacturer: str(b.manufacturer ?? '','Proizvajalec'), specification: str(b.specification ?? '','Oznaka'), size: str(b.size ?? '','Velikost'), location: str(b.location ?? '','Lokacija'), condition: enums(b.condition || 'available',['available','maintenance','unavailable'],'orodje'), notes: str(b.notes ?? '','Opombe') };
}
function findOr404(items, ident, label) { const result = items.find(x => x.id === ident); if (!result) fail(404, `${label} ni najden.`); return result; }
function activeReservation(db, toolId) { return db.toolReservations.find(r => r.toolId === toolId && r.status !== 'released'); }
async function handle(req, res) {
  if (req.method === 'OPTIONS') return response(res, 204, {});
  const p = routeParts(req), method = req.method;
  if (p[0] !== 'api') fail(404, 'Pot ne obstaja.');
  if (p[1] === 'health' && method === 'GET') return response(res, 200, { ok: true });
  if (p[1] === 'work-orders') {
    if (p.length === 2 && method === 'GET') return response(res, 200, await read(db => db.workOrders));
    if (p.length === 2 && method === 'POST') { const b = await body(req); const result = await transaction(db => { const order = validateWorkOrder(b, null, db); db.workOrders.push(order); return order; }); return response(res, 201, result); }
    if (p.length === 3 && method === 'GET') return response(res, 200, await read(db => findOr404(db.workOrders, p[2], 'Delovni nalog')));
    if (p.length === 3 && method === 'PUT') { const b = await body(req); return response(res, 200, await transaction(db => { const prev = findOr404(db.workOrders,p[2],'Delovni nalog'); const updated = validateWorkOrder(b,prev,db); for (const r of db.toolReservations) if (r.workOrderId === prev.id && r.status !== 'released' && !updated.operations.some(o=>o.id===r.operationId)) fail(400,'Najprej sprosti orodja iz odstranjenih operacij.'); db.workOrders[db.workOrders.indexOf(prev)] = updated; return updated; })); }
    if (p.length === 3 && method === 'DELETE') return response(res,200,await transaction(db => { const previous = findOr404(db.workOrders,p[2],'Delovni nalog'); db.workOrders = db.workOrders.filter(x=>x.id!==p[2]); for (const r of db.toolReservations) if (r.workOrderId === p[2] && r.status !== 'released') { r.status='released'; r.releasedAt=new Date().toISOString(); } return { deleted:previous.id }; }));
    if (p.length === 4 && p[3] === 'material-consumption' && method === 'POST') { const b=await body(req); return response(res,200,await transaction(db=>{ const order=findOr404(db.workOrders,p[2],'Delovni nalog'); const a=findOr404(order.materialAssignments,b.assignmentId,'Dodelitev materiala'); if(a.consumed) fail(400,'Poraba materiala je že potrjena.'); const m=findOr404(db.materials,a.materialId,'Material'); if(m.quantity<a.quantity) fail(400,'Ni dovolj materiala na zalogi.'); m.quantity=Number((m.quantity-a.quantity).toFixed(6)); a.consumed=true; return { order, material:m }; })); }
    if (p.length === 6 && p[3] === 'operations' && ['start','stop'].includes(p[5]) && method === 'POST') return response(res,200,await transaction(db=>{ const o=findOr404(db.workOrders,p[2],'Delovni nalog'); const op=findOr404(o.operations,p[4],'Operacija'); const now=new Date().toISOString(); if(p[5]==='start'){ if(op.startedAt) fail(400,'Merjenje časa že poteka.'); if(op.status==='done') fail(400,'Operacija je že zaključena.'); op.startedAt=now; op.status='in_progress'; }else{ if(!op.startedAt) fail(400,'Merjenje časa ni začeto.'); const mins=Math.max(0,(Date.now()-new Date(op.startedAt).getTime())/60000); op.timeRecords.push({id:id(),start:op.startedAt,end:now,minutes:mins}); op.startedAt=null; } return o; }));
  }
  if (p[1] === 'materials') {
    if (p.length===2 && method==='GET') return response(res,200,await read(db=>db.materials));
    if (p.length===2 && method==='POST') {const b=await body(req); return response(res,201,await transaction(db=>{const m=validateMaterial(b);db.materials.push(m);return m;}));}
    if (p.length===3 && method==='PUT') {const b=await body(req);return response(res,200,await transaction(db=>{const prev=findOr404(db.materials,p[2],'Material'); const m=validateMaterial(b,prev);db.materials[db.materials.indexOf(prev)]=m;return m;}));}
    if (p.length===3 && method==='DELETE') return response(res,200,await transaction(db=>{const prev=findOr404(db.materials,p[2],'Material');if(db.workOrders.some(w=>w.materialAssignments.some(a=>a.materialId===prev.id))) fail(400,'Material je povezan z delovnim nalogom.');db.materials=db.materials.filter(m=>m.id!==prev.id);return {deleted:prev.id};}));
  }
  if (p[1] === 'tools') {
    if(p.length===2 && method==='GET') return response(res,200,await read(db=>db.tools));
    if(p.length===2 && method==='POST'){const b=await body(req);return response(res,201,await transaction(db=>{const t=validateTool(b);db.tools.push(t);return t;}));}
    if(p.length===3 && method==='PUT'){const b=await body(req);return response(res,200,await transaction(db=>{const prev=findOr404(db.tools,p[2],'Orodje');if(activeReservation(db,prev.id)&&b.condition!=='available') fail(400,'Najprej sprosti orodje, preden spremeniš razpoložljivost.');const t=validateTool(b,prev);db.tools[db.tools.indexOf(prev)]=t;return t;}));}
    if(p.length===3 && method==='DELETE') return response(res,200,await transaction(db=>{const prev=findOr404(db.tools,p[2],'Orodje');if(activeReservation(db,prev.id)) fail(400,'Orodje je trenutno rezervirano ali v uporabi.');db.tools=db.tools.filter(t=>t.id!==prev.id);return {deleted:prev.id};}));
  }
  if(p[1]==='tool-reservations') {
    if(p.length===2 && method==='GET') return response(res,200,await read(db=>db.toolReservations));
    if(p.length===2 && method==='POST'){const b=await body(req);return response(res,201,await transaction(db=>{const t=findOr404(db.tools,b.toolId,'Orodje');if(t.condition!=='available')fail(400,'Orodje trenutno ni na voljo.');if(activeReservation(db,t.id))fail(409,'Orodje je že rezervirano ali v uporabi.');const w=findOr404(db.workOrders,b.workOrderId,'Delovni nalog');findOr404(w.operations,b.operationId,'Operacija');const r={id:id(),toolId:t.id,workOrderId:w.id,operationId:b.operationId,status:'reserved',reservedAt:new Date().toISOString(),releasedAt:null};db.toolReservations.push(r);return r;}));}
    if(p.length===3 && method==='PUT'){const b=await body(req);return response(res,200,await transaction(db=>{const r=findOr404(db.toolReservations,p[2],'Rezervacija');if(r.status==='released')fail(400,'Rezervacija je že zaključena.');r.status=enums(b.status,['reserved','in_use'],'rezervacija');return r;}));}
    if(p.length===3 && method==='DELETE')return response(res,200,await transaction(db=>{const r=findOr404(db.toolReservations,p[2],'Rezervacija');if(r.status==='released')fail(400,'Orodje je že sproščeno.');r.status='released';r.releasedAt=new Date().toISOString();return r;}));
  }
  fail(404,'Pot ne obstaja.');
}
ensureDB().then(()=>http.createServer((req,res)=>{handle(req,res).catch(e=>{console.error(e.message); response(res,e.status||500,{error:e.status?e.message:'Napaka strežnika.'});});}).listen(PORT,()=>console.log(`Delovni nalogi API: http://localhost:${PORT}`))).catch(e=>{console.error(e);process.exit(1)});
