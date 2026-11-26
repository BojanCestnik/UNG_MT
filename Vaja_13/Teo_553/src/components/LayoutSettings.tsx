import type { Settings } from '../types'

interface Props { settings: Settings; busy: boolean; onChange: (settings: Settings) => Promise<void> }

export default function LayoutSettings({ settings, busy, onChange }: Props) {
  return <section className="panel mb-6 p-4" aria-label="Nastavitve prikaza">
    <div className="flex flex-wrap items-end gap-x-5 gap-y-3">
      <div className="min-w-[145px] flex-1">
        <label className="label" htmlFor="view-mode">Prikaz projektov</label>
        <select className="field" id="view-mode" disabled={busy} value={settings.projectView}
          onChange={e => void onChange({ ...settings, projectView: e.target.value as Settings['projectView'] })}>
          <option value="grid">Mreža</option><option value="list">Seznam</option><option value="compact">Kompaktno</option>
        </select>
      </div>
      <div className="min-w-[145px] flex-1">
        <label className="label" htmlFor="card-size">Velikost kartic</label>
        <select className="field" id="card-size" disabled={busy || settings.projectView !== 'grid'} value={settings.cardSize}
          onChange={e => void onChange({ ...settings, cardSize: e.target.value as Settings['cardSize'] })}>
          <option value="small">Majhne</option><option value="medium">Srednje</option><option value="large">Velike</option>
        </select>
      </div>
      <div className="min-w-[145px] flex-1">
        <label className="label" htmlFor="detail-mode">Podrobnosti projekta</label>
        <select className="field" id="detail-mode" disabled={busy} value={settings.detailView}
          onChange={e => void onChange({ ...settings, detailView: e.target.value as Settings['detailView'] })}>
          <option value="tabs">Zavihki</option><option value="sections">Vsi razdelki</option>
        </select>
      </div>
    </div>
  </section>
}
