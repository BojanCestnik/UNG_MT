# Delovni nalogi – mobilna spletna aplikacija

Razširjena različica (MVP 2.0) za vodenje dela v strojni delavnici. Uporabniški vmesnik je v slovenščini.

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
- **Strojni park:** CNC stružnice, CNC rezkalni stroji, klasični stroji, brusilniki, žage in vrtalni stroji; urejanje stanja in urnih postavk.
- **Kalkulacija operacij:** pripravljalni čas + čas na kos × število kosov, izbira stroja, lastna urna postavka in dodatni stroški.
- Ločen prikaz predvidenega in dejanskega časa ter cene za vsako obdelavo in delovni nalog.
- Preverjanje zasedenosti stroja: dve operaciji ne moreta hkrati potekati na istem stroju.
- Iskanje, filtriranje in mobilno navigacijo.
- Trajno shranjevanje podatkov v `backend/data/db.json` prek REST API.

## Kako se izračuna cena obdelave?

**Predvidene minute = priprava (min) + obdelava na kos (min) × količina kosov.** Če sta oba podatka 0, uporabi aplikacija osnovno oceno časa.

**Predvidena cena = predvidene minute / 60 × urna postavka + dodatni strošek.** Dejanski obračun uporablja zabeležene minute in enako urno postavko. Prikazani zneski so **informativni, brez materiala in DDV**. Priloženih pet strojev ima **izmišljene zgledne urne postavke**, ki jih nastavi na dejanske vrednosti svoje delavnice. Delovni nalogi, orodja in materiali so na začetku prazni.

V podrobnostih delovnega naloga klikni **Dodaj operacijo**, nato pri posamezni operaciji **Kalkulacija**, izberi stroj in vnesi čase.

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

## Preverjanje razširitve

Strežniški API za stroje in zaščita pred sočasnim izvajanjem dveh operacij na istem stroju sta bila preizkušena. Skladnost sintakse TSX je preverjena; celotnega frontend builda ni bilo mogoče izvesti brez namestitve npm paketov v tem okolju. Po `npm install` lahko preveriš tudi `npm run build`.


## Prilagodljiva postavitev (PRO 2.1)

- **Telefon (320–767 px):** spodnja navigacija, prelomljivi gumbi, obrazci v enem stolpcu in kartice, ki se prilagodijo širini zaslona. Pri zelo ozkih telefonih je spodnja navigacija vodoravno pomična.
- **Tablica (768–1023 px):** ožji stranski meni in prilagodljiva razporeditev vsebine.
- **Računalnik (1024 px in več):** širši stranski meni, večstolpčni pregledi in kartice.
- Obrazci imajo najmanj 44 px visoke kontrole; pojavni dialogi upoštevajo višino zaslona in varne robove telefonov.
- Podatki in API so enaki kot v PRO 2.0. Zagon: v glavni mapi `npm install` (prvič), nato `npm run dev`.

**Na telefonu v istem omrežju:** odpri `http://IP-RACUNALNIKA:5173` (npr. 192.168.1.20:5173). Računalnik mora ostati vključen, strežnik pa mora biti zagnan. Morebitni požarni zid Windows mora omogočiti dostop do vrat 5173 in 3001 z lokalnega omrežja.
