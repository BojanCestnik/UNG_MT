// Integracijski preizkus Node.js API brez dodatnih knjižnic.
const test = require('node:test')
const assert = require('node:assert/strict')
const net = require('node:net')
const fs = require('node:fs')
const os = require('node:os')
const path = require('node:path')
const { spawn } = require('node:child_process')

function reserveFreePort() {
  return new Promise((resolve, reject) => {
    const server = net.createServer()
    server.listen(0, '127.0.0.1', () => {
      const port = server.address().port
      server.close(() => resolve(port))
    })
    server.on('error', reject)
  })
}

const validProject = {
  name: 'Delavniška miza', description: 'Projekt za delavnico',
  startDate: '2026-11-19', status: 'planned', materials: [], phases: [], notes: '',
}

test('Moj Projekt: Node REST API', async (t) => {
  const port = await reserveFreePort()
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'moj-projekt-api-'))
  const dbPath = path.join(dir, 'db.json')
  const entry = path.join(__dirname, '..', 'backend', 'server.cjs')
  const child = spawn(process.execPath, [entry], {
    env: { ...process.env, PORT: String(port), MOJ_PROJEKT_DB_PATH: dbPath },
    stdio: ['ignore', 'pipe', 'pipe'],
  })
  let serverOutput = ''
  child.stdout.on('data', (chunk) => { serverOutput += String(chunk) })
  child.stderr.on('data', (chunk) => { serverOutput += String(chunk) })
  t.after(() => { child.kill(); fs.rmSync(dir, { recursive: true, force: true }) })

  const base = `http://127.0.0.1:${port}`
  async function req(method, uri, value) {
    const options = { method, headers: { 'Content-Type': 'application/json' } }
    if (value !== undefined) options.body = JSON.stringify(value)
    const res = await fetch(base + uri, options)
    return { status: res.status, json: await res.json(), headers: res.headers }
  }

  let ready = false
  for (let attempt = 0; attempt < 80; attempt++) {
    if (child.exitCode !== null) break
    try {
      const res = await req('GET', '/api/projects')
      if (res.status === 200) { ready = true; break }
    } catch { /* strežnik še ni poslušal */ }
    await new Promise((resolve) => setTimeout(resolve, 40))
  }
  assert.ok(ready, `Strežnik se ni zagnal: ${serverOutput}`)

  await t.test('GET: prazen seznam', async () => {
    const res = await req('GET', '/api/projects')
    assert.equal(res.status, 200)
    assert.deepEqual(res.json, [])
    assert.equal(res.headers.get('access-control-allow-origin'), '*')
  })

  let id
  await t.test('POST: ustvari projekt', async () => {
    const res = await req('POST', '/api/projects', validProject)
    assert.equal(res.status, 201)
    assert.equal(res.json.name, 'Delavniška miza')
    assert.ok(res.json.id)
    id = res.json.id
  })

  await t.test('GET: prebere projekt po ID', async () => {
    const res = await req('GET', `/api/projects/${id}`)
    assert.equal(res.status, 200)
    assert.equal(res.json.id, id)
  })

  await t.test('PUT: material, faza in zapiski', async () => {
    const updated = {
      ...validProject, status: 'in_progress', notes: 'Mere 120 × 60 cm',
      materials: [{ id: 'm1', name: 'Vijaki', quantity: 10, unitPrice: 0.25, purchased: true }],
      phases: [{ id: 'p1', name: 'Izmera', completed: true }],
    }
    const res = await req('PUT', `/api/projects/${id}`, updated)
    assert.equal(res.status, 200)
    assert.equal(res.json.materials.length, 1)
    assert.equal(res.json.phases[0].completed, true)
    assert.equal(res.json.notes, 'Mere 120 × 60 cm')
    const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'))
    assert.equal(db.projects[0].materials[0].unitPrice, 0.25)
  })

  await t.test('POST: prazno ime vrne 400', async () => {
    const res = await req('POST', '/api/projects', { ...validProject, name: '   ' })
    assert.equal(res.status, 400)
    assert.ok(res.json.error)
  })

  await t.test('POST: negativna cena vrne 400', async () => {
    const res = await req('POST', '/api/projects', {
      ...validProject, materials: [{ name: 'Vijaki', quantity: 1, unitPrice: -1, purchased: false }],
    })
    assert.equal(res.status, 400)
  })

  await t.test('GET: neznan ID vrne 404', async () => {
    const res = await req('GET', '/api/projects/neznan-projekt')
    assert.equal(res.status, 404)
    assert.ok(res.json.error)
  })

  await t.test('neznana pot vrne 404', async () => {
    const res = await req('GET', '/api/other')
    assert.equal(res.status, 404)
  })

  await t.test('OPTIONS: preflight vrne CORS', async () => {
    const res = await req('OPTIONS', '/api/projects')
    assert.equal(res.status, 200)
    assert.equal(res.headers.get('access-control-allow-origin'), '*')
  })

  await t.test('DELETE: brisanje in prazen seznam', async () => {
    const deleted = await req('DELETE', `/api/projects/${id}`)
    assert.equal(deleted.status, 200)
    const list = await req('GET', '/api/projects')
    assert.deepEqual(list.json, [])
  })

  await t.test('preveri obstoj podatkovne datoteke', async () => {
    assert.ok(fs.existsSync(dbPath))
    assert.deepEqual(JSON.parse(fs.readFileSync(dbPath, 'utf8')), { projects: [] })
  })
})
