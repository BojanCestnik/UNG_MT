import React from "react";

const Stats = () => {
  const pc = 1
  const dc = 2
  const gc = 3
  const mc = 4
  const totalCost = pc + dc + gc + mc;

  return (
    <div>
      <h2>Statistics</h2>
      <p>Brewery Cost: {pc}</p>
      <p>Distributor Cost: {dc}</p>
      <p>Wholesaler Cost: {gc}</p>
      <p>Retailer Cost: {mc}</p>
      <h3>Total Cost: {totalCost}</h3>
    </div>
  );
};

export default Stats;
