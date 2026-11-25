import { useGame } from "../game/useGame";
import { customerDemand, isGameOver } from "../game/engine";

// Kupec (customer): end demand placed with Maloprodaja each week.
const Kupec = () => {
  const { game } = useGame();

  return (
    <div className="AHA" style={{ padding: "2px" }}>
      <h1>Kupec</h1>
      {isGameOver(game) ? (
        <p>Igra je končana.</p>
      ) : (
        <>
          <p>Teden: {game.week}</p>
          <p>Naročilo kupca: {customerDemand(game.week)}</p>
        </>
      )}
    </div>
  );
};

export default Kupec;
