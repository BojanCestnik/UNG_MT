// Run the API and Vite together with `npm run dev`, without extra packages.
const { spawn } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const viteCandidates = [
  path.join(root, 'node_modules', 'vite', 'bin', 'vite.js'),
  path.join(root, 'frontend', 'node_modules', 'vite', 'bin', 'vite.js'),
];
const vite = viteCandidates.find((candidate) => fs.existsSync(candidate));

if (!vite) {
  console.error('\nManjkajo potrebni paketi. Najprej v tej mapi pozeni: npm install\n');
  process.exit(1);
}

const children = [];
let stopping = false;
function stop(code = 0) {
  if (stopping) return;
  stopping = true;
  for (const child of children) {
    if (child.exitCode === null && !child.killed) child.kill();
  }
  // On Windows Ctrl+C stops the launched processes as part of the console job.
  process.exitCode = code;
}

function launch(label, args, cwd) {
  const child = spawn(process.execPath, args, { cwd, stdio: 'inherit', windowsHide: false });
  children.push(child);
  child.on('error', (error) => {
    console.error(`${label}: ${error.message}`);
    stop(1);
  });
  child.on('exit', (code, signal) => {
    if (!stopping) {
      console.error(`${label} se je ustavil (${signal || code}).`);
      stop(code || 1);
    }
  });
}

console.log('Zaganjam streznik na http://localhost:3001 in aplikacijo na http://localhost:5173');
launch('Backend', [path.join(root, 'backend', 'server.js')], root);
launch('Frontend', [vite, '--host', '0.0.0.0'], path.join(root, 'frontend'));
process.on('SIGINT', () => stop(0));
process.on('SIGTERM', () => stop(0));
