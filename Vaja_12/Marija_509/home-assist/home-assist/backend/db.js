// Reads and writes data/db.json. Writes go to a temp file first, then rename, so a crash cannot leave half a file.
const fs = require('fs');
const path = require('path');
const DB_FILE = path.join(__dirname, 'data', 'db.json');

function readDb() {
  return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
}

function writeDb(data) {
  const tempFile = DB_FILE + '.tmp';
  fs.writeFileSync(tempFile, JSON.stringify(data, null, 2));
  fs.renameSync(tempFile, DB_FILE);
}

module.exports = { readDb, writeDb };
