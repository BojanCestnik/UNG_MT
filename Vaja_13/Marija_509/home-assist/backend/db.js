// Reads and writes db.json (tools + log). Guides are read from every file in data/guides/.
// To add more guides, just drop another .json file with an array of guides into data/guides/.
const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, 'data');
const DB_DIR = process.env.DB_DIR || DATA_DIR;      // where db.json lives (on Render: /var/data)
const DB_FILE = path.join(DB_DIR, 'db.json');
const GUIDES_DIR = path.join(DATA_DIR, 'guides');   // guides always stay in the code

// First run on a fresh disk: copy the starting db.json into it
if (!fs.existsSync(DB_FILE)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
  fs.copyFileSync(path.join(DATA_DIR, 'db.json'), DB_FILE);
}

function readGuides() {
  return fs.readdirSync(GUIDES_DIR)
    .filter((file) => file.endsWith('.json'))
    .sort()
    .flatMap((file) => JSON.parse(fs.readFileSync(path.join(GUIDES_DIR, file), 'utf8')));
}

function readDb() {
  const db = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
  return { ...db, guides: [...readGuides(), ...(db.aiGuides || [])] };
}

// Writes tools and log only. Guides stay in their own files.
function writeDb(data) {
  const { guides, ...toSave } = data; // aiGuides stay in toSave
  const tempFile = DB_FILE + '.tmp';
  fs.writeFileSync(tempFile, JSON.stringify(toSave, null, 2));
  fs.renameSync(tempFile, DB_FILE);
}

module.exports = { readDb, writeDb };
