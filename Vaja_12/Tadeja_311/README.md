# Moj Ritem 🌸

Delujoča aplikacija za vsakodnevno organizacijo, pripravljena po dokumentu **Moj_Ritem_Prompt_Koraki_1-6.docx**.

## Preprost ogled brez namestitve

Odprite `HITRI_PREDOGLED.html` z dvoklikom v Chrome, Firefox ali Edge. Gre za samostojno demonstracijsko HTML-različico z enakimi glavnimi funkcijami, ki ne potrebuje knjižnic. Samostojni predogled je napisan v navadnem JavaScriptu; spodnja izvorna koda projekta pa je zahtevani **React + TypeScript + Vite + Tailwind CSS v4**. Podatki predogleda in razvojne aplikacije se ne sinhronizirajo med seboj.

## Zagon na računalniku

Potrebujete **Node.js 20.19+ ali 22.12+** in internetno povezavo za prvi prenos knjižnic.

1. Razširite ZIP in odprite mapo `Moj_Ritem_App` v VS Code ali terminalu.
2. Zaženite `npm install`.
3. Zaženite `npm run dev`.
4. V brskalniku odprite naslov, ki ga izpiše Vite (običajno http://localhost:5173).

Za produkcijsko gradnjo: `npm run build`, nato `npm run preview`.

## Funkcije

- **Domov:** današnje naloge, dnevni napredek, prihajajoči dogodki, cilj in motivacijsko sporočilo.
- **Moje naloge:** dodajanje, urejanje, brisanje, označevanje dokončanosti, kategorije, pomembnost, rok in filtri.
- **Koledar:** dnevni, tedenski, mesečni pogled; dodajanje, urejanje, brisanje, barve kategorij in opomniki dogodkov.
- **Moji cilji:** dnevni, tedenski, mesečni cilji, roki, številčni napredek in odstotki.
- **Statistika:** dokončane in nedokončane naloge, dnevni in tedenski pregled, napredek ciljev.
- **Nastavitve:** vklop/izklop opomnikov, privzeti čas opomnika in povrnitev vzorčnih podatkov.

Vse se samodejno shranjuje v **localStorage** trenutnega brskalnika. Ni strežnika ali prijave. Opomniki delujejo **samo v odprtem zavihku** in ne pošiljajo sistemskih/potisnih obvestil. Vzorčni podatki se naložijo ob prvem obisku oziroma po ponastavitvi.

## Tehnologije

- React + TypeScript
- Vite
- Tailwind CSS v4
- Brez dodatnih UI ali drugih funkcionalnih paketov

Pet glavnih React komponent je v `src/App.tsx` in `src/components/` (`DashboardView`, `TasksView`, `CalendarView`, `GoalsView`), tipi pa v `src/types.ts`. Skupne funkcije in preverjanje shranjenih podatkov so v `src/lib.ts`.
