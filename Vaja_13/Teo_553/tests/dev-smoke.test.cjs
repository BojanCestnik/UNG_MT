const test = require('node:test')
const assert = require('node:assert/strict')
const { spawn } = require('node:child_process')
const fs = require('node:fs')
const os = require('node:os')
const path = require('node:path')

test('Vite frontend in Node API delujeta skupaj', async t => {
  const root = path.join(__dirname, '..')
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'moj-projekt-dev-'))
  const backend = spawn(process.execPath, [path.join(root, 'backend', 'server.cjs')], {
    cwd: root, env: { ...process.env, PORT: '3001', MOJ_PROJEKT_DB_PATH: path.join(temp, 'db.json') }, stdio: 'ignore',
  })
  const vite = spawn(process.execPath, [path.join(root, 'node_modules', 'vite', 'bin', 'vite.js'), '--host', '127.0.0.1', '--port', '5173', '--strictPort'], {
    cwd: root, stdio: 'ignore',
  })
  t.after(() => { vite.kill(); backend.kill(); fs.rmSync(temp, { recursive: true, force: true }) })
  let ready = false
  for (let attempt = 0; attempt < 120; attempt++) {
    try {
      const [home, api] = await Promise.all([
        fetch('http://127.0.0.1:5173/'), fetch('http://127.0.0.1:5173/api/projects'),
      ])
      if (home.ok && api.ok && (await home.text()).includes('Moj Projekt') && Array.isArray(await api.json())) {
        ready = true; break
      }
    } catch { /* Zagon. */ }
    await new Promise(resolve => setTimeout(resolve, 40))
  }
  assert.equal(ready, true, 'Front end mora posredovati API na backend')
  const module = await fetch('http://127.0.0.1:5173/src/App.tsx')
  assert.equal(module.status, 200)
  assert.ok((await module.text()).includes('ProjectSidebar'))
})
