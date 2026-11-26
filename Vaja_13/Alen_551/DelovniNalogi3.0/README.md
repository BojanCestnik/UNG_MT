# Delovni nalogi PRO 3.1 – Dark & Mobile

**Nova različica:** temna tema s skoraj črnim ozadjem, visokokontrastni obrazci, mobilna spodnja navigacija s petimi zavihki in gumbom **Več** za vse ostale module. Prilagodljivo za telefon, tablico in računalnik. Ohranjeni vsi moduli različice PRO 3.0.

## Hiter zagon v Windows CMD

1. Namesti Node.js (priporočeno Node 22).
2. Razširi ZIP in odpri mapo `DelovniNalogi` v Raziskovalcu.
3. V naslovno vrstico mape vpiši `cmd`.
4. Izvedi `npm install` (samo prvič) in nato `npm run dev`.
5. Na računalniku odpri `http://localhost:5173`.

## Zagon na telefonu

Telefon in računalnik naj bosta povezana v **isto omrežje Wi-Fi/LAN**. Računalnik mora imeti prižgan strežnik (`npm run dev`). V CMD vpiši `ipconfig` in poišči IPv4 naslov računalnika, npr. `192.168.1.25`. Na telefonu nato odpri `http://192.168.1.25:5173` (uporabi svoj naslov). Vite je nastavljen za dostop v omrežju, API pa uporablja naslov istega gostitelja na vratih 3001. Če povezava ne uspe, dovoli Node.js dostop do zasebnega omrežja v požarnem zidu Windows in preveri, ali sta vrata 5173 ter 3001 dostopna v zasebnem omrežju.

**Varnost:** to je lokalna razvojna aplikacija brez prijave uporabnikov, zato vrat 5173 ali 3001 ne posreduj v javni internet. Za profesionalno uporabo izven delavnice so potrebni prijava, HTTPS in varnostne kopije.

**Ohranitev podatkov:** pri nadgradnji kopiraj `backend/data/db.json` in mapo shranjenih risb iz prejšnje različice, preden zaženeš novo.

## Moduli

Delovni nalogi, operacije, materiali, orodja, stroji, čas in stroški, plan, ponudbe, knjižnica izdelkov, kakovost, delavci, risbe in arhiv.

---

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

---

## NOVO: Delovni nalogi PRO 3.0

Projekt nadaljuje PRO 2.1; obstoječi nalogi, materiali, orodja in stroji ostanejo ohranjeni. Strežnik samodejno dopolni stare podatkovne datoteke z novimi zbirkami.

**Novi moduli v stranskem in mobilnem meniju:**

- **Plan:** tedenski koledar po strojih, dodajanje in urejanje terminov. Isti stroj ne more biti načrtovan v dveh prekrivajočih se terminih.
- **Ponudbe:** postavke, material, drugi stroški in marža, izračun cene brez DDV ter možnost tiskanja oziroma shranjevanja v PDF skozi brskalnik. Gumb »Izračun obdelave« prenese izračun stroškov iz delovnega naloga v ponudbo.
- **Izdelki:** knjižnica izdelkov in predlog postopkov, iz katerih lahko neposredno ustvariš nov delovni nalog.
- **Kakovost:** kontrolni zapisnik z nazivnimi, najmanjšimi, največjimi in izmerjenimi vrednostmi; samodejno oceni skladnost.
- **Delavci:** seznam zaposlenih, urne postavke in dodeljevanje zaposlenih posamezni operaciji.
- **Risbe:** pripenjanje PDF/DXF/STEP/STP dokumentov k nalogu ali izdelku (največ 5 MB), prenos na napravo. Podatki dokumentov so vključeni v lokalni db.json; za produkcijsko okolje priporočamo ločeno shranjevanje datotek.

**Zagon:** Odpri CMD v glavni mapi `DelovniNalogi` in zaženi `npm install` (samo prvič), nato `npm run dev`. Nato odpri http://localhost:5173. Telefon naj bo v istem omrežju; v mobilnem brskalniku odpri `http://IP-RACUNALNIKA:5173`. Če Windows Firewall vpraša, dovoli uporabo v zasebnem omrežju.

**Posodobitev stare namestitve:** Kopiraj mapo `backend/data` iz stare namestitve v novo, da obdržiš svoje podatke (prej ustvari varnostno kopijo). Pred kopiranjem ustavi strežnik.

**Meje prototipa:** Ni prijave, uporabniških pravic, sinhronizacije prek interneta ali transakcijske baze podatkov. Ne objavljaj strežnika javno na internetu brez zaščite. PDF ponudba se ustvari z uporabo brskalnikovega ukaza Natisni → Shrani kot PDF, ne kot samostojen PDF generator.
