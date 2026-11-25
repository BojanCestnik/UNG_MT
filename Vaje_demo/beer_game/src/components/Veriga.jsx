import { useGame } from "../game/useGame";
import { ROLE_IDS } from "../game/engine";

// Totals for the whole supply chain.
const Veriga = () => {
  const { roles } = useGame().game;
  const sum = (fn) => ROLE_IDS.reduce((s, id) => s + fn(roles[id]), 0);

  return (
    <div className="AHA link">
      <h1>Veriga</h1>
      <p>Zaloga: {sum((r) => r.stock)}</p>
      <p>Zaostanek: {sum((r) => r.backlog)}</p>
      <p>Na poti: {sum((r) => r.pipeline.reduce((a, b) => a + b, 0))}</p>
    </div>
  );
};

export default Veriga;
