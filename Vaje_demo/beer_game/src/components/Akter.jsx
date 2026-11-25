import { useGame } from "../game/useGame";
import { ROLE_NAMES, demandFor, isGameOver } from "../game/engine";

// One supply-chain role. All numbers come from the shared game state;
// the order typed here is used when "Izvedi teden" runs the week.
const Akter = ({ role }) => {
  const { game, setOrder } = useGame();
  const r = game.roles[role];
  const inTransit = r.pipeline.reduce((a, b) => a + b, 0);
  const inputId = `order-${role}`;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        padding: "2px",
        boxSizing: "border-box",
        overflow: "auto",
      }}
    >
      <div className="AHA">
        <h1>{ROLE_NAMES[role]}</h1>
        <p>Stock: {r.stock} · Preorder: {r.backlog}</p>
        <p>Incoming order: {demandFor(game, role)}</p>
        <p>
          {role === "pivovarna" ? "Brewing" : "In transit"}: {inTransit} ({r.pipeline.join(" + ")})
        </p>
        <p>Cost: €{r.cost.toFixed(2)}</p>
      </div>

      <div style={{ fontSize: "100%" }}>
        <label htmlFor={inputId}>Order Quantity: </label>
        <input
          type="number"
          id={inputId}
          min={0}
          disabled={isGameOver(game)}
          value={r.order}
          onChange={(e) => setOrder(role, e.target.value)}
          style={{ marginLeft: "3px", padding: "1px 3px", width: "30%", font: "inherit" }}
        />
      </div>
    </div>
  );
};

export default Akter;
