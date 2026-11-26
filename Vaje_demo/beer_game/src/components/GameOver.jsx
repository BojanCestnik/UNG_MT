import { useState } from "react";
import { useGame } from "../game/useGame";
import { ROLE_IDS, ROLE_NAMES, fillRate, isGameOver, totalCost } from "../game/engine";
import { ROLE_COLORS } from "./roleColors";

const eur = (x) => `€${x.toFixed(2)}`;

// Results shown once the last week has been played. "Zapri" hides it so the
// charts can be studied; "Nova igra" starts again.
const GameOver = () => {
  const { game, reset } = useGame();
  // The finished game the dialog was closed for. A finished game never changes, so a
  // new game (after "Nova igra") is a different object and shows its own results.
  const [closedFor, setClosedFor] = useState(null);

  if (!isGameOver(game) || closedFor === game) return null;

  // Upstream → downstream, as on the board; the highest cost is marked.
  const roles = [...ROLE_IDS].reverse();
  const worst = roles.reduce((a, b) => (game.roles[b].cost > game.roles[a].cost ? b : a));
  const rate = fillRate(game);

  return (
    <div className="game-over-backdrop">
      <div className="game-over" role="dialog" aria-labelledby="game-over-title">
        <h2 id="game-over-title">Konec igre</h2>
        <p>Število odigranih tednov: {game.lastWeek}</p>
        <table>
          <tbody>
            {roles.map((id) => (
              <tr key={id} className={id === worst ? "worst" : undefined}>
                <td>
                  <span className="swatch" style={{ background: ROLE_COLORS[id] }} />
                  {ROLE_NAMES[id]}
                </td>
                <td>{eur(game.roles[id].cost)}</td>
                <td>{id === worst ? "najvišji strošek" : ""}</td>
              </tr>
            ))}
            <tr className="total">
              <td>Skupni strošek verige</td>
              <td>{eur(totalCost(game))}</td>
              <td />
            </tr>
          </tbody>
        </table>
        <p>
          Dobavljivost kupcu: {rate === null ? "–" : `${Math.round(rate * 100)} %`}
          {game.roles.maloprodaja.backlog > 0 &&
            ` · nedobavljeno ob koncu: ${game.roles.maloprodaja.backlog}`}
        </p>
        <div className="game-over-buttons">
          <button onClick={() => setClosedFor(game)}>Zapri</button>
          <button onClick={reset}>Nova igra</button>
        </div>
      </div>
    </div>
  );
};

export default GameOver;
