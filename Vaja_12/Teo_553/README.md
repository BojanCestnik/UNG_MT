# MOJ PROJEKT

Mobilno prilagojena spletna aplikacija za vodenje domačih in delavniških projektov. Celoten uporabniški vmesnik je v slovenščini.

## Kaj aplikacija omogoča?

- ustvarjanje, urejanje, pregled in brisanje projektov;
- seznam materialov, oznako *kupljeno* in samodejni izračun stroškov;
- seznam faz dela, označevanje dokončanih faz in izračun napredka;
- zapisovanje opomb in meritev;
- trajno shranjevanje podatkov v `backend/data/db.json`.

## Kaj potrebuješ?

Računalnik z nameščenim **Node.js 20.19+ ali 22.12+** in npm, ki je vključen v Node.js. Namestitev preveri v ukazni vrstici:

```bash
node -v
npm -v
```

Če Node.js še nimaš, ga namesti z [nodejs.org](https://nodejs.org/).

## Zagon v sistemu Windows (najlažje)

1. Razširi ZIP v izbrano mapo, npr. `Dokumenti/Moj_Projekt`.
2. Dvoklikni **`1_NAMESTI.bat`**. Ob prvi namestitvi mora imeti računalnik internetno povezavo, da npm prenese predpisane pakete za React in Tailwind.
3. Dvoklikni **`2_ZAZENI.bat`**. Odprli se bosta dve okni terminala (strežnik in aplikacija). Obe pusti odprti.
4. V brskalniku odpri **http://localhost:5173**.
5. Za zaustavitev zapri obe okni ali pritisni `Ctrl+C` v vsakem.

Če Windows skript prepreči zagon, izvedi spodnje ukaze ročno.

## Ročni zagon (Windows, macOS ali Linux)

**Prvič – namestitev odvisnosti** v terminalu:

```bash
cd frontend
npm install
```

**Terminal 1 – zaledni strežnik** (iz korenske mape projekta):

```bash
cd backend
npm start
```

Strežnik se zažene na **http://localhost:3001**.

**Terminal 2 – uporabniški vmesnik**:

```bash
cd frontend
npm run dev
```

V brskalniku odpri **http://localhost:5173**.

**Testiranje gradnje v produkcijski obliki:** `cd frontend && npm run build`.

## Uporaba na telefonu

Telefon in računalnik morata biti v istem Wi-Fi omrežju. V računalniku poišči njegov lokalni IP naslov (na Windows z ukazom `ipconfig`); na telefonu odpri `http://IP-RACUNALNIKA:5173`, na primer `http://192.168.1.20:5173`. Potrebna je dovoljena povezava do vrat **5173** in **3001** v požarnem zidu. Računalnik in oba terminala morajo ostati prižgani. To je spletna aplikacija za zaslon telefona, ne aplikacija, nameščena iz trgovine.

## Kako so organizirane datoteke?

```text
Moj_Projekt/
  1_NAMESTI.bat             # prva namestitev na Windows
  2_ZAZENI.bat              # zagon strežnika in vmesnika na Windows
  backend/
    server.js               # REST API, samo vgrajena modula http in fs
    data/db.json            # vsi shranjeni projekti
    package.json
  frontend/
    src/
      App.tsx               # izbira zaslona in glavno stanje
      api.ts                # klici REST API (fetch)
      types.ts              # podatkovni tipi in izračuni
      components/           # seznam, obrazec, podrobnosti, material, faze, zapiski
    package.json
    vite.config.ts          # React + Tailwind CSS v4
```

## REST API

| Metoda | Pot | Namen |
|---|---|---|
| GET | `/api/projects` | Vrne seznam projektov |
| GET | `/api/projects/:id` | Vrne izbrani projekt |
| POST | `/api/projects` | Ustvari projekt |
| PUT | `/api/projects/:id` | Shrani spremembe projekta |
| DELETE | `/api/projects/:id` | Izbriše projekt |

Vsi odgovori so JSON. Neveljavni vnosi imajo napako HTTP 400, neobstoječi projekti napako 404. Sprednji del uporablja `fetch`, zaledni del modul `http`, podatki pa se zapisujejo s `fs`.

### Primer podatkov projekta

```json
{
  "name": "Delavniška miza",
  "description": "Izdelava lesene mize za delavnico",
  "startDate": "2026-11-19",
  "status": "in_progress",
  "materials": [],
  "phases": [],
  "notes": "Mere: 120 × 60 cm"
}
```

## Pomembno

- **Podatki so lokalni** na računalniku, na katerem teče strežnik. Če izbrišeš ali prepišeš `backend/data/db.json`, izgubiš projekte; za varnostno kopijo shrani to datoteko.
- Aplikacija nima uporabniških računov, oddaljenega oblaka, fotografij, skic ali spletne trgovine. Namenjena je študijskemu prototipu in uporabi na zaupanja vrednem domačem omrežju, ne javni objavi brez dodatne zaščite.
- Če se pokaže »Povezava s strežnikom ni uspela«, preveri, ali je odprto okno z `npm start` v `backend` in nato klikni »Poskusi znova«.
- Potrebuješ internet **samo pri prvi namestitvi npm paketov**; med lokalno uporabo ga ne potrebuješ.
