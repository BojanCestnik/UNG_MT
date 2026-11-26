import { useEffect, useRef, useState, type ChangeEvent } from 'react'
import type { Project, ProjectImage } from '../types'
import { api } from '../api'

interface Props {
  project: Project
  busy: boolean
  onAdd: (file: File, description: string) => Promise<boolean>
  onDelete: (imageId: string) => Promise<boolean>
}

export function readFileBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(new Error('Slike ni mogoče prebrati.'))
    reader.onload = () => {
      const result = reader.result
      if (typeof result !== 'string' || !result.includes(',')) reject(new Error('Neveljavna slika.'))
      else resolve(result.slice(result.indexOf(',') + 1))
    }
    reader.readAsDataURL(file)
  })
}

export default function ProjectImages({ project, busy, onAdd, onDelete }: Props) {
  const [file, setFile] = useState<File | null>(null)
  const [description, setDescription] = useState('')
  const [error, setError] = useState('')
  const [imageUrls, setImageUrls] = useState<Record<string, string>>({})
  const [viewing, setViewing] = useState<ProjectImage | null>(null)
  const [uploading, setUploading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const ids = project.images.map(image => image.id).join(',')
  useEffect(() => {
    let active = true
    for (const image of project.images) {
      void api.loadImage(project.id, image.id).then(payload => {
        if (active) setImageUrls(prev => ({ ...prev, [image.id]: `data:${payload.mimeType};base64,${payload.dataBase64}` }))
      }).catch(() => { if (active) setError('Nekaterih slik ni bilo mogoče naložiti.') })
    }
    return () => { active = false }
  }, [project.id, ids])

  useEffect(() => {
    if (!viewing) return
    const onEscape = (event: KeyboardEvent) => { if (event.key === 'Escape') setViewing(null) }
    document.addEventListener('keydown', onEscape)
    return () => document.removeEventListener('keydown', onEscape)
  }, [viewing])

  function choose(event: ChangeEvent<HTMLInputElement>) {
    const selected = event.target.files?.[0] ?? null
    setFile(null)
    if (!selected) return
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(selected.type)) {
      setError('Dovoljene so samo slike JPG, PNG in WebP.'); event.target.value = ''; return
    }
    if (selected.size > 2 * 1024 * 1024) {
      setError('Slika je prevelika. Največja velikost je 2 MB.'); event.target.value = ''; return
    }
    setError(''); setFile(selected)
  }
  async function add() {
    if (!file || uploading || busy) return
    setUploading(true); setError('')
    try {
      if (await onAdd(file, description.trim())) {
        setFile(null); setDescription('')
        if (inputRef.current) inputRef.current.value = ''
      }
    } catch {
      setError('Slike ni mogoče dodati.')
    } finally { setUploading(false) }
  }
  async function remove(image: ProjectImage) {
    if (!window.confirm(`Ali res želiš izbrisati sliko »${image.originalName}«?`)) return
    if (await onDelete(image.id)) {
      setViewing(null)
      setImageUrls(prev => { const next = { ...prev }; delete next[image.id]; return next })
    }
  }

  return <section className="panel p-4 sm:p-5" aria-labelledby="images-heading">
    <div className="flex flex-wrap items-center justify-between gap-2">
      <h2 id="images-heading" className="text-lg font-bold">Slike projekta</h2>
      <span className="text-sm text-[#66736d]">{project.images.length}/6 slik</span>
    </div>
    <p className="mt-1 text-sm text-[#718077]">Fotografije projekta na enem mestu. JPG, PNG ali WebP, do 2 MB.</p>
    {error && <p className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-[#B91C1C]" role="alert">{error}</p>}
    {project.images.length === 0 && <p className="mt-4 rounded-xl bg-[#f6f8f5] p-4 text-sm text-[#66736d]">Za ta projekt še ni slik.</p>}
    {project.images.length > 0 && <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
      {project.images.map(image => <div className="overflow-hidden rounded-xl border border-[#e1e8e0]" key={image.id}>
        <button type="button" className="block aspect-[4/3] w-full overflow-hidden bg-[#f2f5f1]" disabled={!imageUrls[image.id]} onClick={() => setViewing(image)}
          aria-label={`Povečaj sliko ${image.originalName}`}>
          {imageUrls[image.id] ? <img src={imageUrls[image.id]} alt={image.description || image.originalName} loading="lazy" className="h-full w-full object-cover" />
            : <span className="text-sm text-[#718077]">Nalaganje ...</span>}
        </button>
        <div className="p-3">
          <p className="truncate text-sm font-semibold" title={image.originalName}>{image.originalName}</p>
          {image.description && <p className="mt-1 text-xs text-[#66736d]">{image.description}</p>}
          <button type="button" className="action-link mt-2 text-[#B91C1C]" disabled={busy} onClick={() => void remove(image)}>Izbriši sliko</button>
        </div>
      </div>)}
    </div>}
    {project.images.length < 6 && <div className="mt-5 rounded-xl border border-dashed border-[#bbd2c4] bg-[#fafcf9] p-4">
      <label className="label" htmlFor="image-file">Dodaj fotografijo</label>
      <input ref={inputRef} className="field" id="image-file" type="file" accept="image/jpeg,image/png,image/webp" onChange={choose} disabled={busy || uploading} />
      <label className="label mt-3" htmlFor="image-description">Opis (neobvezno)</label>
      <input className="field" id="image-description" maxLength={160} value={description} onChange={event => setDescription(event.target.value)}
        placeholder="Npr. Končana konstrukcija" disabled={busy || uploading} />
      <button type="button" className="btn-primary mt-3" disabled={!file || busy || uploading} onClick={() => void add()}>
        {busy || uploading ? 'Shranjevanje ...' : 'Dodaj sliko'}
      </button>
    </div>}
    {viewing && imageUrls[viewing.id] && <div role="dialog" aria-label="Večji prikaz slike" aria-modal="true"
      className="fixed inset-0 z-[90] flex items-center justify-center bg-black/85 p-4" onClick={() => setViewing(null)}>
      <div className="flex max-h-full w-full max-w-5xl flex-col items-center gap-3" onClick={event => event.stopPropagation()}>
        <button type="button" autoFocus className="btn-secondary self-end" onClick={() => setViewing(null)}>Zapri ×</button>
        <img src={imageUrls[viewing.id]} alt={viewing.description || viewing.originalName} className="max-h-[75vh] max-w-full object-contain" />
        <p className="text-center text-sm text-white">{viewing.description || viewing.originalName}</p>
      </div>
    </div>}
  </section>
}
