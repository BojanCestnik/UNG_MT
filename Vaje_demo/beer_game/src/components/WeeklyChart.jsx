import { useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
import { useGame } from "../game/useGame";
import { ROLE_NAMES } from "../game/engine";
import { GRID, MUTED, ROLE_COLORS, TEXT } from "./roleColors";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

// Downstream → upstream, so the bullwhip effect reads left to right in the legend.
const SERIES = ["maloprodaja", "grosist", "distributer", "pivovarna"].map((id) => ({
  id,
  color: ROLE_COLORS[id],
}));
const DEMAND_COLOR = "#52514e";

const line = (label, color, data) => ({
  label,
  data,
  borderColor: color,
  backgroundColor: color,
  borderWidth: 2,
  borderJoinStyle: "round",
  borderCapStyle: "round",
  pointRadius: 0,
  pointHoverRadius: 4,
  pointHoverBorderWidth: 2,
  pointHoverBorderColor: "#ffffff",
  tension: 0,
});

// One line per role over the weeks played. `value(weekEntry, roleId)` picks the number;
// `demand` adds customer demand as a neutral reference line; `zeroLine` emphasises 0.
const WeeklyChart = ({ title, yTitle, value, demand = false, zeroLine = false }) => {
  const { history } = useGame().game;
  const [showTable, setShowTable] = useState(false);

  const data = {
    labels: history.map((h) => h.week),
    datasets: [
      ...(demand ? [line("Kupec", DEMAND_COLOR, history.map((h) => h.customerDemand))] : []),
      ...SERIES.map(({ id, color }) =>
        line(ROLE_NAMES[id], color, history.map((h) => value(h, id))),
      ),
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: false,
    interaction: { mode: "index", intersect: false },
    plugins: {
      legend: {
        position: "bottom",
        labels: { color: TEXT, boxWidth: 12, boxHeight: 2, font: { size: 11 } },
      },
      tooltip: {
        callbacks: { title: (items) => `Teden ${items[0].label}` },
      },
    },
    scales: {
      x: {
        title: { display: true, text: "Teden", color: MUTED },
        ticks: { color: MUTED, maxRotation: 0, autoSkip: true },
        grid: { display: false },
        border: { color: GRID },
      },
      y: {
        beginAtZero: true,
        title: { display: true, text: yTitle, color: MUTED },
        ticks: { color: MUTED, precision: 0 },
        grid: { color: (ctx) => (zeroLine && ctx.tick.value === 0 ? MUTED : GRID) },
        border: { display: false },
      },
    },
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        boxSizing: "border-box",
        padding: "6px",
        background: "#ffffff",
        color: TEXT,
        display: "flex",
        flexDirection: "column",
        fontWeight: "normal",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ fontSize: "14px", margin: 0 }}>{title}</h2>
        {history.length > 0 && (
          <button onClick={() => setShowTable(!showTable)} style={{ fontSize: "11px" }}>
            {showTable ? "Graf" : "Tabela"}
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <p style={{ color: MUTED, margin: "auto", textAlign: "center" }}>
          Klikni »Izvedi teden« za prikaz grafa.
        </p>
      ) : showTable ? (
        <div style={{ overflow: "auto", flex: 1, marginTop: "4px" }}>
          <table style={{ borderCollapse: "collapse", fontSize: "11px", width: "100%" }}>
            <thead>
              <tr>
                {["Teden", ...(demand ? ["Kupec"] : []), ...SERIES.map((s) => ROLE_NAMES[s.id])].map((h) => (
                  <th key={h} style={{ textAlign: "right", padding: "2px 4px", borderBottom: `1px solid ${GRID}` }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {history.map((h) => (
                <tr key={h.week}>
                  {[h.week, ...(demand ? [h.customerDemand] : []), ...SERIES.map((s) => value(h, s.id))].map((v, i) => (
                    <td key={i} style={{ textAlign: "right", padding: "2px 4px" }}>
                      {v}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div style={{ position: "relative", flex: 1, minHeight: 0 }}>
          {/* Absolute so the canvas never props its wrapper open when the window shrinks */}
          <div style={{ position: "absolute", inset: 0 }}>
            <Line data={data} options={options} />
          </div>
        </div>
      )}
    </div>
  );
};

export default WeeklyChart;
