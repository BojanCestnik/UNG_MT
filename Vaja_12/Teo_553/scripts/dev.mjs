// Zažene React/Vite in Node API z enim ukazom: npm run dev.
// Uporabljamo samo vgrajene module Node.js, brez dodatnih npm paketov.
import { spawn } from 'node:child_process'
import { existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const viteEntry = join(root, 'node_modules', 'vite', 'bin', 'vite.js')
const apiEntry = join(root, 'backend', 'server.cjs')

if (!existsSync(viteEntry)) {
  console.error('\nNapaka: Vite ni nameščen. Najprej v glavni mapi zaženi: npm install\n')
  process.exit(1)
}

console.log('\n=== MOJ PROJEKT ===')
console.log('Zaganjam strežnik in aplikacijo ...')
console.log('V brskalniku odpri: http://localhost:5173\n')

const children = []
let stopping = false

function shutdown(code = 0) {
  if (stopping) return
  stopping = true
  process.exitCode = code
  for (const child of children) {
    if (!child.killed && child.exitCode === null) child.kill('SIGTERM')
  }
  // Ko se oba podprocesa končata, se bo zaključil tudi ta skript.
}

function start(label, entry, args = []) {
  const child = spawn(process.execPath, [entry, ...args], {
    cwd: root,
    stdio: 'inherit',
    env: process.env,
  })
  children.push(child)
  child.once('error', (err) => {
    console.error(`${label}: napaka ob zagonu: ${err.message}`)
    shutdown(1)
  })
  child.once('exit', (code, signal) => {
    if (!stopping) {
      console.error(`${label} se je ustavil (koda: ${code ?? 'neznana'}, signal: ${signal ?? '-'}).`)
      shutdown(code || 1)
    }
  })
  return child
}

process.once('SIGINT', () => shutdown(0))
process.once('SIGTERM', () => shutdown(0))

start('API', apiEntry)
start('Vite', viteEntry, ['--host', '0.0.0.0', '--port', '5173', '--strictPort'])
