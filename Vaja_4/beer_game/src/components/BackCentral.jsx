import React, { useState } from "react";
import { useGlobalState } from "./Variable"; // Import global state hook if using Context API
// import backgroundImage from "../../public/BeerBack.png"; // Adjust path as necessary

const BackCentral = () => {
  const [order, setOrder] = useState(0); // Local state for input field
  const { setVariable15 } = useGlobalState(); // Replace `setVariable15` with the relevant global variable setter

  const handleSubmit = () => {
    // Update the relevant global variable with the order value
    setVariable15(order);
    alert('Order submitted: ${order}');
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100%", // Full viewport height
        backgroundImage: "url('../../public/BeerBack.png')", // Replace with your image URL
        backgroundSize: "cover", // Maintains the original proportions contain
        backgroundRepeat: "no-repeat", // Prevents tiling
        backgroundPosition: "center", // Centers the image
        filter: "brightness(20%)", // Dims the background
      }} >
    </div> 
  );
};

export default BackCentral;