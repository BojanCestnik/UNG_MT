# MOJ PROJEKT – zagon z npm v eni mapi

Mobilno prilagojena spletna aplikacija za ustvarjanje in spremljanje domačih ali delavniških projektov. Vmesnik je v slovenščini.

## Zagon (Windows CMD, PowerShell ali terminal v VS Code)

1. Razširi arhiv ZIP, nato odpri mapo **Moj_Projekt** (tisto, v kateri je datoteka `package.json`).
2. V tej mapi odpri terminal. V Raziskovalcu Windows lahko klikneš na naslovno vrstico, vneseš `cmd` in pritisneš Enter.
3. Izvedi naslednja ukaza:

   ```cmd
   npm install
   npm run dev
   ```

4. Ko se izpiše naslov Vite, v brskalniku odpri **http://localhost:5173**.
5. Za ustavitev v terminalu pritisni **Ctrl+C**.

**To je vse.** Ni datotek `.bat` in ni potrebe po dveh terminalih. `npm run dev` sam zažene React/Vite **in** Node.js REST API.

### Predpogoji

- Nameščen **Node.js 20.19+ ali 22.12+** (priporočena aktualna različica LTS) z npm.
- V terminalu lahko preveriš `node -v` in `npm -v`.
- Internetno povezavo potrebuješ pri `npm install`, da prenese potrebne odvisnosti.
- Če CMD izpiše »npm is not recognized«, namesti Node.js z [nodejs.org](https://nodejs.org/) in ponovno odpri terminal.
- Če že teče druga aplikacija na vratih 5173 ali 3001, jo pred zagonom ustavi.

### Kam je treba vpisati ukaze?

V **glavni mapi** aplikacije (kjer je `package.json`), **ne** v `src`, `public` ali `backend`.

Primer:

```text
C:\Users\Uporabnik\Documents\Moj_Projekt> npm install
C:\Users\Uporabnik\Documents\Moj_Projekt> npm run dev
```

Ob prvem `npm install` nastaneta `node_modules/` in `package-lock.json`; to je pričakovano.

## Struktura datotek

```text
Moj_Projekt/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── ProjectList.tsx
│   │   ├── ProjectForm.tsx
│   │   ├── ProjectDetail.tsx
│   │   ├── MaterialList.tsx
│   │   ├── PhaseList.tsx
│   │   └── NotesEditor.tsx
│   ├── App.tsx
│   ├── main.tsx
│   ├── index.css
│   ├── api.ts
│   └── types.ts
├── backend/
│   ├── data/db.json
│   └── server.cjs
├── scripts/
│   └── dev.mjs
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
└── README.md
```

Sprednji del uporablja React + TypeScript + Vite + Tailwind CSS v4, zaledni pa Node.js z vgrajenima moduloma `http` in `fs`. Dodatnih paketov za zaledni del ni. Oba procesa zažene `scripts/dev.mjs`, kar uporablja samo Node.js.

## Kaj deluje

- ustvarjanje, urejanje in brisanje projektov;
- seznam materialov (količina, cena na enoto, kupljeno/nekupljeno);
- izračun predvidenih stroškov v evrih;
- urejanje faz in odstotek napredka;
- zapiski in meritve;
- zapis vseh podatkov v `backend/data/db.json`.

### Tehnične podrobnosti

- Spletna aplikacija: `http://localhost:5173`.
- API: `http://127.0.0.1:3001/api/projects`.
- Vite posreduje vse zahteve za `/api` na API na vratih 3001. Zaradi tega tudi telefon uporablja samo naslov frontend strežnika.
- Strežnik deluje lokalno, brez računa in brez baze podatkov.
- Za telefon poveži telefon in računalnik v isto Wi-Fi omrežje, poišči IP računalnika z `ipconfig` in v telefonu odpri `http://IP-RACUNALNIKA:5173`. Po potrebi dovoli vrata **5173** v požarnem zidu.

**Pomembno:** Ne briši `backend/data/db.json`, če želiš ohraniti projekte. V njem so shranjeni vsi podatki; za varnostno kopijo shrani to datoteko.

## Dodatni ukazi (neobvezno)

```cmd
npm run build
npm test
```

`npm run build` preveri TypeScript in ustvari produkcijsko gradnjo v `dist/`.
`npm test` preveri zaledni REST API, brez dodatnih npm paketov.

### Težave

- **»Cannot reach the server« / »Povezava s strežnikom ni uspela«:** Preveri, ali je `npm run dev` še vedno zagnan in ali API ni izpisal napake.
- **»Port 3001 already in use«:** Zapri drug program ali stari strežnik, ki uporablja vrata 3001.
- **»Port 5173 is already in use«:** Zapri drug Vite razvojni strežnik na vratih 5173.
- **»npm install« ne deluje:** Preveri internet, Node.js in nastavitve proxyja na šolskem omrežju.

Aplikacija je namenjena lokalnemu študijskemu projektu in ni primerna za javno objavo brez dodatne zaščite.
