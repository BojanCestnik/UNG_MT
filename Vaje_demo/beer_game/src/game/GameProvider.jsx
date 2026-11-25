import { useMemo, useReducer } from "react";
import { GameContext } from "./useGame";
import { advanceWeek, createGame, setLastWeek, setOrder } from "./engine";

const reducer = (game, action) => {
  switch (action.type) {
    case "setOrder":
      return setOrder(game, action.role, action.value);
    case "advanceWeek":
      return advanceWeek(game);
    case "setLastWeek":
      return setLastWeek(game, action.value);
    case "reset":
      return createGame(game.lastWeek); // a new game keeps the chosen length
    default:
      return game;
  }
};

export const GameProvider = ({ children }) => {
  const [game, dispatch] = useReducer(reducer, undefined, createGame);

  const value = useMemo(
    () => ({
      game,
      setOrder: (role, value) => dispatch({ type: "setOrder", role, value }),
      advanceWeek: () => dispatch({ type: "advanceWeek" }),
      setLastWeek: (value) => dispatch({ type: "setLastWeek", value }),
      reset: () => dispatch({ type: "reset" }),
    }),
    [game],
  );

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};
