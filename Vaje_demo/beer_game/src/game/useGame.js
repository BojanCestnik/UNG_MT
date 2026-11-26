import { createContext, useContext } from "react";

export const GameContext = createContext(null);

// Returns { game, setOrder(roleId, value), setLastWeek(weeks), advanceWeek(), reset() }.
export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) throw new Error("useGame must be used within a GameProvider");
  return context;
};
