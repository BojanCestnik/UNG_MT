import { useEffect, useRef, useState } from 'react'
import type { Project } from '../types'

interface Props {
  projects: Project[]
  selectedId: string | null
  mobileOpen: boolean
  collapsed: boolean
  busy: boolean
  onClose: () => void
  onToggleCollapse: () => void
  onList: () => void
  onCreate: () => void
  onOpen: (id: string) => void
}

export default function ProjectSidebar({ projects, selectedId, mobileOpen, collapsed, busy, onClose,
  onToggleCollapse, onList, onCreate, onOpen }: Props) {
  const [search, setSearch] = useState('')
  const searchRef = useRef<HTMLInputElement>(null)
  const sidebarRef = useRef<HTMLElement>(null)
  useEffect(() => {
    if (!mobileOpen) return
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null
    searchRef.current?.focus()
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
      if (event.key === 'Tab' && sidebarRef.current) {
        const elements = Array.from(sidebarRef.current.querySelectorAll<HTMLElement>('button:not(:disabled), input:not(:disabled)'))
        const first = elements[0]
        const last = elements[elements.length - 1]
        if (event.shiftKey && document.activeElement === first && last) { event.preventDefault(); last.focus() }
        else if (!event.shiftKey && document.activeElement === last && first) { event.preventDefault(); first.focus() }
      }
    }
    document.addEventListener('keydown', closeOnEscape)
    return () => { document.removeEventListener('keydown', closeOnEscape); previousFocus?.focus() }
  }, [mobileOpen, onClose])

  const shown = projects.filter(p => p.name.toLocaleLowerCase('sl').includes(search.toLocaleLowerCase('sl')))
  return <>
    {mobileOpen && <button type="button" aria-label="Zapri stranski meni" onClick={onClose}
      className="fixed inset-0 z-40 bg-[#172820]/50 lg:hidden" />}
    <aside ref={sidebarRef} role={mobileOpen ? 'dialog' : undefined} aria-label="Meni projektov" aria-modal={mobileOpen ? true : undefined}
      className={`fixed inset-y-0 left-0 z-50 flex h-[100dvh] w-[min(85vw,320px)] shrink-0 flex-col border-r border-[#dce7dd] bg-white shadow-lg transition-transform duration-150 lg:sticky lg:top-0 lg:z-10 lg:translate-x-0 lg:shadow-none ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} ${collapsed ? 'lg:w-[76px]' : 'lg:w-[272px]'}`}>
      <div className="flex h-[84px] items-center justify-between gap-2 border-b border-[#e5ebe4] p-4">
        <button type="button" className="flex min-h-11 min-w-0 flex-1 items-center gap-3" title="Prikaži vse projekte" onClick={onList}>
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#e4f1e7] text-lg" aria-hidden="true">🛠️</span>
          <span className={`min-w-0 text-left text-sm font-extrabold tracking-wide text-[#256d5b] ${collapsed ? 'lg:hidden' : ''}`}>MOJ PROJEKT</span>
        </button>
        <button type="button" className="btn-minimal px-3 lg:hidden" onClick={onClose} aria-label="Zapri meni">×</button>
      </div>
      <div className={`flex-1 overflow-y-auto overflow-x-hidden p-3 ${collapsed ? 'lg:px-2' : ''}`}>
        <button className={`btn-primary mb-4 w-full ${collapsed ? 'lg:px-1' : ''}`} onClick={onCreate} disabled={busy} type="button"
          title="Nov projekt"><span className="text-lg">+</span><span className={collapsed ? 'lg:hidden' : ''}> Nov projekt</span></button>
        <div className={collapsed ? 'lg:hidden' : ''}>
          <label className="label" htmlFor="sidebar-search">Hitro iskanje projektov</label>
          <input ref={searchRef} id="sidebar-search" className="field mb-4" placeholder="Poišči projekt ..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <button className={`mb-3 flex min-h-11 w-full items-center gap-3 rounded-xl px-3 text-left text-sm font-semibold hover:bg-[#edf5ef] ${selectedId ? '' : 'bg-[#e9f3ec] text-[#256d5b]'}`}
          type="button" title="Vsi projekti" onClick={onList}>
          <span aria-hidden="true">▦</span><span className={collapsed ? 'lg:hidden' : ''}>Vsi projekti</span>
        </button>
        <p className={`mb-2 px-3 text-xs font-bold uppercase tracking-wide text-[#829188] ${collapsed ? 'lg:hidden' : ''}`}>Projekti ({projects.length})</p>
        <nav aria-label="Hitra izbira projekta" className="space-y-1">
          {shown.map(p => <button type="button" key={p.id} disabled={busy} onClick={() => onOpen(p.id)} title={p.name}
            className={`flex min-h-11 w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm font-semibold transition hover:bg-[#eef5ef]
              ${selectedId === p.id ? 'bg-[#e2f1e7] text-[#256d5b]' : 'text-[#49594d]'}`}>
            <span className="shrink-0 text-xs" aria-hidden="true">●</span>
            <span className={`min-w-0 truncate ${collapsed ? 'lg:hidden' : ''}`}>{p.name}</span>
          </button>)}
          {!shown.length && <p className={`px-3 py-2 text-sm text-[#66736d] ${collapsed ? 'lg:hidden' : ''}`}>Ni zadetkov.</p>}
        </nav>
      </div>
      <button type="button" className="hidden min-h-12 items-center justify-center border-t border-[#e5ebe4] text-sm font-semibold text-[#256d5b] hover:bg-[#f1f7f2] lg:flex"
        onClick={onToggleCollapse} title={collapsed ? 'Razširi meni' : 'Skrči meni'}>
        {collapsed ? '→' : '← Skrči meni'}
      </button>
    </aside>
  </>
}
