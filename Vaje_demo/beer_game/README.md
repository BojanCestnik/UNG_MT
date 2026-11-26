# The Beer Game

A React + Vite front-end for the Beer Game, a classic supply-chain simulation used in teaching.
The supply chain runs Pivovarna (brewery) → Distributer → Grosist (wholesaler) → Maloprodaja (retailer) → Kupec (customer).

## Running

```bash
npm install
npm run dev      # start the dev server
npm run build    # production build into dist/
npm run lint     # ESLint
```

## Layout

- `src/App.jsx`: page layout (two stacked 12-column CSS grids)
- `src/game/engine.js`: the simulation as pure functions (weekly step, delays, costs)
- `src/game/GameProvider.jsx`, `src/game/useGame.js`: shared game state for all components
- `src/components/Akter.jsx`: one supply-chain role card; `Akter*.jsx` pick the role
- `src/components/Kupec.jsx`: end-customer demand
- `src/components/IzvediTeden.jsx`: "Izvedi teden" (run week) and "Nova igra" (new game) buttons
- `src/components/Stats.jsx`: cost overview and bar chart (Chart.js)
- `src/components/Transport.jsx`: link between two roles (beer on the way down, order going up)
- `src/components/DostavaKupcu.jsx`: deliveries to the customer and fill rate
- `src/components/Veriga.jsx`: totals for the whole chain
- `src/components/WeeklyChart.jsx`: shared line chart; `OrdersChart.jsx` (orders) and
  `StockChart.jsx` (net inventory) use it
- `src/components/Footer.jsx`: game parameters, read from `engine.js`
- `src/components/GameOver.jsx`: results dialog after the last week

## Rules as implemented

- Start: every role has 15 units in stock and 5 units per week already on the way.
- Each week ("Izvedi teden"): shipments arrive; each role fills its incoming order plus
  backlog from stock and ships downstream; each order goes upstream (Pivovarna brews its own).
- Delays: shipping and brewing take 2 weeks; an order reaches the upstream role the next week.
- Costs: €0.50 per unit in stock and €1 per unit of backlog, every week.
- Customer demand: 5 per week, 9 from week 6 on (`customerDemand` in `engine.js`).
- Game length: 20 weeks by default, set with "Število tednov" (1–100) before the first week
  is played; "Nova igra" keeps it. The default is `DEFAULT_LAST_WEEK` in `engine.js`.
- After the last week, a results dialog shows each role's cost, the chain total and the
  customer fill rate.
