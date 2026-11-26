// Pure Beer Game simulation: no React here, so it can be tested on its own.

// Downstream → upstream. Maloprodaja serves the customer, Pivovarna brews.
export const ROLE_IDS = ["maloprodaja", "grosist", "distributer", "pivovarna"];

export const ROLE_NAMES = {
  pivovarna: "Pivovarna",
  distributer: "Distributer",
  grosist: "Grosist",
  maloprodaja: "Maloprodaja",
};

export const HOLDING_COST = 0.5; // € per unit in stock per week
export const BACKLOG_COST = 1; // € per unit of unfilled orders per week

export const INITIAL_STOCK = 15;
export const INITIAL_FLOW = 5; // units per week already in the pipelines at the start
export const SHIPPING_DELAY = 2; // weeks between shipping (or brewing) and arrival

// Customer demand: a step change, the classic Beer Game shock.
export const DEMAND_BEFORE = 5;
export const DEMAND_AFTER = 9;
export const DEMAND_CHANGE_WEEK = 6;

// Game length in weeks, chosen before the first week is played. The classic classroom
// game runs 36 weeks; 20 is enough to see the bullwhip effect and fits a lesson.
export const DEFAULT_LAST_WEEK = 20;
export const MIN_LAST_WEEK = 1;
export const MAX_LAST_WEEK = 100;

// True once the last week has been played (game.week is the week about to be played).
export const isGameOver = (game) => game.week > game.lastWeek;
export const customerDemand = (week) =>
  week >= DEMAND_CHANGE_WEEK ? DEMAND_AFTER : DEMAND_BEFORE;

const initialRole = () => ({
  stock: INITIAL_STOCK,
  backlog: 0,
  // pipeline[0] arrives next week; for Pivovarna this is beer being brewed.
  pipeline: Array(SHIPPING_DELAY).fill(INITIAL_FLOW),
  incomingOrder: INITIAL_FLOW, // order from the downstream role, to fill this week
  order: INITIAL_FLOW, // this week's order to the upstream role (player input)
  cost: 0, // accumulated cost
});

export const createGame = (lastWeek = DEFAULT_LAST_WEEK) => ({
  week: 1,
  lastWeek,
  roles: Object.fromEntries(ROLE_IDS.map((id) => [id, initialRole()])),
  history: [], // one entry per completed week
});

// Demand a role has to fill this week.
export const demandFor = (game, id) =>
  id === "maloprodaja" ? customerDemand(game.week) : game.roles[id].incomingOrder;

// The length can only be changed before the first week is played.
export const setLastWeek = (game, value) => {
  const weeks = Math.floor(Number(value));
  if (game.history.length > 0 || !Number.isFinite(weeks)) return game;
  if (weeks < MIN_LAST_WEEK || weeks > MAX_LAST_WEEK) return game;
  return { ...game, lastWeek: weeks };
};

export const setOrder = (game, id, value) => {
  if (isGameOver(game)) return game;
  const order = Math.max(0, Math.floor(Number(value) || 0));
  return { ...game, roles: { ...game.roles, [id]: { ...game.roles[id], order } } };
};

// Runs one week for all roles at once:
// 1. shipments arrive, 2. orders (plus backlog) are filled from stock and shipped
// downstream, 3. each role's order goes upstream (Pivovarna starts brewing it),
// 4. holding and backlog costs are charged.
export const advanceWeek = (game) => {
  if (isGameOver(game)) return game;
  const roles = {};
  for (const id of ROLE_IDS) {
    const r = game.roles[id];
    const [arrived, ...pipeline] = r.pipeline;
    roles[id] = { ...r, stock: r.stock + arrived, pipeline };
  }

  const shipped = {};
  ROLE_IDS.forEach((id, i) => {
    const r = roles[id];
    const demand = demandFor(game, id);
    const owed = r.backlog + demand;
    const ship = Math.min(r.stock, owed);
    roles[id] = { ...r, stock: r.stock - ship, backlog: owed - ship };
    shipped[id] = ship;
    const downstream = ROLE_IDS[i - 1];
    if (downstream) roles[downstream].pipeline = [...roles[downstream].pipeline, ship];
  });

  ROLE_IDS.forEach((id, i) => {
    const upstream = ROLE_IDS[i + 1];
    const order = game.roles[id].order;
    if (upstream) roles[upstream].incomingOrder = order;
    else roles[id].pipeline = [...roles[id].pipeline, order]; // Pivovarna brews it
  });

  for (const id of ROLE_IDS) {
    const r = roles[id];
    r.cost += r.stock * HOLDING_COST + r.backlog * BACKLOG_COST;
  }

  const entry = {
    week: game.week,
    customerDemand: customerDemand(game.week),
    roles: Object.fromEntries(
      ROLE_IDS.map((id) => [
        id,
        {
          stock: roles[id].stock,
          backlog: roles[id].backlog,
          order: game.roles[id].order,
          shipped: shipped[id],
          cost: roles[id].cost,
        },
      ]),
    ),
  };

  return { ...game, week: game.week + 1, roles, history: [...game.history, entry] };
};

export const totalCost = (game) =>
  ROLE_IDS.reduce((sum, id) => sum + game.roles[id].cost, 0);

// Share of customer demand delivered so far (backlog filled later counts when shipped).
export const fillRate = (game) => {
  const demand = game.history.reduce((sum, h) => sum + h.customerDemand, 0);
  const shipped = game.history.reduce((sum, h) => sum + h.roles.maloprodaja.shipped, 0);
  return demand === 0 ? null : Math.min(1, shipped / demand);
};
