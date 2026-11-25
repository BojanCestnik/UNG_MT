import WeeklyChart from "./WeeklyChart";

// Orders placed each week by every role, against customer demand (the bullwhip effect).
const OrdersChart = () => (
  <WeeklyChart
    title="Naročila po tednih"
    yTitle="Naročilo (enote)"
    value={(h, id) => h.roles[id].order}
    demand
  />
);

export default OrdersChart;
