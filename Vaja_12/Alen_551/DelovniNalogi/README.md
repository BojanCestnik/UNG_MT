# Delovni nalogi – mobilna spletna aplikacija

Prva različica (MVP) za vodenje dela v strojni delavnici. Uporabniški vmesnik je v slovenščini.

## Najlažji zagon – en sam CMD terminal

V Raziskovalcu odprite **glavno mapo `DelovniNalogi`** (kjer je `package.json`), v naslovno vrstico vpišite `cmd`, nato izvedite:

```cmd
npm install
npm run dev
```

`npm install` je potreben le ob prvem zagonu. Naslednjič zadošča `npm run dev`.
Ukaz sam zažene backend na vratih 3001 in frontend na vratih 5173. Aplikacija je na **http://localhost:5173**. Terminal pustite odprt; za ustavitev pritisnite **Ctrl+C**.

## Kaj vključuje?

- Pregled delovnih nalogov, ustvarjanje, urejanje, brisanje in arhiv.
- Več operacij na nalog: struženje, rezkanje, vrtanje, brušenje itd.
- Spremljanje stanj in napredka operacij, vrstni red ter merjenje časa.
- Evidenco materialov, zalog in potrjevanje porabe.
- Evidenco orodij, rezervacije, zasedenost, sproščanje in preprečevanje dvojnih rezervacij.
- Iskanje, filtriranje in mobilno navigacijo.
- Trajno shranjevanje podatkov v `backend/data/db.json` prek REST API.

## Prvi zagon na Windows

Potrebujete **Node.js** (priporočena različica 20.19+ ali 22+) in dostop do interneta **samo pri prvem nameščanju standardnih projektnih paketov**.

1. Razširite ZIP v mapo na računalniku.
2. Zaženite `1-ZAZENI-STREZNIK.bat` (API na vratih **3001**).
3. Zaženite `2-ZAZENI-APLIKACIJO.bat` (spletni vmesnik na vratih **5173**).
4. V računalniškem brskalniku odprite **http://localhost:5173**.

Prvi zagon druge datoteke namesti odvisnosti, določene v standardni predlogi Vite + React/TypeScript + Tailwind CSS 4. **Ne namešča drugih funkcionalnih knjižnic.**

## Zagon v terminalu

Terminal 1:

```bash
cd backend
node server.js
```

Terminal 2:

```bash
cd frontend
npm install
npm run dev
```

Nato odprite `http://localhost:5173`.

## Uporaba na telefonu

Telefon in računalnik morata biti v istem lokalnem omrežju. Na telefonu odprite `http://IP-RACUNALNIKA:5173` (primer: `http://192.168.1.20:5173`). Aplikacija avtomatsko uporablja enak naslov za API na vratih 3001.

Na računalniku mora požarni zid dovoljevati vhodni povezavi na vratih **5173 in 3001**. Strežnik Node.js v tem prototipu nima prijave, zato ga **ne izpostavljajte neposredno v javni internet**. Za uporabo samo na istem računalniku dostop prek omrežja ni potreben.

## Kje se hranijo podatki?

`backend/data/db.json` – podatki ostanejo po zaprtju spletnega brskalnika in ponovnem zagonu strežnika. Datoteko občasno varnostno kopirajte. Aplikacija je namenjena **enemu uporabniku** in nima sistema za sočasno ekipno urejanje.

## Omejitve prve različice

Brez prijave, oblačne sinhronizacije, priponk, slik, spletnega naročanja in zunanjih storitev. V sistemu ni knjigovodstva niti avtomatskega načrtovanja zmogljivosti strojev.

## Preverjeno

Strežniški API je bil preizkušen z ustvarjanjem naloga/materiala/orodja, rezervacijo, zavrnitvijo podvojene rezervacije, potrditvijo porabe, zavrnitvijo dvojne porabe ter začetkom in koncem merjenja časa. Sintaksa datoteke React TSX je preverjena. Celotnega frontend builda v tem okolju ni bilo mogoče izvesti, ker namestitev npm paketov ni uspela; po namestitvi na računalniku za preverjanje poženite `npm run build` v mapi `frontend`.
