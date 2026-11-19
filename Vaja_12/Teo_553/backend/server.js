// Preprost REST API za aplikacijo Moj Projekt. Samo vgrajena modula Node.js.
const http = require('node:http');
const fs = require('node:fs');

const PORT = Number(process.env.PORT || 3001);
const DB_PATH = process.env.MOJ_PROJEKT_DB_PATH || `${__dirname}/data/db.json`;
const MAX_BODY_BYTES = 1024 * 1024;
const VALID_STATUSES = new Set(['planned', 'in_progress', 'done']);

class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

function ensureDatabase() {
  const lastSeparator = Math.max(DB_PATH.lastIndexOf('/'), DB_PATH.lastIndexOf('\\'));
  if (lastSeparator > 0) fs.mkdirSync(DB_PATH.slice(0, lastSeparator), { recursive: true });
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify({ projects: [] }, null, 2) + '\n', 'utf8');
  }
}

function readDatabase() {
  ensureDatabase();
  const data = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
  if (!data || !Array.isArray(data.projects)) {
    throw new Error('Datoteka s podatki ni veljavna.');
  }
  return data;
}

function writeDatabase(data) {
  // Zaščita pred delno zapisano datoteko ob nenadni prekinitvi procesa.
  const tempPath = `${DB_PATH}.tmp`;
  fs.writeFileSync(tempPath, JSON.stringify(data, null, 2) + '\n', 'utf8');
  fs.renameSync(tempPath, DB_PATH);
}

function sendJson(res, status, data) {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  });
  res.end(JSON.stringify(data));
}

function isRecord(value) {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function validDate(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T12:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().startsWith(value);
}

function textField(value, label, maxLength = 2000, required = false) {
  if (typeof value !== 'string') throw new HttpError(400, `${label} mora biti besedilo.`);
  const trimmed = value.trim();
  if (required && !trimmed) throw new HttpError(400, `${label} ne sme biti prazno.`);
  if (trimmed.length > maxLength) throw new HttpError(400, `${label} je predolgo.`);
  return trimmed;
}

function normaliseMaterial(material) {
  if (!isRecord(material)) throw new HttpError(400, 'Neveljaven material.');
  const name = textField(material.name, 'Ime materiala', 120, true);
  const quantity = material.quantity;
  const unitPrice = material.unitPrice;
  if (typeof quantity !== 'number' || !Number.isFinite(quantity) || quantity <= 0) {
    throw new HttpError(400, 'Količina materiala mora biti večja od 0.');
  }
  if (typeof unitPrice !== 'number' || !Number.isFinite(unitPrice) || unitPrice < 0) {
    throw new HttpError(400, 'Cena materiala ne sme biti negativna.');
  }
  if (!Number.isFinite(quantity * unitPrice)) {
    throw new HttpError(400, 'Izračun stroška materiala je prevelik.');
  }
  if (typeof material.purchased !== 'boolean') {
    throw new HttpError(400, 'Podatek o nakupu mora biti da ali ne.');
  }
  return {
    id: typeof material.id === 'string' && material.id.length <= 100 && material.id.trim()
      ? material.id : crypto.randomUUID(),
    name,
    quantity,
    unitPrice,
    purchased: material.purchased,
  };
}

function normalisePhase(phase) {
  if (!isRecord(phase)) throw new HttpError(400, 'Neveljavna faza dela.');
  if (typeof phase.completed !== 'boolean') {
    throw new HttpError(400, 'Podatek o zaključeni fazi mora biti da ali ne.');
  }
  return {
    id: typeof phase.id === 'string' && phase.id.length <= 100 && phase.id.trim()
      ? phase.id : crypto.randomUUID(),
    name: textField(phase.name, 'Ime faze', 120, true),
    completed: phase.completed,
  };
}

function normaliseProject(value, id) {
  if (!isRecord(value)) throw new HttpError(400, 'Podatki projekta niso veljavni.');
  const name = textField(value.name, 'Ime projekta', 120, true);
  const description = textField(value.description ?? '', 'Opis', 2000);
  const notes = textField(value.notes ?? '', 'Zapiski', 10000);
  if (!validDate(value.startDate)) throw new HttpError(400, 'Vnesi veljaven datum začetka.');
  if (!VALID_STATUSES.has(value.status)) throw new HttpError(400, 'Neveljavno stanje projekta.');
  const materials = value.materials ?? [];
  const phases = value.phases ?? [];
  if (!Array.isArray(materials) || !Array.isArray(phases)) {
    throw new HttpError(400, 'Materiali in faze morajo biti seznami.');
  }
  if (materials.length > 500 || phases.length > 500) {
    throw new HttpError(400, 'Preveč materialov ali faz dela.');
  }
  const cleanedMaterials = materials.map(normaliseMaterial);
  const cleanedPhases = phases.map(normalisePhase);
  if (new Set(cleanedMaterials.map((item) => item.id)).size !== cleanedMaterials.length ||
      new Set(cleanedPhases.map((item) => item.id)).size !== cleanedPhases.length) {
    throw new HttpError(400, 'Podvojeni identifikatorji elementov.');
  }
  return { id, name, description, startDate: value.startDate, status: value.status,
    materials: cleanedMaterials, phases: cleanedPhases, notes };
}

async function readBody(req) {
  const chunks = [];
  let size = 0;
  for await (const chunk of req) {
    size += chunk.length;
    if (size > MAX_BODY_BYTES) throw new HttpError(413, 'Zahteva je prevelika.');
    chunks.push(chunk);
  }
  try {
    const parsed = JSON.parse(Buffer.concat(chunks).toString('utf8'));
    if (!isRecord(parsed)) throw new Error('Expected object');
    return parsed;
  } catch {
    throw new HttpError(400, 'Neveljaven zapis JSON.');
  }
}

async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    sendJson(res, 200, { ok: true });
    return;
  }
  try {
    const pathname = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`).pathname;
    const db = readDatabase();
    if (pathname === '/api/projects') {
      if (req.method === 'GET') {
        sendJson(res, 200, db.projects);
        return;
      }
      if (req.method === 'POST') {
        const project = normaliseProject(await readBody(req), crypto.randomUUID());
        db.projects.push(project);
        writeDatabase(db);
        sendJson(res, 201, project);
        return;
      }
      throw new HttpError(405, 'Ta metoda ni dovoljena.');
    }
    const match = /^\/api\/projects\/([^/]+)$/.exec(pathname);
    if (match) {
      const id = decodeURIComponent(match[1]);
      const index = db.projects.findIndex((project) => project.id === id);
      if (index === -1) throw new HttpError(404, 'Projekt ni najden.');
      if (req.method === 'GET') {
        sendJson(res, 200, db.projects[index]);
        return;
      }
      if (req.method === 'PUT') {
        const project = normaliseProject(await readBody(req), id);
        db.projects[index] = project;
        writeDatabase(db);
        sendJson(res, 200, project);
        return;
      }
      if (req.method === 'DELETE') {
        db.projects.splice(index, 1);
        writeDatabase(db);
        sendJson(res, 200, { success: true });
        return;
      }
      throw new HttpError(405, 'Ta metoda ni dovoljena.');
    }
    throw new HttpError(404, 'Pot ne obstaja.');
  } catch (error) {
    if (error instanceof HttpError) {
      sendJson(res, error.status, { error: error.message });
    } else {
      console.error('Napaka strežnika:', error);
      sendJson(res, 500, { error: 'Napaka pri shranjevanju ali branju podatkov.' });
    }
  }
}

ensureDatabase();
const server = http.createServer(handler);
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Moj Projekt API deluje: http://localhost:${PORT}`);
});
