// HTTP server, static frontend hosting, routing, and CORS. Data access lives in db.js.
const http = require('http');
const fs = require('fs');
const path = require('path');
const { readDb, writeDb } = require('./db'); // used by your handlers
const { diagnose } = require('./diagnose');

const PORT = process.env.PORT || 3001;
const MAX_PHOTO_BYTES = 1024 * 1024; // 1 MB
const FRONTEND_DIST = path.join(__dirname, '..', 'frontend', 'dist');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.json': 'application/json; charset=utf-8',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
};

// Helper: CORS headers so local or external front ends may call us.
function setCorsHeaders(req, res) {
  const origin = req.headers.origin || '';
  const hosted = (process.env.FRONTEND_URL || '')
    .split(',')
    .map((u) => u.trim().replace(/\/$/, ''))
    .filter(Boolean);
  const ok = /^http:\/\/[\w.-]+:5173$/.test(origin) || hosted.includes(origin);
  if (ok) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

// Helper: send a JSON response. Errors look like { "error": "message" }.
function sendJson(res, status, data) {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });
    req.on('end', () => {
      if (!body.trim()) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(body));
      } catch (err) {
        reject(new Error('Invalid JSON body'));
      }
    });
    req.on('error', reject);
  });
}

function validatePhoto(photoBase64) {
  if (!photoBase64) {
    return null;
  }
  if (typeof photoBase64 !== 'string') {
    return 'Photo must be a base64 string';
  }
  const commaIndex = photoBase64.indexOf(',');
  const rawBase64 = commaIndex >= 0 ? photoBase64.slice(commaIndex + 1) : photoBase64;
  const bytes = Math.floor((rawBase64.length * 3) / 4);
  if (bytes > MAX_PHOTO_BYTES) {
    return 'Photo exceeds maximum allowed size of 1 MB';
  }
  return null;
}

function serveStaticFile(res, filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';
  fs.readFile(filePath, (err, content) => {
    if (err) {
      sendJson(res, 404, { error: 'Not found' });
      return;
    }
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(content);
  });
}

function tryServeFrontend(res, cleanUrl) {
  const indexPath = path.join(FRONTEND_DIST, 'index.html');
  if (!fs.existsSync(indexPath)) {
    sendJson(res, 404, { error: 'Frontend build not found (frontend/dist missing)' });
    return;
  }

  const relativePath = cleanUrl.replace(/^\/+/, '');
  const candidatePath = path.resolve(FRONTEND_DIST, relativePath || 'index.html');
  const distRoot = path.resolve(FRONTEND_DIST);

  // Prevent path traversal outside dist folder
  if (!candidatePath.startsWith(distRoot + path.sep) && candidatePath !== distRoot) {
    sendJson(res, 403, { error: 'Forbidden' });
    return;
  }

  if (relativePath && fs.existsSync(candidatePath) && fs.statSync(candidatePath).isFile()) {
    serveStaticFile(res, candidatePath);
    return;
  }

  serveStaticFile(res, indexPath);
}

async function handleRequest(req, res) {
  setCorsHeaders(req, res);

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  try {
    const cleanUrl = (req.url || '/').split('?')[0];
    const parts = cleanUrl.split('/').filter(Boolean);

    if (parts[0] !== 'api') {
      if (req.method === 'GET' || req.method === 'HEAD') {
        tryServeFrontend(res, cleanUrl);
      } else {
        sendJson(res, 404, { error: 'Not found' });
      }
      return;
    }

    const db = await readDb();

    if (parts[1] === 'guides' && parts.length === 2 && req.method === 'GET') {
      sendJson(res, 200, db.guides || []);
      return;
    }

    if (parts[1] === 'guides' && parts.length === 3 && req.method === 'GET') {
      const id = parts[2];
      const guide = (db.guides || []).find((g) => String(g.id) === String(id));
      if (!guide) {
        sendJson(res, 404, { error: 'Guide not found' });
        return;
      }
      sendJson(res, 200, guide);
      return;
    }

    if (parts[1] === 'tools' && parts.length === 2 && req.method === 'GET') {
      sendJson(res, 200, db.tools || []);
      return;
    }

    if (parts[1] === 'tools' && parts.length === 2 && req.method === 'PUT') {
      const body = await readJsonBody(req);
      if (!Array.isArray(body) || !body.every((item) => typeof item === 'string')) {
        sendJson(res, 400, { error: 'Expected an array of strings' });
        return;
      }
      db.tools = body;
      await writeDb(db);
      sendJson(res, 200, db.tools);
      return;
    }

    if (parts[1] === 'diagnose' && parts.length === 2 && req.method === 'POST') {
      const body = await readJsonBody(req);
      const photoError = validatePhoto(body.photo);
      if (photoError) { sendJson(res, 413, { error: photoError }); return; }
      try {
        const toolNames = [...new Set((db.guides || []).flatMap((g) => g.tools))];
        const result = await diagnose(body, toolNames);
        if (result.status === 'ok') {
          db.aiGuides = [...(db.aiGuides || []), result.guide]; // saved so the log can show it later
          await writeDb(db);
        }
        sendJson(res, 200, result);
      } catch (err) {
        sendJson(res, err.status || 500, { error: err.message });
      }
      return;
    }

    if (parts[1] === 'log' && parts.length === 2 && req.method === 'GET') {
      sendJson(res, 200, db.log || []);
      return;
    }

    if (parts[1] === 'log' && parts.length === 2 && req.method === 'POST') {
      const body = await readJsonBody(req);
      const { guideId, date, photo } = body || {};

      const photoError = validatePhoto(photo);
      if (photoError) {
        sendJson(res, 413, { error: photoError });
        return;
      }

      if (!Array.isArray(db.log)) {
        db.log = [];
      }

      const newEntry = {
        id: String(Date.now()),
        guideId,
        date,
        ...(photo !== undefined ? { photo } : {}),
      };
      db.log.push(newEntry);
      await writeDb(db);
      sendJson(res, 201, newEntry);
      return;
    }

    if (parts[1] === 'log' && parts.length === 3 && req.method === 'DELETE') {
      const id = parts[2];
      const existingLog = db.log || [];
      const filteredLog = existingLog.filter((entry) => String(entry.id) !== String(id));
      if (filteredLog.length === existingLog.length) {
        sendJson(res, 404, { error: 'Log entry not found' });
        return;
      }
      db.log = filteredLog;
      await writeDb(db);
      sendJson(res, 200, { deleted: id });
      return;
    }

    sendJson(res, 404, { error: 'Not found' });
  } catch (err) {
    console.error(err);
    sendJson(res, 500, { error: 'Internal server error' });
  }
}

http.createServer(handleRequest).listen(PORT, () => {
  console.log('Home Assist server running on port ' + PORT);
});
