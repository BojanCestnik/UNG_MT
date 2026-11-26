# MOJ PROJEKT – razširjena različica

Odzivna spletna aplikacija za vodenje domačih in delavniških projektov. Deluje na računalniku, tablici in telefonu, tudi če računalnik internetno povezavo prejema prek mobilne dostopne točke telefona.

## Najlažji zagon: samo dva ukaza

Na računalniku mora biti nameščen **Node.js 20.19+ ali 22.12+**. Odpri CMD v glavni mapi `Moj_Projekt` (tam, kjer je `package.json`):

```cmd
npm install
npm run dev
```

V brskalniku odpri **http://localhost:5173**. En sam ukaz `npm run dev` zažene React/Vite in Node.js REST API. **Datotek `.bat` ni.**

Prvi ukaz potrebuje internet. Ko sta oba programa zagnana, lahko aplikacijo uporabljaš v domačem omrežju brez nadaljnjega dostopa do interneta. Zaledni strežnik mora ves čas ostati zagnan.

### Dostop s telefona

1. Računalnik in telefon naj bosta v istem omrežju. Lahko uporabljaš tudi **mobilno dostopno točko telefona**, na katero je povezan računalnik.
2. Na računalniku pusti odprt CMD z `npm run dev`.
3. V CMD se izpiše **Network: http://IP-RACUNALNIKA:5173/**. Ta naslov odpri na telefonu, npr. `http://192.168.43.105:5173`.
4. Če se stran ne odpre, preveri požarni zid Windows za *zasebno omrežje* (vrata 5173). API se prenaša prek Vite, zato telefona ni treba neposredno povezovati na vrata 3001.

## Nove funkcije

- **Levi meni s projekti:** hitro preklapljanje projektov, iskanje in možnost skrčenja. Na telefonu se odpre z gumbom »Meni«.
- **Responsive, celozaslonski prikaz:** telefon ima en stolpec; tablica in računalnik več stolpcev; na računalniku vsebina zapolni celotno razpoložljivo širino.
- **Trije načini prikaza:** mreža, seznam in kompaktno. Mreža ima majhne, srednje in velike kartice.
- **Zavihki:** Pregled, Material, Faze dela, Zapiski in meritve ter Slike. Namesto njih lahko izbereš »Vsi razdelki«.
- **Materiali v skupinah in podskupinah:** možnost razvrščanja materialov v dve ravni. Stroški ostanejo pravilni tudi, ko so skupine zaprte.
- **Faze in podfaze:** vsako fazo lahko razdeliš na podopravila. Napredek se računa iz končnih opravil brez dvojnega štetja.
- **Slike projektov:** do 6 slik na projekt (JPG, PNG, WebP), največ 2 MB na sliko. Slike so na računalniku shranjene kot datoteke.
- **Stari projekti delujejo:** obstoječi projekti brez novih polj se samodejno dopolnijo, ko jih aplikacija odpre.

## Pomembno: ohranitev prejšnjih projektov

V novi različici je namenoma **ni priložene prazne datoteke `backend/data/db.json`**, da z razširjanjem ZIP ne prepišeš svojih projektov. Če želiš uporabljati iste projekte kot prej:

1. Zapri prejšnji `npm run dev` (Ctrl+C).
2. Iz prejšnje mape kopiraj **`backend/data/db.json`** v enako mapo nove različice.
3. Če si že uporabljal slike v morebitni novejši različici, skopiraj tudi mapo **`backend/data/images/`**.
4. Šele nato zaženi novo različico. Strežnik bo manjkajoče mape/datoteko sam ustvaril, če še ne obstajajo.

**Ne briši te datoteke ali mape `images/`, če želiš ohraniti podatke.** Za varnostno kopijo oboje shrani na drugo mesto. Vse slike so lokalne; aplikacija jih ne nalaga na spletne strežnike.

## Dodatni ukazi

```cmd
npm run build
npm test
```

`npm run build` preveri TypeScript in sestavi kodo v `dist/`. `npm test` preveri REST API, stroške/skupine, podfaze, slike, nastavitve in lokalni razvojni strežnik.

## Datoteke projekta

```text
Moj_Projekt/
├── index.html
├── package.json            # npm install, npm run dev
├── vite.config.ts
├── public/
├── src/
│   ├── App.tsx
│   ├── types.ts
│   ├── api.ts
│   ├── index.css
│   └── components/         # meni, projekti, materiali, faze, slike ...
├── backend/
│   ├── server.cjs
│   ├── storage.cjs
│   └── data/               # db.json in images/ se ustvarita ob prvem zagonu
├── scripts/dev.mjs
└── tests/
```

Zaledni del uporablja samo vgrajene module Node.js. Podatki in nastavitve so v `backend/data/db.json`, fotografije so v `backend/data/images`. Sprednji del ne uporablja localStorage za projektne podatke. Zaslon in meni delujeta tudi s tipkovnico.

### REST API

| Zahteva | Pot | Namen |
|---|---|---|
| GET/POST | `/api/projects` | Pridobitev in ustvarjanje projektov |
| GET/PUT/DELETE | `/api/projects/:id` | Podrobnosti, spremembe in brisanje projekta |
| GET/PUT | `/api/settings` | Nastavitve postavitve |
| POST | `/api/projects/:id/images` | Dodajanje slike z JSON/base64 |
| GET/DELETE | `/api/projects/:id/images/:imageId` | Prikaz in brisanje slike |

Napake imajo JSON obliko `{ "error": "sporočilo" }`. API deluje lokalno na vratih 3001, Vite (vrata 5173) pa zahtevke `/api` posreduje vanj.

## Omejitve

To je študijski prototip za **zaupanja vredno zasebno omrežje**, ne javna spletna storitev. Nima prijave ali upravljanja dovoljenj, zato ga ne objavljaj na odprtem internetu. Aplikacija ne uporablja AI ali storitev v oblaku in ni namestljiva APK različica. Za Android APK je potrebna ločena prilagoditev s Capacitorjem.
