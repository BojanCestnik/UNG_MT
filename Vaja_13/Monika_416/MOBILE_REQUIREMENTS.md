# Zahteve za mobilno nadgradnjo My Pantry

Cilj: obstoječo aplikacijo My Pantry pretvoriti v mobilno aplikacijo za Android in iOS, pri tem pa ohraniti vse obstoječe funkcionalnosti in podatke.

## Tehnologije in omejitve
Uporabiti React, TypeScript, Vite, Tailwind CSS v4 in Capacitor. Izhajati iz obstoječega projekta; ne prepisovati aplikacije po nepotrebnem; namestiti le pakete, potrebne za Capacitor; podatke hraniti lokalno z localStorage, brez zunanje baze ali backend-a. Koda naj bo preprosta in razumljiva študentu.

## Funkcionalnosti, ki jih je treba ohraniti
- Dodajanje, urejanje in brisanje živil z imenom, količino in rokom uporabe.
- Pretečena živila rdeče, živila z rokom v naslednjih treh dneh oranžno, sveža živila zeleno.
- 20–25 receptov z sestavinami, količinami, časom priprave in navodili.
- Predlogi receptov z največ dvema manjkajočima sestavinama; prednost živilom pred iztekom roka.
- Podrobnosti recepta in jasno označene manjkajoče sestavine.
- Samodejno shranjevanje in obnova podatkov iz localStorage.

## Mobilna nadgradnja
Integrirati Capacitor v obstoječi React + Vite projekt; nastaviti ime My Pantry in identifikator `com.mypantry.app`; dodati Android platformo in pripraviti iOS konfiguracijo. Uporabniški vmesnik mora biti mobile-first, odziven, brez vodoravnega drsenja, z dovolj velikimi gumbi, berljivim besedilom, preprosto navigacijo in obstoječo kremno/pastelno barvno paleto.

## Preverjanje in oddaja
Preveriti upravljanje živil, roke uporabe, recepte, manjkajoče sestavine, localStorage in prikaz na mobilnih zaslonih. Projekt mora biti v `Vaja_13/Monika_416`, vsebovati izvorno kodo, `package.json`, `vite.config.ts`, `capacitor.config.ts` in README z navodili. Ne vključiti `node_modules`. Android mora biti mogoče odpreti v Android Studio; iOS projekt se gradi v Xcode na macOS. Pred spreminjanjem naj se obstoječi projekt pregleda, spremembe pa izvedejo postopoma brez brisanja funkcionalnosti.
