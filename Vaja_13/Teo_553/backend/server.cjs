// Moj Projekt: REST API brez zunanjih Node.js knjižnic.
const http = require('node:http');
const fs = require('node:fs');
const { randomUUID } = require('node:crypto');
const { HttpError, readDb, writeDb, settingsOf, projectOf, imageInput,
  imagePath, ensureDb } = require('./storage.cjs');

const PORT = Number(process.env.PORT || 3001);

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

async function readBody(req, max = 1024 * 1024) {
  const chunks = [];
  let size = 0;
  for await (const part of req) {
    size += part.length;
    if (size > max) throw new HttpError(413, 'Zahteva je prevelika.');
    chunks.push(part);
  }
  try {
    const data = JSON.parse(Buffer.concat(chunks).toString('utf8'));
    if (!data || typeof data !== 'object' || Array.isArray(data)) throw new Error('object expected');
    return data;
  } catch { throw new HttpError(400, 'Neveljaven zapis JSON.'); }
}

function indexOf(db, id) {
  const index = db.projects.findIndex(project => project.id === id);
  if (index < 0) throw new HttpError(404, 'Projekt ni najden.');
  return index;
}
function indexOfImage(project, id) {
  const index = project.images.findIndex(image => image.id === id);
  if (index < 0) throw new HttpError(404, 'Slika ni najdena.');
  return index;
}
function removeImageFiles(images) {
  for (const image of images) {
    try { fs.unlinkSync(imagePath(image.fileName)); }
    catch (error) { if (error.code !== 'ENOENT') console.error('Brisanje slike ni uspelo:', error); }
  }
}

async function handler(req, res) {
  if (req.method === 'OPTIONS') return sendJson(res, 200, { ok: true });
  try {
    const pathname = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`).pathname;
    if (pathname === '/api/settings') {
      if (req.method === 'GET') return sendJson(res, 200, readDb().settings);
      if (req.method === 'PUT') {
        const settings = settingsOf(await readBody(req));
        const db = readDb();
        db.settings = settings;
        writeDb(db);
        return sendJson(res, 200, settings);
      }
      throw new HttpError(405, 'Ta metoda ni dovoljena.');
    }

    if (pathname === '/api/projects') {
      if (req.method === 'GET') return sendJson(res, 200, readDb().projects);
      if (req.method === 'POST') {
        const body = await readBody(req);
        const created = projectOf(body, randomUUID(), []);
        const db = readDb();
        db.projects.push(created);
        writeDb(db);
        return sendJson(res, 201, created);
      }
      throw new HttpError(405, 'Ta metoda ni dovoljena.');
    }

    const imageMatch = /^\/api\/projects\/([^/]+)\/images\/([^/]+)$/.exec(pathname);
    if (imageMatch) {
      const projectId = imageMatch[1];
      const imageId = imageMatch[2];
      const db = readDb();
      const project = db.projects[indexOf(db, projectId)];
      const index = indexOfImage(project, imageId);
      const image = project.images[index];
      if (req.method === 'GET') {
        let bytes;
        try { bytes = fs.readFileSync(imagePath(image.fileName)); }
        catch (error) {
          if (error.code === 'ENOENT') throw new HttpError(404, 'Datoteka slike ni najdena.');
          throw error;
        }
        return sendJson(res, 200, { mimeType: image.mimeType, dataBase64: bytes.toString('base64') });
      }
      if (req.method === 'DELETE') {
        project.images.splice(index, 1);
        writeDb(db);
        removeImageFiles([image]);
        return sendJson(res, 200, { success: true });
      }
      throw new HttpError(405, 'Ta metoda ni dovoljena.');
    }

    const imagesMatch = /^\/api\/projects\/([^/]+)\/images$/.exec(pathname);
    if (imagesMatch) {
      if (req.method !== 'POST') throw new HttpError(405, 'Ta metoda ni dovoljena.');
      const body = await readBody(req, 3 * 1024 * 1024);
      const db = readDb();
      const project = db.projects[indexOf(db, imagesMatch[1])];
      if (project.images.length >= 6) throw new HttpError(400, 'Na projekt je dovoljenih največ 6 slik.');
      const { meta, imageBytes } = imageInput(body);
      const dest = imagePath(meta.fileName);
      fs.writeFileSync(dest, imageBytes, { flag: 'wx' });
      try {
        project.images.push(meta);
        writeDb(db);
      } catch (error) {
        fs.unlinkSync(dest);
        throw error;
      }
      return sendJson(res, 201, project);
    }

    const projectMatch = /^\/api\/projects\/([^/]+)$/.exec(pathname);
    if (projectMatch) {
      const id = projectMatch[1];
      if (req.method === 'PUT') {
        const body = await readBody(req);
        const db = readDb();
        const index = indexOf(db, id);
        // Slike se urejajo samo prek posebnih API poti.
        const updated = projectOf(body, id, db.projects[index].images);
        db.projects[index] = updated;
        writeDb(db);
        return sendJson(res, 200, updated);
      }
      const db = readDb();
      const index = indexOf(db, id);
      if (req.method === 'GET') return sendJson(res, 200, db.projects[index]);
      if (req.method === 'DELETE') {
        const [deleted] = db.projects.splice(index, 1);
        writeDb(db);
        removeImageFiles(deleted.images);
        return sendJson(res, 200, { success: true });
      }
      throw new HttpError(405, 'Ta metoda ni dovoljena.');
    }
    throw new HttpError(404, 'Pot ne obstaja.');
  } catch (error) {
    if (error instanceof HttpError) return sendJson(res, error.status, { error: error.message });
    console.error('Napaka strežnika:', error);
    return sendJson(res, 500, { error: 'Napaka pri branju ali shranjevanju podatkov.' });
  }
}

ensureDb();
http.createServer(handler).listen(PORT, '127.0.0.1', () => {
  console.log(`Moj Projekt API: http://localhost:${PORT}`);
});
