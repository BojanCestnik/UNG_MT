// Photo -> AI -> a brand-new repair guide. The API key stays here, never in the browser.
const fs = require('fs');
const path = require('path');

// Tiny .env reader (so you don't need extra packages)
try {
  for (const line of fs.readFileSync(path.join(__dirname, '.env'), 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z_]+)\s*=\s*(.*?)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
} catch {}

const MODEL = process.env.ANTHROPIC_MODEL || 'claude-sonnet-5-5';
const DANGER = /(wall socket|rewir|fuse box|consumer unit|live wire|mains (power|electric|water)|gas (leak|pipe|boiler|cooker|hob)|boiler|water main|stop ?cock)/i;

// Simple in-memory limit: 20 scans per hour for the whole app
const stamps = [];
function underLimit() {
  const now = Date.now();
  while (stamps.length && now - stamps[0] > 3600000) stamps.shift();
  if (stamps.length >= 20) return false;
  stamps.push(now);
  return true;
}

function fail(status, message) { const e = new Error(message); e.status = status; return e; }

function systemPrompt(toolNames) {
  return `You are a warm, patient home-repair helper inside an app for beginners. The user sends a photo of something broken at home.
Reply with ONE JSON object and nothing else.

Choose a status:
- "professional": the problem involves mains electricity, wiring, sockets, fuse boxes, gas (pipes, boilers, cooker), or water-mains/stopcock/major leaks or flooding, structural damage, or anything that could seriously hurt someone. Give NO repair steps. Fill "reason" with a kind, short explanation and "kind" with "electrical", "gas" or "water".
- "unclear": the photo is too dark/blurry, shows no problem, or is not a home repair. Fill "message" with a friendly request for a better photo and what to show.
- "ok": a safe small DIY repair. Fill "guide".

"guide" fields: title (short), summary (1-2 friendly sentences explaining what you see and why it happens), category (one of Plumbing, Furniture, Walls & doors, Clothes, Security, Appliances, Garden, Bikes, Kitchen & cleaning), emoji (one), difficulty ("easy"|"medium"|"hard"), minutes (number), tools (array), materials (array), safetyNotes (1-3 short items), steps (4-9 items).
Every step starts with one fitting emoji, then one plain, friendly sentence a beginner can follow. Optional tip: append " | tip: short tip" to a step.
For "tools", use exact names from this list when they fit: ${toolNames.join(', ')}. Add other names only if really needed.
Write like a kind neighbour: simple words, no jargon, no scary language. Never invent certainty: if unsure, say so in the summary.`;
}

async function diagnose({ photo, note }, toolNames) {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) throw fail(503, 'The AI helper is not set up yet. Add ANTHROPIC_API_KEY to backend/.env and restart the backend.');
  if (typeof photo !== 'string' || !photo.startsWith('data:image/')) throw fail(400, 'Please send a photo.');
  if (!underLimit()) throw fail(429, 'That is a lot of scans for now. Please try again in a little while.');

  const m = photo.match(/^data:(image\/(?:jpeg|png|webp|gif));base64,(.+)$/);
  if (!m) throw fail(400, 'Please use a JPG or PNG photo.');

  let res;
  try {
    res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-api-key': key, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 1800,
        system: systemPrompt(toolNames),
        messages: [{ role: 'user', content: [
          { type: 'image', source: { type: 'base64', media_type: m[1], data: m[2] } },
          { type: 'text', text: note ? 'What the user says: ' + String(note).slice(0, 300) : 'Please look at my problem.' },
        ] }],
      }),
      signal: AbortSignal.timeout(60000),
    });
  } catch {
    throw fail(502, 'Could not reach the AI service. Check your internet connection.');
  }
  if (!res.ok) throw fail(502, res.status === 401 ? 'The API key was rejected. Check backend/.env.' : 'The AI service had a problem. Please try again.');

  const data = await res.json();
  const text = (data.content || []).filter((b) => b.type === 'text').map((b) => b.text).join('');
  let out;
  try { out = JSON.parse(text.slice(text.indexOf('{'), text.lastIndexOf('}') + 1)); }
  catch { throw fail(502, 'The answer was garbled. Please try again.'); }

  if (out.status === 'professional') {
    return { status: 'professional', kind: String(out.kind || ''), reason: String(out.reason || 'This one is best left to a professional.') };
  }
  if (out.status !== 'ok' || !out.guide) {
    return { status: 'unclear', message: String(out.message || 'I could not see the problem clearly. Try a closer photo in good light.') };
  }

  const g = out.guide;
  const list = (a, max) => (Array.isArray(a) ? a.map(String).filter(Boolean).slice(0, max) : []);
  const steps = list(g.steps, 12);
  if (steps.length < 3) return { status: 'unclear', message: 'I could not work out clear steps from that photo. Could you try another one?' };
  const guide = {
    id: 'ai-' + Date.now(),
    title: String(g.title || 'Home repair').slice(0, 80),
    object: 'Photo scan',
    problem: 'AI scan',
    difficulty: ['easy', 'medium', 'hard'].includes(g.difficulty) ? g.difficulty : 'medium',
    minutes: Math.min(240, Math.max(5, Number(g.minutes) || 30)),
    category: 'AI scan',
    emoji: String(g.emoji || '✨').slice(0, 4),
    summary: String(g.summary || '').slice(0, 500),
    tools: list(g.tools, 12),
    materials: list(g.materials, 12),
    safetyNotes: list(g.safetyNotes, 4),
    steps,
  };
  // Safety net in code, in case the AI misses a dangerous topic
  if (DANGER.test([guide.title, guide.summary, ...steps].join(' '))) {
    return { status: 'professional', kind: '', reason: 'This looks like electrical, gas or water-mains work. Please call a qualified professional.' };
  }
  return { status: 'ok', guide };
}

module.exports = { diagnose };
