import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Stats = ({ pc, dc, gc, mc }) => {
  const totalCost = pc + dc + gc + mc;

  // Data for the bar chart
  const data = {
    labels: ["Brewery", "Distributor", "Wholesaler", "Retailer"],
    datasets: [
      {
        label: "Cost per Department",
        data: [pc, dc, gc, mc],
        backgroundColor: ["#ff6384", "#36a2eb", "#ffce56", "#4bc0c0"],
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        overflow: "hidden",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* Background Image */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundImage:
            "url(https://www.competitionsciences.org/wp-content/uploads/2020/10/statistics-graph-illustration.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(1px)",
        }}
      ></div>

      {/* Semi-Transparent Overlay */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(255, 255, 255, 0.7)",
        }}
      ></div>

      {/* Content (Stats + Chart) */}
      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          height: "100%",
          padding: "20px",
          color: "black",
        }}
      >
        {/* Stats Section */}
        <div style={{ width: "50%", padding: "20px", zIndex: 1 }}>
          <h2>Statistics</h2>
          <p>Brewery Cost: {pc}</p>
          <p>Distributor Cost: {dc}</p>
          <p>Wholesaler Cost: {gc}</p>
          <p>Retailer Cost: {mc}</p>
          <h3>Total Cost: {totalCost}</h3>
        </div>

        {/* Bar Chart Section with Offset */}
        <div
          style={{
            width: "45%", // Reduce width slightly
            height: "250px",
            zIndex: 1,
            marginRight: "50px", // Push it slightly towards the center
          }}
        >
          <Bar data={data} options={options} />
        </div>
      </div>
    </div>
  );
};

export default Stats;

//  const pc = 1
//  const dc = 2
//  const gc = 3
//  const mc = 4