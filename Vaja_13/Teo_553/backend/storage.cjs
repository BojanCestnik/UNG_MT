const fs = require('node:fs');
const path = require('node:path');
const { randomUUID } = require('node:crypto');

const DB_PATH = process.env.MOJ_PROJEKT_DB_PATH || path.join(__dirname, 'data', 'db.json');
const IMAGE_DIR = path.join(path.dirname(DB_PATH), 'images');
const STATUS = new Set(['planned', 'in_progress', 'done']);
const VIEWS = new Set(['grid', 'list', 'compact']);
const SIZES = new Set(['small', 'medium', 'large']);
const DETAILS = new Set(['tabs', 'sections']);
const SETTINGS = { projectView: 'grid', cardSize: 'medium', detailView: 'tabs', sidebarCollapsed: false };

class HttpError extends Error {
  constructor(status, message) { super(message); this.status = status; }
}

function object(value) { return value && typeof value === 'object' && !Array.isArray(value); }
function unique(items) { return new Set(items.map(item => item.id)).size === items.length; }
function id(value) {
  return typeof value === 'string' && /^[A-Za-z0-9_-]{1,100}$/.test(value) ? value : randomUUID();
}
function field(value, name, limit = 2000, required = false) {
  if (typeof value !== 'string') throw new HttpError(400, `${name} mora biti besedilo.`);
  const result = value.trim();
  if (required && !result) throw new HttpError(400, `${name} ne sme biti prazno.`);
  if (result.length > limit) throw new HttpError(400, `${name} je predolgo.`);
  return result;
}
function validDate(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(`${value}T12:00:00Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().startsWith(value);
}
function settingsOf(input = {}) {
  if (!object(input)) throw new HttpError(400, 'Neveljavne nastavitve.');
  const result = { ...SETTINGS, ...input };
  if (!VIEWS.has(result.projectView) || !SIZES.has(result.cardSize) ||
      !DETAILS.has(result.detailView) || typeof result.sidebarCollapsed !== 'boolean') {
    throw new HttpError(400, 'Neveljavna izbira postavitve.');
  }
  return {
    projectView: result.projectView, cardSize: result.cardSize,
    detailView: result.detailView, sidebarCollapsed: result.sidebarCollapsed,
  };
}
function groupOf(item) {
  if (!object(item)) throw new HttpError(400, 'Neveljavna skupina materiala.');
  return { id: id(item.id), name: field(item.name, 'Ime skupine', 120, true),
    parentId: item.parentId == null || item.parentId === '' ? null : field(item.parentId, 'Nadrejena skupina', 100, true) };
}
function materialOf(item) {
  if (!object(item)) throw new HttpError(400, 'Neveljaven material.');
  if (typeof item.quantity !== 'number' || !Number.isFinite(item.quantity) || item.quantity <= 0) {
    throw new HttpError(400, 'Količina materiala mora biti večja od 0.');
  }
  if (typeof item.unitPrice !== 'number' || !Number.isFinite(item.unitPrice) || item.unitPrice < 0 ||
      !Number.isFinite(item.quantity * item.unitPrice)) {
    throw new HttpError(400, 'Cena materiala ni veljavna.');
  }
  if (typeof item.purchased !== 'boolean') throw new HttpError(400, 'Neveljaven podatek o nakupu.');
  return { id: id(item.id), name: field(item.name, 'Ime materiala', 120, true),
    quantity: item.quantity, unitPrice: item.unitPrice, purchased: item.purchased,
    groupId: item.groupId == null || item.groupId === '' ? null : field(item.groupId, 'Skupina materiala', 100, true) };
}
function subphaseOf(item) {
  if (!object(item) || typeof item.completed !== 'boolean') throw new HttpError(400, 'Neveljavna podfaza.');
  return { id: id(item.id), name: field(item.name, 'Ime podfaze', 120, true), completed: item.completed };
}
function phaseOf(item) {
  if (!object(item) || typeof item.completed !== 'boolean') throw new HttpError(400, 'Neveljavna faza.');
  if (!Array.isArray(item.subphases ?? [])) throw new HttpError(400, 'Neveljaven seznam podfaz.');
  const subphases = (item.subphases ?? []).map(subphaseOf);
  if (subphases.length > 500 || !unique(subphases)) throw new HttpError(400, 'Preveč podfaz ali podvojeni ID-ji.');
  return { id: id(item.id), name: field(item.name, 'Ime faze', 120, true),
    completed: subphases.length ? subphases.every(sub => sub.completed) : item.completed, subphases };
}
function projectOf(item, projectId, images = []) {
  if (!object(item)) throw new HttpError(400, 'Neveljavni podatki projekta.');
  const name = field(item.name, 'Ime projekta', 120, true);
  const description = field(item.description ?? '', 'Opis', 2000);
  const notes = field(item.notes ?? '', 'Zapiski', 10000);
  if (!validDate(item.startDate)) throw new HttpError(400, 'Vnesi veljaven datum začetka.');
  if (!STATUS.has(item.status)) throw new HttpError(400, 'Neveljavno stanje projekta.');
  if (![item.materialGroups ?? [], item.materials ?? [], item.phases ?? []].every(Array.isArray)) {
    throw new HttpError(400, 'Skupine, materiali in faze morajo biti seznami.');
  }
  const materialGroups = (item.materialGroups ?? []).map(groupOf);
  const materials = (item.materials ?? []).map(materialOf);
  const phases = (item.phases ?? []).map(phaseOf);
  if ([materialGroups, materials, phases].some(items => items.length > 500 || !unique(items))) {
    throw new HttpError(400, 'Preveč elementov ali podvojeni ID-ji.');
  }
  const groups = new Map(materialGroups.map(group => [group.id, group]));
  for (const group of materialGroups) {
    if (group.parentId !== null) {
      const parent = groups.get(group.parentId);
      if (!parent || parent.parentId !== null || parent.id === group.id) {
        throw new HttpError(400, 'Skupine lahko vsebujejo samo eno raven podskupin.');
      }
    }
  }
  for (const material of materials) {
    if (material.groupId !== null && !groups.has(material.groupId)) {
      throw new HttpError(400, 'Skupina materiala ne obstaja.');
    }
  }
  return { id: projectId, name, description, startDate: item.startDate, status: item.status,
    materialGroups, materials, phases, notes, images };
}
function migrateProject(project) {
  if (!object(project)) throw new Error('Neveljaven zapis projekta v datoteki.');
  // Stare različice niso vsebovale skupin, podfaz ali slik.
  return { ...project,
    materialGroups: project.materialGroups ?? [], images: project.images ?? [],
    materials: (project.materials ?? []).map(m => ({ ...m, groupId: m.groupId ?? null })),
    phases: (project.phases ?? []).map(p => ({ ...p, subphases: p.subphases ?? [] })),
  };
}
function ensureDb() {
  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
  fs.mkdirSync(IMAGE_DIR, { recursive: true });
  if (!fs.existsSync(DB_PATH)) writeDb({ projects: [], settings: SETTINGS });
}
function readDb() {
  ensureDb();
  const data = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
  if (!object(data) || !Array.isArray(data.projects)) throw new Error('Datoteka s projekti ni veljavna.');
  return { projects: data.projects.map(migrateProject), settings: settingsOf(data.settings ?? SETTINGS) };
}
function writeDb(data) {
  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
  const tmp = `${DB_PATH}.${process.pid}.${randomUUID()}.tmp`;
  try {
    fs.writeFileSync(tmp, JSON.stringify(data, null, 2) + '\n', 'utf8');
    fs.renameSync(tmp, DB_PATH);
  } finally { if (fs.existsSync(tmp)) fs.unlinkSync(tmp); }
}
function imagePath(fileName) {
  if (!/^[0-9a-f-]{36}\.(jpg|png|webp)$/.test(fileName)) throw new HttpError(400, 'Neveljavno ime slike.');
  return path.join(IMAGE_DIR, fileName);
}
function imageInput(body) {
  if (!object(body)) throw new HttpError(400, 'Neveljavna slika.');
  const originalName = field(body.fileName, 'Ime slike', 180, true);
  const description = field(body.description ?? '', 'Opis slike', 160);
  const mimeType = body.mimeType;
  const ext = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' }[mimeType];
  if (!ext || typeof body.dataBase64 !== 'string' || !/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(body.dataBase64)) {
    throw new HttpError(400, 'Dovoljene so samo slike JPG, PNG ali WebP.');
  }
  const imageBytes = Buffer.from(body.dataBase64, 'base64');
  if (imageBytes.length === 0 || imageBytes.length > 2 * 1024 * 1024) {
    throw new HttpError(413, 'Slika mora biti velika največ 2 MB.');
  }
  const jpg = imageBytes.length > 3 && imageBytes[0] === 0xff && imageBytes[1] === 0xd8 && imageBytes[2] === 0xff;
  const png = imageBytes.subarray(0, 8).equals(Buffer.from([137,80,78,71,13,10,26,10]));
  const webp = imageBytes.length >= 12 && imageBytes.toString('ascii', 0, 4) === 'RIFF' && imageBytes.toString('ascii', 8, 12) === 'WEBP';
  if (!(mimeType === 'image/jpeg' && jpg || mimeType === 'image/png' && png || mimeType === 'image/webp' && webp)) {
    throw new HttpError(400, 'Vsebina se ne ujema z vrsto slike.');
  }
  const imageId = randomUUID();
  const meta = { id: imageId, fileName: `${imageId}.${ext}`, originalName, description, mimeType };
  return { meta, imageBytes };
}

module.exports = { HttpError, SETTINGS, DB_PATH, IMAGE_DIR, readDb, writeDb, settingsOf,
  projectOf, imageInput, imagePath, ensureDb };
