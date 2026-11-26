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

  await t.test('skupine in podskupine materiala ter podfaze', async () => {
    const update = {
      ...validProject, materialGroups: [
        { id: 'wood', name: 'Les', parentId: null },
        { id: 'panels', name: 'Plošče', parentId: 'wood' },
      ],
      materials: [
        { id: 'panel1', name: 'Vezana plošča', quantity: 2, unitPrice: 5, purchased: true, groupId: 'panels' },
        { id: 'nails', name: 'Žeblji', quantity: 10, unitPrice: 0.5, purchased: false, groupId: null },
      ],
      phases: [
        { id: 'p1', name: 'Ogrodje', completed: false, subphases: [
          { id: 's1', name: 'Razrez', completed: true },
          { id: 's2', name: 'Vrtanje', completed: false },
        ] },
        { id: 'p2', name: 'Barvanje', completed: true, subphases: [] },
      ],
    }
    const res = await req('PUT', `/api/projects/${id}`, update)
    assert.equal(res.status, 200)
    assert.equal(res.json.materialGroups[1].parentId, 'wood')
    assert.equal(res.json.materials[0].groupId, 'panels')
    assert.equal(res.json.phases[0].completed, false)
    assert.equal(res.json.phases[1].completed, true)
    assert.equal(res.json.phases[0].subphases[0].completed, true)
  })

  await t.test('zavrne skupino z več kot eno ravnjo in manjkajoč groupId', async () => {
    const current = (await req('GET', `/api/projects/${id}`)).json
    const chain = [...current.materialGroups, { id: 'grandchild', name: 'Tretja raven', parentId: 'panels' }]
    assert.equal((await req('PUT', `/api/projects/${id}`, { ...current, materialGroups: chain })).status, 400)
    const orphan = current.materials.map(m => ({ ...m, groupId: 'nonexistent' }))
    assert.equal((await req('PUT', `/api/projects/${id}`, { ...current, materials: orphan })).status, 400)
    assert.equal((await req('GET', `/api/projects/${id}`)).json.materialGroups.length, 2)
  })

  await t.test('nastavitve postavitve se shranijo', async () => {
    const defaults = await req('GET', '/api/settings')
    assert.equal(defaults.status, 200)
    assert.equal(defaults.json.projectView, 'grid')
    const next = { projectView: 'compact', cardSize: 'large', detailView: 'sections', sidebarCollapsed: true }
    assert.deepEqual((await req('PUT', '/api/settings', next)).json, next)
    assert.deepEqual((await req('GET', '/api/settings')).json, next)
    assert.equal((await req('PUT', '/api/settings', { ...next, cardSize: 'gigantic' })).status, 400)
  })

  let imageId
  await t.test('doda, prebere in izbriše JPG/PNG sliko', async () => {
    const png = Buffer.from('89504e470d0a1a0a0000000d49484452000000010000000108060000001f15c4890000000b49444154789c636000020000050001a5f645400000000049454e44ae426082', 'hex')
    const upload = { fileName: 'delavnica.png', mimeType: 'image/png', description: 'Miza', dataBase64: png.toString('base64') }
    const saved = await req('POST', `/api/projects/${id}/images`, upload)
    assert.equal(saved.status, 201)
    assert.equal(saved.json.images.length, 1)
    imageId = saved.json.images[0].id
    const read = await req('GET', `/api/projects/${id}/images/${imageId}`)
    assert.equal(read.status, 200)
    assert.deepEqual(Buffer.from(read.json.dataBase64, 'base64'), png)
    assert.equal(fs.readdirSync(path.join(dir, 'images')).length, 1)
    const noFile = await req('POST', `/api/projects/${id}/images`, { ...upload, mimeType: 'image/jpeg' })
    assert.equal(noFile.status, 400)
    const tooBig = Buffer.concat([Buffer.from('89504e470d0a1a0a', 'hex'), Buffer.alloc(2 * 1024 * 1024, 0)])
    assert.equal((await req('POST', `/api/projects/${id}/images`, { ...upload, dataBase64: tooBig.toString('base64') })).status, 413)
    assert.equal((await req('GET', `/api/projects/${id}`)).json.images.length, 1)
  })

  await t.test('PUT projekta ne more sam prepisati njegovih slik', async () => {
    const current = (await req('GET', `/api/projects/${id}`)).json
    const updated = await req('PUT', `/api/projects/${id}`, { ...current, images: [] })
    assert.equal(updated.status, 200)
    assert.equal(updated.json.images.length, 1)
    assert.equal(updated.json.images[0].id, imageId)
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
    assert.deepEqual(fs.readdirSync(path.join(dir, 'images')), [])
  })

  await t.test('preveri obstoj podatkovne datoteke', async () => {
    assert.ok(fs.existsSync(dbPath))
    const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'))
    assert.deepEqual(db.projects, [])
    assert.equal(db.settings.projectView, 'compact')
  })
})
