import { useGame } from "../game/useGame";
import { ROLE_NAMES } from "../game/engine";

// The link between two neighbouring roles: beer travelling down, the order travelling up.
const Transport = ({ from, to }) => {
  const { game } = useGame();
  const pipeline = game.roles[to].pipeline; // [arrives next week, arrives in 2 weeks]
  const order = game.roles[from].incomingOrder; // what `to` ordered last week

  return (
    <div className="AHA link">
      <h1>
        {ROLE_NAMES[from]} ↓ {ROLE_NAMES[to]}
      </h1>
      <p title="Pivo na poti: prispe naslednji teden + čez dva tedna">🚚 {pipeline.join(" + ")}</p>
      <p title="Naročilo, ki ga dobavitelj izpolnjuje ta teden">📋 {order}</p>
    </div>
  );
};

export default Transport;
