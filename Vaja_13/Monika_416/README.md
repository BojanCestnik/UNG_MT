# My Pantry – mobilna aplikacija (Vaja 13)

## Namen
My Pantry pomaga upravljati živila doma, spremljati roke uporabe, zmanjševati zavrženo hrano in iskati recepte glede na sestavine v shrambi. Projekt nadgrajuje obstoječo aplikacijo iz Vaje 12.

## Tehnologije
- React, TypeScript in Vite
- Tailwind CSS v4
- Capacitor za pripravo Android in iOS platform
- localStorage za lokalno shranjevanje živil

## Funkcionalnosti
- Dodajanje, urejanje in brisanje živil (ime, količina, rok uporabe).
- Rdeča oznaka za pretečena živila, oranžna za živila z rokom v naslednjih treh dneh in zelena za sveža živila.
- 24 vnaprej pripravljenih receptov s količinami, časom in navodili.
- Predlogi receptov, ki potrebujejo največ dve dodatni sestavini; prednost imajo živila pred iztekom roka.
- Podrobnosti receptov in označene manjkajoče sestavine.
- Samodejno shranjevanje v localStorage.
- Mobilna navigacija: Moja shramba, Dodaj živilo in Recepti.

## Namestitev in zagon spletne različice
V terminalu odprite mapo `Monika_416` in zaženite:

```bash
npm install
npm run dev
```

Vite izpiše lokalni naslov, običajno `http://localhost:5173`.

## Capacitor – priprava Android projekta
Predpogoj: nameščeni Node.js, Android Studio, Android SDK in ustrezen JDK. V mapi projekta izvedite:

```bash
npm install
npm run build
npx cap add android
npx cap sync android
npx cap open android
```

V Android Studio lahko aplikacijo zaženete v emulatorju ali na povezani napravi. Za pripravo APK izberite **Build > Build Bundle(s) / APK(s) > Build APK(s)**. Po vsaki spremembi spletne kode najprej izvedite `npm run build` in nato `npx cap sync android`.

Če mapa `android/` že obstaja, ne izvajajte ponovno `npx cap add android`; uporabite `npx cap sync android`.

## Capacitor – priprava iOS projekta
Na Windows je mogoče pripraviti konfiguracijo, vendar končno izdelavo, podpisovanje in zagon iOS aplikacije zahtevajo macOS in Xcode. Na Macu izvedite:

```bash
npm install
npm run build
npx cap add ios
npx cap sync ios
npx cap open ios
```

## Shranjevanje podatkov
Živila so shranjena lokalno v `localStorage` brskalnika oziroma WebView aplikacije. Podatki se ne sinhronizirajo samodejno med različnimi napravami in niso shranjeni v zunanji podatkovni bazi. Ne brišite podatkov aplikacije, če želite ohraniti lokalno shrambo.

## Pomembno za oddajo
Mapa `node_modules` ni vključena. Ustvari se z ukazom `npm install`. Mapi `android/` in `ios/` se ustvarita z ukazoma `npx cap add android` in `npx cap add ios` na ustreznih razvojnih okoljih; zato v tem ZIP-u še nista ustvarjeni.
