import WeeklyChart from "./WeeklyChart";

// Net inventory: stock minus backlog at the end of each week. Below 0 means unfilled orders.
const StockChart = () => (
  <WeeklyChart
    title="Neto zaloga po tednih"
    yTitle="Zaloga − zaostanek"
    value={(h, id) => h.roles[id].stock - h.roles[id].backlog}
    zeroLine
  />
);

export default StockChart;
