import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip } from "chart.js";
import { useGame } from "../game/useGame";
import { ROLE_NAMES, totalCost } from "../game/engine";
import { GRID, MUTED, ROLE_COLORS } from "./roleColors";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

// Upstream → downstream, matching the order of the role cards on screen.
const ROLES = ["pivovarna", "distributer", "grosist", "maloprodaja"];
const eur = (x) => `€${x.toFixed(2)}`;

// Accumulated cost per role. The chart hides itself when the cell is too small
// (container query in App.css); the numbers above it always stay visible.
const Stats = () => {
  const { game } = useGame();
  const costs = ROLES.map((id) => game.roles[id].cost);

  const data = {
    labels: ROLES.map((id) => ROLE_NAMES[id]),
    datasets: [
      {
        label: "Cost",
        data: costs,
        backgroundColor: ROLES.map((id) => ROLE_COLORS[id]),
        maxBarThickness: 24,
        borderRadius: { topLeft: 4, topRight: 4 },
        borderSkipped: "bottom",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: false,
    plugins: {
      legend: { display: false },
      tooltip: { callbacks: { label: (ctx) => eur(ctx.parsed.y) } },
    },
    scales: {
      x: { ticks: { display: false }, grid: { display: false }, border: { color: GRID } },
      y: {
        beginAtZero: true,
        ticks: { color: MUTED, font: { size: 10 }, maxTicksLimit: 4 },
        grid: { color: GRID },
        border: { display: false },
      },
    },
  };

  return (
    <div className="stats">
      <h2>Statistics</h2>
      <table>
        <tbody>
          {ROLES.map((id, i) => (
            <tr key={id}>
              <td>
                <span className="swatch" style={{ background: ROLE_COLORS[id] }} />
                {ROLE_NAMES[id]}
              </td>
              <td>{eur(costs[i])}</td>
            </tr>
          ))}
          <tr className="total">
            <td>Total</td>
            <td>{eur(totalCost(game))}</td>
          </tr>
        </tbody>
      </table>
      <div className="stats-chart">
        <div className="stats-chart-inner">
          <Bar data={data} options={options} />
        </div>
      </div>
    </div>
  );
};

export default Stats;
