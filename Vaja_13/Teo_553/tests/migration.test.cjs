const test = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const os = require('node:os')
const path = require('node:path')
const { spawn } = require('node:child_process')

test('stari projekt brez skupin, podfaz in slik ostane uporaben', async t => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'moj-projekt-old-'))
  const dbPath = path.join(dir, 'db.json')
  const legacy = {
    projects: [{
      id: 'legacy-1', name: 'Stara miza', description: 'Stari opis', startDate: '2025-10-11',
      status: 'in_progress', materials: [{ id: 'm1', name: 'Vijaki', quantity: 4, unitPrice: 2, purchased: false }],
      phases: [{ id: 'p1', name: 'Rezanje', completed: true }], notes: 'Mere 90 cm',
    }],
  }
  fs.writeFileSync(dbPath, JSON.stringify(legacy))
  const port = 31000 + Math.floor(Math.random() * 5000)
  const processServer = spawn(process.execPath, [path.join(__dirname, '..', 'backend', 'server.cjs')], {
    env: { ...process.env, PORT: String(port), MOJ_PROJEKT_DB_PATH: dbPath }, stdio: 'ignore',
  })
  t.after(() => { processServer.kill(); fs.rmSync(dir, { recursive: true, force: true }) })
  const url = `http://127.0.0.1:${port}/api/projects/legacy-1`
  let response
  for (let attempt = 0; attempt < 80; attempt++) {
    try { response = await fetch(url); if (response.ok) break } catch { /* Strežnik se zaganja. */ }
    await new Promise(resolve => setTimeout(resolve, 25))
  }
  assert.equal(response?.status, 200)
  const data = await response.json()
  assert.deepEqual(data.materialGroups, [])
  assert.deepEqual(data.images, [])
  assert.equal(data.materials[0].groupId, null)
  assert.deepEqual(data.phases[0].subphases, [])
  const updated = await fetch(url, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
  assert.equal(updated.status, 200)
  const saved = JSON.parse(fs.readFileSync(dbPath, 'utf8'))
  assert.equal(saved.projects[0].notes, 'Mere 90 cm')
  assert.equal(saved.projects[0].phases[0].completed, true)
})
