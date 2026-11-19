# My Pantry – Monika_416

Preprosta aplikacija za upravljanje živil in iskanje receptov.

## Uporabljene tehnologije
- React
- TypeScript
- Vite
- Tailwind CSS v4
- localStorage za shranjevanje živil

## Zagon
Projekt odpri v Visual Studio Code. V terminalu se postavi v mapo `MyPantry` in zaženi:

```bash
npm install
npm run dev
```

Nato odpri lokalni naslov, ki ga izpiše Vite (običajno `http://localhost:5173`).

## Funkcionalnosti
- dodajanje, urejanje in brisanje živil;
- označevanje pretečenih živil (rdeče), živil z rokom v naslednjih treh dneh (oranžno) in svežih živil (zeleno);
- 24 vnaprej pripravljenih receptov s sestavinami, količinami, časom in navodili;
- predlogi receptov, pri katerih manjkata največ dve sestavini;
- prednost receptom, ki porabijo živila s skorajšnjim rokom uporabe;
- samodejno shranjevanje in obnova podatkov z `localStorage`.

Aplikacija je namenoma ozka (največ 480 px), centrirana in prilagojena mobilnim zaslonom.
