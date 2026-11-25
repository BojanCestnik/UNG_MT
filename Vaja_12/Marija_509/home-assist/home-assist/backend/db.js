// Reads and writes data/db.json (tools + log). Guides are read from every file in data/guides/.
// To add more guides, just drop another .json file with an array of guides into data/guides/.
const fs = require('fs');
const path = require('path');
const DB_FILE = path.join(__dirname, 'data', 'db.json');
const GUIDES_DIR = path.join(__dirname, 'data', 'guides');

function readGuides() {
  return fs.readdirSync(GUIDES_DIR)
    .filter((file) => file.endsWith('.json'))
    .sort()
    .flatMap((file) => JSON.parse(fs.readFileSync(path.join(GUIDES_DIR, file), 'utf8')));
}

function readDb() {
  const db = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
  return { ...db, guides: readGuides() };
}

// Writes tools and log only. Guides stay in their own files.
function writeDb(data) {
  const { guides, ...toSave } = data;
  const tempFile = DB_FILE + '.tmp';
  fs.writeFileSync(tempFile, JSON.stringify(toSave, null, 2));
  fs.renameSync(tempFile, DB_FILE);
}

module.exports = { readDb, writeDb };
