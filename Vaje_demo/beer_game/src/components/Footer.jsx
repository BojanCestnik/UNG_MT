import {
  BACKLOG_COST,
  DEMAND_AFTER,
  DEMAND_BEFORE,
  DEMAND_CHANGE_WEEK,
  HOLDING_COST,
  INITIAL_FLOW,
  INITIAL_STOCK,
  SHIPPING_DELAY,
} from "../game/engine";
import { useGame } from "../game/useGame";

// Game parameters, always visible so players know what they are optimising.
const Footer = () => {
  const { lastWeek } = useGame().game;
  return (
    <div style={{ fontSize: "12px", color: "#3d3c39", fontWeight: "normal", textAlign: "center", padding: "0 8px" }}>
      Število tednov: {lastWeek} &nbsp;|&nbsp; Stroški na teden: €{HOLDING_COST.toFixed(2)} na enoto zaloge · €{BACKLOG_COST.toFixed(2)} na enoto
      zaostanka &nbsp;|&nbsp; Dostava in varjenje: {SHIPPING_DELAY} tedna · naročilo pride do dobavitelja
      naslednji teden &nbsp;|&nbsp; Začetek: zaloga {INITIAL_STOCK}, na poti {INITIAL_FLOW} na teden
      &nbsp;|&nbsp; Kupec: {DEMAND_BEFORE} na teden, od {DEMAND_CHANGE_WEEK}. tedna {DEMAND_AFTER}
    </div>
  );
};

export default Footer;
