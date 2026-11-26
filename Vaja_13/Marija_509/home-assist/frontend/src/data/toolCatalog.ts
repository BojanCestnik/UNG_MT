export interface CatalogTool { name: string; group: string; pro: boolean }
const t = (group: string, pro: boolean, ...names: string[]): CatalogTool[] => names.map((name) => ({ name, group, pro }))

export const TOOL_CATALOG: CatalogTool[] = [
  ...t('Hand tools', false, 'Hammer', 'Screwdriver', 'Pliers', 'Adjustable wrench', 'Allen key', 'Hand saw', 'File', 'Clamp', 'Utility knife', 'Putty knife', 'Filling knife', 'Scissors'),
  ...t('Measuring', false, 'Tape measure', 'Pencil', 'Torch'),
  ...t('Measuring', true, 'Spirit level', 'Stud finder'),
  ...t('Power & specialist', true, 'Drill', 'Caulking gun', 'Drain snake', 'Pedal wrench', 'Tyre levers'),
  ...t('Painting & sanding', false, 'Paint brush', 'Paint tray', 'Roller', 'Dust sheet', 'Sandpaper', 'Sanding block'),
  ...t('Cleaning', false, 'Brush', 'Bucket', 'Cloth', 'Microfibre cloth', 'Sponge', 'Spray bottle', 'Squeegee', 'Scrubbing brush', 'Toothbrush', 'Plunger'),
  ...t('Sewing', false, 'Needle', 'Pins'),
  ...t('Garden & bike', false, 'Gardening gloves', 'Secateurs', 'Pump'),
]
