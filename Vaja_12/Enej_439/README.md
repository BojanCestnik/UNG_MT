# Vodni dnevnik

Preprosta aplikacija za beleženje popitih kozarcev vode (cilj: 8 kozarcev po 250 ml).
React + TypeScript, Vite in Tailwind CSS v4. Brez dodatnih paketov.

## Zagon

```
npm install
npm run dev
```

Za izdelavo končne različice: `npm run build` (rezultat je v mapi `dist`).

## Zgradba

- `src/App.tsx` hrani stanje (seznam zapisov) in ga posreduje komponentam
- `src/components/` WaterGlass, EntryList, Controls, ResetButton
- `src/types.ts` tip Entry (id, time, ml)
- `src/index.css` barve in prilagoditve za telefon
