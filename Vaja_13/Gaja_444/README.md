# Moj recept – Gaja_444

Študentska spletna aplikacija za iskanje receptov glede na sestavine, ki jih ima uporabnik doma.

## Zagon

V mapi projekta odpri terminal in izvedi:

```bash
npm install
npm run dev
```

V brskalniku odpri naslov, ki ga izpiše Vite.

## Funkcionalnosti

- 25 receptov iz datoteke JSON.
- Iskanje in izbira sestavin, tudi brez šumnikov.
- Razvrščanje po številu ujemajočih se sestavin.
- Filter po času priprave.
- Podrobnosti recepta s količinami in koraki.
- Priljubljeni recepti, shranjeni v localStorage.

## Tehnologije

React, TypeScript, Vite in Tailwind CSS v4; brez zalednega strežnika.

## Preverjanje

`npm run build` izdela produkcijsko različico, `npm run lint` pa preveri TypeScript.

## Nadgradnja v4
Iskanje receptov in sestavin, razvrščanje, filter vseh sestavin, odstotek ujemanja, shranjevanje shrambe v localStorage in označevanje korakov priprave. Obstoječih 25 receptov je ohranjenih. Za zagon: `npm install`, nato `npm run dev`. Za preverjanje: `npm run build`. Namestitve odvisnosti v okolju priprave ni bilo mogoče dokončati, zato gradnja ni potrjena.
