import { useEffect, useRef, useState } from 'react'
import type { DiagnoseResult, Guide } from '../types'
import { diagnose } from '../api/api'
import { resizeImage } from '../utils/resizeImage'
import { compareTools } from '../utils/compareTools'
import SafetyBox from '../components/SafetyBox'

interface Props { ownedTools: string[]; onOpenGuide: (guide: Guide) => void }

const waiting = ['Taking a close look…', 'Figuring out what went wrong…', 'Picking the easiest fix…', 'Writing your steps…']

export default function ScanScreen({ ownedTools, onOpenGuide }: Props) {
  const [photo, setPhoto] = useState('')
  const [note, setNote] = useState('')
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState(0)
  const [result, setResult] = useState<DiagnoseResult | null>(null)
  const [error, setError] = useState('')
  const [dragging, setDragging] = useState(false)
  const input = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!busy) return
    const id = setInterval(() => setMsg((m) => (m + 1) % waiting.length), 2200)
    return () => clearInterval(id)
  }, [busy])

  async function pick(file: File | undefined) {
    if (!file) return
    if (!file.type.startsWith('image/')) { setError('Please choose a photo (JPG or PNG).'); return }
    setError(''); setResult(null)
    try { setPhoto(await resizeImage(file)) } catch { setError('I could not open that photo. Try another one.') }
  }

  async function look() {
    setBusy(true); setError(''); setResult(null); setMsg(0)
    try { setResult(await diagnose(photo, note)) }
    catch (e) { setError(e instanceof Error ? e.message : 'Something went wrong.') }
    finally { setBusy(false) }
  }

  function reset() { setPhoto(''); setNote(''); setResult(null); setError('') }

  return (
    <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-2">
      <section className="glass flex flex-col gap-4 rounded-3xl p-5">
        <div>
          <h2 className="text-2xl font-bold">Show me what's broken</h2>
          <p className="text-slate-600">Snap a photo and I'll tell you what I think is going on and how to fix it, one calm step at a time.</p>
        </div>

        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => { e.preventDefault(); setDragging(false); pick(e.dataTransfer.files[0]) }}
          className={'flex min-h-56 flex-col items-center justify-center gap-2 overflow-hidden rounded-2xl border-2 border-dashed text-center transition-colors ' + (dragging ? 'border-violet-400 bg-violet-50' : 'border-sky-300 bg-white/60')}>
          {photo ? (
            <img src={photo} alt="Your photo" className="max-h-72 w-full object-cover" />
          ) : (
            <button onClick={() => input.current?.click()} className="flex min-h-56 w-full flex-col items-center justify-center gap-2 p-6">
              <span className="text-5xl">📷</span>
              <span className="text-lg font-semibold">Take or choose a photo</span>
              <span className="text-sm text-slate-500">or drop one here</span>
            </button>
          )}
        </div>
        <input ref={input} type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => pick(e.target.files?.[0])} />

        {photo && (
          <>
            <label className="flex flex-col gap-1 text-sm font-semibold">Anything I should know? (optional)
              <input value={note} onChange={(e) => setNote(e.target.value)} maxLength={300} placeholder="e.g. it started dripping yesterday"
                className="min-h-11 rounded-xl border border-sky-200 bg-white/80 px-4 font-normal" />
            </label>
            <div className="flex gap-3">
              <button onClick={reset} disabled={busy} className="min-h-11 rounded-xl border-2 border-teal-500 bg-white/80 px-5 font-semibold disabled:opacity-50">Different photo</button>
              <button onClick={look} disabled={busy} className="btn-primary min-h-11 flex-1 rounded-xl font-semibold text-white disabled:opacity-60">
                {busy ? waiting[msg] : '✨ Look at my problem'}
              </button>
            </div>
          </>
        )}
        {error && <p role="alert" className="rounded-xl bg-rose-50 p-3 text-rose-800 ring-1 ring-rose-200">{error}</p>}
      </section>

      <section className="flex flex-col gap-4">
        {!result && !busy && (
          <div className="glass rounded-3xl p-5">
            <p className="mb-2 text-lg font-semibold">For the best result</p>
            <ul className="flex flex-col gap-2 text-slate-700">
              <li>💡 Use good light, no flash glare</li>
              <li>🔍 Get close so the problem fills the photo</li>
              <li>📐 Add a second shot if it helps, and tell me what you notice</li>
            </ul>
          </div>
        )}
        {busy && (
          <div className="glass flex flex-col items-center gap-3 rounded-3xl p-10 text-center">
            <span className="text-5xl motion-safe:animate-bounce">🔎</span>
            <p className="text-lg font-semibold">{waiting[msg]}</p>
            <p className="text-slate-500">This usually takes a few seconds.</p>
          </div>
        )}
        {result?.status === 'unclear' && (
          <div className="glass rounded-3xl p-6">
            <p className="mb-1 text-lg font-semibold">🤔 I'm not quite sure yet</p>
            <p className="text-slate-700">{result.message}</p>
          </div>
        )}
        {result?.status === 'professional' && (
          <div role="alert" className="overflow-hidden rounded-3xl bg-gradient-to-br from-rose-50 to-orange-50 p-6 ring-1 ring-red-200 shadow-[0_8px_24px_rgba(229,72,77,.18)]">
            <p className="mb-2 text-xl font-bold text-red-900">📞 This one is for a professional</p>
            <p className="text-red-800">{result.reason}</p>
            <p className="mt-3 text-sm text-red-800/80">I haven't written steps for this on purpose. It isn't safe to fix yourself.</p>
          </div>
        )}
        {result?.status === 'ok' && <GuidePreview guide={result.guide} ownedTools={ownedTools} onOpen={() => onOpenGuide(result.guide)} />}
      </section>
    </div>
  )
}

function GuidePreview({ guide, ownedTools, onOpen }: { guide: Guide; ownedTools: string[]; onOpen: () => void }) {
  const { have, missing } = compareTools(guide.tools, ownedTools)
  return (
    <div className="glass flex flex-col gap-4 rounded-3xl p-5">
      <p className="w-fit rounded-full bg-violet-100 px-3 py-1 text-sm font-semibold text-violet-800">✨ Written by AI from your photo. Double-check before you start.</p>
      <div className="flex items-center gap-3">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-teal-100 to-violet-100 text-3xl">{guide.emoji}</span>
        <div><h3 className="text-xl font-bold">{guide.title}</h3><p className="tabular-nums text-slate-600">{guide.minutes} min · {guide.difficulty}</p></div>
      </div>
      {guide.summary && <p className="text-lg leading-relaxed">{guide.summary}</p>}
      <div className="rounded-2xl bg-white/70 p-4">
        <p className="mb-2 font-semibold">{missing.length === 0 ? '✅ You have all the tools' : 'You will need'}</p>
        <div className="flex flex-wrap gap-2">
          {guide.tools.map((t) => <span key={t} className={'rounded-full px-3 py-1 text-sm ring-1 ' + (have.includes(t) ? 'bg-emerald-50 text-emerald-800 ring-emerald-200' : 'bg-amber-50 text-amber-900 ring-amber-200')}>{have.includes(t) ? '✓ ' : ''}{t}</span>)}
          {guide.materials.map((m) => <span key={m} className="rounded-full bg-sky-50 px-3 py-1 text-sm text-sky-900 ring-1 ring-sky-200">{m}</span>)}
        </div>
      </div>
      {guide.safetyNotes.length > 0 && <SafetyBox notes={guide.safetyNotes} />}
      <button onClick={onOpen} className="btn-primary min-h-12 rounded-xl text-lg font-semibold text-white">Start the repair →</button>
    </div>
  )
}
