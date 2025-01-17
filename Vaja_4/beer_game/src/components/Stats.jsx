import React from "react";

const Stats = ({ pc, dc, gc, mc }) => {
  const totalCost = pc + dc + gc + mc;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column", // Stack text on top of the image
        width: "100%", // Ensures the banner doesn't overflow its grid container
        height: "100%", // Full height of the grid space
        backgroundImage:
          "url(https://cdn.corporatefinanceinstitute.com/assets/Statistics-1.jpeg)", // Replace with your image URL
        backgroundSize: "cover", // Make the image cover the entire box
        backgroundPosition: "center", // Center the image
        color: "black",
        fontFamily: "Arial, sans-serif",
        overflow: "hidden", // Prevent any overflow
        alignItems: "center", // Center items horizontally
        justifyContent: "center", // Center items vertically
        boxSizing: "border-box",
      }}
    >
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

//  const pc = 1
//  const dc = 2
//  const gc = 3
//  const mc = 4