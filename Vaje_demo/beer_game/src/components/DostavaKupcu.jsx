import { useGame } from "../game/useGame";
import { fillRate } from "../game/engine";

// What actually reached the customer, and how reliably.
const DostavaKupcu = () => {
  const { game } = useGame();
  const last = game.history.at(-1);
  const rate = fillRate(game);

  return (
    <div className="AHA link">
      <h1>Maloprodaja ↓ Kupec</h1>
      <p>Dostavljeno: {last ? `${last.roles.maloprodaja.shipped} / ${last.customerDemand}` : "–"}</p>
      <p>Čaka kupca: {game.roles.maloprodaja.backlog}</p>
      <p>Dobavljivost: {rate === null ? "–" : `${Math.round(rate * 100)} %`}</p>
    </div>
  );
};

export default DostavaKupcu;
